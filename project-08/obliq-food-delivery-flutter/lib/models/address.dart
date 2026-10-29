class DeliveryAddress {
  final String id;
  final String label; // 'Home', 'Work', 'Other'
  final String streetAddress;
  final String area;
  final String city;
  final String pincode;
  final bool isDefault;

  DeliveryAddress({
    required this.id,
    required this.label,
    required this.streetAddress,
    required this.area,
    required this.city,
    required this.pincode,
    this.isDefault = false,
  });
}
