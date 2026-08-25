package com.olaso.pos

import android.app.Activity
import android.content.Intent
import androidx.activity.result.ActivityResult
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import java.nio.charset.StandardCharsets

@CapacitorPlugin(name = "DocumentExport")
class DocumentExportPlugin : Plugin() {
    @PluginMethod
    fun saveText(call: PluginCall) {
        val fileName = call.getString("fileName")?.trim().orEmpty()
        val text = call.getString("text")
        if (!FILE_NAME.matches(fileName)) {
            call.reject("Export file name is invalid.", "CONFIGURATION")
            return
        }
        if (text == null || text.isEmpty() || text.length > MAX_CHARS) {
            call.reject("Export content must be 1 to $MAX_CHARS characters.", "CONFIGURATION")
            return
        }
        call.setKeepAlive(true)
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "application/json"
            putExtra(Intent.EXTRA_TITLE, fileName)
        }
        startActivityForResult(call, intent, "saveTextResult")
    }

    @PluginMethod
    fun openText(call: PluginCall) {
        call.setKeepAlive(true)
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "application/json"
        }
        startActivityForResult(call, intent, "openTextResult")
    }

    @ActivityCallback
    private fun saveTextResult(call: PluginCall?, result: ActivityResult) {
        if (call == null) return
        if (result.resultCode != Activity.RESULT_OK) {
            call.reject("Export cancelled.", "CANCELLED")
            return
        }
        val uri = result.data?.data
        if (uri == null) {
            call.reject("Export location was not returned.", "UNKNOWN")
            return
        }
        val text = call.getString("text").orEmpty()
        try {
            bridge.context.contentResolver.openOutputStream(uri)?.use { stream ->
                stream.write(text.toByteArray(StandardCharsets.UTF_8))
                stream.flush()
            } ?: run {
                call.reject("Export location could not be opened.", "UNKNOWN")
                return
            }
            call.resolve(JSObject().apply {
                put("ok", true)
                put("bytesWritten", text.toByteArray(StandardCharsets.UTF_8).size)
            })
        } catch (_: Exception) {
            call.reject("Export could not be written.", "UNKNOWN")
        }
    }

    @ActivityCallback
    private fun openTextResult(call: PluginCall?, result: ActivityResult) {
        if (call == null) return
        if (result.resultCode != Activity.RESULT_OK) {
            call.reject("Backup open cancelled.", "CANCELLED")
            return
        }
        val uri = result.data?.data
        if (uri == null) {
            call.reject("Backup location was not returned.", "UNKNOWN")
            return
        }
        try {
            val bytes = bridge.context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                ?: run {
                    call.reject("Backup could not be opened.", "UNKNOWN")
                    return
                }
            if (bytes.isEmpty() || bytes.size > MAX_BYTES) {
                call.reject("Backup file size is outside the allowed range.", "CONFIGURATION")
                return
            }
            call.resolve(JSObject().apply {
                put("ok", true)
                put("text", String(bytes, StandardCharsets.UTF_8))
                put("bytesRead", bytes.size)
            })
        } catch (_: Exception) {
            call.reject("Backup could not be read.", "UNKNOWN")
        }
    }

    companion object {
        private const val MAX_CHARS = 8_000_000
        private const val MAX_BYTES = 8_000_000
        private val FILE_NAME = Regex("""^[A-Za-z0-9._-]{1,120}\.json$""")
    }
}
