import 'package:flutter/material.dart';
import '../../theme/obliq_theme.dart';

class ObliqMarketScreen extends StatelessWidget {
  const ObliqMarketScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Map<String, String>> marketItems = [
      {'name': 'Amul Taaza Milk (1L)', 'price': '₹68', 'time': '10 MINS', 'image': '🥛'},
      {'name': 'Farm Fresh Eggs (6 Pcs)', 'price': '₹55', 'time': '12 MINS', 'image': '🥚'},
      {'name': 'Brown Bread Slice (400g)', 'price': '₹45', 'time': '10 MINS', 'image': '🍞'},
      {'name': 'Lays Cream & Onion (50g)', 'price': '₹20', 'time': '10 MINS', 'image': '🥔'},
      {'name': 'Coca-Cola Zero Sugar (750ml)', 'price': '₹40', 'time': '8 MINS', 'image': '🥤'},
      {'name': 'Cadbury Silk Chocolate', 'price': '₹175', 'time': '10 MINS', 'image': '🍫'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Obliq Quick Market ⚡'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Delivery Time Banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.green),
              ),
              child: Row(
                children: const [
                  Icon(Icons.bolt, color: Colors.green, size: 24),
                  SizedBox(width: 10),
                  Text(
                    'Instant 10-Minute Delivery to Udaipur',
                    style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'QUICK ESSENTIALS & SNACKS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.82,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: marketItems.length,
              itemBuilder: (context, index) {
                final item = marketItems[index];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? ObliqTheme.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Text(item['image']!, style: const TextStyle(fontSize: 48)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade100,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          item['time']!,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.black),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item['name']!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            item['price']!,
                            style: const TextStyle(fontWeight: FontWeight.bold, color: ObliqTheme.primaryOrange, fontSize: 14),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Added ${item['name']} to Quick Cart!'),
                                  backgroundColor: ObliqTheme.primaryOrange,
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: ObliqTheme.primaryOrange,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: const Text('ADD', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
