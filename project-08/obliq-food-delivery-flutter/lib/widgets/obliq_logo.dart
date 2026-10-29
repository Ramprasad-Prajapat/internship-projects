import 'package:flutter/material.dart';

enum ObliqLogoVariant {
  splash,
  header,
  compact,
  dark,
  light,
}

class ObliqLogo extends StatelessWidget {
  final ObliqLogoVariant variant;
  final double size;
  final bool showSubtitle;

  const ObliqLogo({
    super.key,
    this.variant = ObliqLogoVariant.header,
    this.size = 32,
    this.showSubtitle = true,
  });

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    switch (variant) {
      case ObliqLogoVariant.splash:
        return _buildSplashLogo(context, isDark);
      case ObliqLogoVariant.header:
        return _buildHeaderLogo(context, isDark);
      case ObliqLogoVariant.compact:
        return _buildCompactLogo(context, isDark);
      case ObliqLogoVariant.dark:
        return _buildHeaderLogo(context, true);
      case ObliqLogoVariant.light:
        return _buildHeaderLogo(context, false);
    }
  }

  Widget _buildSplashLogo(BuildContext context, bool isDark) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CustomPaint(
          size: Size(size * 2.5, size * 2.5),
          painter: _ObliqLogoPainter(),
        ),
        const SizedBox(height: 16),
        RichText(
          text: const TextSpan(
            children: [
              TextSpan(
                text: 'OBLIQ',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: Color(0xFFFF5722),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFFF5722).withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFF5722).withValues(alpha: 0.3)),
          ),
          child: const Text(
            'FOOD DELIVERY • UDAIPUR 🏰',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
              color: Color(0xFFFF5722),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeaderLogo(BuildContext context, bool isDark) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        CustomPaint(
          size: Size(size, size),
          painter: _ObliqLogoPainter(),
        ),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'OBLIQ',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
                color: Color(0xFFFF5722),
                height: 1.0,
              ),
            ),
            if (showSubtitle)
              Text(
                'UDAIPUR',
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                  color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                  height: 1.1,
                ),
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildCompactLogo(BuildContext context, bool isDark) {
    return CustomPaint(
      size: Size(size, size),
      painter: _ObliqLogoPainter(),
    );
  }
}

class _ObliqLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.45);
    final radius = size.width * 0.38;

    // Outer Gradient Circle (Stylized 'O' + Pin Base)
    final ringPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF5722), Color(0xFFFF9800)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.16
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, ringPaint);

    // Location Pin Tip at Bottom
    final pinPath = Path();
    final pinBottom = Offset(size.width / 2, size.height * 0.95);
    final pinLeft = Offset(size.width * 0.3, size.height * 0.65);
    final pinRight = Offset(size.width * 0.7, size.height * 0.65);

    pinPath.moveTo(pinLeft.dx, pinLeft.dy);
    pinPath.quadraticBezierTo(size.width * 0.25, size.height * 0.8, pinBottom.dx, pinBottom.dy);
    pinPath.quadraticBezierTo(size.width * 0.75, size.height * 0.8, pinRight.dx, pinRight.dy);
    pinPath.close();

    final pinPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF5722), Color(0xFFFF9800)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.fill;

    canvas.drawPath(pinPath, pinPaint);

    // Inner Flame/Delivery Fork Element (Center Dot/Icon)
    final innerDotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, radius * 0.38, innerDotPaint);

    final innerCenterPaint = Paint()
      ..color = const Color(0xFFFF5722)
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, radius * 0.22, innerCenterPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
