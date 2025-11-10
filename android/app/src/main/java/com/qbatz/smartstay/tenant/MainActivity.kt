package com.qbatz.smartstay.tenant;
import android.os.Bundle;

import android.content.pm.PackageManager
import android.Manifest
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import androidx.core.app.ActivityCompat
import android.widget.Toast


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "smartstayTenant"


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

         override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)


           if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
               ActivityCompat.requestPermissions(this,
                   arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                   1000);
           }
  }

    public override fun onActivityResult(
        requestCode: kotlin.Int,
        resultCode: kotlin.Int,
        data: android.content.Intent?
    ) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 1000) {
            if (resultCode == android.app.Activity.RESULT_CANCELED) {
                Toast.makeText(applicationContext, "Persmission Required", Toast.LENGTH_LONG).show()
            }

        }
    }




    private fun askNotificationPermission() {

    }



}
