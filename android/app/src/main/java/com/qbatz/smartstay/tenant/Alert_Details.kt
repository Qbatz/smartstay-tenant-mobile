package com.qbatz.smartstay.tenant

import android.os.Bundle
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity


class Alert_Details : AppCompatActivity() {

    var textview1: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_alert_details)

        textview1 = findViewById<TextView?>(R.id.txtv11)
    }
}