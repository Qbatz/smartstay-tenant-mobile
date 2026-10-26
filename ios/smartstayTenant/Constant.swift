import DigiokycSDK

// iOS counterpart of android/app/src/{dev,prod}/java/com/qbatz/smartstay/utils/Constant.java.
// Android picks the value by product flavor; iOS has no flavors, so Debug builds
// use the dev API and Release builds use production.
enum Constant {
#if DEBUG
  static let BASE_URL = "https://tenantapi.qbatz.com/"
#else
  static let BASE_URL = "https://tenantapi.qbatz.com"
#endif

  // Must be the Digio environment the backend creates KYC requests in.
  // Android uses SANDBOX for every flavor.
  static let DIGIO_ENVIRONMENT = DigioEnvironment.SANDBOX
}
