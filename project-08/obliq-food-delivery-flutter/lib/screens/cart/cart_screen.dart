import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/cart_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/price_breakdown_card.dart';
import '../checkout/checkout_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _promoController = TextEditingController();

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final cartProvider = Provider.of<CartProvider>(context);

    if (cartProvider.items.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My Cart'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey.shade400),
              const SizedBox(height: 16),
              Text(
                'Your cart is empty',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Browse our top restaurants and add delicious dishes!',
                style: TextStyle(
                  fontSize: 14,
                  color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('My Cart (${cartProvider.itemCount})'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline, color: ObliqTheme.errorRed),
            onPressed: () {
              cartProvider.clearCart();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Restaurant Header Tag
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.storefront, color: ObliqTheme.primaryOrange, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          'Ordering from ${cartProvider.items.first.restaurantName}',
                          style: const TextStyle(
                            color: ObliqTheme.primaryOrange,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Cart Itemized List
                  ...cartProvider.items.map((item) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? ObliqTheme.cardDark : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              item.foodItem.imageUrl,
                              width: 70,
                              height: 70,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(
                                width: 70,
                                height: 70,
                                color: Colors.grey.shade800,
                                child: const Icon(Icons.fastfood, color: Colors.white54),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.foodItem.name,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (item.selectedAddons.isNotEmpty)
                                  Text(
                                    '+ ${item.selectedAddons.join(', ')}',
                                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                                  ),
                                const SizedBox(height: 6),
                                Text(
                                  '₹${item.totalPrice.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    color: ObliqTheme.primaryOrange,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Quantity Controls
                          Container(
                            decoration: BoxDecoration(
                              color: isDark ? ObliqTheme.surfaceDark : Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove, size: 16),
                                  constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                  padding: EdgeInsets.zero,
                                  onPressed: () {
                                    cartProvider.updateQuantity(item, item.quantity - 1);
                                  },
                                ),
                                Text(
                                  '${item.quantity}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add, size: 16),
                                  constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                  padding: EdgeInsets.zero,
                                  onPressed: () {
                                    cartProvider.updateQuantity(item, item.quantity + 1);
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 16),

                  // Total Savings Banner if any
                  if (cartProvider.totalSavings > 0)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.green.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.savings_outlined, color: Colors.green, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            '🎉 You saved ₹${cartProvider.totalSavings.toStringAsFixed(0)} on this order!',
                            style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                    ),

                  // Promo Code Input
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? ObliqTheme.cardDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.local_offer_outlined, color: ObliqTheme.primaryOrange),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TextField(
                            controller: _promoController,
                            decoration: const InputDecoration(
                              hintText: 'Promo Code (UDAIPUR50, MEWAR100)',
                              border: InputBorder.none,
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            bool success = cartProvider.applyPromoCode(_promoController.text);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(success ? 'Promo Code Applied!' : 'Invalid Promo Code'),
                                backgroundColor: success ? ObliqTheme.successGreen : ObliqTheme.errorRed,
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: ObliqTheme.primaryOrange,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            minimumSize: Size.zero,
                          ),
                          child: const Text('Apply'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Price Summary Breakdown
                  PriceBreakdownCard(
                    subtotal: cartProvider.subtotal,
                    deliveryFee: cartProvider.deliveryFee,
                    packagingFee: cartProvider.packagingFee,
                    platformFee: cartProvider.platformFee,
                    tax: cartProvider.tax,
                    discount: cartProvider.discountAmount,
                    grandTotal: cartProvider.grandTotal,
                  ),
                ],
              ),
            ),
          ),

          // Bottom Checkout Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? ObliqTheme.surfaceDark : Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -4),
                )
              ],
            ),
            child: CustomButton(
              text: 'PROCEED TO CHECKOUT (₹${cartProvider.grandTotal.toStringAsFixed(2)})',
              onPressed: () {
                if (!cartProvider.isMinimumOrderMet) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Minimum order value is ₹${cartProvider.minOrderAmount.toStringAsFixed(0)}. Please add more items.'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
