package com.qbatz.smartstay.networking

import com.qbatz.smartstay.utils.Constant
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory

class NetworkService {
    companion object {
        fun getNetworkConfig(authToken: String): NetworkRepository {
            val retrofit = Retrofit.Builder()
                .baseUrl(Constant.BASE_URL)
                .addConverterFactory(ScalarsConverterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .client(OkHttpClient.Builder().addInterceptor(Interceptor { chain ->
                    val request =
                        chain.request().newBuilder().addHeader("Authorization", "Bearer $authToken")
                            .build()
                    chain.proceed(request)
                }).addInterceptor(HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY)).build())
                .build()

            val networRepository = retrofit.create(NetworkRepository::class.java)

            return networRepository
        }
    }
}