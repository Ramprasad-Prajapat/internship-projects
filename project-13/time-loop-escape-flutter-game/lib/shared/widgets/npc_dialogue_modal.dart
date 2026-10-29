// lib/shared/widgets/npc_dialogue_modal.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/models/dialogue_model.dart';
import '../../core/models/npc_model.dart';
import '../../core/services/npc_service.dart';
import '../../core/services/time_loop_service.dart';
import '../design/app_colors.dart';
import '../design/app_spacing.dart';
import '../design/app_typography.dart';
import 'app_button.dart';
import 'app_card.dart';
import 'app_modal_sheet.dart';
import 'app_pill.dart';

class NpcDialogueModal extends StatefulWidget {
  final NpcModel npc;
  final NpcScheduleEvent scheduleEvent;

  const NpcDialogueModal({
    Key? key,
    required this.npc,
    required this.scheduleEvent,
  }) : super(key: key);

  static void show(BuildContext context, NpcModel npc, NpcScheduleEvent scheduleEvent) {
    final loopService = Provider.of<TimeLoopService>(context, listen: false);
    loopService.pauseLoopTimer();

    AppModalSheet.show(
      context: context,
      title: npc.name.toUpperCase(),
      subtitle: npc.role,
      child: NpcDialogueModal(npc: npc, scheduleEvent: scheduleEvent),
    ).then((_) {
      loopService.resumeLoopTimer();
    });
  }

  @override
  State<NpcDialogueModal> createState() => _NpcDialogueModalState();
}

class _NpcDialogueModalState extends State<NpcDialogueModal> {
  DialogueTopic? _selectedTopic;

  @override
  Widget build(BuildContext context) {
    final npcService = Provider.of<NpcService>(context, listen: true);
    final topics = npcService.getTopicsForNpc(widget.npc.id);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // --- NPC STATUS HEADER CARD ---
        AppCard(
          borderColor: AppColors.accentGold,
          child: Row(
            children: [
              Icon(widget.npc.icon, color: AppColors.accentGold, size: 36),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.npc.name, style: AppTypography.h2),
                    const SizedBox(height: 2),
                    Text(widget.scheduleEvent.statusDescription, style: AppTypography.bodySmall),
                  ],
                ),
              ),
              const AppPill(label: 'PRESENT IN ROOM', colorScheme: AppPillColor.good),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.lg),

        // --- CONVERSATION RESPONSE DISPLAY ---
        if (_selectedTopic != null) ...[
          AppCard(
            borderColor: AppColors.accentCyan,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.record_voice_over_rounded, color: AppColors.accentCyan),
                    SizedBox(width: AppSpacing.xs),
                    Text('NPC RESPONSE', style: AppTypography.bodySmall),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(_selectedTopic!.dialoguePrompt, style: AppTypography.bodyMedium),
                const SizedBox(height: AppSpacing.sm),
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundDark,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.lineBorder),
                  ),
                  child: Text(_selectedTopic!.npcResponse, style: AppTypography.h3),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
        ],

        // --- DIALOGUE TOPIC SELECTION LIST ---
        const Text('AVAILABLE DIALOGUE TOPICS', style: AppTypography.h3),
        const SizedBox(height: AppSpacing.sm),
        ...topics.map((topic) {
          final isAvailable = npcService.isTopicAvailable(topic);
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: AppCard(
              borderColor: isAvailable ? AppColors.lineBorder : AppColors.danger.withOpacity(0.4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(topic.title, style: AppTypography.h3),
                        if (!isAvailable)
                          const Text('LOCKED: Requires prerequisite clue or code discovery.', style: AppTypography.bodySmall),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  AppButton(
                    label: isAvailable ? 'ASK' : 'LOCKED',
                    icon: isAvailable ? Icons.forum_rounded : Icons.lock_outline_rounded,
                    variant: isAvailable ? AppButtonVariant.primary : AppButtonVariant.ghost,
                    onPressed: isAvailable
                        ? () async {
                            await npcService.executeDialogueTopic(topic);
                            setState(() {
                              _selectedTopic = topic;
                            });
                          }
                        : null,
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
