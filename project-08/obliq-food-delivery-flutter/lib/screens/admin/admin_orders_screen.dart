import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../theme/obliq_theme.dart';

class AdminOrdersScreen extends StatefulWidget {
  const AdminOrdersScreen({super.key});

  @override
  State<AdminOrdersScreen> createState() => _AdminOrdersScreenState();
}

class _AdminOrdersScreenState extends State<AdminOrdersScreen> {
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);

    final filters = ['All', 'Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

    final filteredOrders = orderProvider.orders.where((o) {
      if (_selectedFilter == 'All') return true;
      if (_selectedFilter == 'Placed') return o.status == OrderStatus.placed;
      if (_selectedFilter == 'Preparing') return o.status == OrderStatus.preparing || o.status == OrderStatus.restaurantAccepted;
      if (_selectedFilter == 'Ready') return o.status == OrderStatus.readyForPickup || o.status == OrderStatus.deliveryAssigned;
      if (_selectedFilter == 'Out for Delivery') return o.status == OrderStatus.pickedUp || o.status == OrderStatus.outForDelivery;
      if (_selectedFilter == 'Delivered') return o.status == OrderStatus.delivered;
      if (_selectedFilter == 'Cancelled') return o.status == OrderStatus.cancelled;
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Order Control Center'),
      ),
      body: Column(
        children: [
          // Filter Chips
          SizedBox(
            height: 48,
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              scrollDirection: Axis.horizontal,
              children: filters.map((f) {
                bool isSel = _selectedFilter == f;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(f),
                    selected: isSel,
                    selectedColor: Colors.purple,
                    labelStyle: TextStyle(
                      color: isSel ? Colors.white : (isDark ? Colors.white : Colors.black),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    onSelected: (val) {
                      setState(() => _selectedFilter = val ? f : 'All');
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const Divider(),

          // Orders List
          Expanded(
            child: filteredOrders.isEmpty
                ? const Center(child: Text('No orders match filter'))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredOrders.length,
                    itemBuilder: (context, index) {
                      final order = filteredOrders[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDark ? ObliqTheme.cardDark : Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('ID: ${order.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.purple.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    order.statusText,
                                    style: const TextStyle(color: Colors.purple, fontWeight: FontWeight.bold, fontSize: 11),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text('Customer: ${order.customerName} (${order.customerPhone})', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                            Text('Restaurant: ${order.restaurantName}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            Text('Delivery: ${order.driverName}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                            Text('Address: ${order.deliveryAddress}', style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
                            const Divider(),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Total: ₹${order.totalAmount.toStringAsFixed(2)} (${order.paymentMethod})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                if (order.status != OrderStatus.delivered && order.status != OrderStatus.cancelled)
                                  OutlinedButton(
                                    onPressed: () {
                                      orderProvider.cancelOrder(order.id);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Admin Cancelled Order ${order.id}'), backgroundColor: Colors.red),
                                      );
                                    },
                                    style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                                    child: const Text('CANCEL ORDER'),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
