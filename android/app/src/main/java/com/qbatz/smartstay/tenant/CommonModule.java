package com.qbatz.smartstay.tenant;

import android.content.Context;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CommonModule extends ReactContextBaseJavaModule {

    Context context;

    CommonModule(ReactApplicationContext context){
        super(context);
        this.context=context;

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


}
