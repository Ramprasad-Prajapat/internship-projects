import 'package:flutter/material.dart';
import '../models/coupon.dart';

class CouponProvider extends ChangeNotifier {
  final List<Coupon> _availableCoupons = [
    Coupon(
      code: 'UDAIPUR50',
      title: '50% OFF',
      description: 'Get 50% discount up to ₹120 on Udaipur food orders above ₹199',
      discountPercent: 0.50,
      maxDiscountAmount: 120,
      minOrderAmount: 199,
    ),
    Coupon(
      code: 'MEWAR100',
      title: 'Flat ₹100 OFF',
      description: 'Flat ₹100 discount on authentic Mewari Dal Baati & thali orders above ₹299',
      discountPercent: 0.30,
      maxDiscountAmount: 100,
      minOrderAmount: 299,
    ),
    Coupon(
      code: 'LAKECITY',
      title: '20% OFF',
      description: 'Get 20% discount up to ₹150 on lakefront cafe orders above ₹249',
      discountPercent: 0.20,
      maxDiscountAmount: 150,
      minOrderAmount: 249,
    ),
    Coupon(
      code: 'PICHOLA50',
      title: 'Flat ₹50 OFF',
      description: 'Flat ₹50 discount on your favorite snacks & street food',
      discountPercent: 0.25,
      maxDiscountAmount: 50,
      minOrderAmount: 149,
    ),
    Coupon(
      code: 'OBLIQ10',
      title: '10% OFF',
      description: 'Get 10% discount up to ₹100 on orders above ₹149',
      discountPercent: 0.10,
      maxDiscountAmount: 100,
      minOrderAmount: 149,
    ),
    Coupon(
      code: 'FREEDELIVERY',
      title: 'Free Delivery',
      description: 'Zero delivery charges on orders above ₹199',
      isFreeDelivery: true,
      minOrderAmount: 199,
    ),
  ];

  List<Coupon> get availableCoupons => List.unmodifiable(_availableCoupons);
  List<Coupon> get coupons => availableCoupons;
}
