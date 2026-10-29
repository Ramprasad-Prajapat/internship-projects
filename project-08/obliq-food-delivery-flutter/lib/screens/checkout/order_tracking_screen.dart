import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/custom_button.dart';

class OrderTrackingScreen extends StatelessWidget {
  final Order order;

  const OrderTrackingScreen({super.key, required this.order});

  void _showCancelOrderDialog(BuildContext context, Order currentOrder, OrderProvider orderProvider) {
    String selectedReason = 'Changed my mind';
    List<String> reasons = [
      'Changed my mind',
      'Delivery time is too long',
      'Placed order by mistake',
      'Want to change delivery address',
      'Incorrect items selected',
    ];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Cancel Order #ORD'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select reason for cancellation:'),
              const SizedBox(height: 10),
              ...reasons.map((r) => InkWell(
                    onTap: () => setState(() => selectedReason = r),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            selectedReason == r ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                            color: selectedReason == r ? ObliqTheme.primaryOrange : Colors.grey,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Expanded(child: Text(r, style: const TextStyle(fontSize: 13))),
                        ],
                      ),
                    ),
                  )),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Keep Order')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () {
                orderProvider.cancelOrderWithReason(currentOrder.id, selectedReason);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Order #${currentOrder.id} cancelled. ₹${currentOrder.totalAmount.toStringAsFixed(2)} refunded to Wallet.'),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: const Text('Confirm Cancellation'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);

    Order currentOrder = orderProvider.orders.firstWhere(
      (o) => o.id == order.id,
      orElse: () => order,
    );

    return Scaffold(
      appBar: AppBar(
        title: Text('Live Tracking #${currentOrder.id}'),
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Status Header Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: currentOrder.status == OrderStatus.cancelled
                    ? Colors.red.withValues(alpha: 0.1)
                    : ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: currentOrder.status == OrderStatus.cancelled
                      ? Colors.red.withValues(alpha: 0.3)
                      : ObliqTheme.primaryOrange.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    currentOrder.status == OrderStatus.cancelled ? Icons.cancel : Icons.delivery_dining,
                    color: currentOrder.status == OrderStatus.cancelled ? Colors.red : ObliqTheme.primaryOrange,
                    size: 40,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentOrder.statusText,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: currentOrder.status == OrderStatus.cancelled ? Colors.red : ObliqTheme.primaryOrange,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          currentOrder.status == OrderStatus.cancelled
                              ? 'Reason: ${currentOrder.cancellationReason ?? "Cancelled"}'
                              : 'Estimated arrival in 20-30 minutes across Udaipur',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Delivery OTP Banner for Customer
            if (currentOrder.status != OrderStatus.delivered && currentOrder.status != OrderStatus.cancelled)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.amber.shade700.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.shade700),
                ),
                child: Row(
                  children: [
                    Icon(Icons.vpn_key, color: Colors.amber.shade800),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Delivery OTP (Share with Partner upon delivery)', style: TextStyle(fontSize: 11, color: Colors.grey)),
                          Text(
                            currentOrder.deliveryOtp,
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.amber.shade900, letterSpacing: 3),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

            // Refund Status Banner if Cancelled
            if (currentOrder.status == OrderStatus.cancelled)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.account_balance_wallet, color: Colors.green),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Refund Status: ${currentOrder.refundStatus.displayName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.green)),
                          Text('Amount ₹${currentOrder.cancellationRefundedAmount.toStringAsFixed(2)} credited to your Obliq Wallet.', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

            // Live Order Status Timeline Stepper
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Live Order Progression Step Timeline',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  _stepTile('1. Order Placed', 'Order sent to ${currentOrder.restaurantName}', currentOrder.status.index >= OrderStatus.placed.index, isDark),
                  _stepTile('2. Accepted by Restaurant', 'Restaurant confirmed your order', currentOrder.status.index >= OrderStatus.restaurantAccepted.index, isDark),
                  _stepTile('3. Preparing Food', 'Mewari Chef is preparing your dishes', currentOrder.status.index >= OrderStatus.preparing.index, isDark),
                  _stepTile('4. Ready for Pickup', 'Packed and awaiting delivery partner', currentOrder.status.index >= OrderStatus.readyForPickup.index, isDark),
                  _stepTile('5. Partner Assigned', '${currentOrder.driverName} assigned to deliver', currentOrder.status.index >= OrderStatus.deliveryAssigned.index, isDark),
                  _stepTile('6. Food Picked Up', 'Driver picked up from restaurant', currentOrder.status.index >= OrderStatus.pickedUp.index, isDark),
                  _stepTile('7. Out for Delivery', 'Driver navigating to your locality in Udaipur', currentOrder.status.index >= OrderStatus.outForDelivery.index, isDark),
                  _stepTile('8. Delivered', 'Order delivered successfully! Enjoy your meal', currentOrder.status == OrderStatus.delivered, isDark, isLast: true),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Action button to advance status for demo simulation & Cancel button
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      orderProvider.advanceOrderStatus(currentOrder.id);
                    },
                    icon: const Icon(Icons.fast_forward, size: 16),
                    label: const Text('Simulate Step', style: TextStyle(fontSize: 12)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ObliqTheme.surfaceDark,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                if (currentOrder.status.index <= OrderStatus.preparing.index) ...[
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _showCancelOrderDialog(context, currentOrder, orderProvider),
                      icon: const Icon(Icons.cancel_outlined, size: 16, color: Colors.red),
                      label: const Text('Cancel Order', style: TextStyle(color: Colors.red, fontSize: 12)),
                      style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.red)),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 20),

            // Driver Contact Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: ObliqTheme.primaryOrange,
                    radius: 22,
                    child: Icon(Icons.two_wheeler, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentOrder.driverName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        Text(
                          'Delivery Partner • ${currentOrder.driverPhone}',
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const CircleAvatar(
                      backgroundColor: Colors.green,
                      radius: 18,
                      child: Icon(Icons.phone, color: Colors.white, size: 18),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Calling ${currentOrder.driverName}...')),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Return to Home
            CustomButton(
              text: 'BACK TO HOME DISCOVERY',
              onPressed: () {
                Navigator.popUntil(context, (route) => route.isFirst);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _stepTile(String title, String subtitle, bool isCompleted, bool isDark, {bool isLast = false}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                color: isCompleted ? ObliqTheme.primaryOrange : Colors.grey.shade400,
                shape: BoxShape.circle,
              ),
              child: isCompleted
                  ? const Icon(Icons.check, size: 13, color: Colors.white)
                  : const SizedBox(),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 24,
                color: isCompleted ? ObliqTheme.primaryOrange : Colors.grey.shade300,
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: isCompleted
                      ? (isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight)
                      : Colors.grey,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 11, color: Colors.grey),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ],
    );
  }
}
