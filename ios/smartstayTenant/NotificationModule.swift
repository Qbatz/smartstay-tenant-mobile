import Foundation
import React

// iOS counterpart of android/app/src/main/java/com/qbatz/smartstay/tenant/NotificationModule.java.
// Push notifications are not set up on iOS yet, so there is never an FCM token:
// fetchFcmToken rejects the same way Android does when no token is available.
@objc(NotificationModule)
class NotificationModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(fetchFcmToken:rejecter:)
  func fetchFcmToken(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    reject("-1", "Not available", nil)
  }

  @objc(logout)
  func logout() {
  }
}
