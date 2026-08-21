package com.olaso.pos

import java.net.ServerSocket
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.fail
import org.junit.Test

class LanSocketWriterTest {
    @Test
    fun validatesIpv4Addresses() {
        assertEquals(true, EscPosPrinterPlugin.isValidIpv4("192.168.11.100"))
        assertFalse(EscPosPrinterPlugin.isValidIpv4("printer.local"))
        assertFalse(EscPosPrinterPlugin.isValidIpv4("192.168.11.256"))
        assertFalse(EscPosPrinterPlugin.isValidIpv4("192.168.11"))
    }

    @Test
    fun writesEveryByteAndReturnsObservableTiming() {
        val payload = byteArrayOf(0x1b, 0x40, 0x0a, 0x1d, 0x56, 0x42, 0x00)
        ServerSocket(0).use { server ->
            val executor = Executors.newSingleThreadExecutor()
            try {
                val received = executor.submit<ByteArray> {
                    server.accept().use { socket -> socket.getInputStream().readBytes() }
                }
                val result = LanSocketWriter.write(
                    host = "127.0.0.1",
                    port = server.localPort,
                    payload = payload,
                    connectTimeoutMs = 1_000,
                    writeTimeoutMs = 1_000,
                )

                assertArrayEquals(payload, received.get(1, TimeUnit.SECONDS))
                assertEquals(payload.size, result.bytesWritten)
                assertEquals(true, result.connectMs >= 0)
                assertEquals(true, result.totalMs >= result.connectMs)
            } finally {
                executor.shutdownNow()
            }
        }
    }

    @Test
    fun reportsAClosedEndpointAsUnreachable() {
        val port = ServerSocket(0).use { it.localPort }
        try {
            LanSocketWriter.write(
                host = "127.0.0.1",
                port = port,
                payload = byteArrayOf(0x1b, 0x40),
                connectTimeoutMs = 1_000,
                writeTimeoutMs = 1_000,
            )
            fail("Expected the closed endpoint to fail")
        } catch (error: LanSocketException) {
            assertEquals("UNREACHABLE", error.errorCode)
            assertEquals("connect", error.stage)
        }
    }
}
