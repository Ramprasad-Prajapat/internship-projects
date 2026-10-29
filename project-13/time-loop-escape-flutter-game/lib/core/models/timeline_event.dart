// lib/core/models/timeline_event.dart
import '../../shared/design/app_colors.dart';
import 'package:flutter/material.dart';

/// 5-minute timeline stage enum.
enum TimelineStage {
  calm, // 0:00 - 1:00
  routineShift, // 1:00 - 2:30
  tension, // 2:30 - 4:00
  criticalDanger, // 4:00 - 4:45
  temporalCollapse, // 4:45 - 5:00
}

extension TimelineStageX on TimelineStage {
  String get displayName {
    switch (this) {
      case TimelineStage.calm:
        return 'STAGE 1: CALM EXPLORATION';
      case TimelineStage.routineShift:
        return 'STAGE 2: ROUTINE SHIFT';
      case TimelineStage.tension:
        return 'STAGE 3: NPC MOVEMENT';
      case TimelineStage.criticalDanger:
        return 'STAGE 4: CRITICAL DANGER';
      case TimelineStage.temporalCollapse:
        return 'STAGE 5: TEMPORAL COLLAPSE';
    }
  }

  Color get color {
    switch (this) {
      case TimelineStage.calm:
        return AppColors.stageStartAmber;
      case TimelineStage.routineShift:
        return AppColors.accentCyan;
      case TimelineStage.tension:
        return AppColors.accentGold;
      case TimelineStage.criticalDanger:
        return AppColors.stageFinalRed;
      case TimelineStage.temporalCollapse:
        return AppColors.accentPurple;
    }
  }
}

/// Model representing a scheduled NPC or environmental world event on the 5-minute timeline.
class TimelineEvent {
  final String id;
  final int triggerTimeSeconds;
  final String title;
  final String description;
  final TimelineStage stage;
  final bool isTriggered;

  const TimelineEvent({
    required this.id,
    required this.triggerTimeSeconds,
    required this.title,
    required this.description,
    required this.stage,
    this.isTriggered = false,
  });

  TimelineEvent copyWith({
    String? id,
    int? triggerTimeSeconds,
    String? title,
    String? description,
    TimelineStage? stage,
    bool? isTriggered,
  }) {
    return TimelineEvent(
      id: id ?? this.id,
      triggerTimeSeconds: triggerTimeSeconds ?? this.triggerTimeSeconds,
      title: title ?? this.title,
      description: description ?? this.description,
      stage: stage ?? this.stage,
      isTriggered: isTriggered ?? this.isTriggered,
    );
  }
}
