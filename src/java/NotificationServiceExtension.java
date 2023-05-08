package com.samantapp.app;
  
import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONException;
import android.content.Intent;
import android.app.PendingIntent;
import android.os.Bundle;

import com.onesignal.OSNotification;
import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;
import java.math.BigInteger;
import android.media.RingtoneManager;
import android.media.Ringtone;
import android.net.Uri;
// import android.support.v7.app.NotificationCompat;
import android.support.v4.app.NotificationCompat;



@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {
    private Context mContext;
    private static Ringtone mRingtone = null;
    @Override
    public void remoteNotificationReceived(Context context, OSNotificationReceivedEvent notificationReceivedEvent) {

        this.mContext = context;
        OSNotification notification = notificationReceivedEvent.getNotification();
        OSMutableNotification mutableNotification = notification.mutableCopy();
        
        try {
            JSONObject data = notification.getAdditionalData();
            
            String type = (String) data.get("ongoing");
            String type_inc = (String) data.get("type");
            
            Log.i("OneSignalExample", "Type: " + type);
            Log.i("OneSignalExample", "Type_inc: " + type_inc);

            if(type_inc.equals("incoming_call")){
                Intent fullScreenIntent = new Intent(context.getApplicationContext(), MainActivity.class);
                fullScreenIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_SINGLE_TOP);
                // PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(context.getApplicationContext(), 0,
                // fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                // fullScreenIntent.addCategory(Intent.CATEGORY_HOME);
                Bundle bundle = new Bundle();
                bundle.putBoolean("cdvStartInBackground", true);
                fullScreenIntent.putExtras(bundle);
                Log.i("OneSignalExample", "Type_inc: incoming start activity");
                context.getApplicationContext().startActivity(fullScreenIntent);
                Log.i("OneSignalExample", "1");
                Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
                Log.i("OneSignalExample", "2");
                // if (mRingtone == null) {
                mRingtone = RingtoneManager.getRingtone(context, uri);
                Log.i("OneSignalExample", "3");
                mRingtone.play();
                Log.i("OneSignalExample", "4");
                // }
            }
            else{
                if(type_inc.equals("normal")){
                    Log.i("OneSignalExample", "5");
                }
                else{
                    if (mRingtone != null) {
                        mRingtone.stop();
                        Log.i("OneSignalExample", "6");
                        mRingtone = null;
                        Log.i("OneSignalExample", "7");
                    }
                }
            }

            mutableNotification.setExtender(builder -> {
                
                Log.i("OneSignalExample", "Type Inside Func: " + type);

                if(type.equals("true")){
                    Log.i("OneSignalExample", "Type inside loop: " + type);
                    builder.setOngoing(true);
                }

                if(type_inc.equals("ong_call")){
                    Log.i("OneSignalExample", "8");

                    // builder.setTimeoutAfter(5000);
                }

                if(type_inc.equals("connecting")){
                    Log.i("OneSignalExample", "9");

                    // builder.setTimeoutAfter(5000);
                }

                if(type_inc.equals("normal")){
                    Log.i("OneSignalExample", "10");
                }
                else{
                    Log.i("OneSignalExample", "11");
                    // builder.setPriority(NotificationCompat.PRIORITY_HIGH);
                    Log.i("OneSignalExample", "12");
                    // builder.setCategory(NotificationCompat.CATEGORY_CALL);
                    Log.i("OneSignalExample", "13");
                }
                Log.i("OneSignalExample", "14");
                
                Log.i("OneSignalExample", "Type after Func: " + type);

                Log.i("OneSignalExample", "15");

                Log.i("OneSignalExample", "16");
                return builder;

            });
            
            Log.i("OneSignalExample", "17");
            
            notificationReceivedEvent.complete(mutableNotification);
            
            Log.i("OneSignalExample", "18");
            
        } catch (JSONException e) {
            //some exception handler code.
            Log.i("OneSignalExample", "Error: " + e);
            notificationReceivedEvent.complete(mutableNotification);
        }
    }
}