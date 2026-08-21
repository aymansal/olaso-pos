package com.olaso.pos

import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "EscPosPrinter")
class EscPosPrinterPlugin : Plugin() {
    @PluginMethod
    fun write(call: PluginCall) {
        val host = call.getString("host")?.trim().orEmpty()
        val port = call.getInt("port")
        val connectTimeoutMs = call.getInt("connectTimeoutMs", 2_000) ?: 2_000
        val writeTimeoutMs = call.getInt("writeTimeoutMs", 2_000) ?: 2_000
        val dataBase64 = call.getString("dataBase64").orEmpty()

        if (!isValidIpv4(host)) {
            fail(call, "CONFIGURATION", "configuration", "Printer address must be a valid IPv4 address.")
            return
        }
        if (port == null || port !in 1..65_535) {
            fail(call, "CONFIGURATION", "configuration", "Printer port must be from 1 to 65535.")
            return
        }
        if (connectTimeoutMs !in 100..30_000 || writeTimeoutMs !in 100..30_000) {
            fail(call, "CONFIGURATION", "configuration", "Printer timeouts must be from 100 to 30000 ms.")
            return
        }

        val payload = try {
            Base64.decode(dataBase64, Base64.DEFAULT)
        } catch (_: IllegalArgumentException) {
            fail(call, "CONFIGURATION", "configuration", "Printer data must be valid base64.")
            return
        }
        if (payload.isEmpty() || payload.size > 65_536) {
            fail(call, "CONFIGURATION", "configuration", "Printer data must contain 1 to 65536 bytes.")
            return
        }

        try {
            val result = LanSocketWriter.write(
                host = host,
                port = port,
                payload = payload,
                connectTimeoutMs = connectTimeoutMs,
                writeTimeoutMs = writeTimeoutMs,
            )
            call.resolve(JSObject().apply {
                put("ok", true)
                put("bytesWritten", result.bytesWritten)
                put("connectMs", result.connectMs)
                put("writeMs", result.writeMs)
                put("totalMs", result.totalMs)
                put("paperConfirmed", false)
            })
        } catch (error: LanSocketException) {
            fail(
                call,
                error.errorCode,
                error.stage,
                error.message ?: "Printer operation failed.",
            )
        } catch (_: Exception) {
            fail(call, "UNKNOWN", "unknown", "Printer operation failed unexpectedly.")
        }
    }

    private fun fail(call: PluginCall, code: String, stage: String, message: String) {
        call.resolve(JSObject().apply {
            put("ok", false)
            put("code", code)
            put("stage", stage)
            put("message", message)
        })
    }

    companion object {
        internal fun isValidIpv4(value: String): Boolean {
            val parts = value.split('.')
            return parts.size == 4 && parts.all { part ->
                part.isNotEmpty() && part.length <= 3 &&
                    part.all(Char::isDigit) && part.toIntOrNull() in 0..255
            }
        }
    }
}
