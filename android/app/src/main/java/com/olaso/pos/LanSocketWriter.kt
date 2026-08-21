package com.olaso.pos

import java.io.IOException
import java.net.ConnectException
import java.net.InetSocketAddress
import java.net.NoRouteToHostException
import java.net.Socket
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import java.util.concurrent.ExecutionException
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

internal class LanSocketException(
    val errorCode: String,
    val stage: String,
    message: String,
    cause: Throwable? = null,
) : Exception(message, cause)

internal data class LanWriteResult(
    val bytesWritten: Int,
    val connectMs: Long,
    val writeMs: Long,
    val totalMs: Long,
)

internal object LanSocketWriter {
    fun write(
        host: String,
        port: Int,
        payload: ByteArray,
        connectTimeoutMs: Int,
        writeTimeoutMs: Int,
    ): LanWriteResult {
        val startedAt = System.nanoTime()
        val socket = Socket()
        try {
            socket.tcpNoDelay = true
            try {
                socket.connect(InetSocketAddress(host, port), connectTimeoutMs)
            } catch (error: SocketTimeoutException) {
                throw LanSocketException(
                    "TIMEOUT",
                    "connect",
                    "Printer connection timed out.",
                    error,
                )
            } catch (error: ConnectException) {
                throw LanSocketException(
                    "UNREACHABLE",
                    "connect",
                    "Printer is unavailable.",
                    error,
                )
            } catch (error: NoRouteToHostException) {
                throw LanSocketException(
                    "UNREACHABLE",
                    "connect",
                    "Printer network is unreachable.",
                    error,
                )
            } catch (error: UnknownHostException) {
                throw LanSocketException(
                    "UNREACHABLE",
                    "connect",
                    "Printer address could not be resolved.",
                    error,
                )
            }

            val connectedAt = System.nanoTime()
            val executor = Executors.newSingleThreadExecutor()
            try {
                val write = executor.submit<Int> {
                    socket.getOutputStream().run {
                        write(payload)
                        flush()
                    }
                    payload.size
                }
                val bytesWritten = try {
                    write.get(writeTimeoutMs.toLong(), TimeUnit.MILLISECONDS)
                } catch (error: TimeoutException) {
                    socket.close()
                    write.cancel(true)
                    throw LanSocketException(
                        "TIMEOUT",
                        "write",
                        "Printer write timed out.",
                        error,
                    )
                } catch (error: ExecutionException) {
                    throw LanSocketException(
                        "WRITE_FAILED",
                        "write",
                        "Printer data could not be written.",
                        error.cause ?: error,
                    )
                }
                val completedAt = System.nanoTime()
                return LanWriteResult(
                    bytesWritten = bytesWritten,
                    connectMs = elapsedMs(startedAt, connectedAt),
                    writeMs = elapsedMs(connectedAt, completedAt),
                    totalMs = elapsedMs(startedAt, completedAt),
                )
            } finally {
                executor.shutdownNow()
            }
        } catch (error: LanSocketException) {
            throw error
        } catch (error: IOException) {
            throw LanSocketException(
                "WRITE_FAILED",
                if (socket.isConnected) "write" else "connect",
                "Printer connection failed.",
                error,
            )
        } finally {
            try {
                socket.close()
            } catch (_: IOException) {
                // The observable operation has already completed or failed.
            }
        }
    }

    private fun elapsedMs(start: Long, end: Long) =
        TimeUnit.NANOSECONDS.toMillis(end - start)
}
