import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/food_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  String _appliedPromoCode = '';
  double _promoDiscountPercent = 0.0;
  double _flatDiscountAmount = 0.0;
  bool _isFreeDelivery = false;

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal {
    return _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  double get deliveryFee {
    if (_items.isEmpty || _isFreeDelivery) return 0.0;
    return 30.0; // ₹30 delivery fee
  }

  double get packagingFee => _items.isEmpty ? 0.0 : 15.0; // ₹15 packaging
  double get platformFee => _items.isEmpty ? 0.0 : 5.0;   // ₹5 platform fee

  double get tax => subtotal * 0.05; // 5% GST/tax

  double get discountAmount {
    if (_flatDiscountAmount > 0) {
      return _flatDiscountAmount > subtotal ? subtotal : _flatDiscountAmount;
    }
    return subtotal * _promoDiscountPercent;
  }

  double get grandTotal {
    if (_items.isEmpty) return 0.0;
    double total = subtotal + deliveryFee + packagingFee + platformFee + tax - discountAmount;
    return total < 0 ? 0.0 : total;
  }

  double get minOrderAmount => 99.0;
  bool get isMinimumOrderMet => subtotal >= minOrderAmount || _items.isEmpty;

  double get totalSavings {
    double savings = discountAmount;
    if (_isFreeDelivery) savings += 30.0;
    return savings;
  }

  String get appliedPromoCode => _appliedPromoCode;

  void addToCart(
    FoodItem foodItem,
    String restaurantId,
    String restaurantName, {
    int quantity = 1,
    List<String> selectedAddons = const [],
    String specialInstructions = '',
  }) {
    int existingIndex = _items.indexWhere(
      (item) =>
          item.foodItem.id == foodItem.id &&
          item.selectedAddons.join(',') == selectedAddons.join(','),
    );

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(
        CartItem(
          foodItem: foodItem,
          restaurantId: restaurantId,
          restaurantName: restaurantName,
          quantity: quantity,
          selectedAddons: List.from(selectedAddons),
          specialInstructions: specialInstructions,
        ),
      );
    }
    notifyListeners();
  }

  void updateQuantity(CartItem cartItem, int newQuantity) {
    if (newQuantity <= 0) {
      _items.remove(cartItem);
    } else {
      cartItem.quantity = newQuantity;
    }
    notifyListeners();
  }

  void removeItem(CartItem cartItem) {
    _items.remove(cartItem);
    notifyListeners();
  }

  bool applyPromoCode(String code) {
    String cleanCode = code.trim().toUpperCase();
    if (cleanCode == 'OBLIQ10' || cleanCode == 'WELCOME') {
      _appliedPromoCode = cleanCode;
      _promoDiscountPercent = 0.10; // 10% off
      _flatDiscountAmount = 0.0;
      _isFreeDelivery = false;
      notifyListeners();
      return true;
    } else if (cleanCode == 'FOOD20' || cleanCode == 'FOODIE100') {
      _appliedPromoCode = cleanCode;
      _promoDiscountPercent = 0.20; // 20% off
      _flatDiscountAmount = 0.0;
      _isFreeDelivery = false;
      notifyListeners();
      return true;
    } else if (cleanCode == 'UDAIPUR50' || cleanCode == 'PICHOLA50') {
      _appliedPromoCode = cleanCode;
      _promoDiscountPercent = 0.0;
      _flatDiscountAmount = 50.0; // ₹50 flat
      _isFreeDelivery = false;
      notifyListeners();
      return true;
    } else if (cleanCode == 'MEWAR100' || cleanCode == 'WELCOMEOBLIQ') {
      _appliedPromoCode = cleanCode;
      _promoDiscountPercent = 0.0;
      _flatDiscountAmount = 100.0; // ₹100 flat
      _isFreeDelivery = false;
      notifyListeners();
      return true;
    } else if (cleanCode == 'FREEDELIVERY' || cleanCode == 'LAKECITY') {
      _appliedPromoCode = cleanCode;
      _promoDiscountPercent = 0.0;
      _flatDiscountAmount = 0.0;
      _isFreeDelivery = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  void removePromoCode() {
    _appliedPromoCode = '';
    _promoDiscountPercent = 0.0;
    _flatDiscountAmount = 0.0;
    _isFreeDelivery = false;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _appliedPromoCode = '';
    _promoDiscountPercent = 0.0;
    _flatDiscountAmount = 0.0;
    _isFreeDelivery = false;
    notifyListeners();
  }
}
