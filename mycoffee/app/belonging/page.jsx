import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Belonging at Starbucks"
      subtitle="Inclusion & Diversity"
      image="/images/coffeefactory.png"
      description={[
        "We believe in creating a culture of warmth and belonging where everyone is welcome — customers and partners alike. Inclusion isn't a program for us; it's the foundation of how we operate every day.",
        "Our commitment to belonging spans hiring practices, partner development, store design, and community engagement. We actively work to remove barriers, amplify underrepresented voices, and ensure that Starbucks is a place where all people can thrive.",
        "From our Mental Health commitments to our supplier diversity goals, we're putting resources behind the values we hold. Because a company that truly belongs to its communities is one that reflects and uplifts all of them.",
      ]}
    />
  );
}
