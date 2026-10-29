import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/delivery_provider.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_indicator_banner.dart';
import 'delivery_active_delivery_screen.dart';

class DeliveryDashboardScreen extends StatelessWidget {
  const DeliveryDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final deliveryProvider = Provider.of<DeliveryProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context);

    final availableRequests = orderProvider.orders
        .where((o) => o.status == OrderStatus.readyForPickup || o.status == OrderStatus.preparing)
        .toList();

    final activeDeliveryList = orderProvider.orders
        .where((o) => o.status == OrderStatus.deliveryAssigned || o.status == OrderStatus.pickedUp || o.status == OrderStatus.outForDelivery)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Partner Dashboard 🛵'),
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
                  // Online / Offline Status Toggle Banner
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: deliveryProvider.isOnline ? Colors.green.shade50 : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: deliveryProvider.isOnline ? Colors.green : Colors.grey),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 12,
                              backgroundColor: deliveryProvider.isOnline ? Colors.green : Colors.grey,
                              child: const Icon(Icons.power_settings_new, color: Colors.white, size: 16),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  deliveryProvider.isOnline ? "YOU'RE ONLINE 🟢" : "YOU'RE OFFLINE ⚪",
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                    color: deliveryProvider.isOnline ? Colors.green.shade800 : Colors.grey.shade800,
                                  ),
                                ),
                                Text(
                                  deliveryProvider.isOnline ? "Receiving Udaipur orders near Lake City" : "Turn online to receive order requests",
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Switch(
                          value: deliveryProvider.isOnline,
                          activeThumbColor: Colors.green,
                          onChanged: (val) {
                            deliveryProvider.toggleOnlineStatus(val);
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Today Earning Metrics
                  Row(
                    children: [
                      _statCard('Today Earnings', '₹${deliveryProvider.todayEarnings.toStringAsFixed(0)}', Icons.payments, Colors.green, isDark),
                      const SizedBox(width: 10),
                      _statCard('Deliveries', '${deliveryProvider.completedDeliveriesCount}', Icons.local_shipping, Colors.blue, isDark),
                      const SizedBox(width: 10),
                      _statCard('Rating', '4.9 ⭐', Icons.star, Colors.amber, isDark),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Active Delivery Section
                  if (activeDeliveryList.isNotEmpty) ...[
                    const Text(
                      'ACTIVE DELIVERY IN PROGRESS 🚀',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.1, color: ObliqTheme.primaryOrange),
                    ),
                    const SizedBox(height: 10),
                    ...activeDeliveryList.map((order) => _activeCard(context, order, isDark)),
                    const SizedBox(height: 24),
                  ],

                  // New Delivery Requests
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'NEW DELIVERY REQUESTS ⚡',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.1),
                      ),
                      if (deliveryProvider.isOnline)
                        Text(
                          '${availableRequests.length} Available',
                          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  if (!deliveryProvider.isOnline)
                    Container(
                      padding: const EdgeInsets.all(24),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: const [
                          Icon(Icons.offline_bolt_outlined, color: Colors.grey, size: 40),
                          SizedBox(height: 8),
                          Text('You are currently Offline', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('Toggle the online switch above to start receiving orders', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    )
                  else if (availableRequests.isEmpty)
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
                          Text('Searching for new orders nearby...', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('New order requests in Udaipur will pop up here', style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    )
                  else
                    ...availableRequests.map((order) => _requestCard(context, order, orderProvider, isDark)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statCard(String title, String value, IconData icon, Color color, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isDark ? ObliqTheme.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 4),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: color)),
            const SizedBox(height: 2),
            Text(title, style: const TextStyle(color: Colors.grey, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _activeCard(BuildContext context, Order order, bool isDark) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => DeliveryActiveDeliveryScreen(orderId: order.id)),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.orange.shade800, Colors.deepOrange.shade900],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('ACTIVE: ${order.id}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(10)),
                  child: Text(order.statusText, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text('Pickup: ${order.restaurantName}', style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
            Text('Drop: ${order.deliveryAddress}', style: const TextStyle(color: Colors.white70, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Tap to open Live Delivery Navigation →', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                Icon(Icons.arrow_forward, color: Colors.white, size: 18),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _requestCard(BuildContext context, Order order, OrderProvider orderProvider, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.withValues(alpha: 0.5), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Order ID: ${order.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const Text('Earning: ₹65.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 15)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.store, size: 16, color: ObliqTheme.primaryOrange),
              const SizedBox(width: 6),
              Expanded(child: Text(order.restaurantName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13))),
            ],
          ),
          Text(order.restaurantAddress, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on, size: 16, color: Colors.red),
              const SizedBox(width: 6),
              Expanded(child: Text(order.deliveryAddress, style: const TextStyle(fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Delivery request declined')),
                    );
                  },
                  child: const Text('DECLINE'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    orderProvider.deliveryAcceptRequest(
                      order.id,
                      driverName: 'Vikram Singh',
                      driverPhone: '+91 98288 77665',
                      driverId: 'del_1',
                    );
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => DeliveryActiveDeliveryScreen(orderId: order.id)),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                  child: const Text('ACCEPT DELIVERY'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
