import 'food_item.dart';

enum RestaurantStatus {
  pending,
  approved,
  suspended,
  active,
}

class Restaurant {
  final String id;
  final String name;
  final String cuisine;
  final String imageUrl;
  final double rating;
  final int reviewsCount;
  final String deliveryTime;
  final double deliveryFee;
  final double minOrder;
  final bool isPopular;
  final String address;
  RestaurantStatus status;
  final List<FoodItem> menu;

  Restaurant({
    required this.id,
    required this.name,
    required this.cuisine,
    required this.imageUrl,
    required this.rating,
    required this.reviewsCount,
    required this.deliveryTime,
    required this.deliveryFee,
    required this.minOrder,
    this.isPopular = false,
    required this.address,
    this.status = RestaurantStatus.active,
    required this.menu,
  });

  Restaurant copyWith({
    String? id,
    String? name,
    String? cuisine,
    String? imageUrl,
    double? rating,
    int? reviewsCount,
    String? deliveryTime,
    double? deliveryFee,
    double? minOrder,
    bool? isPopular,
    String? address,
    RestaurantStatus? status,
    List<FoodItem>? menu,
  }) {
    return Restaurant(
      id: id ?? this.id,
      name: name ?? this.name,
      cuisine: cuisine ?? this.cuisine,
      imageUrl: imageUrl ?? this.imageUrl,
      rating: rating ?? this.rating,
      reviewsCount: reviewsCount ?? this.reviewsCount,
      deliveryTime: deliveryTime ?? this.deliveryTime,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      minOrder: minOrder ?? this.minOrder,
      isPopular: isPopular ?? this.isPopular,
      address: address ?? this.address,
      status: status ?? this.status,
      menu: menu ?? this.menu,
    );
  }
}
