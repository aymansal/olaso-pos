package com.olaso.pos;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;

import com.getcapacitor.CapacitorWebView;

public class OlasoWebView extends CapacitorWebView {
    public OlasoWebView(Context context, AttributeSet attrs) {
        super(context, attrs);

        WebSettings settings = getSettings();
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
    }

    @Override
    public void evaluateJavascript(String script, ValueCallback<String> callback) {
        super.evaluateJavascript(guardCapacitorEventScript(script), callback);
    }

    static String guardCapacitorEventScript(String script) {
        if (!script.trim().startsWith("window.Capacitor.triggerEvent(")) {
            return script;
        }
        return "if (window.Capacitor && "
            + "typeof window.Capacitor.triggerEvent === 'function') {"
            + script
            + "}";
    }
}
