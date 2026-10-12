import Foundation
import Network
import React
import UIKit

// iOS counterpart of android/app/src/main/java/com/qbatz/smartstay/tenant/CommonModule.java.
// verifyKyc (Digio) is not ported yet.
@objc(CommonModule)
class CommonModule: RCTEventEmitter {
  private static let networkStatusEvent = "networkStatus"

  private let pathMonitor = NWPathMonitor()
  private var hasListeners = false
  // Same store name as the Android SharedPreferences file.
  private let credentials = UserDefaults(suiteName: "user_credentials") ?? .standard

  override init() {
    super.init()
    pathMonitor.pathUpdateHandler = { [weak self] path in
      guard let self = self, self.hasListeners else { return }
      self.sendEvent(withName: CommonModule.networkStatusEvent, body: path.status == .satisfied)
    }
    pathMonitor.start(queue: DispatchQueue(label: "com.qbatz.smartstay.network"))
  }

  deinit {
    pathMonitor.cancel()
  }

  override static func requiresMainQueueSetup() -> Bool {
    false
  }

  override func supportedEvents() -> [String]! {
    [CommonModule.networkStatusEvent]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc(fetchBaseUrl:rejecter:)
  func fetchBaseUrl(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(Constant.BASE_URL)
  }

  @objc(checkInternet:rejecter:)
  func checkInternet(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(pathMonitor.currentPath.status == .satisfied)
  }

  @objc(fetchSerialNumber:rejecter:)
  func fetchSerialNumber(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      resolve(UIDevice.current.identifierForVendor?.uuidString)
    }
  }

  @objc(downloadPDF:)
  func downloadPDF(_ url: String) {
    guard let pdfURL = URL(string: url) else { return }
    DispatchQueue.main.async {
      UIApplication.shared.open(pdfURL)
    }
  }

  // The share sheet has no title on iOS, so `title` is unused.
  @objc(sharePDF:title:)
  func sharePDF(_ url: String, title: String) {
    guard let remoteURL = URL(string: url) else { return }
    URLSession.shared.downloadTask(with: remoteURL) { downloadedURL, _, _ in
      guard let downloadedURL = downloadedURL else { return }
      let pdfURL = FileManager.default.temporaryDirectory.appendingPathComponent("invoice.pdf")
      try? FileManager.default.removeItem(at: pdfURL)
      guard (try? FileManager.default.moveItem(at: downloadedURL, to: pdfURL)) != nil else { return }

      DispatchQueue.main.async {
        guard let presenter = RCTPresentedViewController() else { return }
        let shareSheet = UIActivityViewController(activityItems: [pdfURL], applicationActivities: nil)
        shareSheet.popoverPresentationController?.sourceView = presenter.view
        presenter.present(shareSheet, animated: true)
      }
    }.resume()
  }

  @objc(storeCredentials:)
  func storeCredentials(_ token: String) {
    credentials.set(token, forKey: "token")
  }

  @objc(updateCustomerId:)
  func updateCustomerId(_ customerId: String) {
    credentials.set(customerId, forKey: "customerId")
  }

  @objc(logout:)
  func logout(_ customerId: String) {
    credentials.removeObject(forKey: "customerId")
    credentials.removeObject(forKey: "token")
  }

  @objc(makeCall:)
  func makeCall(_ phoneNumber: String) {
    guard let callURL = URL(string: "tel://\(phoneNumber)") else { return }
    DispatchQueue.main.async {
      UIApplication.shared.open(callURL)
    }
  }
}
