package com.example.storage

import android.content.Context
import android.content.SharedPreferences
import com.example.data.MockDataStore
import com.example.data.VisitorRequest
import com.example.data.ParcelRequest
import com.example.data.NotificationItem
import com.example.constants.Status
import org.json.JSONArray
import org.json.JSONObject

object LocalDataStorage {
    private var sharedPreferences: SharedPreferences? = null

    fun init(context: Context) {
        sharedPreferences = context.getSharedPreferences("smartgate_local_persistence_prefs", Context.MODE_PRIVATE)
    }

    fun saveData() {
        val prefs = sharedPreferences ?: return
        try {
            val visitorsArray = JSONArray()
            MockDataStore.visitorsList.forEach {
                visitorsArray.put(it.toJsonObject())
            }

            val parcelsArray = JSONArray()
            MockDataStore.parcelsList.forEach {
                parcelsArray.put(it.toJsonObject())
            }

            val notificationsArray = JSONArray()
            MockDataStore.notificationsList.forEach {
                notificationsArray.put(it.toJsonObject())
            }

            prefs.edit().apply {
                putString("visitors_json", visitorsArray.toString())
                putString("parcels_json", parcelsArray.toString())
                putString("notifications_json", notificationsArray.toString())
                apply()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun loadData(): Boolean {
        val prefs = sharedPreferences ?: return false
        try {
            val visitorsStr = prefs.getString("visitors_json", null)
            val parcelsStr = prefs.getString("parcels_json", null)
            val notificationsStr = prefs.getString("notifications_json", null)

            var loadedAny = false

            if (!visitorsStr.isNullOrEmpty()) {
                val visitorsArray = JSONArray(visitorsStr)
                MockDataStore.visitorsList.clear()
                for (i in 0 until visitorsArray.length()) {
                    val obj = visitorsArray.getJSONObject(i)
                    MockDataStore.visitorsList.add(obj.toVisitorRequest())
                }
                loadedAny = true
            }

            if (!parcelsStr.isNullOrEmpty()) {
                val parcelsArray = JSONArray(parcelsStr)
                MockDataStore.parcelsList.clear()
                for (i in 0 until parcelsArray.length()) {
                    val obj = parcelsArray.getJSONObject(i)
                    MockDataStore.parcelsList.add(obj.toParcelRequest())
                }
                loadedAny = true
            }

            if (!notificationsStr.isNullOrEmpty()) {
                val notificationsArray = JSONArray(notificationsStr)
                MockDataStore.notificationsList.clear()
                for (i in 0 until notificationsArray.length()) {
                    val obj = notificationsArray.getJSONObject(i)
                    MockDataStore.notificationsList.add(obj.toNotificationItem())
                }
                loadedAny = true
            }

            return loadedAny
        } catch (e: Exception) {
            e.printStackTrace()
            return false
        }
    }

    fun clearData() {
        sharedPreferences?.edit()?.clear()?.apply()
    }

    fun clearDataAndRestoreDefaults() {
        clearData()
        MockDataStore.resetToDefaults()
    }

    // JSON Extension Helpers
    private fun VisitorRequest.toJsonObject(): JSONObject {
        val obj = JSONObject()
        obj.put("id", id)
        obj.put("name", name)
        obj.put("phone", phone)
        obj.put("purpose", purpose)
        obj.put("flatNo", flatNo)
        obj.put("residentName", residentName)
        obj.put("guardName", guardName)
        obj.put("requestTime", requestTime)
        obj.put("status", status)
        obj.put("vehicleNo", vehicleNo ?: JSONObject.NULL)
        obj.put("visitorCount", visitorCount)
        obj.put("entryTime", entryTime ?: JSONObject.NULL)
        obj.put("exitTime", exitTime ?: JSONObject.NULL)
        obj.put("otp", otp)
        obj.put("qrCode", qrCode)
        obj.put("isPreApproved", isPreApproved)
        obj.put("visitDate", visitDate)
        obj.put("visitTime", visitTime)
        obj.put("validityTime", validityTime)
        return obj
    }

    private fun JSONObject.toVisitorRequest(): VisitorRequest {
        return VisitorRequest(
            id = getString("id"),
            name = getString("name"),
            phone = getString("phone"),
            purpose = getString("purpose"),
            flatNo = getString("flatNo"),
            residentName = getString("residentName"),
            guardName = optString("guardName", "Officer Lee"),
            requestTime = optString("requestTime", "Just Now"),
            status = optString("status", Status.VISITOR_PENDING),
            vehicleNo = if (has("vehicleNo") && !isNull("vehicleNo")) getString("vehicleNo") else null,
            visitorCount = optInt("visitorCount", 1),
            entryTime = if (has("entryTime") && !isNull("entryTime")) getString("entryTime") else null,
            exitTime = if (has("exitTime") && !isNull("exitTime")) getString("exitTime") else null,
            otp = optString("otp", ""),
            qrCode = optString("qrCode", ""),
            isPreApproved = optBoolean("isPreApproved", false),
            visitDate = optString("visitDate", "Today"),
            visitTime = optString("visitTime", "12:00 PM"),
            validityTime = optString("validityTime", "24 Hours")
        )
    }

    private fun ParcelRequest.toJsonObject(): JSONObject {
        val obj = JSONObject()
        obj.put("id", id)
        obj.put("companyName", companyName)
        obj.put("courierName", courierName)
        obj.put("phone", phone)
        obj.put("flatNo", flatNo)
        obj.put("residentName", residentName)
        obj.put("parcelType", parcelType)
        obj.put("orderId", orderId ?: JSONObject.NULL)
        obj.put("status", status)
        obj.put("receivedTime", receivedTime)
        obj.put("deliveredTime", deliveredTime ?: JSONObject.NULL)
        obj.put("choiceOption", choiceOption ?: JSONObject.NULL)
        return obj
    }

    private fun JSONObject.toParcelRequest(): ParcelRequest {
        return ParcelRequest(
            id = getString("id"),
            companyName = getString("companyName"),
            courierName = getString("courierName"),
            phone = getString("phone"),
            flatNo = getString("flatNo"),
            residentName = getString("residentName"),
            parcelType = optString("parcelType", "Box"),
            orderId = if (has("orderId") && !isNull("orderId")) getString("orderId") else null,
            status = optString("status", Status.PARCEL_PENDING),
            receivedTime = optString("receivedTime", "Just Now"),
            deliveredTime = if (has("deliveredTime") && !isNull("deliveredTime")) getString("deliveredTime") else null,
            choiceOption = if (isNull("choiceOption")) null else {
                val v = optInt("choiceOption", -1)
                if (v == -1) null else v
            }
        )
    }

    private fun NotificationItem.toJsonObject(): JSONObject {
        val obj = JSONObject()
        obj.put("id", id)
        obj.put("title", title)
        obj.put("body", body)
        obj.put("type", type)
        obj.put("isRead", isRead)
        obj.put("timestamp", timestamp)
        return obj
    }

    private fun JSONObject.toNotificationItem(): NotificationItem {
        return NotificationItem(
            id = getString("id"),
            title = getString("title"),
            body = getString("body"),
            type = getString("type"),
            isRead = optBoolean("isRead", false),
            timestamp = optString("timestamp", "10 mins ago")
        )
    }
}
