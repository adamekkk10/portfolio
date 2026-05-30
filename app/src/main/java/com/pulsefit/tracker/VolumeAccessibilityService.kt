package com.pulsefit.tracker

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent

/**
 * Accessibility service that receives hardware key events and reports
 * volume up / volume down presses to the configured server.
 *
 * It listens via onKeyEvent (enabled by flagRequestFilterKeyEvents in
 * accessibility_service_config.xml) and always returns false so the key
 * events are NOT consumed — volume continues to work normally for the user.
 */
class VolumeAccessibilityService : AccessibilityService() {

    override fun onServiceConnected() {
        super.onServiceConnected()
        isRunning = true
        Log.d(TAG, "Accessibility service connected.")
        // Bring up the persistent foreground notification / keep-alive service.
        VolumeForegroundService.start(this)
    }

    override fun onKeyEvent(event: KeyEvent): Boolean {
        // Only react on the initial key-down to avoid duplicate reports.
        if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
            when (event.keyCode) {
                KeyEvent.KEYCODE_VOLUME_UP -> EventReporter.report(this, "volume_up")
                KeyEvent.KEYCODE_VOLUME_DOWN -> EventReporter.report(this, "volume_down")
            }
        }
        // Return false: do not consume the event, let the system handle volume.
        return false
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Not used — we only care about key events.
    }

    override fun onInterrupt() {
        // No-op.
    }

    override fun onUnbind(intent: android.content.Intent?): Boolean {
        isRunning = false
        Log.d(TAG, "Accessibility service unbound.")
        VolumeForegroundService.stop(this)
        return super.onUnbind(intent)
    }

    override fun onDestroy() {
        isRunning = false
        super.onDestroy()
    }

    companion object {
        private const val TAG = "VolumeA11yService"

        /** Best-effort flag reflecting whether the service is currently connected. */
        @Volatile
        var isRunning: Boolean = false
            private set
    }
}
