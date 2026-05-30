package com.pulsefit.tracker

import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder

/**
 * Lightweight foreground service whose only job is to hold the persistent
 * notification and keep the process alive after the app is swiped away.
 *
 * Actual volume-key detection happens in [VolumeAccessibilityService]; this
 * service exists to satisfy Android's foreground-service requirement so the
 * background work isn't killed aggressively.
 */
class VolumeForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()
        Notifications.createChannel(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = Notifications.buildForegroundNotification(this)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                Notifications.FOREGROUND_NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(Notifications.FOREGROUND_NOTIFICATION_ID, notification)
        }
        // Ask the system to recreate the service if it gets killed.
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        fun start(context: Context) {
            val intent = Intent(context, VolumeForegroundService::class.java)
            context.startForegroundService(intent)
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, VolumeForegroundService::class.java))
        }
    }
}
