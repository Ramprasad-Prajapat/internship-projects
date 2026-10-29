import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/restaurant_provider.dart';
import '../../theme/obliq_theme.dart';

class RestaurantAnalyticsScreen extends StatelessWidget {
  const RestaurantAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final restProvider = Provider.of<RestaurantProvider>(context);
    final metrics = restProvider.analyticsSummary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Analytics & Revenue'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Revenue Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.indigo.shade800, Colors.deepPurple.shade900],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Total Today Revenue', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 4),
                  Text('₹${metrics['revenueToday']}', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Orders Today: ${metrics['ordersToday']}", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                      Text("Avg Order: ₹${metrics['avgOrderValue']}", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('PERFORMANCE INSIGHTS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            _insightTile('Best Selling Item', '${metrics['bestSeller']}', Icons.star, Colors.amber, isDark),
            _insightTile('Top Category', '${metrics['topCategory']}', Icons.category, Colors.blue, isDark),
            _insightTile('Customer Rating', '${metrics['rating']} / 5.0 ⭐', Icons.thumb_up, Colors.green, isDark),
            _insightTile('Order Cancellation Rate', '${metrics['cancellationRate']}', Icons.cancel, Colors.red, isDark),

            const SizedBox(height: 24),
            const Text('WEEKLY ORDER VOLUME (MOCK GRAPH)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            Container(
              height: 160,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  _bar('Mon', 0.4),
                  _bar('Tue', 0.6),
                  _bar('Wed', 0.5),
                  _bar('Thu', 0.8),
                  _bar('Fri', 0.95),
                  _bar('Sat', 1.0),
                  _bar('Sun', 0.85),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _insightTile(String title, String value, IconData icon, Color color, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
      ),
      child: Row(
        children: [
          CircleAvatar(backgroundColor: color.withValues(alpha: 0.15), child: Icon(icon, color: color, size: 20)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _bar(String day, double heightFactor) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Container(
          width: 20,
          height: 100 * heightFactor,
          decoration: BoxDecoration(
            color: ObliqTheme.primaryOrange,
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(height: 6),
        Text(day, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
