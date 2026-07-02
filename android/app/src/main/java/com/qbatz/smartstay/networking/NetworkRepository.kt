package com.qbatz.smartstay.networking

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.POST

interface NetworkRepository {
    @GET("/v2/kyc/verify")
    fun getInitializeKYC(): Call<String>

    @POST("/v2/kyc/status")
    fun updateStatus(): Call<String>
}