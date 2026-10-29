import 'package:flutter/material.dart';
import '../../models/order.dart';
import '../../theme/obliq_theme.dart';

class ReceiptScreen extends StatelessWidget {
  final Order order;
  const ReceiptScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('Tax Invoice #${order.id}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tax invoice receipt link copied to clipboard!')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? ObliqTheme.cardDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade300),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withAlpha(12),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Column(
                  children: [
                    const Text(
                      'OBLIQ FOOD DELIVERY',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: ObliqTheme.primaryOrange, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: 4),
                    const Text('Udaipur, Rajasthan, India - 313001', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    const Text('GSTIN: 08AAACF1234F1Z8 | FSSAI: 12221034000189', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              ),
              const Divider(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Order ID: ${order.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text(
                    '${order.createdAt.day}/${order.createdAt.month}/${order.createdAt.year}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text('Restaurant: ${order.restaurantName}', style: const TextStyle(fontSize: 13)),
              Text('Payment Method: ${order.paymentMethod}', style: const TextStyle(fontSize: 13)),
              const Divider(height: 30),
              const Text('Items Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 10),
              ...order.items.map(
                (item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('${item.foodItem.name} x ${item.quantity}', style: const TextStyle(fontSize: 13)),
                      Text('₹${(item.foodItem.price * item.quantity).toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const Divider(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Delivery & Taxes Breakdown', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text('₹${(order.totalAmount * 0.1).toStringAsFixed(2)}', style: const TextStyle(fontSize: 12)),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total Amount Paid', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Text(
                    '₹${order.totalAmount.toStringAsFixed(2)}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: ObliqTheme.primaryOrange),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Center(
                child: Text('Thank you for ordering with Obliq Udaipur!', style: TextStyle(fontStyle: FontStyle.italic, fontSize: 12, color: Colors.grey)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
