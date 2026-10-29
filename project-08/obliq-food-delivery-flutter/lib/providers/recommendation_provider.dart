import 'package:flutter/foundation.dart';
import '../models/food_item.dart';
import '../models/restaurant.dart';
import '../mock_data/mock_food_data.dart';

class RecommendationProvider with ChangeNotifier {
  String _preferredCuisine = 'Rajasthani';
  final List<String> _recentlyViewedIds = [];

  String get preferredCuisine => _preferredCuisine;
  List<String> get recentlyViewedIds => _recentlyViewedIds;

  void trackViewedRestaurant(String id) {
    if (!_recentlyViewedIds.contains(id)) {
      _recentlyViewedIds.insert(0, id);
      if (_recentlyViewedIds.length > 5) {
        _recentlyViewedIds.removeLast();
      }
      notifyListeners();
    }
  }

  void setPreferredCuisine(String cuisine) {
    _preferredCuisine = cuisine;
    notifyListeners();
  }

  List<Restaurant> getRecommendedRestaurants() {
    return MockFoodData.restaurants.where((r) {
      return r.cuisine.toLowerCase().contains(_preferredCuisine.toLowerCase()) || r.rating >= 4.7;
    }).toList();
  }

  List<FoodItem> getRecommendedDishes() {
    return MockFoodData.restaurants
        .expand((r) => r.menu)
        .where((f) => f.rating >= 4.5 || f.category.toLowerCase().contains(_preferredCuisine.toLowerCase()))
        .toList();
  }
}
