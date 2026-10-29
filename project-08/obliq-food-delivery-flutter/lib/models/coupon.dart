class Coupon {
  final String code;
  final String title;
  final String description;
  final double discountPercent; // e.g. 0.20 for 20%
  final double maxDiscountAmount;
  final double minOrderAmount;
  final bool isFreeDelivery;

  Coupon({
    required this.code,
    required this.title,
    required this.description,
    this.discountPercent = 0.0,
    this.maxDiscountAmount = 100.0,
    this.minOrderAmount = 149.0,
    this.isFreeDelivery = false,
  });
}
