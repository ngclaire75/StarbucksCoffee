import TopicPage from '../components/TopicPage';
export default function Page() {
  return (
    <TopicPage
      title="Drinks & Food"
      subtitle="Our Menu"
      image="/images/coffeefactory.png"
      description={[
        "From our handcrafted beverages to wholesome food options, every item on our menu is crafted with care. We source the finest ingredients and combine them with expert technique to create flavors that inspire.",
        "Explore seasonal favorites that celebrate the best of each time of year, alongside timeless classics that have earned a permanent place in coffee culture. Whether you're craving a velvety latte, a refreshing cold brew, or a warm bite to go with it, there's something made just for you.",
        "Our culinary team works tirelessly to ensure every food item pairs perfectly with our beverages — from protein-packed breakfast options to afternoon snacks that keep you going. Fresh, thoughtful, and always made with quality in mind.",
      ]}
    />
  );
}
