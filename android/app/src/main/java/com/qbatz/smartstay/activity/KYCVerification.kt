package com.qbatz.smartstay.activity

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import `in`.digio.sdk.gateway.enums.DigioEnvironment
import `in`.digio.sdk.gateway.enums.KycMode
import `in`.digio.sdk.gateway.event.model.GatewayEvent
import `in`.digio.sdk.gateway.model.DigioConfig
import `in`.digio.sdk.gateway.model.DigioTheme
import `in`.digio.sdk.kyc.DigioWorkflowSession
import `in`.digio.sdk.kyc.workflow.WorkflowResponseListener
import `in`.digio.sdk.kyc.workflow.model.WorkflowResponse


class KYCVerification: ComponentActivity(), WorkflowResponseListener {


    private lateinit var digioWorkflowSession: DigioWorkflowSession


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val bundle = intent.extras
        var documetId: String = ""
        var identifier: String = ""
        var tokenId: String = ""

        bundle?.let { it ->
            documetId = it.getString("documentId", "")
            identifier = it.getString("mobile", "")
            tokenId = it.getString("token", "")

        }

        try {
            initDigio()
            startDigioKyc(documetId, identifier, tokenId)
        } catch (e: Exception) {
            Log.e("KycApp", "Error initializing Digio", e)
        }

        setContent {
            
        }
    }

    override fun onGatewayEvent(gatewayEvent: GatewayEvent) {
    }

    override fun onWorkflowFailure(workflowResponse: WorkflowResponse) {
    }

    override fun onWorkflowSuccess(workflowResponse: WorkflowResponse) {
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
            Log.d("KycApp", "Configured KycMode: WORKFLOW")

            // We are NOT setting ServiceMode locally. Letting the Workflow ID drive the flow.
            // digioConfig.serviceMode = DigioServiceMode.FACE

        } catch (e: Exception) {
            Log.e("KycApp", "Failed to set modes", e)
        }

        try {
            digioWorkflowSession.init(this, digioConfig)
            Log.d("KycApp", "DigioWorkflowSession initialized successfully")
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Failed to init Digio: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun startDigioKyc(documentId: String, identifier: String, tokenId: String?) {
        try {
            val document = if (documentId.startsWith("KID") || documentId.startsWith("RID")) documentId else "KID$documentId"
            Toast.makeText(this, "Requesting: $document", Toast.LENGTH_LONG).show()
            digioWorkflowSession.start("KID251219000010890V6IK9DR38IR18D", identifier, tokenId)
        } catch (e: Exception) {
            System.out.println("KYCC Failed")
            e.printStackTrace()
            Toast.makeText(this, "Start Failed: ${e.message}", Toast.LENGTH_LONG).show()
//            viewModel.onKycFailure(-1, "Exception starting SDK: ${e.message}", null)
        }
    }
}