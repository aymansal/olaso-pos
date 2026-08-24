package com.olaso.pos

import org.junit.Assert.assertEquals
import org.junit.Test

class OlasoWebViewTest {
    @Test
    fun `guards capacitor lifecycle event until the bridge exists`() {
        val event = "window.Capacitor.triggerEvent('pause', 'document');"
        assertEquals(
            "if (window.Capacitor && " +
                "typeof window.Capacitor.triggerEvent === 'function') {$event}",
            OlasoWebView.guardCapacitorEventScript(event),
        )
    }

    @Test
    fun `leaves ordinary bridge scripts unchanged`() {
        val script = "document.documentElement.dataset.ready = 'true';"
        assertEquals(script, OlasoWebView.guardCapacitorEventScript(script))
    }
}
