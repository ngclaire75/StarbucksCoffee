import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Farmers"
      subtitle="From the Source"
      image="/images/coffeefactory.png"
      description={[
        "Coffee is only as extraordinary as the people who grow it. We work closely with hundreds of thousands of farmers across 30 countries, investing in their livelihoods, their land, and their futures.",
        "Through our Farmer Support Centers, we provide agronomists, tools, and resources directly to the people who grow our coffee. We offer loans, technical guidance, and access to markets that help farmers build sustainable, profitable businesses.",
        "Our commitment goes beyond purchasing — it's a relationship built on mutual respect and shared goals. When farmers thrive, the quality of coffee improves, communities grow stronger, and the entire supply chain benefits. That's the kind of partnership we're proud to stand behind.",
      ]}
    />
  );
}
