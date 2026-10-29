import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';
import '../../providers/restaurant_provider.dart';
import '../../theme/obliq_theme.dart';
import 'restaurant_order_detail_screen.dart';

class RestaurantOrdersScreen extends StatefulWidget {
  const RestaurantOrdersScreen({super.key});

  @override
  State<RestaurantOrdersScreen> createState() => _RestaurantOrdersScreenState();
}

class _RestaurantOrdersScreenState extends State<RestaurantOrdersScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final orderProvider = Provider.of<OrderProvider>(context);
    final restProvider = Provider.of<RestaurantProvider>(context);

    final allOrders = orderProvider.orders
        .where((o) => o.restaurantId == restProvider.currentRestaurant.id || o.restaurantName.contains('Lake City'))
        .toList();

    final pending = allOrders.where((o) => o.status == OrderStatus.placed).toList();
    final preparing = allOrders.where((o) => o.status == OrderStatus.restaurantAccepted || o.status == OrderStatus.preparing).toList();
    final ready = allOrders.where((o) => o.status == OrderStatus.readyForPickup || o.status == OrderStatus.deliveryAssigned || o.status == OrderStatus.pickedUp || o.status == OrderStatus.outForDelivery).toList();
    final completed = allOrders.where((o) => o.status == OrderStatus.delivered).toList();
    final cancelled = allOrders.where((o) => o.status == OrderStatus.cancelled).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Order Management'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: ObliqTheme.primaryOrange,
          unselectedLabelColor: isDark ? Colors.white60 : Colors.black54,
          indicatorColor: ObliqTheme.primaryOrange,
          tabs: [
            Tab(text: 'Pending (${pending.length})'),
            Tab(text: 'Preparing (${preparing.length})'),
            Tab(text: 'Ready (${ready.length})'),
            Tab(text: 'Delivered (${completed.length})'),
            Tab(text: 'Cancelled (${cancelled.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrdersList(context, pending, orderProvider, isDark),
          _buildOrdersList(context, preparing, orderProvider, isDark),
          _buildOrdersList(context, ready, orderProvider, isDark),
          _buildOrdersList(context, completed, orderProvider, isDark),
          _buildOrdersList(context, cancelled, orderProvider, isDark),
        ],
      ),
    );
  }

  Widget _buildOrdersList(BuildContext context, List<Order> orders, OrderProvider orderProvider, bool isDark) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.inbox_outlined, size: 60, color: Colors.grey),
            SizedBox(height: 12),
            Text('No orders in this status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 14),
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
                  Text(order.id, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: ObliqTheme.primaryOrange.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      order.statusText,
                      style: const TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text('Customer: ${order.customerName} (${order.customerPhone})', style: const TextStyle(fontSize: 13)),
              Text('Address: ${order.deliveryAddress}', style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
              const Divider(),
              ...order.items.map((item) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('• ${item.food.name} x${item.quantity}', style: const TextStyle(fontSize: 13)),
                        Text('₹${(item.food.price * item.quantity).toStringAsFixed(0)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  )),
              const Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total: ₹${order.totalAmount.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => RestaurantOrderDetailScreen(orderId: order.id)),
                      );
                    },
                    child: const Text('View Full Order'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _buildActionButtons(context, order, orderProvider),
            ],
          ),
        );
      },
    );
  }

  Widget _buildActionButtons(BuildContext context, Order order, OrderProvider orderProvider) {
    if (order.status == OrderStatus.placed) {
      return Row(
        children: [
          Expanded(
            child: OutlinedButton(
              onPressed: () => orderProvider.restaurantRejectOrder(order.id),
              style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('REJECT'),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: ElevatedButton(
              onPressed: () => orderProvider.restaurantAcceptOrder(order.id),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: const Text('ACCEPT'),
            ),
          ),
        ],
      );
    } else if (order.status == OrderStatus.restaurantAccepted) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () => orderProvider.restaurantStartPreparing(order.id),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
          child: const Text('START PREPARING FOOD'),
        ),
      );
    } else if (order.status == OrderStatus.preparing) {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () => orderProvider.restaurantMarkReady(order.id),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
          child: const Text('MARK READY FOR PICKUP'),
        ),
      );
    } else if (order.status == OrderStatus.readyForPickup) {
      return Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(8)),
        child: Row(
          children: const [
            Icon(Icons.check_circle, color: Colors.green, size: 18),
            SizedBox(width: 8),
            Text('Food Ready! Awaiting Delivery Partner Pickup', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
