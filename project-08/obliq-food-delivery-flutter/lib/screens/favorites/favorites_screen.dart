import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../mock_data/mock_food_data.dart';
import '../../models/food_item.dart';
import '../../models/restaurant.dart';
import '../../providers/cart_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/food_card.dart';
import '../../widgets/restaurant_card.dart';
import '../food/food_detail_screen.dart';
import '../restaurant/restaurant_detail_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    List<Restaurant> favRestaurants = MockFoodData.restaurants
        .where((r) => favoritesProvider.isRestaurantFavorite(r.id))
        .toList();

    List<FoodItem> favFoods = MockFoodData.restaurants
        .expand((r) => r.menu)
        .where((f) => favoritesProvider.isFoodFavorite(f.id))
        .toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Favorites'),
          bottom: const TabBar(
            indicatorColor: ObliqTheme.primaryOrange,
            labelColor: ObliqTheme.primaryOrange,
            tabs: [
              Tab(text: 'Restaurants'),
              Tab(text: 'Dishes'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Restaurants Tab
            favRestaurants.isEmpty
                ? Center(
                    child: Text(
                      'No favorite restaurants saved yet.',
                      style: TextStyle(
                        color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: favRestaurants.length,
                    itemBuilder: (context, index) {
                      final rest = favRestaurants[index];
                      return RestaurantCard(
                        restaurant: rest,
                        isFavorite: true,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => RestaurantDetailScreen(restaurant: rest),
                            ),
                          );
                        },
                        onFavoriteToggle: () {
                          favoritesProvider.toggleRestaurantFavorite(rest);
                        },
                      );
                    },
                  ),

            // Dishes Tab
            favFoods.isEmpty
                ? Center(
                    child: Text(
                      'No favorite dishes saved yet.',
                      style: TextStyle(
                        color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: favFoods.length,
                    itemBuilder: (context, index) {
                      final food = favFoods[index];
                      Restaurant parentRest = MockFoodData.restaurants.firstWhere(
                        (r) => r.menu.any((m) => m.id == food.id),
                      );

                      return FoodCard(
                        food: food,
                        isFavorite: true,
                        onTap: () {
                          FoodDetailScreen.show(context, food, parentRest);
                        },
                        onAddToCart: () {
                          cartProvider.addToCart(food, parentRest.id, parentRest.name);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('${food.name} added to cart!'),
                              backgroundColor: ObliqTheme.primaryOrange,
                            ),
                          );
                        },
                        onFavoriteToggle: () {
                          favoritesProvider.toggleFoodFavorite(food);
                        },
                      );
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
