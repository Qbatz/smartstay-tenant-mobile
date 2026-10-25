import DigiokycSDK

// iOS counterpart of android/app/src/{dev,prod}/java/com/qbatz/smartstay/utils/Constant.java.
enum Constant {
  static let BASE_URL = RNCConfig.env(for: "API_BASE_URL") ?? ""
  static let DIGIO_ENVIRONMENT = DigioEnvironment.SANDBOX
}
