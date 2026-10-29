import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/food_item.dart';
import '../../providers/restaurant_provider.dart';
import '../../theme/obliq_theme.dart';

class RestaurantAddEditFoodScreen extends StatefulWidget {
  final FoodItem? foodItem;
  const RestaurantAddEditFoodScreen({super.key, this.foodItem});

  @override
  State<RestaurantAddEditFoodScreen> createState() => _RestaurantAddEditFoodScreenState();
}

class _RestaurantAddEditFoodScreenState extends State<RestaurantAddEditFoodScreen> {
  final _formKey = GlobalKey<FormState>();
  late String _name;
  late String _description;
  late double _price;
  late String _category;
  late String _imageUrl;
  late bool _isVeg;
  late bool _isAvailable;

  @override
  void initState() {
    super.initState();
    _name = widget.foodItem?.name ?? '';
    _description = widget.foodItem?.description ?? '';
    _price = widget.foodItem?.price ?? 199.0;
    _category = widget.foodItem?.category ?? 'Rajasthani Thali';
    _imageUrl = widget.foodItem?.imageUrl ?? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
    _isVeg = widget.foodItem?.isVeg ?? true;
    _isAvailable = widget.foodItem?.isAvailable ?? true;
  }

  @override
  Widget build(BuildContext context) {
    bool isEditing = widget.foodItem != null;
    final restProvider = Provider.of<RestaurantProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Menu Item' : 'Add New Menu Item'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                initialValue: _name,
                decoration: const InputDecoration(labelText: 'Dish Name', border: OutlineInputBorder()),
                validator: (val) => (val == null || val.isEmpty) ? 'Please enter dish name' : null,
                onSaved: (val) => _name = val!,
              ),
              const SizedBox(height: 14),
              TextFormField(
                initialValue: _description,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                maxLines: 2,
                validator: (val) => (val == null || val.isEmpty) ? 'Please enter description' : null,
                onSaved: (val) => _description = val!,
              ),
              const SizedBox(height: 14),
              TextFormField(
                initialValue: _price.toString(),
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Price (₹)', border: OutlineInputBorder()),
                validator: (val) {
                  if (val == null || double.tryParse(val) == null) return 'Please enter valid price';
                  return null;
                },
                onSaved: (val) => _price = double.parse(val!),
              ),
              const SizedBox(height: 14),
              TextFormField(
                initialValue: _imageUrl,
                decoration: const InputDecoration(labelText: 'Image URL', border: OutlineInputBorder()),
                validator: (val) => (val == null || val.isEmpty) ? 'Please enter image URL' : null,
                onSaved: (val) => _imageUrl = val!,
              ),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(
                initialValue: _category,
                decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: 'Rajasthani Thali', child: Text('Rajasthani Thali')),
                  DropdownMenuItem(value: 'Snacks', child: Text('Snacks')),
                  DropdownMenuItem(value: 'Main Course', child: Text('Main Course')),
                  DropdownMenuItem(value: 'Sweets & Desserts', child: Text('Sweets & Desserts')),
                  DropdownMenuItem(value: 'Beverages', child: Text('Beverages')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _category = val);
                },
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('Pure Vegetarian Dish'),
                value: _isVeg,
                activeThumbColor: Colors.green,
                onChanged: (val) => setState(() => _isVeg = val),
              ),
              SwitchListTile(
                title: const Text('Available for Orders'),
                value: _isAvailable,
                activeThumbColor: ObliqTheme.primaryOrange,
                onChanged: (val) => setState(() => _isAvailable = val),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();
                      final food = FoodItem(
                        id: widget.foodItem?.id ?? 'food_${DateTime.now().millisecondsSinceEpoch}',
                        name: _name,
                        description: _description,
                        price: _price,
                        category: _category,
                        imageUrl: _imageUrl,
                        isVeg: _isVeg,
                        isAvailable: _isAvailable,
                      );
                      if (isEditing) {
                        restProvider.updateMenuItem(food);
                      } else {
                        restProvider.addMenuItem(food);
                      }
                      Navigator.pop(context);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo, padding: const EdgeInsets.symmetric(vertical: 14)),
                  child: Text(isEditing ? 'UPDATE DISH' : 'ADD DISH TO MENU'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
