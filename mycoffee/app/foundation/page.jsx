import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="The Starbucks Foundation"
      subtitle="Creating Opportunity"
      image="/images/coffeefactory.png"
      description={[
        "The Starbucks Foundation is the philanthropic arm of Starbucks, dedicated to strengthening communities around the world through grants, scholarships, and strategic partnerships.",
        "Since its founding, the Foundation has invested hundreds of millions of dollars in programs that create pathways to opportunity — from workforce development and education to disaster relief and community resilience. Every dollar goes toward building a more equitable world.",
        "Whether through the Neighborhood Grants program that puts funding directly into local communities, or global initiatives that support coffee-growing regions, The Starbucks Foundation acts as a bridge between the company's resources and the world's most pressing needs.",
      ]}
    />
  );
}
