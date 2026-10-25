package com.qbatz.smartstay.utils;

import com.qbatz.smartstay.tenant.BuildConfig;

public final class Constant {
    // From the env file of the product flavor being built (.env.dev, .env.prod or .env.local);
    // see readEnvFile in android/app/build.gradle.
    public static final String BASE_URL = BuildConfig.API_BASE_URL;
}
