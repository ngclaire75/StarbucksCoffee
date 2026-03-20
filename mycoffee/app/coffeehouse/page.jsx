import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Coffeehouse Experience"
      subtitle="The Third Place"
      image="/images/coffeefactory.png"
      description={[
        "Every Starbucks is designed to be a welcoming third place — a space between home and work where community naturally gathers. From the warm lighting to the carefully curated music, every detail is intentional.",
        "Our stores are more than places to grab a coffee. They're spaces for connection, creativity, and calm. Baristas learn customer names, remember orders, and create moments of genuine human warmth that make each visit feel personal.",
        "Across more than 35,000 locations worldwide, no two stores are exactly alike. Each one reflects the neighborhood it serves, incorporating local art, architecture, and culture. We believe a great coffeehouse is a living part of the community it calls home.",
      ]}
    />
  );
}
