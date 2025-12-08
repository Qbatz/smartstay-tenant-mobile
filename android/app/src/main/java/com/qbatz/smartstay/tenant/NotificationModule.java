package com.qbatz.smartstay.tenant;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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

    NotificationModule(ReactApplicationContext context){
        super(context);

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
        if(token!=null){
            promise.resolve(token);
        }
        else {
            this.promise = promise;
        }
    }







}
