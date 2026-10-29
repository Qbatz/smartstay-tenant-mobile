import DigiokycSDK

enum Constant {
  static let BASE_URL = Configuration.fetchFromDictionary(key: "BASE_URL")

  static let DIGIO_ENVIRONMENT: DigioEnvironment = {
    let value = Configuration.fetchFromDictionary(key: "DIGIO_ENVIRONMENT")
    guard let environment = DigioEnvironment(rawValue: value) else {
      fatalError("DIGIO_ENVIRONMENT \(value) is not a Digio environment (SANDBOX or PRODUCTION)")
    }
    return environment
  }()
}
