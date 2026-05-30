package com.pulsefit.tracker

import android.content.Context

/**
 * Thin wrapper around SharedPreferences for the one value we persist:
 * the server URL.
 */
object Prefs {

    private const val FILE = "pulsefit_prefs"
    private const val KEY_SERVER_URL = "server_url"

    private fun prefs(context: Context) =
        context.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    fun getServerUrl(context: Context): String? =
        prefs(context).getString(KEY_SERVER_URL, null)

    fun setServerUrl(context: Context, url: String) {
        prefs(context).edit().putString(KEY_SERVER_URL, url.trim()).apply()
    }
}
