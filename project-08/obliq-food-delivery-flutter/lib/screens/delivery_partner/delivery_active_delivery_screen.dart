import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/delivery_provider.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';

class DeliveryActiveDeliveryScreen extends StatefulWidget {
  final String orderId;
  const DeliveryActiveDeliveryScreen({super.key, required this.orderId});

  @override
  State<DeliveryActiveDeliveryScreen> createState() => _DeliveryActiveDeliveryScreenState();
}

class _DeliveryActiveDeliveryScreenState extends State<DeliveryActiveDeliveryScreen> {
  void _showOtpVerificationDialog(BuildContext context, Order order, OrderProvider orderProvider, DeliveryProvider deliveryProvider) {
    TextEditingController otpCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.security, color: ObliqTheme.primaryOrange),
            SizedBox(width: 8),
            Text('Enter Customer OTP'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Ask customer for the 4-digit Delivery OTP to confirm drop-off.'),
            const SizedBox(height: 12),
            TextField(
              controller: otpCtrl,
              keyboardType: TextInputType.number,
              maxLength: 4,
              decoration: const InputDecoration(
                hintText: '4-Digit OTP (e.g., 4892)',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.successGreen),
            onPressed: () {
              bool success = orderProvider.verifyDeliveryOtp(order.id, otpCtrl.text.trim());
              if (success) {
                deliveryProvider.recordCompletedDelivery(65.0);
                Navigator.pop(ctx); // close dialog
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('OTP Verified! Order Delivered. Earned ₹65.00'), backgroundColor: Colors.green),
                );
                Navigator.pop(context); // return to dashboard
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Incorrect OTP! Please check with customer.'), backgroundColor: Colors.red),
                );
              }
            },
            child: const Text('Verify & Deliver'),
          ),
        ],
      ),
    );
  }

  void _showSosDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.warning, color: Colors.red),
            SizedBox(width: 8),
            Text('EMERGENCY SOS ASSIST'),
          ],
        ),
        content: const Text(
          'Connecting to Udaipur 24/7 Delivery Safety Helpline (+91 0294 2800999) & Emergency Services. Obliq Support team alerted.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Emergency SOS Alert sent to Obliq Safety Desk!'), backgroundColor: Colors.red),
              );
            },
            child: const Text('CALL SAFETY HELPLINE'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);
    final deliveryProvider = Provider.of<DeliveryProvider>(context, listen: false);

    final matchingOrders = orderProvider.orders.where((o) => o.id == widget.orderId).toList();
    if (matchingOrders.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Active Delivery')),
        body: const Center(child: Text('Delivery Task completed or not found.')),
      );
    }

    final order = matchingOrders.first;

    return Scaffold(
      appBar: AppBar(
        title: Text('Active Task ${order.id}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.sos, color: Colors.red),
            tooltip: 'Emergency SOS Assist',
            onPressed: () => _showSosDialog(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Simulated Route Map Header Box
            Container(
              height: 180,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.blueGrey.shade900,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(Icons.map_outlined, color: Colors.white24, size: 120),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.navigation, color: ObliqTheme.primaryOrange, size: 36),
                      const SizedBox(height: 6),
                      Text(
                        'Live Navigation to ${order.status == OrderStatus.pickedUp || order.status == OrderStatus.outForDelivery ? "Customer Locality" : "Restaurant"}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Udaipur GPS Tracking • Est: 12 Mins',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Delivery Timeline Tracker Box
            Text('DELIVERY STEP TIMELINE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: isDark ? Colors.white60 : Colors.black54, letterSpacing: 1.1)),
            const SizedBox(height: 10),

            _timelineStep('1. Assigned & Accepted', 'Order assigned to partner', order.status.index >= OrderStatus.deliveryAssigned.index, isDark),
            _timelineStep('2. Pickup at Restaurant', order.restaurantName, order.status.index >= OrderStatus.pickedUp.index, isDark),
            _timelineStep('3. Out for Delivery', 'Navigating to Customer', order.status.index >= OrderStatus.outForDelivery.index, isDark),
            _timelineStep('4. Delivered to Customer', order.deliveryAddress, order.status == OrderStatus.delivered, isDark),

            const SizedBox(height: 20),

            // Pickup & Drop Details
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
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(backgroundColor: Colors.orangeAccent, child: Icon(Icons.store, color: Colors.white)),
                    title: Text(order.restaurantName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Pickup: ${order.restaurantAddress}'),
                  ),
                  const Divider(),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(backgroundColor: Colors.green, child: Icon(Icons.person, color: Colors.white)),
                    title: Text(order.customerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Drop: ${order.deliveryAddress}\nPhone: ${order.customerPhone}'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Action Step Button
            _buildInteractiveActionButton(context, order, orderProvider, deliveryProvider),
          ],
        ),
      ),
    );
  }

  Widget _timelineStep(String title, String subtitle, bool isDone, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDone ? Colors.green.withValues(alpha: 0.1) : (isDark ? ObliqTheme.cardDark : Colors.white),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDone ? Colors.green : (isDark ? Colors.white10 : Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          Icon(isDone ? Icons.check_circle : Icons.radio_button_unchecked, color: isDone ? Colors.green : Colors.grey),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: isDone ? Colors.green : null)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInteractiveActionButton(BuildContext context, Order order, OrderProvider orderProvider, DeliveryProvider deliveryProvider) {
    if (order.status == OrderStatus.deliveryAssigned || order.status == OrderStatus.readyForPickup || order.status == OrderStatus.preparing) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () {
            orderProvider.deliveryPickupOrder(order.id);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Food Picked Up from Restaurant!'), backgroundColor: Colors.orange),
            );
          },
          icon: const Icon(Icons.shopping_bag),
          label: const Text('CONFIRM FOOD PICKUP AT RESTAURANT'),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.orange.shade800, padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
      );
    } else if (order.status == OrderStatus.pickedUp) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () {
            orderProvider.deliveryStartOutForDelivery(order.id);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Status updated: Out For Delivery!'), backgroundColor: Colors.blue),
            );
          },
          icon: const Icon(Icons.two_wheeler),
          label: const Text('START OUT FOR DELIVERY'),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
      );
    } else if (order.status == OrderStatus.outForDelivery) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () {
            _showOtpVerificationDialog(context, order, orderProvider, deliveryProvider);
          },
          icon: const Icon(Icons.check_circle_outline),
          label: const Text('VERIFY OTP & MARK DELIVERED'),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.green, padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(12),
      width: double.infinity,
      decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(12)),
      child: const Center(
        child: Text('Delivery Completed! 🎉', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 15)),
      ),
    );
  }
}
