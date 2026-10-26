#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// Exposes the Swift native modules to React Native.

@interface RCT_EXTERN_MODULE(CommonModule, RCTEventEmitter)

RCT_EXTERN_METHOD(fetchBaseUrl:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(checkInternet:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(fetchSerialNumber:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(downloadPDF:(NSString *)url)
RCT_EXTERN_METHOD(sharePDF:(NSString *)url title:(NSString *)title)
RCT_EXTERN_METHOD(storeCredentials:(NSString *)token)
RCT_EXTERN_METHOD(updateCustomerId:(NSString *)customerId)
RCT_EXTERN_METHOD(logout:(NSString *)customerId)
RCT_EXTERN_METHOD(verifyKyc:(NSString *)mobile documentId:(NSString *)documentId token:(NSString *)token)
RCT_EXTERN_METHOD(makeCall:(NSString *)phoneNumber)

@end

@interface RCT_EXTERN_MODULE(NotificationModule, NSObject)

RCT_EXTERN_METHOD(fetchFcmToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(logout)

@end
