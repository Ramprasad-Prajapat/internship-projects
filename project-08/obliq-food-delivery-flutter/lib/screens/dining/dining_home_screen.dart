import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/dining_provider.dart';
import '../../theme/obliq_theme.dart';

class DiningHomeScreen extends StatelessWidget {
  const DiningHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final diningProvider = Provider.of<DiningProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dining & Table Booking'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.purple.shade700, Colors.deepPurple.shade900],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  const Icon(Icons.restaurant_menu, size: 48, color: Colors.amber),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Reserve a Table at Premium Dining',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Enjoy up to 25% OFF on dining bills with Obliq Pay',
                          style: TextStyle(fontSize: 13, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'POPULAR DINING SPOTS IN UDAIPUR',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),
            ...diningProvider.diningPlaces.map((place) {
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: isDark ? ObliqTheme.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      child: Image.network(
                        place.imageUrl,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, st) => Container(
                          height: 160,
                          color: Colors.grey.shade800,
                          child: const Icon(Icons.restaurant, size: 50, color: Colors.white54),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                place.name,
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.star, size: 14, color: Colors.white),
                                    const SizedBox(width: 2),
                                    Text(
                                      '${place.rating}',
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(place.cuisine, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                          const SizedBox(height: 4),
                          Text('${place.address} • ${place.costForTwo}', style: const TextStyle(fontSize: 12)),
                          if (place.hasOffer) ...[
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                place.offerText,
                                style: const TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                          ],
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                _showBookingDialog(context, place.name);
                              },
                              icon: const Icon(Icons.table_restaurant, size: 18),
                              label: const Text('BOOK A TABLE'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: ObliqTheme.primaryOrange,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  void _showBookingDialog(BuildContext context, String placeName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Book Table at $placeName'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Select Guests & Slot:'),
            SizedBox(height: 12),
            Text('• 2 Guests • Today, 8:00 PM'),
            SizedBox(height: 8),
            Text('Offer: 15% Instant Discount on Total Bill'),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Table Reserved at $placeName for 2 Guests!'),
                  backgroundColor: ObliqTheme.successGreen,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
            child: const Text('Confirm Reservation'),
          ),
        ],
      ),
    );
  }
}
