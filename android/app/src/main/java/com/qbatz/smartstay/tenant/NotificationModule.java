package com.qbatz.smartstay.tenant;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;


import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class NotificationModule extends ReactContextBaseJavaModule {

    Promise promise = null;
    String token = null;

    Receiver receiver;
    private Context context;

    NotificationModule(ReactApplicationContext context){
        super(context);
        this.context = context;

        receiver=new Receiver();

        IntentFilter filter=new IntentFilter();
        filter.addAction("com.smartstay.token");

        int receiverflags = ContextCompat.RECEIVER_NOT_EXPORTED;

        ContextCompat.registerReceiver(context,receiver,filter,receiverflags);

    }


    class Receiver extends BroadcastReceiver{
        @Override
        public void onReceive(Context context, Intent intent) {

            Bundle bundle=intent.getExtras();
            if (bundle!=null){
                token=bundle.getString("token");
                System.out.println(token);
                if(promise!=null){
                    promise.resolve(token);
                }

            }

        }
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void fetchFcmToken(Promise promise){
        SharedPreferences mpref = context.getSharedPreferences("user_details", Context.MODE_PRIVATE);
        if (!mpref.getBoolean("is_token_set", false)) {
            SharedPreferences.Editor editor = mpref.edit();
            editor.putBoolean("is_token_set", true);
            editor.apply();
            promise.resolve(mpref.getString("token", null));
        }
        else {
            promise.reject("-1", "Not available");
        }

    }

    /**
     *
     * should be triggered at the time of logging from the app.
     *
     */
    @ReactMethod
    public void logout() {
        SharedPreferences mpref = context.getSharedPreferences("user_details", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = mpref.edit();
        editor.putBoolean("is_token_set", false);
        editor.apply();;

    }







}
