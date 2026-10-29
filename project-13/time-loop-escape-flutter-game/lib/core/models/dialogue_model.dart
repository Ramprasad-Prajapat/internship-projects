// lib/core/models/dialogue_model.dart

/// Model representing a conditional dialogue topic and conversation response node.
class DialogueTopic {
  final String id;
  final String npcId;
  final String title;
  final String dialoguePrompt;
  final String npcResponse;
  final String? requiredClueId;
  final String? requiredCodeId;
  final String? clueIdToUnlock;
  final String? codeIdToUnlock;
  final String? itemToGrant;

  const DialogueTopic({
    required this.id,
    required this.npcId,
    required this.title,
    required this.dialoguePrompt,
    required this.npcResponse,
    this.requiredClueId,
    this.requiredCodeId,
    this.clueIdToUnlock,
    this.codeIdToUnlock,
    this.itemToGrant,
  });
}
