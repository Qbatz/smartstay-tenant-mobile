import Foundation
import React

// iOS counterpart of android/app/src/main/java/com/qbatz/smartstay/tenant/NotificationModule.java.
// The FCM token is stored by AppDelegate (messaging(_:didReceiveRegistrationToken:)) in a
// "user_details" store, as FireBaseServices.onNewToken does on Android.
@objc(NotificationModule)
class NotificationModule: NSObject {
  private static let userDetails = UserDefaults(suiteName: "user_details") ?? .standard

  // A new token has not been handed to JS yet, so fetchFcmToken will return it.
  static func storeFcmToken(_ token: String) {
    userDetails.set(token, forKey: "token")
    userDetails.set(false, forKey: "is_token_set")
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }

  // Same contract as Android: returns the token once, until logout() or a new token re-arms it.
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

  // Called at logout so the next login sends the token to the server again.
  @objc(logout)
  func logout() {
    NotificationModule.userDetails.set(false, forKey: "is_token_set")
  }
}
