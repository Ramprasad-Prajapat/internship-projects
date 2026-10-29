package com.example.game

enum class Screen {
    Splash,
    Menu,
    Game,
    GameOver,
    Settings,
    Shop
}

enum class ObstacleType {
    Spikes,
    Bird,
    Needle,
    Cloud,
    Rocket
}

enum class PowerUpType {
    Shield,
    Magnet,
    SlowMotion
}

data class Obstacle(
    val id: Long,
    val type: ObstacleType,
    var x: Float, // 0.0 to 1.0
    var y: Float, // -0.1 to 1.1
    val speed: Float,
    val size: Float, // relative width
    val angle: Float = 0f,
    val driftSpeed: Float = 0f, // For Bird or Cloud drift
    var warningTimer: Float = 0f // For Rockets: if > 0, show warning on screen before moving
) {
    fun getBoundingBox(canvasWidth: Float, canvasHeight: Float): Rect {
        val px = x * canvasWidth
        val py = y * canvasHeight
        val radius = (size * canvasWidth) / 2f
        return Rect(px - radius, py - radius, px + radius, py + radius)
    }
}

data class Coin(
    val id: Long,
    var x: Float,
    var y: Float,
    val size: Float = 0.05f,
    var isCollected: Boolean = false,
    var isBeingPulled: Boolean = false
) {
    fun getBoundingBox(canvasWidth: Float, canvasHeight: Float): Rect {
        val px = x * canvasWidth
        val py = y * canvasHeight
        val radius = (size * canvasWidth) / 2f
        return Rect(px - radius, py - radius, px + radius, py + radius)
    }
}

data class PowerUp(
    val id: Long,
    val type: PowerUpType,
    var x: Float,
    var y: Float,
    val size: Float = 0.06f,
    var isCollected: Boolean = false
) {
    fun getBoundingBox(canvasWidth: Float, canvasHeight: Float): Rect {
        val px = x * canvasWidth
        val py = y * canvasHeight
        val radius = (size * canvasWidth) / 2f
        return Rect(px - radius, py - radius, px + radius, py + radius)
    }
}

data class Rect(
    val left: Float,
    val top: Float,
    val right: Float,
    val bottom: Float
) {
    fun intersects(other: Rect): Boolean {
        return left < other.right && right > other.left && top < other.bottom && bottom > other.top
    }
}
