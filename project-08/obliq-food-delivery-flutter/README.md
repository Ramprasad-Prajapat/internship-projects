# obliq-food-delivery-flutter

A multi-role cross-platform food delivery ecosystem built with Flutter. It connects customers, restaurant partners, delivery riders, and administrators in a single responsive codebase.

## Tech Stack
- Framework: Flutter 3.10+ (Dart 3.x)
- Design: Material Design 3, Cupertino Icons, Custom micro-animations
- Architecture: Role-based decoupled modules (Customer, Restaurant Partner, Delivery Partner, Admin)

## Features
- Customer ordering experience with multi-criteria search, cuisine filters, dish customizations, and dynamic cart
- Simulated payment gateway supporting UPI (Google Pay, PhonePe, Paytm), Cards, NetBanking, and COD
- Live multi-stage simulated delivery tracking with rider contact details and map interface
- Restaurant partner portal for menu updates, item availability, and active kitchen orders
- Delivery partner dashboard with real-time order acceptance, earnings tracker, and route previews
- Admin management console for restaurant verification, platform fee adjustments, and coupons

## Folder Structure
`
obliq-food-delivery-flutter/
â”œâ”€â”€ android/
â”œâ”€â”€ ios/
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ main.dart
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ providers/
â”‚   â”œâ”€â”€ screens/
â”‚   â””â”€â”€ widgets/
â”œâ”€â”€ pubspec.yaml
â””â”€â”€ README.md
`

## How to Run
1. Prerequisites: Flutter SDK 3.10+, Dart SDK 3.0+, Android Studio or Xcode
2. Setup:
   `ash
   flutter pub get
   `
3. Run:
   `ash
   flutter run
   `

## Environment Variables / Config
- None required for baseline local simulation
