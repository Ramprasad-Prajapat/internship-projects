import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';

class RestaurantOrderDetailScreen extends StatelessWidget {
  final String orderId;
  const RestaurantOrderDetailScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);

    final orderList = orderProvider.orders.where((o) => o.id == orderId).toList();
    if (orderList.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Order Details')),
        body: const Center(child: Text('Order not found')),
      );
    }

    final order = orderList.first;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order ${order.id}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: ObliqTheme.primaryOrange),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: ObliqTheme.primaryOrange, size: 24),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Status: ${order.statusText}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: ObliqTheme.primaryOrange)),
                        Text('Placed at: ${order.createdAt.hour}:${order.createdAt.minute.toString().padLeft(2, '0')}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Customer Info Card
            Text('CUSTOMER INFORMATION', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: isDark ? Colors.white60 : Colors.black54, letterSpacing: 1.1)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(child: Icon(Icons.person)),
                    title: Text(order.customerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(order.customerPhone),
                  ),
                  const Divider(),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: Colors.grey, size: 18),
                      const SizedBox(width: 8),
                      Expanded(child: Text(order.deliveryAddress, style: const TextStyle(fontSize: 13))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Item List
            Text('ORDER ITEMS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: isDark ? Colors.white60 : Colors.black54, letterSpacing: 1.1)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  ...order.items.map((i) => ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(i.food.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        subtitle: Text('Variant: ${i.selectedVariant}'),
                        trailing: Text('x${i.quantity}  ₹${(i.food.price * i.quantity).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      )),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('₹${order.totalAmount.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: ObliqTheme.primaryOrange)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Quick Status Advancement Buttons
            if (order.status != OrderStatus.delivered && order.status != OrderStatus.cancelled) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    orderProvider.advanceOrderStatus(order.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Order Status Advanced!'), backgroundColor: Colors.green),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
                  child: const Text('ADVANCE ORDER STATUS'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
