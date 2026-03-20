import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Sustainability"
      subtitle="Planet Positive"
      image="/images/coffeefactory.png"
      description={[
        "We're committed to becoming resource positive — storing more carbon than we emit, eliminating waste, and providing more clean freshwater than we use. It's an ambitious goal, and we're working toward it every day.",
        "From our transition to plant-based menu options and reusable packaging, to renewable energy investments and sustainable store design, every part of the business is being reimagined with the planet in mind.",
        "We know that no company can solve the climate crisis alone. That's why we collaborate with suppliers, governments, and NGOs to drive systemic change across our entire value chain. The future of coffee depends on the health of our planet, and we take that responsibility seriously.",
      ]}
    />
  );
}
