package com.qbatz.smartstay.tenant;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.HashMap;
import java.util.Map;

public class FireBaseServices extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        SharedPreferences mpref = getSharedPreferences("user_details", Context.MODE_PRIVATE);
        SharedPreferences.Editor edt = mpref.edit();
        edt.putString("token",token);
        edt.putBoolean("is_token_set",false);
        edt.apply();


        Intent intent=new Intent("com.smartstay.token");
        intent.putExtra("token",token);
        sendBroadcast(intent);

    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        Intent intent=new Intent(FireBaseServices.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent= PendingIntent.getActivity(FireBaseServices.this,0,intent,PendingIntent.FLAG_IMMUTABLE);

        if (message.getData() != null) {
            Map<String, String> data = message.getData();
            if (data.containsKey("type")) {
                String type = data.get("type");
                if (type != null && type.equalsIgnoreCase("COMPLAINT_ASSIGN")) {
                    String title = data.get("title");
                    String description = data.get("description");
                    NotificationCompat.Builder builder = new NotificationCompat.Builder(FireBaseServices.this, "My_notification")
                            .setSmallIcon(R.drawable.ic_launcher_background)
                            .setContentTitle(title)
                            .setContentText(description)
                            .setStyle(new NotificationCompat.BigTextStyle()
                                    .bigText(description))
                            .setContentIntent(pendingIntent)
                            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        int importance = NotificationManager.IMPORTANCE_DEFAULT;
                        NotificationChannel channel = new NotificationChannel("My_notification", "My_notification", importance);
                        channel.setDescription(description);
                        // Register the channel with the system; you can't change the importance
                        // or other notification behaviors after this.
                        NotificationManager notificationManager = getSystemService(NotificationManager.class);
                        notificationManager.createNotificationChannel(channel);
                    }

                    if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        // ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        // public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                        int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    NotificationManagerCompat.from(FireBaseServices.this).notify(1000, builder.build());
                }
                if (type != null && type.equalsIgnoreCase("INVOICE_NOTIFICATION")) {
                    String title = data.get("title");
                    String description = data.get("description");
                    NotificationCompat.Builder builder = new NotificationCompat.Builder(FireBaseServices.this, "My_notification")
                            .setSmallIcon(R.drawable.ic_launcher_background)
                            .setContentTitle(title)
                            .setContentText(description)
                            .setStyle(new NotificationCompat.BigTextStyle()
                                    .bigText(description))
                            .setContentIntent(pendingIntent)
                            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        int importance = NotificationManager.IMPORTANCE_DEFAULT;
                        NotificationChannel channel = new NotificationChannel("My_notification", "My_notification", importance);
                        channel.setDescription(description);
                        // Register the channel with the system; you can't change the importance
                        // or other notification behaviors after this.
                        NotificationManager notificationManager = getSystemService(NotificationManager.class);
                        notificationManager.createNotificationChannel(channel);
                    }

                    if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        // ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        // public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                        int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    NotificationManagerCompat.from(FireBaseServices.this).notify(1000, builder.build());
                }
                if (type != null && type.equalsIgnoreCase("COMPLAINT_COMMENTS")) {
                    String title = data.get("title");
                    String description = data.get("description");
                    NotificationCompat.Builder builder = new NotificationCompat.Builder(FireBaseServices.this, "My_notification")
                            .setSmallIcon(R.drawable.ic_launcher_background)
                            .setContentTitle(title)
                            .setContentText(description)
                            .setStyle(new NotificationCompat.BigTextStyle()
                                    .bigText(description))
                            .setContentIntent(pendingIntent)
                            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        int importance = NotificationManager.IMPORTANCE_DEFAULT;
                        NotificationChannel channel = new NotificationChannel("My_notification", "My_notification", importance);
                        channel.setDescription(description);
                        // Register the channel with the system; you can't change the importance
                        // or other notification behaviors after this.
                        NotificationManager notificationManager = getSystemService(NotificationManager.class);
                        notificationManager.createNotificationChannel(channel);
                    }

                    if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        // ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        // public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                        int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    NotificationManagerCompat.from(FireBaseServices.this).notify(1000, builder.build());
                }
            }
        }
    }
}
