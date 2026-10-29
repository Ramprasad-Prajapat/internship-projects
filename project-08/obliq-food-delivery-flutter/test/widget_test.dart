import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:obliq_food_delivery/main.dart';
import 'package:obliq_food_delivery/providers/admin_provider.dart';
import 'package:obliq_food_delivery/providers/auth_provider.dart';
import 'package:obliq_food_delivery/providers/cart_provider.dart';
import 'package:obliq_food_delivery/providers/coupon_provider.dart';
import 'package:obliq_food_delivery/providers/delivery_provider.dart';
import 'package:obliq_food_delivery/providers/dining_provider.dart';
import 'package:obliq_food_delivery/providers/favorites_provider.dart';
import 'package:obliq_food_delivery/providers/healthy_mode_provider.dart';
import 'package:obliq_food_delivery/providers/location_provider.dart';
import 'package:obliq_food_delivery/providers/membership_provider.dart';
import 'package:obliq_food_delivery/providers/notification_provider.dart';
import 'package:obliq_food_delivery/providers/order_provider.dart';
import 'package:obliq_food_delivery/providers/recommendation_provider.dart';
import 'package:obliq_food_delivery/providers/restaurant_provider.dart';
import 'package:obliq_food_delivery/providers/role_provider.dart';
import 'package:obliq_food_delivery/providers/search_provider.dart';
import 'package:obliq_food_delivery/providers/support_provider.dart';
import 'package:obliq_food_delivery/providers/theme_provider.dart';
import 'package:obliq_food_delivery/providers/wallet_provider.dart';

void main() {
  testWidgets('ObliqApp smoke test initializes root widget tree', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => ThemeProvider()),
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => RoleProvider()),
          ChangeNotifierProvider(create: (_) => CartProvider()),
          ChangeNotifierProvider(create: (_) => CouponProvider()),
          ChangeNotifierProvider(create: (_) => FavoritesProvider()),
          ChangeNotifierProvider(create: (_) => OrderProvider()),
          ChangeNotifierProvider(create: (_) => NotificationProvider()),
          ChangeNotifierProvider(create: (_) => LocationProvider()),
          ChangeNotifierProvider(create: (_) => SearchProvider()),
          ChangeNotifierProvider(create: (_) => DiningProvider()),
          ChangeNotifierProvider(create: (_) => HealthyModeProvider()),
          ChangeNotifierProvider(create: (_) => MembershipProvider()),
          ChangeNotifierProvider(create: (_) => RestaurantProvider()),
          ChangeNotifierProvider(create: (_) => DeliveryProvider()),
          ChangeNotifierProvider(create: (_) => AdminProvider()),
          ChangeNotifierProvider(create: (_) => WalletProvider()),
          ChangeNotifierProvider(create: (_) => SupportProvider()),
          ChangeNotifierProvider(create: (_) => RecommendationProvider()),
        ],
        child: const ObliqApp(),
      ),
    );
    expect(find.byType(ObliqApp), findsOneWidget);
    await tester.pumpAndSettle(const Duration(seconds: 3));
  });
}
