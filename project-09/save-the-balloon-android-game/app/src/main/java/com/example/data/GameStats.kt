package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "game_stats")
data class GameStats(
    @PrimaryKey val id: Int = 1,
    val highScore: Int = 0,
    val totalCoins: Int = 0,
    val soundEnabled: Boolean = true,
    val unlockedSkins: String = "Red",
    val selectedSkin: String = "Red"
)
