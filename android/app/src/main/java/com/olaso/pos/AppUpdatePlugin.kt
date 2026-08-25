package com.olaso.pos

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageInstaller
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.File
import java.io.FileInputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.Executors

@CapacitorPlugin(name = "AppUpdate")
class AppUpdatePlugin : Plugin() {
    private val executor = Executors.newSingleThreadExecutor()
    private var statusReceiver: BroadcastReceiver? = null

    override fun handleOnDestroy() {
        unregisterStatusReceiver()
        executor.shutdownNow()
        super.handleOnDestroy()
    }

    @PluginMethod
    fun getInstalledInfo(call: PluginCall) {
        try {
            val packageInfo = currentPackageInfo()
            val versionCode =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    packageInfo.longVersionCode
                } else {
                    @Suppress("DEPRECATION")
                    packageInfo.versionCode.toLong()
                }
            call.resolve(
                JSObject().apply {
                    put("packageId", packageInfo.packageName)
                    put("versionCode", versionCode.toInt())
                    put("versionName", packageInfo.versionName ?: "")
                    put("signingCertSha256", signingCertSha256(packageInfo))
                },
            )
        } catch (error: Exception) {
            call.reject(error.message ?: "Installed package info failed.", "UNKNOWN")
        }
    }

    @PluginMethod
    fun canRequestInstalls(call: PluginCall) {
        val allowed =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.packageManager.canRequestPackageInstalls()
            } else {
                true
            }
        call.resolve(JSObject().apply { put("allowed", allowed) })
    }

    @PluginMethod
    fun openInstallPermissionSettings(call: PluginCall) {
        try {
            val intent =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Intent(
                        Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                        Uri.parse("package:${context.packageName}"),
                    )
                } else {
                    Intent(Settings.ACTION_SECURITY_SETTINGS)
                }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            activity.startActivity(intent)
            call.resolve(JSObject().apply { put("ok", true) })
        } catch (error: Exception) {
            fail(call, "SETTINGS", "permission", error.message ?: "Could not open install settings.")
        }
    }

    @PluginMethod
    fun downloadApk(call: PluginCall) {
        val urlText = call.getString("url")?.trim().orEmpty()
        val expectedSha256 = call.getString("sha256")?.trim()?.lowercase(Locale.US).orEmpty()
        if (!urlText.startsWith("https://", ignoreCase = true)) {
            fail(call, "CONFIGURATION", "download", "Update URL must use HTTPS.")
            return
        }
        if (!SHA256_HEX.matches(expectedSha256)) {
            fail(call, "CONFIGURATION", "download", "Update checksum must be a SHA-256 hex digest.")
            return
        }

        executor.execute {
            try {
                val connection = (URL(urlText).openConnection() as HttpURLConnection).apply {
                    instanceFollowRedirects = true
                    connectTimeout = 15_000
                    readTimeout = 120_000
                    requestMethod = "GET"
                }
                try {
                    val code = connection.responseCode
                    if (code !in 200..299) {
                        fail(call, "DOWNLOAD", "download", "Update download failed ($code).")
                        return@execute
                    }
                    val length = connection.contentLengthLong
                    if (length > MAX_APK_BYTES) {
                        fail(call, "DOWNLOAD", "download", "Update package is too large.")
                        return@execute
                    }
                    val target = File(context.cacheDir, "olaso-update.apk")
                    if (target.exists() && !target.delete()) {
                        fail(call, "DOWNLOAD", "download", "Previous update file could not be cleared.")
                        return@execute
                    }
                    val digest = MessageDigest.getInstance("SHA-256")
                    var total = 0L
                    connection.inputStream.use { input ->
                        target.outputStream().use { output ->
                            val buffer = ByteArray(64 * 1024)
                            while (true) {
                                val read = input.read(buffer)
                                if (read < 0) break
                                total += read
                                if (total > MAX_APK_BYTES) {
                                    fail(call, "DOWNLOAD", "download", "Update package is too large.")
                                    return@execute
                                }
                                output.write(buffer, 0, read)
                                digest.update(buffer, 0, read)
                            }
                        }
                    }
                    val actual = digest.digest().joinToString("") { "%02x".format(it) }
                    if (actual != expectedSha256) {
                        target.delete()
                        fail(call, "CHECKSUM", "verify", "Update checksum did not match.")
                        return@execute
                    }
                    call.resolve(
                        JSObject().apply {
                            put("ok", true)
                            put("path", target.absolutePath)
                            put("bytes", total)
                            put("sha256", actual)
                        },
                    )
                } finally {
                    connection.disconnect()
                }
            } catch (error: Exception) {
                fail(call, "DOWNLOAD", "download", error.message ?: "Update download failed.")
            }
        }
    }

    @PluginMethod
    fun installApk(call: PluginCall) {
        val path = call.getString("path")?.trim().orEmpty()
        val expectedPackageId = call.getString("packageId")?.trim().orEmpty()
        val expectedVersionCode = call.getInt("versionCode")
        val expectedCertSha256 = call.getString("signingCertSha256")?.trim()?.lowercase(Locale.US).orEmpty()

        if (path.isEmpty() || !File(path).isFile) {
            fail(call, "CONFIGURATION", "install", "Update package file is missing.")
            return
        }
        if (expectedPackageId != APPLICATION_ID) {
            fail(call, "CONFIGURATION", "install", "Update package ID is not Olaso POS.")
            return
        }
        if (expectedVersionCode == null || expectedVersionCode < 1) {
            fail(call, "CONFIGURATION", "install", "Update version code is invalid.")
            return
        }
        if (!SHA256_HEX.matches(expectedCertSha256)) {
            fail(call, "CONFIGURATION", "install", "Signing certificate digest is invalid.")
            return
        }

        executor.execute {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                    !context.packageManager.canRequestPackageInstalls()
                ) {
                    fail(
                        call,
                        "PERMISSION",
                        "install",
                        "Allow Olaso to install updates in Android settings, then try again.",
                    )
                    return@execute
                }

                val archiveFlags =
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        PackageManager.GET_SIGNING_CERTIFICATES
                    } else {
                        @Suppress("DEPRECATION")
                        PackageManager.GET_SIGNATURES
                    }
                val archive =
                    context.packageManager.getPackageArchiveInfo(path, archiveFlags) ?: run {
                        fail(call, "VERIFY", "install", "Update package could not be read.")
                        return@execute
                    }
                archive.applicationInfo?.sourceDir = path
                archive.applicationInfo?.publicSourceDir = path

                if (archive.packageName != expectedPackageId) {
                    fail(call, "VERIFY", "install", "Update package ID did not match.")
                    return@execute
                }
                val archiveVersion = packageVersionCode(archive)
                if (archiveVersion != expectedVersionCode) {
                    fail(call, "VERIFY", "install", "Update version code did not match the manifest.")
                    return@execute
                }
                val installed = currentPackageInfo()
                if (archiveVersion <= packageVersionCode(installed)) {
                    fail(call, "VERIFY", "install", "Update must have a higher version code.")
                    return@execute
                }
                val archiveCert = signingCertSha256(archive)
                val installedCert = signingCertSha256(installed)
                if (archiveCert != installedCert || archiveCert != expectedCertSha256) {
                    fail(call, "VERIFY", "install", "Update signing certificate did not match.")
                    return@execute
                }

                registerStatusReceiver()
                val installer = context.packageManager.packageInstaller
                val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
                params.setAppPackageName(expectedPackageId)
                val sessionId = installer.createSession(params)
                installer.openSession(sessionId).use { session ->
                    FileInputStream(path).use { input ->
                        session.openWrite("base.apk", 0, File(path).length()).use { output ->
                            input.copyTo(output)
                            session.fsync(output)
                        }
                    }
                    val intent = Intent(ACTION_INSTALL_STATUS).setPackage(context.packageName)
                    val flags =
                        PendingIntent.FLAG_UPDATE_CURRENT or
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                                PendingIntent.FLAG_MUTABLE
                            } else {
                                0
                            }
                    val pending =
                        PendingIntent.getBroadcast(context, sessionId, intent, flags)
                    session.commit(pending.intentSender)
                }
                call.resolve(
                    JSObject().apply {
                        put("ok", true)
                        put("sessionId", sessionId)
                        put("awaitingUserConfirmation", true)
                    },
                )
            } catch (error: Exception) {
                Log.w(TAG, "installApk failed", error)
                fail(call, "INSTALL", "install", error.message ?: "Update installation failed.")
            }
        }
    }

    private fun registerStatusReceiver() {
        if (statusReceiver != null) return
        val receiver =
            object : BroadcastReceiver() {
                override fun onReceive(context: Context, intent: Intent) {
                    if (intent.action != ACTION_INSTALL_STATUS) return
                    when (intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)) {
                        PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                            val confirm =
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                    intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent::class.java)
                                } else {
                                    @Suppress("DEPRECATION")
                                    intent.getParcelableExtra(Intent.EXTRA_INTENT)
                                }
                            if (confirm != null) {
                                confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                context.startActivity(confirm)
                            }
                        }
                        PackageInstaller.STATUS_SUCCESS -> {
                            Log.i(TAG, "Package install succeeded")
                        }
                        else -> {
                            val message =
                                intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE)
                                    ?: "Package install failed"
                            Log.w(TAG, message)
                        }
                    }
                }
            }
        ContextCompat.registerReceiver(
            context,
            receiver,
            IntentFilter(ACTION_INSTALL_STATUS),
            ContextCompat.RECEIVER_NOT_EXPORTED,
        )
        statusReceiver = receiver
    }

    private fun unregisterStatusReceiver() {
        val receiver = statusReceiver ?: return
        try {
            context.unregisterReceiver(receiver)
        } catch (_: Exception) {
        }
        statusReceiver = null
    }

    private fun currentPackageInfo(): android.content.pm.PackageInfo {
        val flags =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                PackageManager.GET_SIGNING_CERTIFICATES
            } else {
                @Suppress("DEPRECATION")
                PackageManager.GET_SIGNATURES
            }
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.packageManager.getPackageInfo(
                context.packageName,
                PackageManager.PackageInfoFlags.of(flags.toLong()),
            )
        } else {
            @Suppress("DEPRECATION")
            context.packageManager.getPackageInfo(context.packageName, flags)
        }
    }

    private fun packageVersionCode(packageInfo: android.content.pm.PackageInfo): Int {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            packageInfo.longVersionCode.toInt()
        } else {
            @Suppress("DEPRECATION")
            packageInfo.versionCode
        }
    }

    private fun signingCertSha256(packageInfo: android.content.pm.PackageInfo): String {
        val signatures =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageInfo.signingInfo?.apkContentsSigners
                    ?: packageInfo.signingInfo?.signingCertificateHistory
                    ?: emptyArray()
            } else {
                @Suppress("DEPRECATION")
                packageInfo.signatures ?: emptyArray()
            }
        val first = signatures.firstOrNull()
            ?: throw IllegalStateException("Package has no signing certificate.")
        val digest = MessageDigest.getInstance("SHA-256").digest(first.toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
    }

    private fun fail(call: PluginCall, code: String, stage: String, message: String) {
        call.resolve(
            JSObject().apply {
                put("ok", false)
                put("code", code)
                put("stage", stage)
                put("message", message)
            },
        )
    }

    companion object {
        private const val TAG = "OlasoAppUpdate"
        private const val APPLICATION_ID = "com.olaso.pos"
        private const val ACTION_INSTALL_STATUS = "com.olaso.pos.UPDATE_INSTALL_STATUS"
        private const val MAX_APK_BYTES = 120L * 1024L * 1024L
        private val SHA256_HEX = Regex("^[a-f0-9]{64}$")
    }
}
