import DigiokycSDK

// iOS counterpart of android/app/src/{dev,prod}/java/com/qbatz/smartstay/utils/Constant.java.
enum Constant {
  // From the env file of the scheme being built (.env.dev for Dev, .env.prod for Prod), via
  // react-native-config. The "[Env] Verify env file" build phase fails the build if it is missing.
  static let BASE_URL = RNCConfig.env(for: "API_BASE_URL") ?? ""

  // Must be the Digio environment the backend creates KYC requests in.
  // Android uses SANDBOX for every flavor.
  static let DIGIO_ENVIRONMENT = DigioEnvironment.SANDBOX
}
