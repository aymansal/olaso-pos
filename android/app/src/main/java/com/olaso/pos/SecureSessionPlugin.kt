package com.olaso.pos

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

@CapacitorPlugin(name = "SecureSession")
class SecureSessionPlugin : Plugin() {
    @PluginMethod
    fun get(call: PluginCall) {
        val key = key(call) ?: return
        val value = preferences().getString(key, null)?.let(::decrypt)
        call.resolve(JSObject().apply { put("value", value) })
    }

    @PluginMethod
    fun set(call: PluginCall) {
        val key = key(call) ?: return
        val value = call.getString("value")
        if (value == null || value.length > MAX_VALUE_LENGTH) {
            call.reject("Secure value must contain at most $MAX_VALUE_LENGTH characters.")
            return
        }
        preferences().edit().putString(key, encrypt(value)).apply()
        call.resolve()
    }

    @PluginMethod
    fun remove(call: PluginCall) {
        val key = key(call) ?: return
        preferences().edit().remove(key).apply()
        call.resolve()
    }

    private fun key(call: PluginCall): String? {
        val key = call.getString("key").orEmpty()
        if (!isValidKey(key)) {
            call.reject("Secure key must use 1 to 100 letters, numbers, dots, underscores, or hyphens.")
            return null
        }
        return key
    }

    private fun preferences() = context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)

    private fun encrypt(value: String): String {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey())
        val encrypted = cipher.doFinal(value.toByteArray(StandardCharsets.UTF_8))
        return "${Base64.encodeToString(cipher.iv, Base64.NO_WRAP)}:${Base64.encodeToString(encrypted, Base64.NO_WRAP)}"
    }

    private fun decrypt(value: String): String {
        val parts = value.split(':', limit = 2)
        require(parts.size == 2) { "Stored secure value is invalid." }
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(
            Cipher.DECRYPT_MODE,
            secretKey(),
            GCMParameterSpec(TAG_LENGTH_BITS, Base64.decode(parts[0], Base64.NO_WRAP)),
        )
        return String(cipher.doFinal(Base64.decode(parts[1], Base64.NO_WRAP)), StandardCharsets.UTF_8)
    }

    private fun secretKey(): SecretKey {
        val store = KeyStore.getInstance(KEYSTORE).apply { load(null) }
        (store.getKey(KEY_ALIAS, null) as? SecretKey)?.let { return it }
        return KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE).apply {
            init(
                KeyGenParameterSpec.Builder(
                    KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
                )
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .build(),
            )
        }.generateKey()
    }

    companion object {
        private const val KEYSTORE = "AndroidKeyStore"
        private const val KEY_ALIAS = "olaso_session_v1"
        private const val PREFERENCES = "olaso_secure_session"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val TAG_LENGTH_BITS = 128
        private const val MAX_VALUE_LENGTH = 8_192

        internal fun isValidKey(value: String) = value.matches(Regex("[A-Za-z0-9._-]{1,100}"))
    }
}
