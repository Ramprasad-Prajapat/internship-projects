import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../mock_data/mock_food_data.dart';
import '../models/restaurant.dart';
import '../providers/favorites_provider.dart';
import '../screens/restaurant/restaurant_detail_screen.dart';
import '../theme/obliq_theme.dart';
import 'restaurant_card.dart';

class CollectionsModal extends StatelessWidget {
  final String collectionTitle;
  final String collectionSubtitle;

  const CollectionsModal({
    super.key,
    required this.collectionTitle,
    required this.collectionSubtitle,
  });

  static void show(BuildContext context, String title, String subtitle) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => CollectionsModal(
        collectionTitle: title,
        collectionSubtitle: subtitle,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final favoritesProvider = Provider.of<FavoritesProvider>(context);

    List<Restaurant> curatedList = MockFoodData.restaurants;
    if (collectionTitle.contains('Top 10')) {
      curatedList = MockFoodData.restaurants.where((r) => r.rating >= 4.7).toList();
    } else if (collectionTitle.contains('Train')) {
      curatedList = MockFoodData.restaurants.where((r) => r.deliveryFee <= 25).toList();
    } else if (collectionTitle.contains('Under')) {
      curatedList = MockFoodData.restaurants.where((r) => r.minOrder <= 150).toList();
    }

    return Container(
      height: MediaQuery.of(context).size.height * 0.82,
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 6),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        collectionTitle,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        collectionSubtitle,
                        style: const TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: curatedList.length,
              itemBuilder: (context, index) {
                final restaurant = curatedList[index];
                return RestaurantCard(
                  restaurant: restaurant,
                  isFavorite: favoritesProvider.isRestaurantFavorite(restaurant.id),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => RestaurantDetailScreen(restaurant: restaurant),
                      ),
                    );
                  },
                  onFavoriteToggle: () {
                    favoritesProvider.toggleRestaurantFavorite(restaurant);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
