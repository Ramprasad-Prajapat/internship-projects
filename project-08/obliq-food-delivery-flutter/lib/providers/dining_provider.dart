import 'package:flutter/material.dart';
import '../models/dining_place.dart';

class DiningProvider extends ChangeNotifier {
  final List<DiningPlace> _diningPlaces = [
    DiningPlace(
      id: 'dine_1',
      name: 'Upre by 1559 AD',
      cuisine: 'North Indian • Rajasthani • Lake View Rooftop',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 520,
      address: 'Lake Pichola Waterfront, Udaipur',
      costForTwo: '₹2,200 for two',
      hasOffer: true,
      offerText: 'Flat 20% OFF on Dining',
    ),
    DiningPlace(
      id: 'dine_2',
      name: 'Ambrai Restaurant',
      cuisine: 'Mewari Fine Dining • Lakeside',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 680,
      address: 'Amet Haveli, Lake Pichola, Udaipur',
      costForTwo: '₹2,800 for two',
      hasOffer: true,
      offerText: '15% OFF with Obliq Pay',
    ),
    DiningPlace(
      id: 'dine_3',
      name: 'Sun & Moon Rooftop Restaurant',
      cuisine: 'Continental • Cafe • Sunset View',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 390,
      address: 'Chandpole, Lake Pichola, Udaipur',
      costForTwo: '₹1,400 for two',
      hasOffer: false,
      offerText: '',
    ),
    DiningPlace(
      id: 'dine_4',
      name: 'Royal Repast Heritage Dining',
      cuisine: 'Royal Mewari • Barbecue • Garden',
      imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      reviewsCount: 280,
      address: 'Fatehpura Main Circle, Udaipur',
      costForTwo: '₹1,600 for two',
      hasOffer: true,
      offerText: 'Complimentary Rabdi Ghewar Dessert',
    ),
  ];

  List<DiningPlace> get diningPlaces => List.unmodifiable(_diningPlaces);
}
