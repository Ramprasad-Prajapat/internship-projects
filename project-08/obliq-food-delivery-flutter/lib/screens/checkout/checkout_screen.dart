import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/price_breakdown_card.dart';
import 'order_tracking_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedAddress = 'Home: 14 Main Road, Sector 4, Hiran Magri, Udaipur - 313002';
  String _selectedPayment = 'Google Pay (UPI)';
  final bool _isPlacingOrder = false;

  final List<String> _addresses = [
    'Home: 14 Main Road, Sector 4, Hiran Magri, Udaipur - 313002',
    'Work: Plot 104, Celebration Mall Road, Bhuwana, Udaipur - 313004',
    'Lake Pichola Guest House: Old City, Udaipur - 313001',
  ];

  final List<Map<String, dynamic>> _paymentOptions = [
    {'name': 'Google Pay (UPI)', 'icon': Icons.account_balance_wallet, 'subtitle': 'Instant UPI transfer'},
    {'name': 'PhonePe (UPI)', 'icon': Icons.qr_code_2, 'subtitle': 'Pay via PhonePe app'},
    {'name': 'Credit / Debit Card', 'icon': Icons.credit_card, 'subtitle': 'Visa, Mastercard, RuPay'},
    {'name': 'Cash on Delivery (COD)', 'icon': Icons.payments_outlined, 'subtitle': 'Pay cash at your doorstep'},
    {'name': 'Obliq Wallet (Balance: ₹450)', 'icon': Icons.account_balance_wallet_outlined, 'subtitle': 'Instant 1-click checkout'},
  ];

  void _showSimulatedPaymentModal(CartProvider cartProvider, OrderProvider orderProvider) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: ObliqTheme.primaryOrange),
            const SizedBox(height: 20),
            const Text(
              'Simulating Secure Payment...',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Processing ₹${cartProvider.grandTotal.toStringAsFixed(2)} via $_selectedPayment',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Colors.grey),
            ),
          ],
        ),
      ),
    );

    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      Navigator.of(context).pop(); // Close loading modal

      Order placedOrder = orderProvider.placeOrder(
        items: cartProvider.items,
        subtotal: cartProvider.subtotal,
        deliveryFee: cartProvider.deliveryFee,
        tax: cartProvider.tax,
        discount: cartProvider.discountAmount,
        totalAmount: cartProvider.grandTotal,
        deliveryAddress: _selectedAddress,
        paymentMethod: _selectedPayment,
      );

      cartProvider.clearCart();

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => OrderTrackingScreen(order: placedOrder),
        ),
        (route) => route.isFirst,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final cartProvider = Provider.of<CartProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Address Section
                  Text(
                    'Delivery Address',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ..._addresses.map((addr) {
                    bool isSelected = _selectedAddress == addr;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedAddress = addr),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark ? ObliqTheme.cardDark : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? ObliqTheme.primaryOrange : (isDark ? Colors.white10 : Colors.grey.shade300),
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                              color: isSelected ? ObliqTheme.primaryOrange : Colors.grey,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                addr,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 20),

                  // Payment Method Section
                  Text(
                    'Payment Method',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ..._paymentOptions.map((opt) {
                    String name = opt['name'];
                    String subtitle = opt['subtitle'];
                    IconData icon = opt['icon'];
                    bool isSelected = _selectedPayment == name;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedPayment = name),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isDark ? ObliqTheme.cardDark : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? ObliqTheme.primaryOrange : (isDark ? Colors.white10 : Colors.grey.shade300),
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(icon, color: isSelected ? ObliqTheme.primaryOrange : Colors.grey),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    name,
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                  ),
                                  Text(
                                    subtitle,
                                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                            Icon(
                              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                              color: isSelected ? ObliqTheme.primaryOrange : Colors.grey,
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 20),

                  // Order Summary Breakdown
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

          // Bottom Place Order Bar
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
              text: 'PAY & PLACE ORDER (₹${cartProvider.grandTotal.toStringAsFixed(2)})',
              isLoading: _isPlacingOrder,
              onPressed: () {
                _showSimulatedPaymentModal(cartProvider, orderProvider);
              },
            ),
          ),
        ],
      ),
    );
  }
}
