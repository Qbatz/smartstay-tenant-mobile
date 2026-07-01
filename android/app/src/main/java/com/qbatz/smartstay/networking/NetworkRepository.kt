package com.qbatz.smartstay.networking

import retrofit2.Call
import retrofit2.http.GET

interface NetworkRepository {
    @GET("/v2/kyc/verify")
    fun getInitializeKYC(): Call<String>
}