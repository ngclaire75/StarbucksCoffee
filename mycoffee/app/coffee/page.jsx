import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Coffee"
      subtitle="Our Craft"
      image="/images/coffeefactory.png"
      description={[
        "We've been sourcing and roasting the world's finest coffee for over 50 years. It all starts with the bean — and we work directly with farmers across Latin America, Africa, and Asia-Pacific to find exceptional lots worth sharing.",
        "Our master roasters bring out the distinct personality of each origin through careful, precise roasting. Light, medium, or dark — every roast profile is designed to highlight what makes that coffee unique, from fruity and bright to rich and bold.",
        "Coffee is not just what we sell; it's what we know. From seed to cup, our commitment to quality, ethics, and craft is unwavering. We invite you to taste the difference that genuine passion makes in every single brew.",
      ]}
    />
  );
}
