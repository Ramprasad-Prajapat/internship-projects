import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/food_item.dart';
import '../../models/restaurant.dart';
import '../../providers/cart_provider.dart';
import '../../theme/obliq_theme.dart';

class FoodDetailScreen extends StatefulWidget {
  final FoodItem food;
  final Restaurant restaurant;

  const FoodDetailScreen({
    super.key,
    required this.food,
    required this.restaurant,
  });

  static void show(BuildContext context, FoodItem food, Restaurant restaurant) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FoodDetailScreen(food: food, restaurant: restaurant),
    );
  }

  @override
  State<FoodDetailScreen> createState() => _FoodDetailScreenState();
}

class _FoodDetailScreenState extends State<FoodDetailScreen> {
  int _quantity = 1;
  String _selectedSize = 'Regular'; // Regular, Medium, Large
  final List<String> _selectedAddons = [];
  final TextEditingController _instructionsController = TextEditingController();

  @override
  void dispose() {
    _instructionsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final cartProvider = Provider.of<CartProvider>(context, listen: false);

    double sizeExtra = _selectedSize == 'Medium' ? 40.0 : (_selectedSize == 'Large' ? 80.0 : 0.0);
    double addonPrice = _selectedAddons.length * 30.0;
    double totalPrice = (widget.food.price + sizeExtra + addonPrice) * _quantity;

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 6),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.network(
                      widget.food.imageUrl,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        height: 200,
                        color: Colors.grey.shade800,
                        child: const Icon(Icons.fastfood, size: 60, color: Colors.white54),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Title & Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          widget.food.name,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                          ),
                        ),
                      ),
                      Text(
                        '₹${widget.food.price.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: ObliqTheme.primaryOrange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.food.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Portion Size Choice
                  const Text(
                    'Select Portion Size',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      for (final size in [
                        {'label': 'Regular', 'extra': '+₹0'},
                        {'label': 'Medium', 'extra': '+₹40'},
                        {'label': 'Large', 'extra': '+₹80'},
                      ])
                        Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text('${size['label']} (${size['extra']})'),
                            selected: _selectedSize == size['label'],
                            selectedColor: ObliqTheme.primaryOrange,
                            labelStyle: TextStyle(
                              color: _selectedSize == size['label'] ? Colors.white : (isDark ? Colors.white : Colors.black87),
                              fontSize: 12,
                            ),
                            onSelected: (val) {
                              if (val) {
                                setState(() {
                                  _selectedSize = size['label']!;
                                });
                              }
                            },
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Add-ons section
                  if (widget.food.availableAddons.isNotEmpty) ...[
                    const Text(
                      'Choice of Add-ons (+₹30 each)',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    ...widget.food.availableAddons.map((addon) {
                      bool isChecked = _selectedAddons.contains(addon);
                      return CheckboxListTile(
                        value: isChecked,
                        activeColor: ObliqTheme.primaryOrange,
                        contentPadding: EdgeInsets.zero,
                        title: Text(addon, style: const TextStyle(fontSize: 14)),
                        onChanged: (val) {
                          setState(() {
                            if (val == true) {
                              _selectedAddons.add(addon);
                            } else {
                              _selectedAddons.remove(addon);
                            }
                          });
                        },
                      );
                    }),
                    const SizedBox(height: 16),
                  ],

                  // Special Instructions
                  const Text(
                    'Special Instructions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _instructionsController,
                    decoration: const InputDecoration(
                      hintText: 'e.g. Extra sauce, no onions, mild spice level',
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),

          // Bottom Add-to-cart Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? ObliqTheme.cardDark : Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -4),
                )
              ],
            ),
            child: Row(
              children: [
                // Quantity Counter
                Container(
                  decoration: BoxDecoration(
                    color: isDark ? ObliqTheme.surfaceDark : Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove, size: 18),
                        onPressed: _quantity > 1
                            ? () {
                                setState(() {
                                  _quantity--;
                                });
                              }
                            : null,
                      ),
                      Text(
                        '$_quantity',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, size: 18),
                        onPressed: () {
                          setState(() {
                            _quantity++;
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                // Add to Cart Button
                Expanded(
                  child: SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        List<String> finalAddons = List.from(_selectedAddons);
                        if (_selectedSize != 'Regular') {
                          finalAddons.insert(0, 'Size: $_selectedSize');
                        }
                        cartProvider.addToCart(
                          widget.food,
                          widget.restaurant.id,
                          widget.restaurant.name,
                          quantity: _quantity,
                          selectedAddons: finalAddons,
                          specialInstructions: _instructionsController.text,
                        );
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Added $_quantity x ${widget.food.name} to Cart'),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: ObliqTheme.primaryOrange,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: ObliqTheme.primaryOrange,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('ADD TO CART', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text(
                            '₹${totalPrice.toStringAsFixed(0)}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
