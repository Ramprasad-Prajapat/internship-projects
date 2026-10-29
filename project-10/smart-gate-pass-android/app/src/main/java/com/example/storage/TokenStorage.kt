package com.example.storage

import android.content.Context
import android.content.SharedPreferences

data class AuthUser(
    val id: Int,
    val name: String,
    val mobile: String,
    val role: String,
    val flatNumber: String? = null,
    val token: String
)

object TokenStorage {
    private var sharedPreferences: SharedPreferences? = null

    // In-memory fallback if Context is not initialized yet
    private var memToken: String? = null
    private var memUser: AuthUser? = null

    fun init(context: Context) {
        sharedPreferences = context.getSharedPreferences("smartgate_auth_prefs", Context.MODE_PRIVATE)
    }

    fun saveToken(token: String) {
        memToken = token
        sharedPreferences?.edit()?.putString("auth_token", token)?.apply()
    }

    fun getToken(): String? {
        return sharedPreferences?.getString("auth_token", null) ?: memToken
    }

    fun removeToken() {
        memToken = null
        sharedPreferences?.edit()?.remove("auth_token")?.apply()
    }

    fun saveUser(user: AuthUser) {
        memUser = user
        sharedPreferences?.edit()?.apply {
            putInt("user_id", user.id)
            putString("user_name", user.name)
            putString("user_mobile", user.mobile)
            putString("user_role", user.role)
            putString("user_flat", user.flatNumber)
            putString("user_token", user.token)
            apply()
        }
    }

    fun getUser(): AuthUser? {
        val prefs = sharedPreferences
        if (prefs == null) return memUser
        val id = prefs.getInt("user_id", -1)
        if (id == -1) return memUser
        
        return AuthUser(
            id = id,
            name = prefs.getString("user_name", "") ?: "",
            mobile = prefs.getString("user_mobile", "") ?: "",
            role = prefs.getString("user_role", "") ?: "",
            flatNumber = prefs.getString("user_flat", null),
            token = prefs.getString("user_token", "") ?: ""
        )
    }

    fun removeUser() {
        memUser = null
        sharedPreferences?.edit()?.apply {
            remove("user_id")
            remove("user_name")
            remove("user_mobile")
            remove("user_role")
            remove("user_flat")
            remove("user_token")
            apply()
        }
    }

    fun clearAuthData() {
        removeToken()
        removeUser()
    }
}
