import 'cart_item.dart';

enum OrderStatus {
  placed,
  restaurantAccepted,
  preparing,
  readyForPickup,
  deliveryAssigned,
  pickedUp,
  outForDelivery,
  delivered,
  cancelled,
}

enum RefundStatus {
  notApplicable,
  pending,
  processing,
  completed,
  failed,
}

extension OrderStatusExtension on OrderStatus {
  String get displayName {
    switch (this) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.restaurantAccepted:
        return 'Accepted by Restaurant';
      case OrderStatus.preparing:
        return 'Preparing Food';
      case OrderStatus.readyForPickup:
        return 'Ready for Pickup';
      case OrderStatus.deliveryAssigned:
        return 'Delivery Partner Assigned';
      case OrderStatus.pickedUp:
        return 'Food Picked Up';
      case OrderStatus.outForDelivery:
        return 'Out for Delivery';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }
}

extension RefundStatusExtension on RefundStatus {
  String get displayName {
    switch (this) {
      case RefundStatus.notApplicable:
        return 'N/A';
      case RefundStatus.pending:
        return 'Refund Pending';
      case RefundStatus.processing:
        return 'Processing Refund';
      case RefundStatus.completed:
        return 'Refund Completed to Wallet';
      case RefundStatus.failed:
        return 'Refund Failed - Support Required';
    }
  }
}

class Order {
  final String id;
  final String customerId;
  final String customerName;
  final String customerPhone;

  final String restaurantId;
  final String restaurantName;
  final String restaurantAddress;

  String? deliveryPartnerId;
  String? deliveryPartnerName;
  String? deliveryPartnerPhone;

  final List<CartItem> items;
  final double subtotal;
  final double deliveryFee;
  final double tax;
  final double discount;
  final double totalAmount;

  final String deliveryAddress;
  final String paymentMethod;
  OrderStatus status;

  final String deliveryOtp;
  RefundStatus refundStatus;
  String? cancellationReason;
  double cancellationRefundedAmount;
  final bool contactlessDelivery;
  final String deliveryInstructions;

  final DateTime createdAt;
  DateTime? acceptedAt;
  DateTime? preparedAt;
  DateTime? readyAt;
  DateTime? pickedUpAt;
  DateTime? deliveredAt;

  Order({
    required this.id,
    this.customerId = 'cust_101',
    this.customerName = 'Rahul Sharma',
    this.customerPhone = '+91 98290 12345',
    required this.restaurantId,
    required this.restaurantName,
    this.restaurantAddress = 'Hiran Magri, Udaipur',
    this.deliveryPartnerId,
    this.deliveryPartnerName,
    this.deliveryPartnerPhone,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.tax,
    this.discount = 0.0,
    required this.totalAmount,
    required this.deliveryAddress,
    required this.paymentMethod,
    this.status = OrderStatus.placed,
    this.deliveryOtp = '4892',
    this.refundStatus = RefundStatus.notApplicable,
    this.cancellationReason,
    this.cancellationRefundedAmount = 0.0,
    this.contactlessDelivery = false,
    this.deliveryInstructions = 'Leave at doorstep, call upon arrival',
    DateTime? createdAt,
    this.acceptedAt,
    this.preparedAt,
    this.readyAt,
    this.pickedUpAt,
    this.deliveredAt,
  }) : createdAt = createdAt ?? DateTime.now();

  String get driverName => deliveryPartnerName ?? 'Vikram Singh (Delivery Partner)';
  String get driverPhone => deliveryPartnerPhone ?? '+91 94140 99887';
  String get statusText => status.displayName;
}
