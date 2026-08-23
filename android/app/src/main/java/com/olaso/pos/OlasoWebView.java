package com.olaso.pos;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebSettings;

import com.getcapacitor.CapacitorWebView;

public class OlasoWebView extends CapacitorWebView {
    public OlasoWebView(Context context, AttributeSet attrs) {
        super(context, attrs);

        WebSettings settings = getSettings();
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
    }
}
