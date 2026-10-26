import DigiokycSDK
import Foundation
import React
import UIKit

// iOS counterpart of android/app/src/main/java/com/qbatz/smartstay/activity/KYCVerification.kt.
// Runs one KYC attempt: backend check, Digio workflow, backend status update.
// Must be created and started on the main queue; all state is touched there.
final class KYCVerification: DigioKycResponseDelegate {
  private static let genericError = "Something went wrong. Please try again."
  private static let cancelledByUserCode = -1000

  private enum Reply {
    case success
    case httpError(body: String)
    case transportError
  }

  private let documentId: String
  private let identifier: String
  private let tokenId: String?
  private let accessToken: String
  private let onFinish: () -> Void
  private var hasHandledResponse = false

  init(documentId: String, identifier: String, tokenId: String?, accessToken: String, onFinish: @escaping () -> Void) {
    self.documentId = documentId
    self.identifier = identifier
    self.tokenId = tokenId
    self.accessToken = accessToken
    self.onFinish = onFinish
  }

  func start() {
    send("GET", "/v2/kyc/verify") { reply in
      switch reply {
      case .success:
        self.startDigioKyc()
      case .httpError(let body):
        self.finish(message: body.isEmpty ? "Unknown error" : body)
      case .transportError:
        self.finish(message: KYCVerification.genericError)
      }
    }
  }

  private func startDigioKyc() {
    guard let presenter = RCTPresentedViewController() else {
      finish(message: KYCVerification.genericError)
      return
    }
    do {
      try DigioKycBuilder()
        .withController(viewController: presenter)
        .setEnvironment(environment: Constant.DIGIO_ENVIRONMENT)
        .setDocumentId(documentId: documentId)
        .setIdentifier(identifier: identifier)
        .setTokenId(tokenId: tokenId)
        .setLogo(logo: "https://www.digio.in/images/digio_blue.png")
        .setPrimaryColor(hexColor: "#0261B0")
        .setKycResponseDelegate(delegate: self)
        .build()
    } catch {
      finish(message: "Failed to init Digio: \(error.localizedDescription)")
    }
  }

  // MARK: - DigioKycResponseDelegate

  func onDigioKycResponseSuccess(successResponse: String) {
    DispatchQueue.main.async {
      self.handleResponse(succeeded: true, response: successResponse)
    }
  }

  func onDigioKycResponseFailure(failureResponse: String) {
    DispatchQueue.main.async {
      self.handleResponse(succeeded: false, response: failureResponse)
    }
  }

  func onGateWayEvent(event: String) {
  }

  private func handleResponse(succeeded: Bool, response: String) {
    // The SDK must not be able to complete the same attempt twice.
    guard !hasHandledResponse else { return }
    hasHandledResponse = true

    guard succeeded else {
      // Backing out of the Digio screen is not an error, so it gets no message.
      finish(message: KYCVerification.isCancellation(response) ? nil : KYCVerification.genericError)
      return
    }

    send("POST", "/v2/kyc/status") { reply in
      guard case .success = reply else {
        self.finish(message: KYCVerification.genericError)
        return
      }
      self.finish(message: "KYC is completed") {
        // Android relaunches MainActivity here; reloading React Native is the iOS
        // equivalent, so the app comes back up with the new KYC status.
        RCTTriggerReloadCommandListeners("KYC completed")
      }
    }
  }

  private static func isCancellation(_ response: String) -> Bool {
    guard let data = response.data(using: .utf8),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
      return false
    }
    return (json["code"] as? Int) == cancelledByUserCode || (json["status"] as? String) == "cancel"
  }

  // MARK: - Helpers

  // `completion` runs on the main queue.
  private func send(_ method: String, _ path: String, completion: @escaping (Reply) -> Void) {
    guard let url = URL(string: Constant.BASE_URL + path) else {
      completion(.transportError)
      return
    }
    var request = URLRequest(url: url)
    request.httpMethod = method
    request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

    URLSession.shared.dataTask(with: request) { data, response, _ in
      let reply: Reply
      if let statusCode = (response as? HTTPURLResponse)?.statusCode {
        let body = data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
        reply = (200..<300).contains(statusCode) ? .success : .httpError(body: body)
      } else {
        reply = .transportError
      }
      DispatchQueue.main.async {
        completion(reply)
      }
    }.resume()
  }

  // Ends the attempt. `message` is shown the way Android shows its toasts;
  // `then` runs once the user has dismissed it.
  private func finish(message: String?, then: (() -> Void)? = nil) {
    onFinish()
    guard let message = message, let presenter = RCTPresentedViewController() else {
      then?()
      return
    }
    let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in then?() })

    // The Digio screen may still be animating away when its callback fires.
    if presenter.isBeingDismissed,
       let coordinator = presenter.transitionCoordinator,
       let presenting = presenter.presentingViewController {
      coordinator.animate(alongsideTransition: nil) { _ in
        presenting.present(alert, animated: true)
      }
    } else {
      presenter.present(alert, animated: true)
    }
  }
}
