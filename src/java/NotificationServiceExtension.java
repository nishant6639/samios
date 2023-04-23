package com.samantapp.app;
  
import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONException;
import android.content.Intent;
import android.os.Bundle;

import com.onesignal.OSNotification;
import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;
import java.math.BigInteger;


@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {
    private Context mContext;
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
                Intent dialogIntent = new Intent(context.getApplicationContext(), MainActivity.class);
                dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_SINGLE_TOP);
                // dialogIntent.addCategory(Intent.CATEGORY_HOME);
                Bundle bundle = new Bundle();
                // bundle.putBoolean("cdvStartInBackground", true);
                dialogIntent.putExtras(bundle);
                Log.i("OneSignalExample", "Type_inc: incoming start activity");
                context.getApplicationContext().startActivity(dialogIntent);
            }

            mutableNotification.setExtender(builder -> {
                
                Log.i("OneSignalExample", "Type Inside Func: " + type);

                if(type.equals("true")){
                    // Log.i("OneSignalExample", "Type inside loop: " + type);
                    builder.setOngoing(true);
                }
                // }
                
                Log.i("OneSignalExample", "Type after Func: " + type);

                return builder;
            });
            
            notificationReceivedEvent.complete(mutableNotification);

        } catch (JSONException e) {
            //some exception handler code.
            Log.i("OneSignalExample", "Error: " + e);
            notificationReceivedEvent.complete(mutableNotification);
        }
    }
}