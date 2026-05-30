package com.pulsefit.tracker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Restarts the foreground keep-alive service after a reboot.
 *
 * Note: the accessibility service itself is restarted automatically by the
 * system if it was enabled before reboot; this just re-establishes the
 * persistent notification promptly.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Only start if the user previously configured a server URL.
            if (!Prefs.getServerUrl(context).isNullOrBlank()) {
                VolumeForegroundService.start(context)
            }
        }
    }
}
