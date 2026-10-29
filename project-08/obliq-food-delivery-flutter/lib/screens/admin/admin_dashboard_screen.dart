import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_indicator_banner.dart';
import 'admin_orders_screen.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final adminProvider = Provider.of<AdminProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context);

    final metrics = adminProvider.platformMetrics;
    final liveOrdersCount = orderProvider.orders.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('OBLIQ Admin Control Center 🛡️'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('System alerts: All services operational across Udaipur')),
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
                  // Admin Overview Banner
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.purple.shade800, Colors.deepPurple.shade900],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Udaipur Ecosystem Revenue', style: TextStyle(color: Colors.white70, fontSize: 13)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(10)),
                              child: const Text('LIVE CITY CONTROL', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text('₹${metrics['revenueToday']}', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Orders Today: ${metrics['ordersToday']}', style: const TextStyle(color: Colors.white70, fontSize: 13)),
                            Text('Live Active Orders: $liveOrdersCount', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Metrics Cards
                  Row(
                    children: [
                      _card('Customers', '${metrics['totalCustomers']}', Icons.people, Colors.blue, isDark),
                      const SizedBox(width: 10),
                      _card('Restaurants', '${metrics['totalRestaurants']}', Icons.storefront, Colors.amber.shade800, isDark),
                      const SizedBox(width: 10),
                      _card('Delivery Crew', '${metrics['totalDeliveryPartners']}', Icons.two_wheeler, Colors.green, isDark),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Quick Shortcuts Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('PLATFORM MANAGEMENT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
                      TextButton(
                        onPressed: () {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminOrdersScreen()));
                        },
                        child: const Text('View All Orders →'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Live Order Monitoring Box
                  GestureDetector(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminOrdersScreen())),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: ObliqTheme.primaryOrange.withValues(alpha: 0.5), width: 1.5),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 22,
                            backgroundColor: ObliqTheme.primaryOrange.withValues(alpha: 0.15),
                            child: const Icon(Icons.monitor_heart, color: ObliqTheme.primaryOrange),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Order Control Center', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                Text('Monitor live order status across all $liveOrdersCount system orders', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios, size: 16, color: ObliqTheme.primaryOrange),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Udaipur Locality Performance
                  const Text('UDAIPUR LOCALITY SALES SHARE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
                  const SizedBox(height: 12),

                  ...adminProvider.areaAnalytics.map((area) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.location_city, color: Colors.purple, size: 18),
                              const SizedBox(width: 10),
                              Text(area['area'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                          Text('${area['share']} (${area['orders']} Orders)', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.purple)),
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

  Widget _card(String title, String value, IconData icon, Color color, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? ObliqTheme.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: color)),
            const SizedBox(height: 2),
            Text(title, style: const TextStyle(color: Colors.grey, fontSize: 11)),
          ],
        ),
      ),
    );
  }
}
