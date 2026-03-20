import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Communities"
      subtitle="Stronger Together"
      image="/images/coffeefactory.png"
      description={[
        "From local neighborhoods to global initiatives, Starbucks is committed to uplifting the communities we serve. We believe that a business only succeeds when the communities around it are thriving.",
        "Through youth employment programs, neighborhood grants, and disaster relief efforts, our partners and customers come together to make a tangible difference. Our stores serve as gathering points for connection and collective action.",
        "We partner with nonprofits, local governments, and grassroots organizations to address the most pressing needs in each market. Whether it's housing, education, or food security, we show up where it matters most — one community at a time.",
      ]}
    />
  );
}
