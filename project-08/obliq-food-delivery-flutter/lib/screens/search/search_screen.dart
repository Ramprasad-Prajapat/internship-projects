import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../mock_data/mock_food_data.dart';
import '../../models/food_item.dart';
import '../../models/restaurant.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/search_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/food_card.dart';
import '../../widgets/restaurant_card.dart';
import '../food/food_detail_screen.dart';
import '../restaurant/restaurant_detail_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    final searchProvider = Provider.of<SearchProvider>(context, listen: false);
    _controller.text = searchProvider.query;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _showSortFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Consumer<SearchProvider>(
        builder: (context, provider, child) => Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Sort & Filter Results', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: () {
                      provider.resetFilters();
                    },
                    child: const Text('Reset', style: TextStyle(color: ObliqTheme.primaryOrange)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text('Sort By', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: SearchSortOption.values.map((option) {
                  String label = 'Relevance';
                  if (option == SearchSortOption.rating) label = 'Rating: High to Low';
                  if (option == SearchSortOption.deliveryTime) label = 'Fastest Delivery';
                  if (option == SearchSortOption.costLowToHigh) label = 'Cost: Low to High';
                  if (option == SearchSortOption.costHighToLow) label = 'Cost: High to Low';

                  bool isSelected = provider.sortOption == option;
                  return ChoiceChip(
                    label: Text(label),
                    selected: isSelected,
                    selectedColor: ObliqTheme.primaryOrange,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                    ),
                    onSelected: (selected) {
                      if (selected) provider.setSortOption(option);
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              const Text('Dietary & Offers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              Row(
                children: [
                  FilterChip(
                    label: const Text('Pure Veg Only 🌿'),
                    selected: provider.pureVegOnly,
                    onSelected: (val) => provider.togglePureVeg(val),
                  ),
                  const SizedBox(width: 8),
                  FilterChip(
                    label: const Text('Has Offers'),
                    selected: provider.hasOffersOnly,
                    onSelected: (val) => provider.toggleHasOffers(val),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ObliqTheme.primaryOrange,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('Apply Filters', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final searchProvider = Provider.of<SearchProvider>(context);
    final favoritesProvider = Provider.of<FavoritesProvider>(context);

    // Filter & Sort logic
    List<Restaurant> matchingRestaurants = MockFoodData.restaurants.where((r) {
      if (searchProvider.query.isEmpty) return false;
      bool qMatch = r.name.toLowerCase().contains(searchProvider.query.toLowerCase()) ||
          r.cuisine.toLowerCase().contains(searchProvider.query.toLowerCase()) ||
          r.menu.any((m) => m.name.toLowerCase().contains(searchProvider.query.toLowerCase()));
      bool vegMatch = !searchProvider.pureVegOnly || r.menu.any((m) => m.isVeg);
      bool ratingMatch = r.rating >= searchProvider.minRating;
      bool offerMatch = !searchProvider.hasOffersOnly || r.isPopular;
      return qMatch && vegMatch && ratingMatch && offerMatch;
    }).toList();

    List<FoodItem> matchingDishes = MockFoodData.restaurants
        .expand((r) => r.menu)
        .where((f) {
          if (searchProvider.query.isEmpty) return false;
          bool qMatch = f.name.toLowerCase().contains(searchProvider.query.toLowerCase()) ||
              f.description.toLowerCase().contains(searchProvider.query.toLowerCase()) ||
              f.category.toLowerCase().contains(searchProvider.query.toLowerCase());
          bool vegMatch = !searchProvider.pureVegOnly || f.isVeg;
          return qMatch && vegMatch;
        })
        .toList();

    // Sort matching restaurants
    if (searchProvider.sortOption == SearchSortOption.rating) {
      matchingRestaurants.sort((a, b) => b.rating.compareTo(a.rating));
    } else if (searchProvider.sortOption == SearchSortOption.costLowToHigh) {
      matchingRestaurants.sort((a, b) => a.minOrder.compareTo(b.minOrder));
    } else if (searchProvider.sortOption == SearchSortOption.costHighToLow) {
      matchingRestaurants.sort((a, b) => b.minOrder.compareTo(a.minOrder));
    }

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          autofocus: true,
          onChanged: (val) => searchProvider.setQuery(val),
          onSubmitted: (val) {
            searchProvider.addRecentSearch(val);
          },
          decoration: InputDecoration(
            hintText: 'Search biryani, pizza, Punjabi Rasoi...',
            border: InputBorder.none,
            suffixIcon: _controller.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _controller.clear();
                      searchProvider.setQuery('');
                    },
                  )
                : null,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: ObliqTheme.primaryOrange),
            onPressed: () => _showSortFilterSheet(context),
            tooltip: 'Sort & Filter',
          ),
        ],
      ),
      body: searchProvider.query.isEmpty
          ? SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Recent Searches
                  if (searchProvider.recentSearches.isNotEmpty) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Recent Searches',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                          ),
                        ),
                        TextButton(
                          onPressed: () => searchProvider.clearRecentSearches(),
                          child: const Text('Clear All', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ),
                      ],
                    ),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: searchProvider.recentSearches.map((term) {
                        return ActionChip(
                          avatar: const Icon(Icons.history, size: 16, color: Colors.grey),
                          label: Text(term),
                          onPressed: () {
                            _controller.text = term;
                            searchProvider.setQuery(term);
                            searchProvider.addRecentSearch(term);
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Trending Searches
                  Text(
                    'Trending Searches 🚀',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: searchProvider.trendingSearches.map((term) {
                      return ActionChip(
                        avatar: const Icon(Icons.trending_up, size: 16, color: ObliqTheme.primaryOrange),
                        label: Text(term),
                        backgroundColor: ObliqTheme.primaryOrange.withValues(alpha: 0.08),
                        onPressed: () {
                          _controller.text = term;
                          searchProvider.setQuery(term);
                          searchProvider.addRecentSearch(term);
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            )
          : (matchingRestaurants.isEmpty && matchingDishes.isEmpty)
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search_off, size: 80, color: Colors.grey.shade400),
                      const SizedBox(height: 16),
                      Text(
                        'No results found for "${searchProvider.query}"',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text('Try checking your spelling or search for something else.', style: TextStyle(color: Colors.grey)),
                    ],
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    if (matchingRestaurants.isNotEmpty) ...[
                      Text(
                        'Restaurants (${matchingRestaurants.length})',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      ...matchingRestaurants.map((restaurant) => RestaurantCard(
                            restaurant: restaurant,
                            isFavorite: favoritesProvider.isRestaurantFavorite(restaurant.id),
                            onTap: () {
                              searchProvider.addRecentSearch(searchProvider.query);
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => RestaurantDetailScreen(restaurant: restaurant),
                                ),
                              );
                            },
                            onFavoriteToggle: () {
                              favoritesProvider.toggleRestaurantFavorite(restaurant);
                            },
                          )),
                      const SizedBox(height: 20),
                    ],
                    if (matchingDishes.isNotEmpty) ...[
                      Text(
                        'Dishes (${matchingDishes.length})',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      ...matchingDishes.map((food) {
                        final parentRest = MockFoodData.restaurants.firstWhere(
                          (r) => r.menu.any((m) => m.id == food.id),
                          orElse: () => MockFoodData.restaurants.first,
                        );
                        return FoodCard(
                          food: food,
                          isFavorite: favoritesProvider.isFoodFavorite(food.id),
                          onTap: () {
                            searchProvider.addRecentSearch(searchProvider.query);
                            FoodDetailScreen.show(context, food, parentRest);
                          },
                          onAddToCart: () {},
                          onFavoriteToggle: () {
                            favoritesProvider.toggleFoodFavorite(food);
                          },
                        );
                      }),
                    ],
                  ],
                ),
    );
  }
}
