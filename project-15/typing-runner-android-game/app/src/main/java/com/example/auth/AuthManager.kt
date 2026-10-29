package com.example.auth

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

data class LocalUser(
    val fullName: String,
    val email: String,
    val password: String
)

class AuthManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
    private val usersKey = "users_json"
    private val currentUserKey = "current_user_email"

    // Load users from SharedPreferences (JSON array)
    private fun loadUsers(): MutableList<LocalUser> {
        val json = prefs.getString(usersKey, null) ?: return mutableListOf()
        val array = JSONArray(json)
        val list = mutableListOf<LocalUser>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            list.add(
                LocalUser(
                    fullName = obj.getString("fullName"),
                    email = obj.getString("email"),
                    password = obj.getString("password")
                )
            )
        }
        return list
    }

    // Save users to SharedPreferences
    private fun saveUsers(users: List<LocalUser>) {
        val array = JSONArray()
        users.forEach { user ->
            val obj = JSONObject()
            obj.put("fullName", user.fullName)
            obj.put("email", user.email)
            obj.put("password", user.password)
            array.put(obj)
        }
        prefs.edit().putString(usersKey, array.toString()).apply()
    }

    // Public API
    fun isLoggedIn(): Boolean = prefs.contains(currentUserKey)

    fun getCurrentUser(): LocalUser? {
        val email = prefs.getString(currentUserKey, null) ?: return null
        return loadUsers().find { it.email.equals(email, ignoreCase = true) }
    }

    fun login(email: String, password: String): Boolean {
        // Demo account handling
        if (email.equals("demo@typingrunner.com", ignoreCase = true) && password == "demo123") {
            // Ensure demo user exists in stored users
            val users = loadUsers()
            if (users.none { it.email.equals(email, ignoreCase = true) }) {
                val demoUser = LocalUser(fullName = "Demo Student", email = email, password = password)
                users.add(demoUser)
                saveUsers(users)
            }
            // Initialize default progress for demo user if absent
            initializeDefaultProgress(email)
            prefs.edit().putString(currentUserKey, email).apply()
            return true
        }
        val user = loadUsers().find { it.email.equals(email, ignoreCase = true) }
        return if (user != null && user.password == password) {
            // Initialize default progress for user if absent
            initializeDefaultProgress(user.email)
            prefs.edit().putString(currentUserKey, user.email).apply()
            true
        } else {
            false
        }
    }

    fun register(fullName: String, email: String, password: String): Boolean {
        val users = loadUsers()
        if (users.any { it.email.equals(email, ignoreCase = true) }) {
            return false // email already exists
        }
        val newUser = LocalUser(fullName, email, password)
        users.add(newUser)
        saveUsers(users)
        // Initialize default progress for new user if absent
        initializeDefaultProgress(email)
        // Automatically log in the new user
        prefs.edit().putString(currentUserKey, email).apply()
        return true
    }

    fun logout() {
        prefs.edit().remove(currentUserKey).apply()
    }

    // Per-User Progress Serialization
    fun initializeDefaultProgress(email: String, force: Boolean = false) {
        val userProgressKey = "progress_$email"
        if (!force && prefs.contains(userProgressKey)) return

        // Create default progress payload representing seed state
        val progressObj = JSONObject()
        progressObj.put("coins", 1250)
        progressObj.put("bestWpm", 45)
        progressObj.put("accuracy", 92.0)
        progressObj.put("streak", 5)
        progressObj.put("rank", "Top 5%")
        progressObj.put("level", 4)
        progressObj.put("xp", 2400)
        progressObj.put("nextLevelXp", 5000)

        // Seed modes progress
        val modesArr = JSONArray()
        val m1 = JSONObject().apply { put("id", "word_run"); put("progressPercent", 75) }
        val m2 = JSONObject().apply { put("id", "sentence_run"); put("progressPercent", 45) }
        val m3 = JSONObject().apply { put("id", "grammar_challenge"); put("progressPercent", 12) }
        val m4 = JSONObject().apply { put("id", "hindi_to_english"); put("progressPercent", 55) }
        modesArr.put(m1).put(m2).put(m3).put(m4)
        progressObj.put("modes", modesArr)

        // Seed levels completed/unlocked
        val levelsArr = JSONArray()
        // Word Run (5 levels)
        levelsArr.put(JSONObject().apply { put("id", "word_1"); put("stars", 3); put("completed", true); put("unlocked", true); put("bestWpm", 25); put("bestAccuracy", 90.0) })
        levelsArr.put(JSONObject().apply { put("id", "word_2"); put("stars", 0); put("completed", false); put("unlocked", true); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "word_3"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "word_4"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "word_5"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        // Sentence Run (5 levels)
        levelsArr.put(JSONObject().apply { put("id", "sent_1"); put("stars", 0); put("completed", false); put("unlocked", true); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "sent_2"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "sent_3"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "sent_4"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "sent_5"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        // Grammar Challenge (5 levels)
        levelsArr.put(JSONObject().apply { put("id", "gram_1"); put("stars", 0); put("completed", false); put("unlocked", true); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "gram_2"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "gram_3"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "gram_4"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "gram_5"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        // Hindi to English (5 levels)
        levelsArr.put(JSONObject().apply { put("id", "hindi_1"); put("stars", 3); put("completed", true); put("unlocked", true); put("bestWpm", 45); put("bestAccuracy", 95.0) })
        levelsArr.put(JSONObject().apply { put("id", "hindi_2"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "hindi_3"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "hindi_4"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        levelsArr.put(JSONObject().apply { put("id", "hindi_5"); put("stars", 0); put("completed", false); put("unlocked", false); put("bestWpm", 0); put("bestAccuracy", 0.0) })
        progressObj.put("levels", levelsArr)

        prefs.edit().putString(userProgressKey, progressObj.toString()).apply()
    }
}
