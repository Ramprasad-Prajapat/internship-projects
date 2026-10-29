import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';

class DeliveryHistoryScreen extends StatelessWidget {
  const DeliveryHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);

    final completedOrders = orderProvider.orders
        .where((o) => o.status == OrderStatus.delivered)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Completed Delivery History'),
      ),
      body: completedOrders.isEmpty
          ? const Center(child: Text('No completed deliveries yet'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: completedOrders.length,
              itemBuilder: (context, index) {
                final order = completedOrders[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? ObliqTheme.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Order: ${order.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                          const Text('Delivered ✅', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('From: ${order.restaurantName}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                      Text('To: ${order.deliveryAddress}', style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Customer: ${order.customerName}', style: const TextStyle(fontSize: 12)),
                          const Text('Payout: ₹65.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
