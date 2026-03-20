import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Partners (Employees)"
      subtitle="Our People"
      image="/images/coffeefactory.png"
      description={[
        "We call our employees partners because we're all in this together — sharing in the success, the mission, and the responsibility of building something meaningful. It's not just a name; it's a philosophy.",
        "Starbucks invests in partners through industry-leading benefits, including comprehensive health coverage, stock ownership through Bean Stock, the Starbucks College Achievement Plan, and mental health resources. We believe that when partners are supported, they can show up fully for each other and our customers.",
        "Our partners come from every walk of life, and that diversity makes us stronger. We're committed to creating paths for growth, recognition for hard work, and an environment where every partner feels seen, valued, and empowered to bring their whole self to work.",
      ]}
    />
  );
}
