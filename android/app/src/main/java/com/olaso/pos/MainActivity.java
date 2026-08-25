package com.olaso.pos;

import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.splashscreen.SplashScreenViewProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginHandle;
import com.getcapacitor.WebViewListener;
import com.getcapacitor.community.database.sqlite.CapacitorSQLitePlugin;

public class MainActivity extends BridgeActivity {
    private boolean launchFrameReady;
    private SplashScreenViewProvider launchSplash;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        splashScreen.setOnExitAnimationListener(splash -> {
            if (launchFrameReady) splash.remove();
            else launchSplash = splash;
        });
        registerPlugin(EscPosPrinterPlugin.class);
        registerPlugin(SecureSessionPlugin.class);
        registerPlugin(AppUpdatePlugin.class);
        super.onCreate(savedInstanceState);
        getBridge().addWebViewListener(new WebViewListener() {
            @Override
            public void onPageCommitVisible(WebView webView, String url) {
                finishLaunch();
            }

            @Override
            public void onReceivedError(WebView webView) {
                finishLaunch();
            }

            @Override
            public void onReceivedHttpError(WebView webView) {
                finishLaunch();
            }
        });
        hideSystemBars();
    }

    private void finishLaunch() {
        launchFrameReady = true;
        if (launchSplash != null) {
            launchSplash.remove();
            launchSplash = null;
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemBars();
        }
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().invalidate();
        }
    }

    @Override
    public void onDestroy() {
        if (getBridge() != null) {
            PluginHandle handle = getBridge().getPlugin("CapacitorSQLite");
            if (handle != null) {
                JSObject options = new JSObject();
                options.put("database", "olaso_pos");
                options.put("readonly", false);
                PluginCall closeCall = new PluginCall(
                    null,
                    "CapacitorSQLite",
                    PluginCall.CALLBACK_ID_DANGLING,
                    "closeConnection",
                    options
                ) {
                    @Override
                    public void resolve() {}

                    @Override
                    public void resolve(JSObject result) {}

                    @Override
                    public void reject(String message, String code, Exception error, JSObject data) {}
                };
                getBridge().execute(() -> {
                    CapacitorSQLitePlugin sqlite = (CapacitorSQLitePlugin) handle.getInstance();
                    sqlite.rollbackTransaction(closeCall);
                    sqlite.closeConnection(closeCall);
                });
            }
        }
        super.onDestroy();
    }

    private void hideSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(
            getWindow(),
            getWindow().getDecorView()
        );
        controller.hide(WindowInsetsCompat.Type.systemBars());
        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }
}
