package com.samantapp.app;
  
import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONException;

import com.onesignal.OSNotification;
import com.onesignal.OSMutableNotification;
import com.onesignal.OSNotificationReceivedEvent;
import com.onesignal.OneSignal.OSRemoteNotificationReceivedHandler;
import java.math.BigInteger;


@SuppressWarnings("unused")
public class NotificationServiceExtension implements OSRemoteNotificationReceivedHandler {

    @Override
    public void remoteNotificationReceived(Context context, OSNotificationReceivedEvent notificationReceivedEvent) {

        OSNotification notification = notificationReceivedEvent.getNotification();
        OSMutableNotification mutableNotification = notification.mutableCopy();
        
        try {
            JSONObject data = notification.getAdditionalData();
            
            String type = (String) data.get("ongoing");
            
            // Log.i("OneSignalExample", "Type: " + type);

            mutableNotification.setExtender(builder -> {
                
                // Log.i("OneSignalExample", "Type Inside Func: " + type);

                if(type.equals("true")){
                    // Log.i("OneSignalExample", "Type inside loop: " + type);
                    builder.setOngoing(true);
                }
                // }
                
                // Log.i("OneSignalExample", "Type after Func: " + type);

                return builder;
            });
            
            notificationReceivedEvent.complete(mutableNotification);

        } catch (JSONException e) {
            //some exception handler code.
            // Log.i("OneSignalExample", "Error: " + e);
            notificationReceivedEvent.complete(mutableNotification);
        }
    }
}