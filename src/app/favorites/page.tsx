import ListCard from "@/components/card/list-card";
import { createClient } from "@/utils/supabase/server";

type Restaurant = {
  id: number;
  name: string;
  category: string;
  cuisine: string;
  google_maps_link: string;
  menu_id: number;
};

type FavoriteWithRestaurant = {
  restaurant_id: number;
  restaurants: Restaurant;
};

export default async function FavoritesPage() {
  const supabase = await createClient();

  // Get user's favorites with restaurant details
  const { data: favorites } = (await supabase.from("favorites").select(`
      restaurant_id,
      restaurants (
        id,
        name,
        category,
        cuisine,
        google_maps_link,
        menu_id
      )
    `)) as { data: FavoriteWithRestaurant[] | null };

  const restaurants = favorites?.map((fav) => fav.restaurants) || [];

  return (
    <div className="w-full lg:w-2/5">
      <div className="flex flex-col space-y-6 items-center">
        <h1 className="text-2xl font-bold">Your Favorite Restaurants</h1>
        {restaurants.length === 0 ? (
          <p className="text-muted-foreground">
            You haven&apos;t added any restaurants to your favorites yet.
          </p>
        ) : (
          <p className="text-muted-foreground">
            You have {restaurants.length} favorite{" "}
            {restaurants.length === 1 ? "restaurant" : "restaurants"}.
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-8 mt-10">
        {restaurants.map((restaurant) => (
          <ListCard
            key={restaurant.id}
            restaurant={restaurant}
            initialFavorited={true}
          />
        ))}
      </div>
    </div>
  );
}
