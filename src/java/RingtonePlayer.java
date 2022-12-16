package com.cordova.plugins.ringtone;

import android.content.Context;
import android.media.RingtoneManager;
import android.media.Ringtone;
import android.net.Uri;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import android.os.Vibrator;

import java.util.Timer;
import java.util.TimerTask;

public class RingtonePlayer extends CordovaPlugin {
    private static final String TAG = "RingtonePlayer";
    private static Ringtone mRingtone = null;
    private Timer mTimer = null;
    private Vibrator v;

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Context context = this.cordova.getActivity().getApplicationContext();
        Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        
        v = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);

        if (mRingtone == null) {
            mRingtone = RingtoneManager.getRingtone(context, uri);
        }

        if (action.equals("play")) {
            play();

            
            // Start without a delay
            // Vibrate for 100 milliseconds
            // Sleep for 1000 milliseconds
            long[] pattern = {0, 3000, 1000};

            // The '0' here means to repeat indefinitely
            // '0' is actually the index at which the pattern keeps repeating from (the start)
            // To repeat the pattern from any other point, you could increase the index, e.g. '1'
            v.vibrate(pattern, 0);

            callbackContext.success();
        } else if (action.equals("stop")) {
            v.cancel();
            stop();
            callbackContext.success();
        } else {
            callbackContext.error("Invalid action =" + action);
            return false;
        }
        return true;
    }

    private void play() {
        if (mRingtone == null || mRingtone.isPlaying()) {
            return;
        }
        mTimer = new Timer();
        mTimer.scheduleAtFixedRate(new TimerTask() {
            public void run() {
                if (!mRingtone.isPlaying()) {
                    mRingtone.play();
                }
            }
        }, 1000 * 1, 1000 * 1);
        mRingtone.play();
    }

    private void stop() {
        Log.d(TAG, "[stop]");
        if (mTimer != null) {
            mTimer.cancel();
        }
        if (mRingtone != null) {
            mRingtone.stop();
            mRingtone = null;
        }
    }
}
