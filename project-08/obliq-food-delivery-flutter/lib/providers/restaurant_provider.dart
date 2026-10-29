import 'package:flutter/material.dart';
import '../mock_data/mock_food_data.dart';
import '../models/food_item.dart';
import '../models/restaurant.dart';

class RestaurantProvider extends ChangeNotifier {
  late Restaurant _currentRestaurant;

  RestaurantProvider() {
    _currentRestaurant = MockFoodData.restaurants.firstWhere(
      (r) => r.id == 'rest_1',
      orElse: () => MockFoodData.restaurants.first,
    );
  }

  Restaurant get currentRestaurant => _currentRestaurant;
  List<FoodItem> get menu => _currentRestaurant.menu;

  void toggleItemAvailability(String foodId) {
    int idx = _currentRestaurant.menu.indexWhere((item) => item.id == foodId);
    if (idx != -1) {
      FoodItem oldItem = _currentRestaurant.menu[idx];
      _currentRestaurant.menu[idx] = oldItem.copyWith(isAvailable: !oldItem.isAvailable);
      notifyListeners();
    }
  }

  void addFoodItem(FoodItem newItem) {
    _currentRestaurant.menu.insert(0, newItem);
    notifyListeners();
  }

  void addMenuItem(FoodItem newItem) => addFoodItem(newItem);

  void updateFoodItem(FoodItem updatedItem) {
    int idx = _currentRestaurant.menu.indexWhere((item) => item.id == updatedItem.id);
    if (idx != -1) {
      _currentRestaurant.menu[idx] = updatedItem;
      notifyListeners();
    }
  }

  void updateMenuItem(FoodItem updatedItem) => updateFoodItem(updatedItem);

  void deleteFoodItem(String foodId) {
    _currentRestaurant.menu.removeWhere((item) => item.id == foodId);
    notifyListeners();
  }

  void deleteMenuItem(String foodId) => deleteFoodItem(foodId);

  // Restaurant analytics summary
  Map<String, dynamic> get analyticsSummary => {
        'ordersToday': 28,
        'pendingOrders': 3,
        'revenueToday': 8450.0,
        'avgOrderValue': 301.7,
        'rating': _currentRestaurant.rating,
        'bestSeller': 'Special Mewari Dal Baati Thali',
        'topCategory': 'Rajasthani Thali',
        'cancellationRate': '1.2%',
      };
}
