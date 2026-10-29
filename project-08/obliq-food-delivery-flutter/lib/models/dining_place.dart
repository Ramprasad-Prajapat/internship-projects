class DiningPlace {
  final String id;
  final String name;
  final String cuisine;
  final String imageUrl;
  final double rating;
  final int reviewsCount;
  final String address;
  final String costForTwo;
  final bool hasOffer;
  final String offerText;
  final List<String> photos;

  DiningPlace({
    required this.id,
    required this.name,
    required this.cuisine,
    required this.imageUrl,
    required this.rating,
    required this.reviewsCount,
    required this.address,
    required this.costForTwo,
    this.hasOffer = false,
    this.offerText = '',
    this.photos = const [],
  });
}
