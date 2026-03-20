import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Starbucks Customer Service representative named "Aria". You help customers with all Starbucks-related questions and concerns.

Your expertise covers:
- **Starbucks® Rewards**: Stars earning/redemption, account issues, tier levels (Green/Gold), expiration, missing Stars, linking cards
- **Mobile App & Ordering**: App troubleshooting, mobile orders, customization, pickup issues, app account management
- **Menu & Beverages**: Drink customization, nutritional info, allergens, seasonal items, Starbucks Reserve, merchandise
- **Gift Cards & Starbucks Cards**: Balance checks, reloading, lost/stolen cards, transfers, eGifts, merging cards
- **Store Experience**: Store locator, hours, Wi-Fi, feedback, accessibility, store types (Drive-Thru, Reserve, etc.)
- **Payments & Billing**: Accepted payment methods, refunds, unauthorized charges, order issues, tipping
- **Subscriptions & Promotions**: Double Star Days, limited-time offers, Starbucks for Life, bonus Star challenges
- **Accessibility**: ADA accommodations, assistance animals, accessibility features in the app
- **General Policies**: Refund policy, customization policy, free refill policy, feedback submission

**Your communication style:**
- Warm, helpful, and professional — just like Starbucks partners in stores
- Use "partner" when referring to Starbucks employees
- Be concise but thorough — give actionable steps
- If you cannot resolve an issue (like account-specific lookups), guide the customer to the right channel: phone (1-800-782-7282), live chat, or email through the app
- Always ask if there's anything else you can help with

**Important policies to know:**
- Free refill policy: Hot or iced brewed coffee/tea refills are free for Rewards members during the same visit, at participating stores
- Refund policy: Customers can request a remake or refund if unsatisfied — within reason
- Stars expiration: Stars expire 6 months after being earned if no activity
- Gold status: Earned by collecting 300 Stars in a 12-month period
- Reward redemption: 25 Stars = free customization, 100 Stars = free hot/cold drink, 200 Stars = free food item, 300 Stars = free select merchandise, 400 Stars = free select Reserve drink
- Mobile order pickup: Ready at the handoff plane (counter), not at the register
- App issues: Try force-closing and reopening, check internet connection, update the app, or reinstall

Always be empathetic when customers have complaints or negative experiences. Acknowledge their feelings before offering solutions.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Fallback rule-based responses when no API key is configured
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      const fallback = getFallbackResponse(lastMsg);
      return new Response(
        JSON.stringify({ content: fallback }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Groq API with streaming (OpenAI-compatible)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
    }

    // Stream the response back to client as SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // hold incomplete last line

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                  }
                } catch {
                  // skip malformed lines
                }
              }
            }
          }
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Rule-based fallback when GROQ_API_KEY is not set
function getFallbackResponse(input) {
  if (input.includes('reward') || input.includes('star') || input.includes('points')) {
    return "Great question about Starbucks® Rewards! You earn 2 Stars per $1 spent when paying with your registered Starbucks Card or through the app. Stars can be redeemed starting at 25 Stars for a free customization, 100 Stars for a free drink, and up to 400 Stars for a Starbucks Reserve drink. Stars expire 6 months after being earned with no account activity. Is there anything specific about your Rewards account I can help with?";
  }
  if (input.includes('refund') || input.includes('charge') || input.includes('money') || input.includes('payment')) {
    return "I understand your concern about a charge. Starbucks partners are happy to remake any beverage or food item that doesn't meet your expectations. For billing disputes or unauthorized charges, I recommend:\n\n1. Check your Starbucks Card transaction history in the app\n2. Contact us at **1-800-782-7282** for account-specific issues\n3. For credit/debit card disputes, contact your bank\n\nWould you like more details about our refund policy?";
  }
  if (input.includes('app') || input.includes('mobile') || input.includes('order')) {
    return "For mobile app issues, here are some quick fixes:\n\n1. **Force close** the app and reopen it\n2. **Check your internet connection** — switch between Wi-Fi and cellular\n3. **Update the app** to the latest version\n4. **Reinstall the app** if the issue persists\n\nFor mobile order pickup, your order will be ready at the **handoff plane** (the counter with labeled drinks), not at the register. Is there a specific app issue I can help you with?";
  }
  if (input.includes('gift card') || input.includes('balance') || input.includes('card')) {
    return "Here's how to manage your Starbucks Card:\n\n- **Check balance**: In the app under 'Cards', at any store, or at starbucks.com\n- **Reload**: In the app or store with cash, credit, or debit\n- **Lost/stolen card**: Report immediately at **1-800-782-7282** — we can protect the remaining balance if registered\n- **eGifts**: Send and receive digital gift cards through the app or starbucks.com\n\nIs there anything specific about your Starbucks Card I can help with?";
  }
  if (input.includes('store') || input.includes('location') || input.includes('hours') || input.includes('near')) {
    return "To find a Starbucks near you:\n\n1. Open the **Starbucks app** and tap the Store Locator icon\n2. Visit **starbucks.com/store-locator**\n3. Or use our **Find a Store** feature on this site\n\nYou can filter by store type (Drive-Thru, Reserve, etc.) and see current hours. Is there anything else I can help you find?";
  }
  if (input.includes('wifi') || input.includes('wi-fi') || input.includes('internet')) {
    return "Starbucks offers **free Wi-Fi** at participating locations, powered by Google. Simply select the 'Google Starbucks' network on your device — no password required. Some locations may have a time limit. Is there anything else I can help you with?";
  }
  if (input.includes('allergen') || input.includes('allergy') || input.includes('nutrition') || input.includes('calorie')) {
    return "Starbucks takes allergies seriously. Here's how to find nutritional info:\n\n1. **In the app**: Tap any menu item to see full nutritional details and allergens\n2. **Starbucks website**: Visit starbucks.com/menu for detailed info\n3. **In store**: Ask a partner — they can check the ingredient list\n\nPlease note: Our stores handle dairy, nuts, and other common allergens. Cross-contact is possible. For severe allergies, please speak directly with the store manager.\n\nWould you like more information about a specific item?";
  }
  if (input.includes('refill') || input.includes('free refill')) {
    return "Good news on free refills!\n\n**Free refill policy for Starbucks® Rewards members:**\n- Available on **hot or iced brewed coffee and tea** (not cold brew or espresso drinks)\n- During the **same store visit**\n- At **participating locations** (company-owned stores)\n- Simply show your Rewards account at the handoff bar\n\nThis is one of the great perks of being a Rewards member. Anything else I can help with?";
  }
  if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('help')) {
    return "Hello! Welcome to Starbucks Customer Service. I'm here to help you with:\n\n- **Starbucks® Rewards** & Stars\n- **Mobile app** & ordering\n- **Gift cards** & payments\n- **Menu** & nutritional info\n- **Store** locations & hours\n- **Refunds** & account issues\n\nWhat can I help you with today?";
  }
  return "Thank you for reaching out to Starbucks Customer Service. For the best assistance, you can also:\n\n- **Call us**: 1-800-782-7282 (Mon–Fri 5am–8pm PT, Sat–Sun 6am–5pm PT)\n- **Live chat**: Available through the Starbucks app\n- **Email**: Submit feedback at starbucks.com/contact\n\nIs there something specific I can help you with today?";
}
