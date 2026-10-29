package com.example.data

import androidx.annotation.DrawableRes

data class UserData(
    val username: String,
    val email: String,
    val coins: Int,
    val bestWpm: Int,
    val accuracy: Double,
    val streak: Int,
    val rank: String,
    val level: Int,
    val xp: Int,
    val nextLevelXp: Int
)

data class StatsData(
    val bestWpm: Int,
    val accuracy: Double,
    val dailyStreak: Int,
    val rankPercent: Int
)

data class GameMode(
    val id: String,
    val title: String,
    val subtitle: String,
    val description: String,
    val iconKey: String,
    val difficulty: String,
    val progressPercent: Int = 0,
    val isAvailable: Boolean = true
) {
    val name: String get() = title
    val category: String get() = subtitle
    val iconName: String get() = iconKey
}

typealias ModeData = GameMode

fun ModeData(
    id: String,
    name: String,
    category: String,
    difficulty: String,
    description: String,
    progressPercent: Int,
    iconName: String
): GameMode = GameMode(
    id = id,
    title = name,
    subtitle = category,
    description = description,
    iconKey = iconName,
    difficulty = difficulty,
    progressPercent = progressPercent,
    isAvailable = true
)

data class GameLevel(
    val id: String,
    val modeId: String,
    val number: Int,
    val title: String,
    val description: String,
    val difficulty: String,
    val rewardXP: Int = 0,
    val rewardCoins: Int = 0,
    val targetText: String = "",
    val unlocked: Boolean = false,
    val completed: Boolean = false,
    val stars: Int = 0,
    val bestWpm: Int = 0,
    val bestAccuracy: Double = 0.0,
    val difficultyLabel: String = difficulty
) {
    val name: String get() = title
}

typealias LevelData = GameLevel

fun LevelData(
    id: String,
    modeId: String,
    name: String,
    targetText: String,
    unlocked: Boolean,
    completed: Boolean,
    stars: Int,
    bestWpm: Int,
    bestAccuracy: Double,
    difficultyLabel: String
): GameLevel = GameLevel(
    id = id,
    modeId = modeId,
    number = id.filter { it.isDigit() }.toIntOrNull() ?: 1,
    title = name,
    description = "",
    difficulty = difficultyLabel,
    rewardXP = 120,
    rewardCoins = 250,
    targetText = targetText,
    unlocked = unlocked,
    completed = completed,
    stars = stars,
    bestWpm = bestWpm,
    bestAccuracy = bestAccuracy,
    difficultyLabel = difficultyLabel
)

data class MistakeData(
    val id: String,
    val originalWord: String,
    val typedWord: String,
    val typeLabel: String, // "Spelling", "Rhythm", "Grammar"
    val originalSentence: String,
    val typedSentence: String,
    val helpText: String,
    val userId: String = "",
    val sessionId: String = "",
    val modeId: String = "",
    val levelId: String = "",
    val challengeId: String = "",
    val promptText: String = "",
    val expectedText: String = "",
    val submittedText: String = "",
    val timestamp: Long = 0
)

data class RewardMetadata(
    val id: String,
    val title: String,
    val description: String,
    val iconKey: String,
    val requirementText: String
)

data class RewardData(
    val id: String,
    val title: String,
    val coinsReward: Int,
    val xpReward: Int,
    val unlocked: Boolean
)

data class BadgeData(
    val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val unlocked: Boolean
)

data class EquipmentData(
    val id: String,
    val name: String,
    val category: String, // "Shoes", "Wings", "Aura"
    val rarity: String, // "Epic", "Rare", "Mythic", "Common"
    val effect: String, // "Epic Effect", "Mythic Glow", etc.
    val cost: Int,
    val unlocked: Boolean,
    val equipped: Boolean,
    val iconName: String
)

data class NavigationData(
    val activeTab: String,
    val tabs: List<NavigationTab>
)

data class NavigationTab(
    val id: String,
    val label: String,
    val iconName: String
)

enum class ChallengeType {
    WORD,
    SENTENCE,
    GRAMMAR,
    TRANSLATION
}

data class GameplayChallenge(
    val id: String,
    val modeId: String,
    val levelId: String,
    val promptText: String,
    val expectedText: String,
    val challengeType: ChallengeType
)

enum class GameOutcome {
    COMPLETED,
    HEALTH_DEPLETED,
    TIME_EXPIRED
}

object CentralizedChallenges {
    val list = listOf(
        // Word Run Level 1 (25 challenges)
        GameplayChallenge("w_1", "word_run", "word_1", "the", "the", ChallengeType.WORD),
        GameplayChallenge("w_2", "word_run", "word_1", "quick", "quick", ChallengeType.WORD),
        GameplayChallenge("w_3", "word_run", "word_1", "brown", "brown", ChallengeType.WORD),
        GameplayChallenge("w_4", "word_run", "word_1", "fox", "fox", ChallengeType.WORD),
        GameplayChallenge("w_5", "word_run", "word_1", "jumps", "jumps", ChallengeType.WORD),
        GameplayChallenge("w_6", "word_run", "word_1", "over", "over", ChallengeType.WORD),
        GameplayChallenge("w_7", "word_run", "word_1", "lazy", "lazy", ChallengeType.WORD),
        GameplayChallenge("w_8", "word_run", "word_1", "dog", "dog", ChallengeType.WORD),
        GameplayChallenge("w_9", "word_run", "word_1", "run", "run", ChallengeType.WORD),
        GameplayChallenge("w_10", "word_run", "word_1", "speed", "speed", ChallengeType.WORD),
        GameplayChallenge("w_11", "word_run", "word_1", "fast", "fast", ChallengeType.WORD),
        GameplayChallenge("w_12", "word_run", "word_1", "type", "type", ChallengeType.WORD),
        GameplayChallenge("w_13", "word_run", "word_1", "runner", "runner", ChallengeType.WORD),
        GameplayChallenge("w_14", "word_run", "word_1", "key", "key", ChallengeType.WORD),
        GameplayChallenge("w_15", "word_run", "word_1", "board", "board", ChallengeType.WORD),
        GameplayChallenge("w_16", "word_run", "word_1", "finger", "finger", ChallengeType.WORD),
        GameplayChallenge("w_17", "word_run", "word_1", "game", "game", ChallengeType.WORD),
        GameplayChallenge("w_18", "word_run", "word_1", "play", "play", ChallengeType.WORD),
        GameplayChallenge("w_19", "word_run", "word_1", "word", "word", ChallengeType.WORD),
        GameplayChallenge("w_20", "word_run", "word_1", "time", "time", ChallengeType.WORD),
        GameplayChallenge("w_21", "word_run", "word_1", "score", "score", ChallengeType.WORD),
        GameplayChallenge("w_22", "word_run", "word_1", "combo", "combo", ChallengeType.WORD),
        GameplayChallenge("w_23", "word_run", "word_1", "level", "level", ChallengeType.WORD),
        GameplayChallenge("w_24", "word_run", "word_1", "heart", "heart", ChallengeType.WORD),
        GameplayChallenge("w_25", "word_run", "word_1", "win", "win", ChallengeType.WORD),

        // Word Run Levels 2–5 (1 challenge each)
        GameplayChallenge("w_lvl2_1", "word_run", "word_2", "Focus on short sentences with basic punctuation. Watch your breath!", "Focus on short sentences with basic punctuation. Watch your breath!", ChallengeType.WORD),
        GameplayChallenge("w_lvl3_1", "word_run", "word_3", "Flowing paragraphs build stamina and test endurance on complex words.", "Flowing paragraphs build stamina and test endurance on complex words.", ChallengeType.WORD),
        GameplayChallenge("w_lvl4_1", "word_run", "word_4", "Accelerated challenges designed to push your tactile speed limits.", "Accelerated challenges designed to push your tactile speed limits.", ChallengeType.WORD),
        GameplayChallenge("w_lvl5_1", "word_run", "word_5", "Ultimate typing battle where speed and flawless rhythm meet glory.", "Ultimate typing battle where speed and flawless rhythm meet glory.", ChallengeType.WORD),

        // Sentence Run Level 1 (10 challenges)
        GameplayChallenge("s_1", "sentence_run", "sent_1", "The quick brown fox jumps over the lazy dog.", "The quick brown fox jumps over the lazy dog.", ChallengeType.SENTENCE),
        GameplayChallenge("s_2", "sentence_run", "sent_1", "Type with calm concentration to unlock a perfect flow.", "Type with calm concentration to unlock a perfect flow.", ChallengeType.SENTENCE),
        GameplayChallenge("s_3", "sentence_run", "sent_1", "Fast typing requires both speed and precision on every keystroke.", "Fast typing requires both speed and precision on every keystroke.", ChallengeType.SENTENCE),
        GameplayChallenge("s_4", "sentence_run", "sent_1", "Build your finger strength and focus by typing this phrase.", "Build your finger strength and focus by typing this phrase.", ChallengeType.SENTENCE),
        GameplayChallenge("s_5", "sentence_run", "sent_1", "Keep a steady pace while typing longer sentences with complex words.", "Keep a steady pace while typing longer sentences with complex words.", ChallengeType.SENTENCE),
        GameplayChallenge("s_6", "sentence_run", "sent_1", "Commas, semicolons, and periods are important for structure.", "Commas, semicolons, and periods are important for structure.", ChallengeType.SENTENCE),
        GameplayChallenge("s_7", "sentence_run", "sent_1", "Focus on short sentences with basic punctuation.", "Focus on short sentences with basic punctuation.", ChallengeType.SENTENCE),
        GameplayChallenge("s_8", "sentence_run", "sent_1", "Practice makes perfect when it comes to speed typing.", "Practice makes perfect when it comes to speed typing.", ChallengeType.SENTENCE),
        GameplayChallenge("s_9", "sentence_run", "sent_1", "Watch your breath and relax your shoulders while typing.", "Watch your breath and relax your shoulders while typing.", ChallengeType.SENTENCE),
        GameplayChallenge("s_10", "sentence_run", "sent_1", "A true typing master typing with accuracy and speed.", "A true typing master typing with accuracy and speed.", ChallengeType.SENTENCE),

        // Sentence Run Levels 2–5 (1 challenge each)
        GameplayChallenge("s_lvl2_1", "sentence_run", "sent_2", "Commas, semicolons; questions? exclamation points! Type them all.", "Commas, semicolons; questions? exclamation points! Type them all.", ChallengeType.SENTENCE),
        GameplayChallenge("s_lvl3_1", "sentence_run", "sent_3", "Keep a steady pace while typing longer sentences with complex words.", "Keep a steady pace while typing longer sentences with complex words.", ChallengeType.SENTENCE),
        GameplayChallenge("s_lvl4_1", "sentence_run", "sent_4", "Fast typing requires both speed and precision on every keystroke.", "Fast typing requires both speed and precision on every keystroke.", ChallengeType.SENTENCE),
        GameplayChallenge("s_lvl5_1", "sentence_run", "sent_5", "Build your finger strength and focus by typing this final paragraph.", "Build your finger strength and focus by typing this final paragraph.", ChallengeType.SENTENCE),

        // Grammar Challenge Level 1 (10 challenges)
        GameplayChallenge("g_1", "grammar_challenge", "gram_1", "He don't want to go to the park.", "He doesn't want to go to the park.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_2", "grammar_challenge", "gram_1", "She write a letter yesterday.", "She wrote a letter yesterday.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_3", "grammar_challenge", "gram_1", "Each of the students have a book.", "Each of the students has a book.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_4", "grammar_challenge", "gram_1", "The dog wagged it's tail happily.", "The dog wagged its tail happily.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_5", "grammar_challenge", "gram_1", "I have been waiting here since two hours.", "I have been waiting here for two hours.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_6", "grammar_challenge", "gram_1", "There is many people in the room.", "There are many people in the room.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_7", "grammar_challenge", "gram_1", "She is more taller than her sister.", "She is taller than her sister.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_8", "grammar_challenge", "gram_1", "They was playing football when it rained.", "They were playing football when it rained.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_9", "grammar_challenge", "gram_1", "Me and him went to the market.", "He and I went to the market.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_10", "grammar_challenge", "gram_1", "He doesn't want to go because he is busy typing with speed.", "He doesn't want to go because he is busy typing with speed.", ChallengeType.GRAMMAR),

        // Grammar Challenge Levels 2–5 (1 challenge each)
        GameplayChallenge("g_lvl2_1", "grammar_challenge", "gram_2", "Each of the runners have a unique technique for fast typing.", "Each of the runners has a unique technique for fast typing.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_lvl3_1", "grammar_challenge", "gram_3", "It is them who finished the marathon before anyone else.", "It is they who finished the marathon before anyone else.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_lvl4_1", "grammar_challenge", "gram_4", "She walked in the room and sat down at the typing terminal.", "She walked into the room and sat down at the typing terminal.", ChallengeType.GRAMMAR),
        GameplayChallenge("g_lvl5_1", "grammar_challenge", "gram_5", "If you practice every day, you would become a true typing master.", "If you practice every day, you will become a true typing master.", ChallengeType.GRAMMAR),

        // Hindi to English Run Level 1 (8 challenges)
        GameplayChallenge("h_1", "hindi_to_english", "hindi_1", "यह एक किताब है।", "This is a book.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_2", "hindi_to_english", "hindi_1", "वह दौड़ रहा है।", "He is running.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_3", "hindi_to_english", "hindi_1", "मैं अंग्रेजी सीख रहा हूँ।", "I am learning English.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_4", "hindi_to_english", "hindi_1", "आपका नाम क्या है?", "What is your name?", ChallengeType.TRANSLATION),
        GameplayChallenge("h_5", "hindi_to_english", "hindi_1", "मुझे टाइपिंग करना पसंद है।", "I like typing.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_6", "hindi_to_english", "hindi_1", "समय बहुत कीमती है।", "Time is very precious.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_7", "hindi_to_english", "hindi_1", "आज मौसम अच्छा है।", "The weather is good today.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_8", "hindi_to_english", "hindi_1", "वह बहुत तेज़ दौड़ता है।", "He runs very fast.", ChallengeType.TRANSLATION),

        // Hindi to English Run Levels 2–5 (1 challenge each)
        GameplayChallenge("h_lvl2_1", "hindi_to_english", "hindi_2", "आप आज कैसे हैं?", "How are you today?", ChallengeType.TRANSLATION),
        GameplayChallenge("h_lvl3_1", "hindi_to_english", "hindi_3", "मुझे सुबह दौड़ना पसंद है।", "I like running in the morning.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_lvl4_1", "hindi_to_english", "hindi_4", "वह दो घंटे से टाइप कर रहा है।", "He has been typing for two hours.", ChallengeType.TRANSLATION),
        GameplayChallenge("h_lvl5_1", "hindi_to_english", "hindi_5", "कृपया इस वाक्य का जितनी जल्दी हो सके अनुवाद करें।", "Please translate this sentence as fast as possible.", ChallengeType.TRANSLATION)
    )
}
