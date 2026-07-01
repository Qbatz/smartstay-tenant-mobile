package com.qbatz.smartstay.activity

import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.qbatz.smartstay.networking.NetworkService
import `in`.digio.sdk.gateway.enums.DigioEnvironment
import `in`.digio.sdk.gateway.enums.KycMode
import `in`.digio.sdk.gateway.event.model.GatewayEvent
import `in`.digio.sdk.gateway.model.DigioConfig
import `in`.digio.sdk.gateway.model.DigioTheme
import `in`.digio.sdk.kyc.DigioWorkflowSession
import `in`.digio.sdk.kyc.workflow.WorkflowResponseListener
import `in`.digio.sdk.kyc.workflow.model.WorkflowResponse
import retrofit2.Call

import retrofit2.Callback
import retrofit2.Response


class KYCVerification: ComponentActivity(), WorkflowResponseListener {


    private lateinit var digioWorkflowSession: DigioWorkflowSession
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val bundle = intent.extras
        var documetId: String = "" //KID260701214403703NWY1JPWP3TFJN8
        var identifier: String = "" //7022736579
        var tokenId: String = "" //GWT260701214403731JEEJBX5EOR9GXS

        var acessToken: String = ""
        var customerId: String = ""

        sharedPreferences = getSharedPreferences("user_credentials", MODE_PRIVATE)
        sharedPreferences?.let { it ->
            acessToken = it.getString("token", "").toString()
            customerId = it.getString("customerId", "").toString()
        }

        bundle?.let { it ->
            documetId = it.getString("request_id", "")
            identifier = it.getString("mobile", "")
            tokenId = it.getString("token", "")
        }


        initDigio()
        NetworkService.getNetworkConfig(acessToken)
            .getInitializeKYC()
            .enqueue(object: Callback<String>{
            override fun onResponse(
                p0: Call<String?>,
                p1: Response<String?>
            ) {
                if (p1.isSuccessful) {
                    try {
                        startDigioKyc(documetId, identifier, tokenId)
                    } catch (e: Exception) {
                        Log.e("KycApp", "Error initializing Digio", e)
                    }
                }
                else {
                    val errorMessage = p1.errorBody()?.string() ?: "Unknown error"
                    Toast.makeText(application, errorMessage, Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(p0: Call<String?>, p1: Throwable) {
                Log.e("Retrofit", "Failure", p1)

                Toast.makeText(application, "Error available", Toast.LENGTH_LONG).show()
            }
        })


        setContent {
            
        }
    }

    override fun onGatewayEvent(gatewayEvent: GatewayEvent) {
    }

    override fun onWorkflowFailure(workflowResponse: WorkflowResponse) {
    }

    override fun onWorkflowSuccess(workflowResponse: WorkflowResponse) {
        Toast.makeText(application, "Workflow is success", Toast.LENGTH_LONG).show()
    }

    private fun initDigio() {
        digioWorkflowSession = DigioWorkflowSession()
        val digioConfig = DigioConfig()
        val theme = DigioTheme()
        theme.primaryColor = android.R.color.holo_blue_dark
        theme.primaryColorHex = "#0261B0"
        theme.secondaryColorHex = "#141414"

        try {
            digioConfig.theme = theme
        } catch(e: Throwable) {
            Log.e("KycApp", "setTheme failed", e)
        }

        digioConfig.logo = "https://www.digio.in/images/digio_blue.png"
        digioConfig.environment = DigioEnvironment.SANDBOX

        // Correct configuration based on reflection
        try {
            // Set KycMode to WORKFLOW as we are using "DigioWorkflowSession"
            digioConfig.kycMode = KycMode.WORKFLOW

        } catch (e: Exception) {
        }

        try {
            digioWorkflowSession.init(this, digioConfig)
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Failed to init Digio: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun startDigioKyc(documentId: String, identifier: String, tokenId: String?) {
        try {
            val document = if (documentId.startsWith("KID") || documentId.startsWith("RID")) documentId else "KID$documentId"

            digioWorkflowSession.start(documentId, identifier, tokenId)
        } catch (e: Exception) {

//            viewModel.onKycFailure(-1, "Exception starting SDK: ${e.message}", null)
        }
    }
}