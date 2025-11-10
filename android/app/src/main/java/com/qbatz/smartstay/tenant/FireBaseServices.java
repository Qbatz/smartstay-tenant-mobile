package com.qbatz.smartstay.tenant;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class FireBaseServices extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        System.out.println("Token of :" + token);
        Log.d("FCM","Token:" +token);
        System.out.println("nothinghappenin");

        Intent intent=new Intent("com.Notification_Event");
        intent.putExtra("token",token);
        sendBroadcast(intent);

    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
    }
}
