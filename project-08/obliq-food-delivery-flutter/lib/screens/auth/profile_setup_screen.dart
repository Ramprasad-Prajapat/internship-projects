import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../mock_data/mock_food_data.dart';
import '../../models/address.dart';
import '../../providers/location_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/obliq_logo.dart';
import '../main_navigation_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController(text: 'Udaipur Foodie');
  final TextEditingController _emailController = TextEditingController(text: 'foodie@obliq.in');
  String _selectedLocality = 'Hiran Magri';

  void _saveProfileAndProceed() {
    final locationProvider = Provider.of<LocationProvider>(context, listen: false);
    
    // Select existing address matching locality or create new one
    final match = locationProvider.savedAddresses.firstWhere(
      (a) => a.area.toLowerCase().contains(_selectedLocality.toLowerCase()),
      orElse: () {
        final newAddr = DeliveryAddress(
          id: 'addr_${DateTime.now().millisecondsSinceEpoch}',
          label: 'Primary',
          streetAddress: 'Main Road',
          area: _selectedLocality,
          city: 'Udaipur',
          pincode: '313001',
          isDefault: true,
        );
        locationProvider.addAddress(newAddr);
        return newAddr;
      },
    );

    locationProvider.selectAddress(match);

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
      (route) => false,
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const ObliqLogo(variant: ObliqLogoVariant.header, size: 24, showSubtitle: false),
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              Text(
                'Complete Your Profile',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Personalize your Udaipur food delivery experience',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 28),

              // Full Name
              const Text('Full Name', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  hintText: 'e.g. Maharana Pratap',
                  prefixIcon: const Icon(Icons.person_outline, color: ObliqTheme.primaryOrange),
                  filled: true,
                  fillColor: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Email Address
              const Text('Email Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: 'e.g. foodie@obliq.in',
                  prefixIcon: const Icon(Icons.email_outlined, color: ObliqTheme.primaryOrange),
                  filled: true,
                  fillColor: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Preferred Locality in Udaipur
              const Text('Primary Delivery Area (Udaipur)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedLocality,
                    isExpanded: true,
                    icon: const Icon(Icons.location_on, color: ObliqTheme.primaryOrange),
                    items: MockFoodData.udaipurLocalities.map((loc) {
                      return DropdownMenuItem<String>(
                        value: loc,
                        child: Text(loc, style: const TextStyle(fontWeight: FontWeight.w600)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedLocality = val);
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 36),

              // Save & Proceed
              ElevatedButton(
                onPressed: _saveProfileAndProceed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: ObliqTheme.primaryOrange,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text(
                  'Save & Start Ordering 🚀',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
