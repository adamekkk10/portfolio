package com.pulsefit.tracker

import android.content.Context
import android.os.Build
import android.util.Log
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Builds and sends the JSON payload to the user-configured server URL.
 *
 * All sending is asynchronous (OkHttp's enqueue) and every failure path is
 * swallowed and logged, so an unreachable / misconfigured server can never
 * crash the app or the background service.
 */
object EventReporter {

    private const val TAG = "EventReporter"
    private val JSON = "application/json; charset=utf-8".toMediaType()

    private val client: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .build()
    }

    /**
     * Sends a button-press event. Returns immediately; work happens off-thread.
     *
     * @param button e.g. "volume_up" or "volume_down"
     */
    fun report(context: Context, button: String) {
        val url = Prefs.getServerUrl(context)
        if (url.isNullOrBlank()) {
            Log.w(TAG, "No server URL configured; skipping event '$button'.")
            return
        }

        val payload = JSONObject().apply {
            put("button", button)
            put("timestamp", System.currentTimeMillis())
            put("device", deviceName())
        }.toString()

        val request = try {
            Request.Builder()
                .url(url)
                .post(payload.toRequestBody(JSON))
                .build()
        } catch (e: IllegalArgumentException) {
            // Malformed URL entered by the user — log and bail, do not crash.
            Log.e(TAG, "Invalid server URL: $url", e)
            return
        }

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                // Server unreachable / network down — handled gracefully.
                Log.w(TAG, "Failed to send '$button': ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    Log.d(TAG, "Sent '$button' -> HTTP ${it.code}")
                }
            }
        })
    }

    private fun deviceName(): String {
        val manufacturer = Build.MANUFACTURER?.replaceFirstChar { it.uppercase() } ?: ""
        val model = Build.MODEL ?: ""
        return when {
            model.startsWith(manufacturer, ignoreCase = true) -> model
            manufacturer.isBlank() -> model
            else -> "$manufacturer $model"
        }.trim().ifBlank { "Android device" }
    }
}
