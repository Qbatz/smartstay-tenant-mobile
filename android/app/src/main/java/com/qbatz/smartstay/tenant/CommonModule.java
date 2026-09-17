package com.qbatz.smartstay.tenant;

import static android.content.Context.MODE_PRIVATE;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.SharedPreferencesKt;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qbatz.smartstay.activity.KYCVerification;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.qbatz.smartstay.utils.Constant;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class CommonModule extends ReactContextBaseJavaModule {

    Context context;

    private final ReactApplicationContext reactContext;

    private final ConnectivityManager connectivityManager;

    private static final int REQUEST_CALL = 1;

    CommonModule(ReactApplicationContext context){
        super(context);
        this.context=context;

        this.reactContext = context;
        connectivityManager =(ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        registerNetworkListener();

    }
    @NonNull
    @Override
    public String getName() {
        return "CommonModule";
    }

    @ReactMethod
    public void fetchSerialNumber(Promise promise){
            String  android_id=Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);

        promise.resolve(android_id);
    }

//    @ReactMethod
//    public void  checkInternet(Promise promise){
//        ConnectivityManager connectivityManager=(ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
//
//        boolean connected=(connectivityManager.getNetworkInfo(connectivityManager.TYPE_MOBILE).getState() == NetworkInfo.State.CONNECTED ||
//                connectivityManager.getNetworkInfo(connectivityManager.TYPE_WIFI).getState() == NetworkInfo.State.CONNECTED);
//
//        System.out.println("Connected,"+ connected);
//        Log.d("CommonModule", "connected = " + connected);
//
//        promise.resolve(connected);
//    }

    @ReactMethod
    public void checkInternet(Promise promise) {
        try {

            if (connectivityManager == null) {
                promise.resolve(false);
                return;
            }

            Network network = connectivityManager.getActiveNetwork();
            if (network == null) {
                promise.resolve(false);
                return;
            }

            NetworkCapabilities capabilities =
                    connectivityManager.getNetworkCapabilities(network);

            boolean connected = capabilities != null &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);

            promise.resolve(connected);

        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    private void registerNetworkListener() {

        if (connectivityManager == null) return;

        connectivityManager.registerDefaultNetworkCallback(
                new ConnectivityManager.NetworkCallback() {

                    @Override
                    public void onAvailable(Network network) {
//                        sendEvent(true);
                        NetworkCapabilities capabilities =
                                connectivityManager.getNetworkCapabilities(network);

                        boolean isConnected = capabilities != null &&
                                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);

                        sendEvent(isConnected);
                    }

                    @Override
                    public void onLost(Network network) {
                        sendEvent(false);
                    }
                }
        );
    }

    private void sendEvent(boolean isConnected) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("networkStatus", isConnected);
    }


    @ReactMethod
    public void fetchBaseUrl(Promise promise) {
        promise.resolve(Constant.BASE_URL);
    }

    @ReactMethod
    public void downloadPDF(String url) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        browserIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(browserIntent);
    }

    @ReactMethod
    public void sharePDF(String url, String title) {
        File pdfFile = null;
        try {
            pdfFile = downloadPdf(context, url, "invoice.pdf");
            Uri pdfUri = FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".provider",
                    pdfFile
            );

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("application/pdf");
            shareIntent.putExtra(Intent.EXTRA_STREAM, pdfUri);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);

            Intent chooser = Intent.createChooser(shareIntent, title);
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(chooser);

//            context.startActivity(Intent.createChooser(shareIntent, title));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }

    public File downloadPdf(Context context, String pdfUrl, String fileName) throws IOException {
        File file = new File(context.getCacheDir(), fileName);

        URL url = new URL(pdfUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.connect();

        InputStream input = connection.getInputStream();
        FileOutputStream output = new FileOutputStream(file);

        byte[] buffer = new byte[1024];
        int len;
        while ((len = input.read(buffer)) > 0) {
            output.write(buffer, 0, len);
        }

        output.close();
        input.close();

        return file;
    }

    @ReactMethod
    public void storeCredentials(String token) {
        SharedPreferences mpref = context.getSharedPreferences("user_credentials", MODE_PRIVATE);
        SharedPreferences.Editor edt = mpref.edit();
        edt.putString("token", token);

        edt.apply();
    }

    @ReactMethod
    public void updateCustomerId(String customerId) {
        SharedPreferences mpref = context.getSharedPreferences("user_credentials", MODE_PRIVATE);
        SharedPreferences.Editor edt = mpref.edit();
        edt.putString("customerId", customerId);

        edt.apply();
    }

    @ReactMethod
    public void logout(String customerId) {
        SharedPreferences mpref = context.getSharedPreferences("user_credentials", MODE_PRIVATE);
        SharedPreferences.Editor edt = mpref.edit();
        edt.remove("customerId");
        edt.remove("token");

        edt.apply();
    }

    @ReactMethod
    public void verifyKyc(String mobile, String documentId, String token) {
        Intent intent = new Intent(context, KYCVerification.class);
        intent.putExtra("mobile", mobile);
        intent.putExtra("request_id", documentId);
        intent.putExtra("token", token);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
    }

    @ReactMethod
    public void makeCall(String phn_number){
        if(ContextCompat.checkSelfPermission(reactContext, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(reactContext.getCurrentActivity(),
                    new String[]{Manifest.permission.CALL_PHONE}, REQUEST_CALL);
        }else {
            String dial = "tel:" + phn_number;

            Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse(dial));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            reactContext.startActivity(intent);

        }
    }

}
