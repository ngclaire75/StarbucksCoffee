import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Annual Impact Report (ESG)"
      subtitle="Our Accountability"
      image="/images/coffeefactory.png"
      description={[
        "Our Environmental, Social and Governance report is our commitment to transparency. Every year we publish measurable progress toward our sustainability goals, social equity commitments, and ethical business practices.",
        "From reducing our carbon footprint and diverting waste from landfills, to investing in partner wages and community resilience — the ESG report holds us accountable to the future we've promised to build.",
        "We believe that how we conduct our business matters as much as the business itself. The annual report is not just a document; it's a declaration that Starbucks is serious about leaving the world a little better than we found it.",
      ]}
    />
  );
}
