import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../models/address.dart';

class LocationProvider extends ChangeNotifier {
  final List<DeliveryAddress> _savedAddresses = [
    DeliveryAddress(
      id: 'addr_1',
      label: 'Home',
      streetAddress: '14 Main Road, Sector 4',
      area: 'Hiran Magri',
      city: 'Udaipur',
      pincode: '313002',
      isDefault: true,
    ),
    DeliveryAddress(
      id: 'addr_2',
      label: 'Work',
      streetAddress: 'Plot 104, Celebration Mall Road',
      area: 'Bhuwana',
      city: 'Udaipur',
      pincode: '313004',
      isDefault: false,
    ),
    DeliveryAddress(
      id: 'addr_3',
      label: 'Other',
      streetAddress: '12 Promenade Circle',
      area: 'Fateh Sagar',
      city: 'Udaipur',
      pincode: '313001',
      isDefault: false,
    ),
  ];

  late DeliveryAddress _currentAddress;
  bool _isLoading = false;
  String? _errorMessage;

  LocationProvider() {
    _currentAddress = _savedAddresses.firstWhere(
      (a) => a.isDefault,
      orElse: () => _savedAddresses.first,
    );
  }

  List<DeliveryAddress> get savedAddresses => List.unmodifiable(_savedAddresses);
  DeliveryAddress get currentAddress => _currentAddress;
  String get currentLocationString => '${_currentAddress.area}, ${_currentAddress.city} (${_currentAddress.label})';
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  void selectAddress(DeliveryAddress address) {
    _currentAddress = address;
    notifyListeners();
  }

  void addAddress(DeliveryAddress newAddress) {
    _savedAddresses.add(newAddress);
    if (newAddress.isDefault) {
      _currentAddress = newAddress;
    }
    notifyListeners();
  }

  void deleteAddress(String id) {
    _savedAddresses.removeWhere((a) => a.id == id);
    if (_currentAddress.id == id && _savedAddresses.isNotEmpty) {
      _currentAddress = _savedAddresses.first;
    }
    notifyListeners();
  }

  Future<void> fetchCurrentLocation() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _errorMessage = 'Location services are disabled.';
        return;
      }
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _errorMessage = 'Location permission denied.';
          return;
        }
      }
      if (permission == LocationPermission.deniedForever) {
        _errorMessage = 'Location permissions are permanently denied.';
        return;
      }
      Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
      List<Placemark> placemarks = await placemarkFromCoordinates(position.latitude, position.longitude);
      if (placemarks.isNotEmpty) {
        Placemark place = placemarks.first;
        _currentAddress = DeliveryAddress(
          id: 'gps',
          label: 'Current',
          streetAddress: place.street ?? '',
            area: place.subLocality ?? '',
            city: place.locality ?? '',
            pincode: place.postalCode ?? '',
          isDefault: true,
        );
      }
    } catch (e) {
      _errorMessage = 'Failed to get location: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
