import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';
import '../cart/cart_screen.dart';
import '../checkout/order_tracking_screen.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    if (orderProvider.orders.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('My Orders')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.receipt_long_outlined, size: 80, color: Colors.grey.shade400),
              const SizedBox(height: 16),
              Text(
                'No orders placed yet',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Your active & past orders will appear here.',
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: orderProvider.orders.length,
        itemBuilder: (context, index) {
          final order = orderProvider.orders[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
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
                    Text(
                      'Order #${order.id}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: order.status == OrderStatus.delivered
                            ? Colors.green.withValues(alpha: 0.1)
                            : ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        order.statusText,
                        style: TextStyle(
                          color: order.status == OrderStatus.delivered ? Colors.green : ObliqTheme.primaryOrange,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${order.items.length} Items • ₹${order.totalAmount.toStringAsFixed(2)}',
                  style: const TextStyle(color: Colors.grey, fontSize: 14),
                ),
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 8),
                Row(
                  children: [
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => OrderTrackingScreen(order: order),
                          ),
                        );
                      },
                      child: const Text('Track Order'),
                    ),
                    const Spacer(),
                    OutlinedButton(
                      onPressed: () => _showReviewDialog(context, order),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: Size.zero,
                        side: const BorderSide(color: ObliqTheme.primaryOrange),
                      ),
                      child: const Text('Rate Meal', style: TextStyle(color: ObliqTheme.primaryOrange, fontSize: 12)),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        for (var item in order.items) {
                          cartProvider.addToCart(
                            item.foodItem,
                            item.restaurantId,
                            item.restaurantName,
                            quantity: item.quantity,
                            selectedAddons: item.selectedAddons,
                          );
                        }
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Reordered items added to Cart!'),
                            backgroundColor: ObliqTheme.primaryOrange,
                          ),
                        );
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const CartScreen()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: ObliqTheme.primaryOrange,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        minimumSize: Size.zero,
                      ),
                      child: const Text('Reorder'),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showReviewDialog(BuildContext context, Order order) {
    int rating = 5;
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Rate Your Meal & Delivery'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('How was your food from Obliq?'),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (i) {
                  return IconButton(
                    icon: Icon(
                      i < rating ? Icons.star : Icons.star_border,
                      color: ObliqTheme.accentAmber,
                      size: 32,
                    ),
                    onPressed: () {
                      setState(() {
                        rating = i + 1;
                      });
                    },
                  );
                }),
              ),
              const SizedBox(height: 12),
              const TextField(
                decoration: InputDecoration(
                  hintText: 'Add a comment about food quality or delivery...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Thank you! $rating-star review submitted for Order #${order.id}'),
                    backgroundColor: ObliqTheme.primaryOrange,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
              child: const Text('Submit Review'),
            ),
          ],
        ),
      ),
    );
  }
}
