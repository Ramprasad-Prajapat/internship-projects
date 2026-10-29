class FoodItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final double rating;
  final int reviewsCount;
  final int prepTimeMinutes;
  final bool isVeg;
  final bool isAvailable;
  final List<String> availableAddons;

  FoodItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    this.rating = 4.5,
    this.reviewsCount = 120,
    this.prepTimeMinutes = 20,
    this.isVeg = false,
    this.isAvailable = true,
    this.availableAddons = const [],
  });

  FoodItem copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    String? imageUrl,
    String? category,
    double? rating,
    int? reviewsCount,
    int? prepTimeMinutes,
    bool? isVeg,
    bool? isAvailable,
    List<String>? availableAddons,
  }) {
    return FoodItem(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      imageUrl: imageUrl ?? this.imageUrl,
      category: category ?? this.category,
      rating: rating ?? this.rating,
      reviewsCount: reviewsCount ?? this.reviewsCount,
      prepTimeMinutes: prepTimeMinutes ?? this.prepTimeMinutes,
      isVeg: isVeg ?? this.isVeg,
      isAvailable: isAvailable ?? this.isAvailable,
      availableAddons: availableAddons ?? this.availableAddons,
    );
  }
}
