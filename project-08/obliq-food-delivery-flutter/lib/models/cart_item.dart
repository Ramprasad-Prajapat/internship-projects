import 'food_item.dart';

class CartItem {
  final FoodItem foodItem;
  final String restaurantId;
  final String restaurantName;
  int quantity;
  final List<String> selectedAddons;
  final String selectedVariant;
  final String spiceLevel;
  final String specialInstructions;
  final String packagingPreference;
  final bool includeCutlery;

  CartItem({
    required this.foodItem,
    this.restaurantId = 'rest_1',
    this.restaurantName = 'Lake City Thali House',
    this.quantity = 1,
    this.selectedAddons = const [],
    this.selectedVariant = 'Regular',
    this.spiceLevel = 'Medium Spicy 🌶️',
    this.specialInstructions = '',
    this.packagingPreference = 'Eco-Friendly Packaging',
    this.includeCutlery = true,
  });

  FoodItem get food => foodItem;

  double get totalPrice {
    double variantMultiplier = 1.0;
    if (selectedVariant.contains('Large') || selectedVariant.contains('Full')) {
      variantMultiplier = 1.3;
    } else if (selectedVariant.contains('Small') || selectedVariant.contains('Half')) {
      variantMultiplier = 0.85;
    }
    double addonPrice = selectedAddons.length * 15.0;
    return ((foodItem.price * variantMultiplier) + addonPrice) * quantity;
  }
}
