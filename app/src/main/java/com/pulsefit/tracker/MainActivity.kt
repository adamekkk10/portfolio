package com.pulsefit.tracker

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.view.accessibility.AccessibilityManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.pulsefit.tracker.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        requestNotificationPermissionIfNeeded()

        // Pre-fill the saved URL.
        binding.urlInput.setText(Prefs.getServerUrl(this) ?: "")

        binding.saveButton.setOnClickListener { saveUrl() }

        // Toggling the switch routes the user to Accessibility settings, where
        // the service is actually enabled/disabled by the system.
        binding.serviceSwitch.setOnClickListener {
            Toast.makeText(this, R.string.toast_open_settings, Toast.LENGTH_LONG).show()
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }
    }

    override fun onResume() {
        super.onResume()
        // Reflect the real, system-owned state every time we come back.
        refreshStatus()
    }

    private fun saveUrl() {
        val url = binding.urlInput.text?.toString()?.trim().orEmpty()
        if (url.isEmpty()) {
            binding.urlInputLayout.error = getString(R.string.error_empty_url)
            return
        }
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            binding.urlInputLayout.error = getString(R.string.error_invalid_url)
            return
        }
        binding.urlInputLayout.error = null
        Prefs.setServerUrl(this, url)
        Toast.makeText(this, R.string.toast_saved, Toast.LENGTH_SHORT).show()
    }

    private fun refreshStatus() {
        val active = isAccessibilityServiceEnabled(this, VolumeAccessibilityService::class.java)

        binding.serviceSwitch.setOnCheckedChangeListener(null)
        binding.serviceSwitch.isChecked = active
        binding.serviceSwitch.setOnClickListener {
            Toast.makeText(this, R.string.toast_open_settings, Toast.LENGTH_LONG).show()
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }

        if (active) {
            binding.statusText.setText(R.string.status_active)
            binding.statusDot.setBackgroundResource(R.drawable.dot_active)
        } else {
            binding.statusText.setText(R.string.status_inactive)
            binding.statusDot.setBackgroundResource(R.drawable.dot_inactive)
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                this, android.Manifest.permission.POST_NOTIFICATIONS
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            if (!granted) {
                requestPermissions(
                    arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 1
                )
            }
        }
    }

    /**
     * Reads the system's enabled-accessibility-services list to determine
     * whether our service is actually on.
     */
    private fun isAccessibilityServiceEnabled(
        context: Context,
        service: Class<*>
    ): Boolean {
        val expectedId = "${context.packageName}/${service.name}"
        val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
        val enabledServices = am.getEnabledAccessibilityServiceList(
            android.accessibilityservice.AccessibilityServiceInfo.FEEDBACK_ALL_MASK
        )
        for (info in enabledServices) {
            if (info.id.equals(expectedId, ignoreCase = true)) return true
        }

        // Fallback to the raw settings string (covers some OEM quirks).
        val setting = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        val splitter = TextUtils.SimpleStringSplitter(':')
        splitter.setString(setting)
        while (splitter.hasNext()) {
            if (splitter.next().equals(expectedId, ignoreCase = true)) return true
        }
        return false
    }
}
