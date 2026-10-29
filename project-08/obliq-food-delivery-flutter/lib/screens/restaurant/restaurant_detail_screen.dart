import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/food_item.dart';
import '../../models/restaurant.dart';
import '../../providers/cart_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/food_card.dart';
import '../food/food_detail_screen.dart';

class RestaurantDetailScreen extends StatefulWidget {
  final Restaurant restaurant;

  const RestaurantDetailScreen({super.key, required this.restaurant});

  @override
  State<RestaurantDetailScreen> createState() => _RestaurantDetailScreenState();
}

class _RestaurantDetailScreenState extends State<RestaurantDetailScreen> {
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    bool isFav = favoritesProvider.isRestaurantFavorite(widget.restaurant.id);

    // Extract unique categories from menu
    List<String> categories = ['All'];
    for (var item in widget.restaurant.menu) {
      String catName = item.category[0].toUpperCase() + item.category.substring(1);
      if (!categories.contains(catName)) {
        categories.add(catName);
      }
    }

    // Filter menu items
    List<FoodItem> displayedMenu = _selectedCategory == 'All'
        ? widget.restaurant.menu
        : widget.restaurant.menu.where((m) => m.category.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero Image Header
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: isDark ? ObliqTheme.surfaceDark : Colors.white,
            leading: CircleAvatar(
              backgroundColor: Colors.black.withValues(alpha: 0.5),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            actions: [
              CircleAvatar(
                backgroundColor: Colors.black.withValues(alpha: 0.5),
                child: IconButton(
                  icon: Icon(
                    isFav ? Icons.favorite : Icons.favorite_border,
                    color: isFav ? Colors.redAccent : Colors.white,
                  ),
                  onPressed: () {
                    favoritesProvider.toggleRestaurantFavorite(widget.restaurant);
                  },
                ),
              ),
              const SizedBox(width: 12),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                widget.restaurant.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Colors.grey.shade800,
                  child: const Center(
                    child: Icon(Icons.restaurant, size: 60, color: Colors.white54),
                  ),
                ),
              ),
            ),
          ),

          // Restaurant Header Info Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.restaurant.name,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.restaurant.cuisine,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: ObliqTheme.accentAmber,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.star, size: 14, color: Colors.black),
                            const SizedBox(width: 4),
                            Text(
                              widget.restaurant.rating.toString(),
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '(${widget.restaurant.reviewsCount} reviews)',
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      const Spacer(),
                      const Icon(Icons.access_time, size: 16, color: ObliqTheme.primaryOrange),
                      const SizedBox(width: 4),
                      Text(
                        widget.restaurant.deliveryTime,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Divider(),
                  ),
                ],
              ),
            ),
          ),

          // Category Tabs Filter
          SliverToBoxAdapter(
            child: SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  String cat = categories[index];
                  bool isSelected = _selectedCategory == cat;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? ObliqTheme.primaryOrange : (isDark ? ObliqTheme.cardDark : Colors.grey.shade200),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        cat,
                        style: TextStyle(
                          color: isSelected ? Colors.white : (isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight),
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

          // Menu Section Header
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Text(
                'Menu Items',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ),

          // Menu List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final food = displayedMenu[index];
                  bool isFoodFav = favoritesProvider.isFoodFavorite(food.id);

                  return FoodCard(
                    food: food,
                    isFavorite: isFoodFav,
                    onTap: () {
                      FoodDetailScreen.show(context, food, widget.restaurant);
                    },
                    onAddToCart: () {
                      cartProvider.addToCart(food, widget.restaurant.id, widget.restaurant.name);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${food.name} added to cart!'),
                          duration: const Duration(seconds: 2),
                          behavior: SnackBarBehavior.floating,
                          backgroundColor: ObliqTheme.primaryOrange,
                        ),
                      );
                    },
                    onFavoriteToggle: () {
                      favoritesProvider.toggleFoodFavorite(food);
                    },
                  );
                },
                childCount: displayedMenu.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
