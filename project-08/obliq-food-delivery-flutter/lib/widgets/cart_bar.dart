import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../screens/cart/cart_screen.dart';
import '../theme/obliq_theme.dart';

class GlobalCartBar extends StatelessWidget {
  const GlobalCartBar({super.key});

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);

    if (cartProvider.itemCount == 0) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.all(12),
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const CartScreen()),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: ObliqTheme.primaryOrange,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          elevation: 6,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.shopping_bag, color: Colors.white),
                const SizedBox(width: 10),
                Text(
                  '${cartProvider.itemCount} ${cartProvider.itemCount == 1 ? 'ITEM' : 'ITEMS'}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  ' • ₹${cartProvider.grandTotal.toStringAsFixed(0)}',
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
            Row(
              children: const [
                Text(
                  'VIEW CART',
                  style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13),
                ),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward_ios, color: Colors.white, size: 14),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
