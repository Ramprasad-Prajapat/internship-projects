// lib/shared/widgets/app_knowledge_card.dart
import 'package:flutter/material.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_card.dart';
import 'app_pill.dart';

enum KnowledgeStatus { isNew, confirmed, unresolved, contradiction }

class AppKnowledgeCard extends StatelessWidget {
  final String title;
  final String category;
  final String summary;
  final KnowledgeStatus status;
  final VoidCallback? onTap;

  const AppKnowledgeCard({
    Key? key,
    required this.title,
    required this.category,
    required this.summary,
    this.status = KnowledgeStatus.unresolved,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    AppPillColor pillScheme;
    String statusLabel;

    switch (status) {
      case KnowledgeStatus.isNew:
        pillScheme = AppPillColor.gold;
        statusLabel = 'NEW DISCOVERY';
        break;
      case KnowledgeStatus.confirmed:
        pillScheme = AppPillColor.good;
        statusLabel = 'CONFIRMED FACT';
        break;
      case KnowledgeStatus.unresolved:
        pillScheme = AppPillColor.cyan;
        statusLabel = 'UNRESOLVED LEAD';
        break;
      case KnowledgeStatus.contradiction:
        pillScheme = AppPillColor.danger;
        statusLabel = 'CONTRADICTION';
        break;
    }

    return AppCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                category.toUpperCase(),
                style: AppTypography.caption.copyWith(color: AppColors.accentPurpleLight),
              ),
              AppPill(label: statusLabel, colorScheme: pillScheme),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(title, style: AppTypography.h3),
          const SizedBox(height: AppSpacing.xs),
          Text(
            summary,
            style: AppTypography.bodyMedium,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
