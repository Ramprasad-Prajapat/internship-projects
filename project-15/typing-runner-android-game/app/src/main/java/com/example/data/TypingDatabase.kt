package com.example.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import kotlinx.coroutines.flow.Flow

// Entities

@Entity(tableName = "user_stats")
data class UserStatsEntity(
    @PrimaryKey val id: Int = 1,
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

@Entity(tableName = "modes")
data class ModeEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val difficulty: String,
    val description: String,
    val progressPercent: Int,
    val iconName: String
)

@Entity(tableName = "levels")
data class LevelEntity(
    @PrimaryKey val id: String,
    val modeId: String,
    val name: String,
    val targetText: String,
    val unlocked: Boolean,
    val completed: Boolean,
    val stars: Int,
    val bestWpm: Int,
    val bestAccuracy: Double,
    val difficultyLabel: String
)

@Entity(tableName = "mistakes")
data class MistakeEntity(
    @PrimaryKey val id: String,
    val originalWord: String,
    val typedWord: String,
    val typeLabel: String,
    val originalSentence: String,
    val typedSentence: String,
    val helpText: String,
    val userId: String,
    val sessionId: String,
    val modeId: String,
    val levelId: String,
    val challengeId: String,
    val promptText: String,
    val expectedText: String,
    val submittedText: String,
    val timestamp: Long
)

@Entity(tableName = "equipment")
data class EquipmentEntity(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val rarity: String,
    val effect: String,
    val cost: Int,
    val unlocked: Boolean,
    val equipped: Boolean,
    val iconName: String
)

@Entity(tableName = "badges")
data class BadgeEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val unlocked: Boolean
)

@Entity(tableName = "session_history")
data class SessionHistoryEntity(
    @PrimaryKey val id: String,
    val email: String,
    val modeId: String,
    val levelId: String,
    val score: Int,
    val wpm: Int,
    val accuracy: Double,
    val completedItems: Int,
    val requiredItems: Int,
    val remainingTime: Int,
    val remainingHealth: Int,
    val maxCombo: Int,
    val outcome: String,
    val earnedXp: Int,
    val earnedCoins: Int,
    val timestamp: Long
)

// DAOs

@Dao
interface TypingDao {
    @Query("SELECT * FROM user_stats WHERE id = 1")
    fun getUserStats(): Flow<UserStatsEntity?>

    @Query("SELECT * FROM user_stats WHERE id = 1")
    suspend fun getUserStatsSync(): UserStatsEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserStats(stats: UserStatsEntity)

    @Query("SELECT * FROM modes")
    fun getAllModes(): Flow<List<ModeEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertModes(modes: List<ModeEntity>)

    @Query("UPDATE modes SET progressPercent = :progress WHERE id = :modeId")
    suspend fun updateModeProgress(modeId: String, progress: Int)

    @Query("SELECT * FROM levels WHERE modeId = :modeId")
    fun getLevelsForMode(modeId: String): Flow<List<LevelEntity>>

    @Query("SELECT * FROM levels")
    fun getAllLevels(): Flow<List<LevelEntity>>

    @Query("SELECT * FROM modes")
    suspend fun getAllModesSync(): List<ModeEntity>

    @Query("SELECT * FROM levels")
    suspend fun getAllLevelsSync(): List<LevelEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLevels(levels: List<LevelEntity>)

    @Query("UPDATE levels SET stars = :stars, completed = :completed, bestWpm = :bestWpm, bestAccuracy = :bestAcc WHERE id = :levelId")
    suspend fun updateLevelResult(levelId: String, stars: Int, completed: Boolean, bestWpm: Int, bestAcc: Double)

    @Query("UPDATE levels SET unlocked = :unlocked WHERE id = :levelId")
    suspend fun updateLevelUnlockStatus(levelId: String, unlocked: Boolean)

    @Query("SELECT * FROM mistakes")
    fun getAllMistakes(): Flow<List<MistakeEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMistake(mistake: MistakeEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMistakes(mistakes: List<MistakeEntity>)

    @Query("DELETE FROM mistakes WHERE id = :id")
    suspend fun deleteMistake(id: String)

    @Query("DELETE FROM mistakes")
    suspend fun clearAllMistakes()

    @Query("SELECT * FROM equipment")
    fun getAllEquipment(): Flow<List<EquipmentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEquipment(equipment: List<EquipmentEntity>)

    @Query("UPDATE equipment SET unlocked = :unlocked WHERE id = :id")
    suspend fun updateEquipmentUnlock(id: String, unlocked: Boolean)

    @Query("UPDATE equipment SET equipped = :equipped WHERE id = :id")
    suspend fun updateEquipmentEquipped(id: String, equipped: Boolean)

    @Query("UPDATE equipment SET equipped = 0 WHERE category = :category")
    suspend fun unequipAllInCategory(category: String)

    @Query("SELECT * FROM badges")
    fun getAllBadges(): Flow<List<BadgeEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBadges(badges: List<BadgeEntity>)

    @Query("SELECT * FROM session_history WHERE email = :email ORDER BY timestamp DESC")
    fun getSessionHistory(email: String): Flow<List<SessionHistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: SessionHistoryEntity)

    @Query("SELECT COUNT(*) FROM session_history WHERE id = :id")
    suspend fun hasSession(id: String): Int
}

// Database

@Database(
    entities = [
        UserStatsEntity::class,
        ModeEntity::class,
        LevelEntity::class,
        MistakeEntity::class,
        EquipmentEntity::class,
        BadgeEntity::class,
        SessionHistoryEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class TypingDatabase : RoomDatabase() {
    abstract fun typingDao(): TypingDao

    companion object {
        @Volatile
        private var INSTANCE: TypingDatabase? = null

        val MIGRATION_1_2 = object : androidx.room.migration.Migration(1, 2) {
            override fun migrate(db: androidx.sqlite.db.SupportSQLiteDatabase) {
                db.execSQL("""
                    CREATE TABLE IF NOT EXISTS `session_history` (
                        `id` TEXT NOT NULL, 
                        `email` TEXT NOT NULL, 
                        `modeId` TEXT NOT NULL, 
                        `levelId` TEXT NOT NULL, 
                        `score` INTEGER NOT NULL, 
                        `wpm` INTEGER NOT NULL, 
                        `accuracy` REAL NOT NULL, 
                        `completedItems` INTEGER NOT NULL, 
                        `requiredItems` INTEGER NOT NULL, 
                        `remainingTime` INTEGER NOT NULL, 
                        `remainingHealth` INTEGER NOT NULL, 
                        `maxCombo` INTEGER NOT NULL, 
                        `outcome` TEXT NOT NULL, 
                        `earnedXp` INTEGER NOT NULL, 
                        `earnedCoins` INTEGER NOT NULL, 
                        `timestamp` INTEGER NOT NULL, 
                        PRIMARY KEY(`id`)
                    )
                """.trimIndent())
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `userId` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `sessionId` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `modeId` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `levelId` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `challengeId` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `promptText` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `expectedText` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `submittedText` TEXT NOT NULL DEFAULT ''")
                db.execSQL("ALTER TABLE `mistakes` ADD COLUMN `timestamp` INTEGER NOT NULL DEFAULT 0")
            }
        }

        fun getDatabase(context: Context): TypingDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TypingDatabase::class.java,
                    "typing_runner_database"
                )
                .addMigrations(MIGRATION_1_2)
                .build()
                INSTANCE = instance
                instance
            }
        }

        suspend fun seedDatabase(dao: TypingDao) {
            // Seed user stats
            val initialStats = UserStatsEntity(
                id = 1,
                username = "Alex.Run",
                email = "runner@example.com",
                coins = 1250,
                bestWpm = 45,
                accuracy = 92.0,
                streak = 5,
                rank = "Top 5%",
                level = 4,
                xp = 2400,
                nextLevelXp = 5000
            )
            dao.insertUserStats(initialStats)

            // Seed modes
            val initialModes = listOf(
                ModeEntity(
                    id = "word_run",
                    name = "Word Run",
                    category = "VOCABULARY FOCUS",
                    difficulty = "EASY",
                    description = "Master core vocabulary with rapid-fire word bursts.",
                    progressPercent = 75,
                    iconName = "abc"
                ),
                ModeEntity(
                    id = "sentence_run",
                    name = "Sentence Run",
                    category = "DAILY PRACTICE",
                    difficulty = "MEDIUM",
                    description = "Type full-flowing sentences to build rhythm and accuracy.",
                    progressPercent = 45,
                    iconName = "chat_bubble"
                ),
                ModeEntity(
                    id = "grammar_challenge",
                    name = "Grammar Run",
                    category = "TENSES & ARTICLES",
                    difficulty = "HARD",
                    description = "Complex structures designed to test your mental and typing speed.",
                    progressPercent = 12,
                    iconName = "g_translate"
                ),
                ModeEntity(
                    id = "hindi_to_english",
                    name = "Hindi to English",
                    category = "TRANSLATION FOCUS",
                    difficulty = "MEDIUM",
                    description = "See Hindi prompts, type the English translation instantly.",
                    progressPercent = 55,
                    iconName = "translate"
                )
            )
            dao.insertModes(initialModes)

            // Seed levels
            val initialLevels = listOf(
                // Word Run Levels (5)
                LevelEntity(
                    id = "word_1",
                    modeId = "word_run",
                    name = "Warmup Jog",
                    targetText = "The quick brown fox jumps over the lazy dog.",
                    unlocked = true,
                    completed = true,
                    stars = 3,
                    bestWpm = 25,
                    bestAccuracy = 90.0,
                    difficultyLabel = "Warmup"
                ),
                LevelEntity(
                    id = "word_2",
                    modeId = "word_run",
                    name = "Sentence Sprint",
                    targetText = "Focus on short sentences with basic punctuation. Watch your breath!",
                    unlocked = true,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Sprint"
                ),
                LevelEntity(
                    id = "word_3",
                    modeId = "word_run",
                    name = "Paragraph Power",
                    targetText = "Flowing paragraphs build stamina and test endurance on complex words.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Endurance"
                ),
                LevelEntity(
                    id = "word_4",
                    modeId = "word_run",
                    name = "Speed Demon",
                    targetText = "Accelerated challenges designed to push your tactile speed limits.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Extreme"
                ),
                LevelEntity(
                    id = "word_5",
                    modeId = "word_run",
                    name = "The Final Sprint",
                    targetText = "Ultimate typing battle where speed and flawless rhythm meet glory.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Championship"
                ),
                // Sentence Run Levels (5)
                LevelEntity(
                    id = "sent_1",
                    modeId = "sentence_run",
                    name = "Daily Rhythm",
                    targetText = "Type with calm concentration to unlock a perfect typing flow.",
                    unlocked = true,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Rhythm"
                ),
                LevelEntity(
                    id = "sent_2",
                    modeId = "sentence_run",
                    name = "Punctuation Play",
                    targetText = "Commas, semicolons; questions? exclamation points! Type them all.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Grammar"
                ),
                LevelEntity(
                    id = "sent_3",
                    modeId = "sentence_run",
                    name = "Flowing Phrases",
                    targetText = "Keep a steady pace while typing longer sentences with complex words.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Steady"
                ),
                LevelEntity(
                    id = "sent_4",
                    modeId = "sentence_run",
                    name = "Typing Sprint",
                    targetText = "Fast typing requires both speed and precision on every keystroke.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Sprint"
                ),
                LevelEntity(
                    id = "sent_5",
                    modeId = "sentence_run",
                    name = "Stamina Test",
                    targetText = "Build your finger strength and focus by typing this final paragraph.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Stamina"
                ),
                // Grammar Challenge Levels (5)
                LevelEntity(
                    id = "gram_1",
                    modeId = "grammar_challenge",
                    name = "Verb Conjugations",
                    targetText = "He doesn't want to go because he is busy typing with speed.",
                    unlocked = true,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Verbs"
                ),
                LevelEntity(
                    id = "gram_2",
                    modeId = "grammar_challenge",
                    name = "Subject Verb Agreement",
                    targetText = "Each of the runners has a unique technique for fast typing.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Subject-Verb"
                ),
                LevelEntity(
                    id = "gram_3",
                    modeId = "grammar_challenge",
                    name = "Pronoun Usage",
                    targetText = "It is they who finished the marathon before anyone else.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Pronouns"
                ),
                LevelEntity(
                    id = "gram_4",
                    modeId = "grammar_challenge",
                    name = "Prepositions",
                    targetText = "She walked into the room and sat down at the typing terminal.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Prepositions"
                ),
                LevelEntity(
                    id = "gram_5",
                    modeId = "grammar_challenge",
                    name = "Conditional Sentences",
                    targetText = "If you practice every day, you will become a true typing master.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Conditionals"
                ),
                // Hindi to English Run Levels (5)
                LevelEntity(
                    id = "hindi_1",
                    modeId = "hindi_to_english",
                    name = "Basic Phrases",
                    targetText = "This is a book",
                    unlocked = true,
                    completed = true,
                    stars = 3,
                    bestWpm = 45,
                    bestAccuracy = 95.0,
                    difficultyLabel = "Translation"
                ),
                LevelEntity(
                    id = "hindi_2",
                    modeId = "hindi_to_english",
                    name = "Daily Greetings",
                    targetText = "How are you today?",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Greetings"
                ),
                LevelEntity(
                    id = "hindi_3",
                    modeId = "hindi_to_english",
                    name = "Simple Sentence",
                    targetText = "I like running in the morning.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Simple"
                ),
                LevelEntity(
                    id = "hindi_4",
                    modeId = "hindi_to_english",
                    name = "Grammar Focus",
                    targetText = "He has been typing for two hours.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Tenses"
                ),
                LevelEntity(
                    id = "hindi_5",
                    modeId = "hindi_to_english",
                    name = "Translation Sprint",
                    targetText = "Please translate this sentence as fast as possible.",
                    unlocked = false,
                    completed = false,
                    stars = 0,
                    bestWpm = 0,
                    bestAccuracy = 0.0,
                    difficultyLabel = "Sprint"
                )
            )
            dao.insertLevels(initialLevels)

            // Seed mistakes
            val initialMistakes = listOf(
                MistakeEntity(
                    id = "mistake_1",
                    originalWord = "jumped",
                    typedWord = "jumpped",
                    typeLabel = "Spelling",
                    originalSentence = "The quick brown fox jumped over the fence.",
                    typedSentence = "The quick brown fox jumpped over the fence.",
                    helpText = "Spelling error: 'jumped' only has one 'p'.",
                    userId = "",
                    sessionId = "",
                    modeId = "",
                    levelId = "",
                    challengeId = "",
                    promptText = "The quick brown fox jumped over the fence.",
                    expectedText = "jumped",
                    submittedText = "jumpped",
                    timestamp = 0
                ),
                MistakeEntity(
                    id = "mistake_2",
                    originalWord = "doesn't",
                    typedWord = "don'ts",
                    typeLabel = "Grammar",
                    originalSentence = "He doesn't want to go.",
                    typedSentence = "He don'ts want to go.",
                    helpText = "Grammar: Subject-verb agreement with 'He'.",
                    userId = "",
                    sessionId = "",
                    modeId = "",
                    levelId = "",
                    challengeId = "",
                    promptText = "He doesn't want to go.",
                    expectedText = "doesn't",
                    submittedText = "don'ts",
                    timestamp = 0
                )
            )
            dao.insertMistakes(initialMistakes)

            // Seed equipment
            val initialEquipment = listOf(
                EquipmentEntity(
                    id = "equip_neon_sprint",
                    name = "Neon Sprint",
                    category = "Shoes",
                    rarity = "Legendary",
                    effect = "+15% XP Bonus",
                    cost = 0,
                    unlocked = true,
                    equipped = true,
                    iconName = "directions_run"
                ),
                EquipmentEntity(
                    id = "equip_hermes_flight",
                    name = "Hermes Flight",
                    category = "Wings",
                    rarity = "Epic",
                    effect = "Epic Effect: Coin Multiplier x1.5",
                    cost = 1500,
                    unlocked = false,
                    equipped = false,
                    iconName = "flight"
                ),
                EquipmentEntity(
                    id = "equip_fire_trail",
                    name = "Fire Trail",
                    category = "Aura",
                    rarity = "Mythic",
                    effect = "Mythic Glow: Flame Trail exhaust",
                    cost = 3000,
                    unlocked = false,
                    equipped = false,
                    iconName = "local_fire_department"
                )
            )
            dao.insertEquipment(initialEquipment)

            // Seed badges
            val initialBadges = listOf(
                BadgeEntity(
                    id = "badge_1",
                    title = "Speed Demon",
                    description = "Type faster than 80 WPM in a game.",
                    iconName = "speed",
                    unlocked = true
                ),
                BadgeEntity(
                    id = "badge_2",
                    title = "Perfect 100",
                    description = "Achieve 100% accuracy in a Sentence Run.",
                    iconName = "ads_click",
                    unlocked = true
                ),
                BadgeEntity(
                    id = "badge_3",
                    title = "7-Day Streak",
                    description = "Keep a daily streak for 7 consecutive days.",
                    iconName = "calendar_month",
                    unlocked = false
                ),
                BadgeEntity(
                    id = "badge_4",
                    title = "Grandmaster",
                    description = "Reach Typing Level 15.",
                    iconName = "emoji_events",
                    unlocked = false
                )
            )
            dao.insertBadges(initialBadges)
        }
    }
}
