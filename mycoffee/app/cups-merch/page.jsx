import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Cups & Merch"
      subtitle="Carry the Craft"
      image="/images/coffeefactory.png"
      description={[
        "From iconic tumblers to limited-edition seasonal collections, our merchandise celebrates the love of coffee, craft, and community. Each piece is designed to make your daily ritual feel special.",
        "Our drinkware is crafted for the way you live — whether that's a sleek stainless tumbler for the morning commute, a cozy ceramic mug for lazy weekends, or a vibrant cold cup for summer afternoons. Form and function, beautifully balanced.",
        "Limited-edition drops and collaborations with artists and designers keep the collection feeling fresh and collectible. Follow your favorite seasons, cities, and stories through pieces that are as unique as the coffees we serve.",
      ]}
    />
  );
}
