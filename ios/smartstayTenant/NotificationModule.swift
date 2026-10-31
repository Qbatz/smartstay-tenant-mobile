import Foundation
import React

@objc(NotificationModule)
class NotificationModule: NSObject {
  private static let userDetails = UserDefaults(suiteName: "user_details") ?? .standard

  static func storeFcmToken(_ token: String) {
    guard userDetails.string(forKey: "token") != token else { return }
    userDetails.set(token, forKey: "token")
    userDetails.set(false, forKey: "is_token_set")
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(fetchFcmToken:rejecter:)
  func fetchFcmToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let userDetails = NotificationModule.userDetails
    guard !userDetails.bool(forKey: "is_token_set"), let token = userDetails.string(forKey: "token") else {
      reject("-1", "Not available", nil)
      return
    }
    userDetails.set(true, forKey: "is_token_set")
    resolve(token)
  }

  @objc(logout)
  func logout() {
    NotificationModule.userDetails.set(false, forKey: "is_token_set")
  }
}
