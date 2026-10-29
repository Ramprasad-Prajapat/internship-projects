import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../providers/restaurant_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_indicator_banner.dart';
import 'restaurant_order_detail_screen.dart';

class RestaurantDashboardScreen extends StatelessWidget {
  const RestaurantDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final restProvider = Provider.of<RestaurantProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context);

    final restaurantOrders = orderProvider.orders
        .where((o) => o.restaurantId == restProvider.currentRestaurant.id || o.restaurantName.contains('Lake City'))
        .toList();

    final pendingOrders = restaurantOrders.where((o) => o.status == OrderStatus.placed).toList();
    final preparingOrders = restaurantOrders.where((o) => o.status == OrderStatus.preparing || o.status == OrderStatus.restaurantAccepted).toList();
    final readyOrders = restaurantOrders.where((o) => o.status == OrderStatus.readyForPickup).toList();

    final metrics = restProvider.analyticsSummary;

    return Scaffold(
      appBar: AppBar(
        title: Text('${restProvider.currentRestaurant.name} 🏪'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Dashboard refreshed'), duration: Duration(seconds: 1)),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          const RoleIndicatorBanner(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Overview Banner
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.indigo.shade700, Colors.indigo.shade900],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundColor: Colors.white24,
                          child: const Icon(Icons.storefront, color: Colors.white, size: 30),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                restProvider.currentRestaurant.name,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${restProvider.currentRestaurant.address} • Rating: ${restProvider.currentRestaurant.rating} ⭐',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Metrics Grid
                  Row(
                    children: [
                      _metricCard(context, 'Pending', '${pendingOrders.length}', Icons.pending_actions, Colors.orange, isDark),
                      const SizedBox(width: 10),
                      _metricCard(context, 'Preparing', '${preparingOrders.length}', Icons.soup_kitchen, Colors.blue, isDark),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      _metricCard(context, 'Ready', '${readyOrders.length}', Icons.takeout_dining, Colors.purple, isDark),
                      const SizedBox(width: 10),
                      _metricCard(context, "Today's Rev", '₹${metrics['revenueToday']}', Icons.payments, Colors.green, isDark),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Incoming Orders Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'NEW INCOMING ORDERS ⚡',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.1),
                      ),
                      Text(
                        '${pendingOrders.length} Pending',
                        style: const TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  if (pendingOrders.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: const [
                          Icon(Icons.check_circle_outline, color: Colors.green, size: 40),
                          SizedBox(height: 8),
                          Text('No pending orders right now', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('New orders will appear here automatically', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    )
                  else
                    ...pendingOrders.map((order) => _orderCard(context, order, orderProvider, isDark)),

                  const SizedBox(height: 24),

                  // Quick Menu Status
                  const Text(
                    'QUICK MENU AVAILABILITY TOGGLE',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.1),
                  ),
                  const SizedBox(height: 10),
                  ...restProvider.menu.take(4).map((item) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                Icon(
                                  item.isVeg ? Icons.circle : Icons.change_history,
                                  color: item.isVeg ? Colors.green : Colors.red,
                                  size: 16,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    item.name,
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '₹${item.price.toStringAsFixed(0)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: ObliqTheme.primaryOrange, fontSize: 13),
                          ),
                          const SizedBox(width: 12),
                          Switch(
                            value: item.isAvailable,
                            activeThumbColor: ObliqTheme.primaryOrange,
                            onChanged: (val) {
                              restProvider.toggleItemAvailability(item.id);
                            },
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricCard(BuildContext context, String label, String value, IconData icon, Color color, bool isDark) {
    return Expanded(
      child: Container(
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
                Icon(icon, color: color, size: 24),
                Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: color)),
              ],
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _orderCard(BuildContext context, Order order, OrderProvider orderProvider, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: ObliqTheme.primaryOrange.withValues(alpha: 0.5), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'ID: ${order.id}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  order.statusText,
                  style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Customer: ${order.customerName} (${order.customerPhone})',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
          ),
          Text(
            'Deliver to: ${order.deliveryAddress}',
            style: const TextStyle(fontSize: 12, color: Colors.grey),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          const Divider(),
          ...order.items.map((i) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('• ${i.food.name} x${i.quantity}', style: const TextStyle(fontSize: 13)),
                    Text('₹${(i.food.price * i.quantity).toStringAsFixed(0)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  ],
                ),
              )),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total: ₹${order.totalAmount.toStringAsFixed(0)} (${order.paymentMethod})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => RestaurantOrderDetailScreen(orderId: order.id)),
                  );
                },
                child: const Text('View Details', style: TextStyle(color: ObliqTheme.primaryOrange)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    orderProvider.restaurantRejectOrder(order.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Order ${order.id} Rejected'), backgroundColor: Colors.red),
                    );
                  },
                  style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                  child: const Text('REJECT'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    orderProvider.restaurantAcceptOrder(order.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Accepted Order ${order.id}!'), backgroundColor: Colors.green),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  child: const Text('ACCEPT ORDER'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
