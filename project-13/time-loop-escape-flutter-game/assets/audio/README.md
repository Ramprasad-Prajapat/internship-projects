# Time Loop Escape — Audio Asset Manifest

This directory contains the audio sound effects and ambient atmosphere tracks mapped in `AudioService` (`lib/core/services/audio_service.dart`).

## Audio Files Map

- `sfx_button_tap.mp3` — Standard UI button press cue
- `sfx_location_enter.mp3` — Room transition cue
- `sfx_object_inspect.mp3` — Hotspot inspection cue
- `sfx_item_pickup.mp3` — Physical item acquisition cue
- `sfx_item_anchored.mp3` — Timeline anchor setting cue
- `sfx_clue_discovered.mp3` — Clue discovery cue
- `sfx_knowledge_confirm.mp3` — Knowledge board confirmation cue
- `sfx_contradiction.mp3` — Contradiction discovery cue
- `sfx_puzzle_open.mp3` — Puzzle dialog open cue
- `sfx_puzzle_correct.mp3` — Puzzle solution success cue
- `sfx_puzzle_incorrect.mp3` — Puzzle failure cue
- `sfx_mechanism_unlock.mp3` — Door/box mechanism unlocked cue
- `sfx_mechanism_locked.mp3` — Locked mechanism error cue
- `sfx_dialogue_open.mp3` — NPC dialogue opened cue
- `sfx_dialogue_topic.mp3` — NPC dialogue topic unlocked cue
- `sfx_hint_open.mp3` — Hint modal open cue
- `sfx_hint_revealed.mp3` — Hint guidance revealed cue
- `sfx_stage_change.mp3` — Timeline stage progression cue
- `sfx_critical_warning.mp3` — Final 60-second time warning cue
- `sfx_temporal_collapse.mp3` — Temporal collapse cue
- `sfx_loop_start.mp3` — 11:57 PM loop start cue
- `sfx_loop_ending_warning.mp3` — 11:59 PM loop ending warning cue
- `sfx_loop_reset.mp3` — Midnight temporal reset cue
- `sfx_ending_unlocked.mp3` — Ending condition unlocked cue
- `sfx_ending_completed.mp3` — Ending sequence completed cue

## Safe Fallback Guarantee
If an optional audio file is not present on disk, `AudioService` handles playback failure gracefully without interrupting gameplay or displaying UI error popups.
