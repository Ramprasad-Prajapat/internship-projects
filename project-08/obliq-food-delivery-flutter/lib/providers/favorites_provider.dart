import 'package:flutter/material.dart';
import '../models/food_item.dart';
import '../models/restaurant.dart';

class FavoritesProvider extends ChangeNotifier {
  final Set<String> _favoriteRestaurantIds = {'rest_1'};
  final Set<String> _favoriteFoodIds = {'food_101'};

  Set<String> get favoriteRestaurantIds => Set.unmodifiable(_favoriteRestaurantIds);
  Set<String> get favoriteFoodIds => Set.unmodifiable(_favoriteFoodIds);

  bool isRestaurantFavorite(String id) => _favoriteRestaurantIds.contains(id);
  bool isFoodFavorite(String id) => _favoriteFoodIds.contains(id);

  void toggleRestaurantFavorite(Restaurant restaurant) {
    if (_favoriteRestaurantIds.contains(restaurant.id)) {
      _favoriteRestaurantIds.remove(restaurant.id);
    } else {
      _favoriteRestaurantIds.add(restaurant.id);
    }
    notifyListeners();
  }

  void toggleFoodFavorite(FoodItem food) {
    if (_favoriteFoodIds.contains(food.id)) {
      _favoriteFoodIds.remove(food.id);
    } else {
      _favoriteFoodIds.add(food.id);
    }
    notifyListeners();
  }
}
