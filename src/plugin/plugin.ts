import type { ConfigPlugin } from "@expo/config-plugins";

// biome-ignore lint: lint/suspicious/noExplicitAny fine here
const _missingPluginTypes: ConfigPlugin<any> = () => ({ name: "", slug: "" });

// Could not find file of  @azesmway/react-native-unity error: Failed to find implementation for @azesmway/react-native-unity: ENOENT: no such file or directory, open 'node_modules/@azesmway/react-native-unity/app.plugin.js'
// Could not find file of  @datadog/mobile-react-native error: Failed to find implementation for @datadog/mobile-react-native: ENOENT: no such file or directory, open 'node_modules/@datadog/mobile-react-native/app.plugin.js'
// Could not find file of  @sparkfabrik/react-native-idfa-aaid error: Failed to find implementation for @sparkfabrik/react-native-idfa-aaid: ENOENT: no such file or directory, open 'node_modules/@sparkfabrik/react-native-idfa-aaid/app.plugin.js'
// Could not find file of  app-icon-badge error: Failed to find implementation for app-icon-badge: Could not resolve import: ./dist/app.plugin.js from node_modules/app-icon-badge/app.plugin.js
// Could not find file of  onesignal-expo-plugin error: Failed to find implementation for onesignal-expo-plugin: Could not resolve import: ./build/onesignal/withOneSignal.js from node_modules/onesignal-expo-plugin/app.plugin.js
// Could not find file of  react-native-capture-protection error: Failed to find implementation for react-native-capture-protection: Could not resolve import: ./plugins/withPlugin.js from node_modules/react-native-capture-protection/app.plugin.js
// Could not find file of  react-native-cloud-storage error: Failed to find implementation for react-native-cloud-storage: Could not resolve import: ./dist/typescript/expo-plugin/index.js from node_modules/react-native-cloud-storage/app.plugin.js
// Could not find file of  react-native-iap error: Failed to find implementation for react-native-iap: Could not resolve import: ./plugin/build/withIAP.js from node_modules/react-native-iap/app.plugin.js
// Could not find file of  react-native-localize error: Failed to find implementation for react-native-localize: ENOENT: no such file or directory, open 'node_modules/react-native-localize/app.plugin.js'
// Could not find file of  react-native-mmkv error: Failed to find implementation for react-native-mmkv: ENOENT: no such file or directory, open 'node_modules/react-native-mmkv/app.plugin.js'
// Could not find file of  react-native-nitro-sound error: Failed to find implementation for react-native-nitro-sound: ENOENT: no such file or directory, open 'node_modules/react-native-nitro-sound/app.plugin.js'
// Could not find file of  react-native-quick-crypto error: Failed to find implementation for react-native-quick-crypto: ENOENT: no such file or directory, open 'node_modules/react-native-quick-crypto/app.plugin.js'
// Could not find file of  react-native-whip-whep error: Failed to find implementation for react-native-whip-whep: ENOENT: no such file or directory, open 'node_modules/react-native-whip-whep/app.plugin.js'
// Could not find file of  rn-fade-wrapper error: Failed to find implementation for rn-fade-wrapper: ENOENT: no such file or directory, open 'node_modules/rn-fade-wrapper/app.plugin.js'

import type appandflowExpoCameraCharacteristics from "@appandflow/expo-camera-characteristics/plugin/build/index";
import type baconsAppleColors from "@bacons/apple-colors/plugin/build/withAndroidColors";
import type bamTechReactNativeBatch from "@bam.tech/react-native-batch/plugin/build/withReactNativeBatch";
import type batchComReactNativePlugin from "@batch.com/react-native-plugin/plugin/build/withReactNativeBatch"; // @ts-expect-error
import type beyondidentityBiSdkReactNative from "@beyondidentity/bi-sdk-react-native/app.plugin";
import type bittingzExpoWidgets from "@bittingz/expo-widgets/plugin/build/index"; // @ts-expect-error
import type bravemobileReactNativeCodePush from "@bravemobile/react-native-code-push/expo/plugin/withCodePush";
import type brazeExpoPlugin from "@braze/expo-plugin/build/withBraze";
import type configPluginsReactNativeBlobUtil from "@config-plugins/react-native-blob-util/build/withReactNativeBlobUtil";
import type configPluginsReactNativePdf from "@config-plugins/react-native-pdf/build/withPdf"; // @ts-expect-error
import type corasanImageCompressor from "@corasan/image-compressor/app.plugin";
import type fishjamCloudReactNativeClient from "@fishjam-cloud/react-native-client/plugin/build/withFishjam"; // @ts-expect-error
import type giphyReactNativeSdk from "@giphy/react-native-sdk/app.plugin"; // @ts-expect-error
import type hotUpdaterReactNative from "@hot-updater/react-native/plugin/build/withHotUpdater"; // @ts-expect-error
import type intercomIntercomReactNative from "@intercom/intercom-react-native/app.plugin";
import type iterableExpoPlugin from "@iterable/expo-plugin/plugin/build/withIterable"; // @ts-expect-error
import type kingstinctReactNativeActivityKit from "@kingstinct/react-native-activity-kit/app.plugin"; // @ts-expect-error
import type kingstinctReactNativeHealthkit from "@kingstinct/react-native-healthkit/app.plugin"; // @ts-expect-error
import type maplibreMaplibreReactNative from "@maplibre/maplibre-react-native/lib/typescript/plugin/withMapLibre";
import type prismaReactNative from "@prisma/react-native/plugin/build/index";
import type reactNativeCommunityDatetimepicker from "@react-native-community/datetimepicker/plugin/build/withDateTimePickerStyles";
import type reactNativeFirebaseApp from "@react-native-firebase/app/plugin/build/index";
import type reactNativeFirebaseAppCheck from "@react-native-firebase/app-check/plugin/build/index";
import type reactNativeFirebaseAppDistribution from "@react-native-firebase/app-distribution/plugin/build/index";
import type reactNativeFirebaseAuth from "@react-native-firebase/auth/plugin/build/index";
import type reactNativeFirebaseCrashlytics from "@react-native-firebase/crashlytics/plugin/build/index";
import type reactNativeFirebaseMessaging from "@react-native-firebase/messaging/plugin/build/index";
import type reactNativeFirebasePerf from "@react-native-firebase/perf/plugin/build/index"; // @ts-expect-error
import type reactNativeGoogleSigninGoogleSignin from "@react-native-google-signin/google-signin/plugin/build/withGoogleSignIn";
import type reactNativeSeoulNaverLogin from "@react-native-seoul/naver-login/plugin/build/index";
import type reactNativeVoiceVoice from "@react-native-voice/voice/plugin/build/withVoice";
import type reactvisionReactViro from "@reactvision/react-viro/dist/plugins/withViro";
import type rnmapboxMaps from "@rnmapbox/maps/plugin/build/withMapbox";
import type sentryReactNative from "@sentry/react-native/plugin/build/index"; // @ts-expect-error
import type stripeStripeReactNative from "@stripe/stripe-react-native/lib/typescript/plugin/withStripe"; // @ts-expect-error
import type vonovakReactNativeThemeControl from "@vonovak/react-native-theme-control/plugin/build/withThemeControl";
import type wwdrewExpoAndroidAccountManager from "@wwdrew/expo-android-account-manager/plugin/build/index";
import type wwdrewExpoSpotifySdk from "@wwdrew/expo-spotify-sdk/plugin/build/index"; // @ts-expect-error
import type xmartlabsReactNativeLine from "@xmartlabs/react-native-line/plugin/withLineSDK";
import type expoAlternateAppIcons from "expo-alternate-app-icons/plugin/build/index";
import type expoAppleAuthentication from "expo-apple-authentication/plugin/build/withAppleAuth"; // @ts-expect-error
import type expoAsset from "expo-asset/plugin/build/withAssets";
import type expoAudio from "expo-audio/plugin/build/withAudio";
import type expoAv from "expo-av/plugin/build/withAV";
import type expoBackgroundFetch from "expo-background-fetch/plugin/build/withBackgroundFetch";
import type expoBackgroundTask from "expo-background-task/plugin/build/withBackgroundTask";
import type expoBrightness from "expo-brightness/plugin/build/withBrightness";
import type expoBuildProperties from "expo-build-properties/build/withBuildProperties";
import type expoCalendar from "expo-calendar/plugin/build/withCalendar";
import type expoCamera from "expo-camera/plugin/build/withCamera";
import type expoCellular from "expo-cellular/plugin/build/withCellular";
import type expoContacts from "expo-contacts/plugin/build/withContacts";
import type expoCustomAssets from "expo-custom-assets/build/index";
import type expoDevClient from "expo-dev-client/plugin/build/withDevClient";
import type expoDocumentPicker from "expo-document-picker/plugin/build/withDocumentPicker";
import type expoDynamicAppIcon from "expo-dynamic-app-icon/plugin/build/withDynamicIcon";
import type expoFileSystem from "expo-file-system/plugin/build/withFileSystem"; // @ts-expect-error
import type expoFont from "expo-font/plugin/build/withFonts";
import type expoHealthConnect from "expo-health-connect/build/withHealthConnect";
import type expoIap from "expo-iap/plugin/build/withIAP";
import type expoImagePicker from "expo-image-picker/plugin/build/withImagePicker";
import type expoLibvlcPlayer from "expo-libvlc-player/plugin/build/withExpoLibVlcPlayer";
import type expoLiveActivity from "expo-live-activity/plugin/build/index";
import type expoLocalAuthentication from "expo-local-authentication/plugin/build/withLocalAuthentication";
import type expoLocalization from "expo-localization/plugin/build/withExpoLocalization";
import type expoLocation from "expo-location/plugin/build/withLocation";
import type expoMailComposer from "expo-mail-composer/plugin/build/withMailComposer";
import type expoMaps from "expo-maps/plugin/build/withMapsLocation";
import type expoMediaLibrary from "expo-media-library/plugin/build/withMediaLibrary"; // @ts-expect-error
import type expoMusicPicker from "expo-music-picker/app.plugin"; // @ts-expect-error
import type expoNativeAlipay from "expo-native-alipay/app.plugin";
import type expoNavigationBar from "expo-navigation-bar/plugin/build/withNavigationBar";
import type expoNotifications from "expo-notifications/plugin/build/withNotifications";
import type expoPip from "expo-pip/plugin/build/index";
import type expoQuickActions from "expo-quick-actions/plugin/build/index"; // @ts-expect-error
import type expoRoomplan from "expo-roomplan/app.plugin";
import type expoRouter from "expo-router/plugin/build/index";
import type expoScreenOrientation from "expo-screen-orientation/plugin/build/withScreenOrientation";
import type expoSecureStore from "expo-secure-store/plugin/build/withSecureStore";
import type expoSensors from "expo-sensors/plugin/build/withSensors";
import type expoShareExtension from "expo-share-extension/plugin/build/index";
import type expoShareIntent from "expo-share-intent/plugin/build/index";
import type expoShazamkit from "expo-shazamkit/plugin/build/withShazamKit"; // @ts-expect-error
import type expoSpeechRecognition from "expo-speech-recognition/app.plugin";
import type expoSplashScreen from "expo-splash-screen/plugin/build/withSplashScreen"; // @ts-expect-error
import type expoSqlite from "expo-sqlite/plugin/build/withSQLite"; // @ts-expect-error
import type expoSuperwall from "expo-superwall/plugin/build/index";
import type expoSystemUi from "expo-system-ui/plugin/build/withSystemUI";
import type expoTaskManager from "expo-task-manager/plugin/build/withTaskManager";
import type expoTrackingTransparency from "expo-tracking-transparency/plugin/build/withTrackingTransparency";
import type expoUpdates from "expo-updates/plugin/build/withUpdates";
import type expoVideo from "expo-video/plugin/build/withExpoVideo";
import type expoWebBrowser from "expo-web-browser/plugin/build/withWebBrowser";
import type freeraspReactNative from "freerasp-react-native/plugin/build/index"; // @ts-expect-error
import type instabugReactnative from "instabug-reactnative/plugin/build/index";
import type newrelicReactNativeAgent from "newrelic-react-native-agent/plugin/build/index"; // @ts-expect-error
import type pushyExpoPlugin from "pushy-expo-plugin/app.plugin";
import type reactNativeAddCalendarEvent from "react-native-add-calendar-event/plugin/build/withAddCalendarEvent";
import type reactNativeAdmobNativeAds from "react-native-admob-native-ads/plugin/build/withAdmobNativeAds";
import type reactNativeAppClip from "react-native-app-clip/plugin/build/index"; // @ts-expect-error
import type reactNativeAppsflyer from "react-native-appsflyer/expo/withAppsFlyer";
import type reactNativeAudioApi from "react-native-audio-api/lib/typescript/plugin/withAudioAPI";
import type reactNativeAuth0 from "react-native-auth0/lib/typescript/plugin/withAuth0"; // @ts-expect-error
import type reactNativeAutoSkeleton from "react-native-auto-skeleton/src/expo-plugins/withAutoSkeleton";
import type reactNativeBackgroundFetch from "react-native-background-fetch/expo/plugin/build/index";
import type reactNativeBackgroundGeolocation from "react-native-background-geolocation/expo/plugin/build/index";
import type reactNativeBleManager from "react-native-ble-manager/plugin/build/withBLE";
import type reactNativeBlePlx from "react-native-ble-plx/plugin/build/withBLE"; // @ts-expect-error
import type reactNativeBootsplash from "react-native-bootsplash/app.plugin"; // @ts-expect-error
import type reactNativeBottomTabs from "react-native-bottom-tabs/lib/typescript/expo"; // @ts-expect-error
import type reactNativeCloudStore from "react-native-cloud-store/plugins/withCloud";
import type reactNativeCompressor from "react-native-compressor/lib/typescript/expo-plugin/compressor"; // @ts-expect-error
import type reactNativeCredentialsManager from "react-native-credentials-manager/app.plugin";
import type reactNativeDocumentScannerPlugin from "react-native-document-scanner-plugin/expo-plugin/build/withDocumentScanner";
import type reactNativeEdgeToEdge from "react-native-edge-to-edge/dist/typescript/expo"; // @ts-expect-error
import type reactNativeEmailLink from "react-native-email-link/plugin/withEmailLink"; // @ts-expect-error
import type reactNativeFastTflite from "react-native-fast-tflite/lib/typescript/expo-plugin/withFastTFLite";
import type reactNativeFbads from "react-native-fbads/plugin/build/withReactNativeFbads";
import type reactNativeFbsdkNext from "react-native-fbsdk-next/plugin/build/withFacebook"; // @ts-expect-error
import type reactNativeFullScreenNotificationIncomingCall from "react-native-full-screen-notification-incoming-call/lib/commonjs/expo";
import type reactNativeGoogleCast from "react-native-google-cast/lib/typescript/plugin/withGoogleCast";
import type reactNativeGoogleMobileAds from "react-native-google-mobile-ads/plugin/build/index"; // @ts-expect-error
import type reactNativeHealth from "react-native-health/app.plugin"; // @ts-expect-error
import type reactNativeHealthConnect from "react-native-health-connect/app.plugin";
import type reactNativeImageMarker from "react-native-image-marker/lib/typescript/expo-plugin/withImageMarker"; // @ts-expect-error
import type reactNativeKeys from "react-native-keys/plugin/build/index";
import type reactNativeLegal from "react-native-legal/plugin/build/index"; // @ts-expect-error
import type reactNativeLibsodium from "react-native-libsodium/app.plugin";
import type reactNativeLocalizationSettings from "react-native-localization-settings/plugin/build/index";
import type reactNativeLocalizeDate from "react-native-localize-date/plugin/build/withLocalizations"; // @ts-expect-error
import type reactNativeMapLink from "react-native-map-link/app.plugin"; // @ts-expect-error
import type reactNativeMaps from "react-native-maps/plugin/build/index";
import type reactNativeMsal from "react-native-msal/plugin/build/withReactNativeMSAL"; // @ts-expect-error
import type reactNativeNavigationMode from "react-native-navigation-mode/app.plugin"; // @ts-expect-error
import type reactNativeNfcManager from "react-native-nfc-manager/app.plugin";
import type reactNativeNitroScreenRecorder from "react-native-nitro-screen-recorder/plugin/build/index"; // @ts-expect-error
import type reactNativeOrientationDirector from "react-native-orientation-director/plugin/build/index";
import type reactNativeOtaHotUpdate from "react-native-ota-hot-update/plugin/build/index";
import type reactNativePermissions from "react-native-permissions/dist/typescript/expo";
import type reactNativeRateApp from "react-native-rate-app/lib/typescript/plugin/withReactNativeRateApp"; // @ts-expect-error
import type reactNativeRenderLynx from "react-native-render-lynx/plugin/withRenderLynx";
import type reactNativeScreenshotAware from "react-native-screenshot-aware/lib/typescript/plugin/withReactNativeScreenshotAware";
import type reactNativeShare from "react-native-share/plugin/build/index";
import type reactNativeTheoplayer from "react-native-theoplayer/lib/typescript/plugins/expo/withTHEOplayer"; // @ts-expect-error
import type reactNativeTiktok from "react-native-tiktok/plugin/build/withTiktok";
import type reactNativeTwilioVideoWebrtc from "react-native-twilio-video-webrtc/plugin/build/index";
import type reactNativeV8 from "react-native-v8/plugin/build/withV8ExpoAdapter";
import type reactNativeVideo from "react-native-video/lib/expo-plugins/withRNVideo";
import type reactNativeVisionCamera from "react-native-vision-camera/lib/typescript/expo-plugin/withVisionCamera"; // @ts-expect-error
import type reactNativeVlcMediaPlayer from "react-native-vlc-media-player/expo/withVlcMediaPlayer";
import type reactNativeWifiReborn from "react-native-wifi-reborn/plugin/dist/withWifi";

import type { ConfigPluginOptions } from "./types";

/*
This file is generated by a script that uses react-native-directory and looks for a app.plugin.js in each package
This is not perfect and may need some manual adjustments to work correctly
Its really imported that this is still exported in the final build output (to make module augmentation work)
 */
export interface ThirdPartyPlugins {
    "@appandflow/expo-camera-characteristics": ConfigPluginOptions<typeof appandflowExpoCameraCharacteristics>;
    "@bacons/apple-colors": ConfigPluginOptions<typeof baconsAppleColors>;
    "@bam.tech/react-native-batch": ConfigPluginOptions<typeof bamTechReactNativeBatch>;
    "@batch.com/react-native-plugin": ConfigPluginOptions<typeof batchComReactNativePlugin>;
    "@beyondidentity/bi-sdk-react-native": ConfigPluginOptions<typeof beyondidentityBiSdkReactNative>;
    "@bittingz/expo-widgets": ConfigPluginOptions<typeof bittingzExpoWidgets>;
    "@bravemobile/react-native-code-push": ConfigPluginOptions<typeof bravemobileReactNativeCodePush>;
    "@braze/expo-plugin": ConfigPluginOptions<typeof brazeExpoPlugin>;
    "@config-plugins/react-native-blob-util": ConfigPluginOptions<typeof configPluginsReactNativeBlobUtil>;
    "@config-plugins/react-native-pdf": ConfigPluginOptions<typeof configPluginsReactNativePdf>;
    "@corasan/image-compressor": ConfigPluginOptions<typeof corasanImageCompressor>;
    "@fishjam-cloud/react-native-client": ConfigPluginOptions<typeof fishjamCloudReactNativeClient>;
    "@giphy/react-native-sdk": ConfigPluginOptions<typeof giphyReactNativeSdk>;
    "@hot-updater/react-native": ConfigPluginOptions<typeof hotUpdaterReactNative>;
    "@intercom/intercom-react-native": ConfigPluginOptions<typeof intercomIntercomReactNative>;
    "@iterable/expo-plugin": ConfigPluginOptions<typeof iterableExpoPlugin>;
    "@kingstinct/react-native-activity-kit": ConfigPluginOptions<typeof kingstinctReactNativeActivityKit>;
    "@kingstinct/react-native-healthkit": ConfigPluginOptions<typeof kingstinctReactNativeHealthkit>;
    "@maplibre/maplibre-react-native": ConfigPluginOptions<typeof maplibreMaplibreReactNative>;
    "@prisma/react-native": ConfigPluginOptions<typeof prismaReactNative>;
    "@react-native-community/datetimepicker": ConfigPluginOptions<typeof reactNativeCommunityDatetimepicker>;
    "@react-native-firebase/app": ConfigPluginOptions<typeof reactNativeFirebaseApp>;
    "@react-native-firebase/app-check": ConfigPluginOptions<typeof reactNativeFirebaseAppCheck>;
    "@react-native-firebase/app-distribution": ConfigPluginOptions<typeof reactNativeFirebaseAppDistribution>;
    "@react-native-firebase/auth": ConfigPluginOptions<typeof reactNativeFirebaseAuth>;
    "@react-native-firebase/crashlytics": ConfigPluginOptions<typeof reactNativeFirebaseCrashlytics>;
    "@react-native-firebase/messaging": ConfigPluginOptions<typeof reactNativeFirebaseMessaging>;
    "@react-native-firebase/perf": ConfigPluginOptions<typeof reactNativeFirebasePerf>;
    "@react-native-google-signin/google-signin": ConfigPluginOptions<typeof reactNativeGoogleSigninGoogleSignin>;
    "@react-native-seoul/naver-login": ConfigPluginOptions<typeof reactNativeSeoulNaverLogin>;
    "@react-native-voice/voice": ConfigPluginOptions<typeof reactNativeVoiceVoice>;
    "@reactvision/react-viro": ConfigPluginOptions<typeof reactvisionReactViro>;
    "@rnmapbox/maps": ConfigPluginOptions<typeof rnmapboxMaps>;
    "@sentry/react-native": ConfigPluginOptions<typeof sentryReactNative>;
    "@sentry/react-native/expo": ConfigPluginOptions<typeof sentryReactNative>; // Alias
    "@stripe/stripe-react-native": ConfigPluginOptions<typeof stripeStripeReactNative>;
    "@vonovak/react-native-theme-control": ConfigPluginOptions<typeof vonovakReactNativeThemeControl>;
    "@wwdrew/expo-android-account-manager": ConfigPluginOptions<typeof wwdrewExpoAndroidAccountManager>;
    "@wwdrew/expo-spotify-sdk": ConfigPluginOptions<typeof wwdrewExpoSpotifySdk>;
    "@xmartlabs/react-native-line": ConfigPluginOptions<typeof xmartlabsReactNativeLine>;
    "expo-alternate-app-icons": ConfigPluginOptions<typeof expoAlternateAppIcons>;
    "expo-apple-authentication": ConfigPluginOptions<typeof expoAppleAuthentication>;
    "expo-asset": ConfigPluginOptions<typeof expoAsset>;
    "expo-audio": ConfigPluginOptions<typeof expoAudio>;
    "expo-av": ConfigPluginOptions<typeof expoAv>;
    "expo-background-fetch": ConfigPluginOptions<typeof expoBackgroundFetch>;
    "expo-background-task": ConfigPluginOptions<typeof expoBackgroundTask>;
    "expo-brightness": ConfigPluginOptions<typeof expoBrightness>;
    "expo-build-properties": ConfigPluginOptions<typeof expoBuildProperties>;
    "expo-calendar": ConfigPluginOptions<typeof expoCalendar>;
    "expo-camera": ConfigPluginOptions<typeof expoCamera>;
    "expo-cellular": ConfigPluginOptions<typeof expoCellular>;
    "expo-contacts": ConfigPluginOptions<typeof expoContacts>;
    "expo-custom-assets": ConfigPluginOptions<typeof expoCustomAssets>;
    "expo-dev-client": ConfigPluginOptions<typeof expoDevClient>;
    "expo-document-picker": ConfigPluginOptions<typeof expoDocumentPicker>;
    "expo-dynamic-app-icon": ConfigPluginOptions<typeof expoDynamicAppIcon>;
    "expo-file-system": ConfigPluginOptions<typeof expoFileSystem>;
    "expo-font": ConfigPluginOptions<typeof expoFont>;
    "expo-health-connect": ConfigPluginOptions<typeof expoHealthConnect>;
    "expo-iap": ConfigPluginOptions<typeof expoIap>;
    "expo-image-picker": ConfigPluginOptions<typeof expoImagePicker>;
    "expo-libvlc-player": ConfigPluginOptions<typeof expoLibvlcPlayer>;
    "expo-live-activity": ConfigPluginOptions<typeof expoLiveActivity>;
    "expo-local-authentication": ConfigPluginOptions<typeof expoLocalAuthentication>;
    "expo-localization": ConfigPluginOptions<typeof expoLocalization>;
    "expo-location": ConfigPluginOptions<typeof expoLocation>;
    "expo-mail-composer": ConfigPluginOptions<typeof expoMailComposer>;
    "expo-maps": ConfigPluginOptions<typeof expoMaps>;
    "expo-media-library": ConfigPluginOptions<typeof expoMediaLibrary>;
    "expo-music-picker": ConfigPluginOptions<typeof expoMusicPicker>;
    "expo-native-alipay": ConfigPluginOptions<typeof expoNativeAlipay>;
    "expo-navigation-bar": ConfigPluginOptions<typeof expoNavigationBar>;
    "expo-notifications": ConfigPluginOptions<typeof expoNotifications>;
    "expo-pip": ConfigPluginOptions<typeof expoPip>;
    "expo-quick-actions": ConfigPluginOptions<typeof expoQuickActions>;
    "expo-roomplan": ConfigPluginOptions<typeof expoRoomplan>;
    "expo-router": ConfigPluginOptions<typeof expoRouter>;
    "expo-screen-orientation": ConfigPluginOptions<typeof expoScreenOrientation>;
    "expo-secure-store": ConfigPluginOptions<typeof expoSecureStore>;
    "expo-sensors": ConfigPluginOptions<typeof expoSensors>;
    "expo-share-extension": ConfigPluginOptions<typeof expoShareExtension>;
    "expo-share-intent": ConfigPluginOptions<typeof expoShareIntent>;
    "expo-shazamkit": ConfigPluginOptions<typeof expoShazamkit>;
    "expo-speech-recognition": ConfigPluginOptions<typeof expoSpeechRecognition>;
    "expo-splash-screen": ConfigPluginOptions<typeof expoSplashScreen>;
    "expo-sqlite": ConfigPluginOptions<typeof expoSqlite>;
    "expo-superwall": ConfigPluginOptions<typeof expoSuperwall>;
    "expo-system-ui": ConfigPluginOptions<typeof expoSystemUi>;
    "expo-task-manager": ConfigPluginOptions<typeof expoTaskManager>;
    "expo-tracking-transparency": ConfigPluginOptions<typeof expoTrackingTransparency>;
    "expo-updates": ConfigPluginOptions<typeof expoUpdates>;
    "expo-video": ConfigPluginOptions<typeof expoVideo>;
    "expo-web-browser": ConfigPluginOptions<typeof expoWebBrowser>;
    "freerasp-react-native": ConfigPluginOptions<typeof freeraspReactNative>;
    "instabug-reactnative": ConfigPluginOptions<typeof instabugReactnative>;
    "newrelic-react-native-agent": ConfigPluginOptions<typeof newrelicReactNativeAgent>;
    "pushy-expo-plugin": ConfigPluginOptions<typeof pushyExpoPlugin>;
    "react-native-add-calendar-event": ConfigPluginOptions<typeof reactNativeAddCalendarEvent>;
    "react-native-admob-native-ads": ConfigPluginOptions<typeof reactNativeAdmobNativeAds>;
    "react-native-app-clip": ConfigPluginOptions<typeof reactNativeAppClip>;
    "react-native-appsflyer": ConfigPluginOptions<typeof reactNativeAppsflyer>;
    "react-native-audio-api": ConfigPluginOptions<typeof reactNativeAudioApi>;
    "react-native-auth0": ConfigPluginOptions<typeof reactNativeAuth0>;
    "react-native-auto-skeleton": ConfigPluginOptions<typeof reactNativeAutoSkeleton>;
    "react-native-background-fetch": ConfigPluginOptions<typeof reactNativeBackgroundFetch>;
    "react-native-background-geolocation": ConfigPluginOptions<typeof reactNativeBackgroundGeolocation>;
    "react-native-ble-manager": ConfigPluginOptions<typeof reactNativeBleManager>;
    "react-native-ble-plx": ConfigPluginOptions<typeof reactNativeBlePlx>;
    "react-native-bootsplash": ConfigPluginOptions<typeof reactNativeBootsplash>;
    "react-native-bottom-tabs": ConfigPluginOptions<typeof reactNativeBottomTabs>;
    "react-native-cloud-store": ConfigPluginOptions<typeof reactNativeCloudStore>;
    "react-native-compressor": ConfigPluginOptions<typeof reactNativeCompressor>;
    "react-native-credentials-manager": ConfigPluginOptions<typeof reactNativeCredentialsManager>;
    "react-native-document-scanner-plugin": ConfigPluginOptions<typeof reactNativeDocumentScannerPlugin>;
    "react-native-edge-to-edge": ConfigPluginOptions<typeof reactNativeEdgeToEdge>;
    "react-native-email-link": ConfigPluginOptions<typeof reactNativeEmailLink>;
    "react-native-fast-tflite": ConfigPluginOptions<typeof reactNativeFastTflite>;
    "react-native-fbads": ConfigPluginOptions<typeof reactNativeFbads>;
    "react-native-fbsdk-next": ConfigPluginOptions<typeof reactNativeFbsdkNext>;
    "react-native-full-screen-notification-incoming-call": ConfigPluginOptions<
        typeof reactNativeFullScreenNotificationIncomingCall
    >;
    "react-native-google-cast": ConfigPluginOptions<typeof reactNativeGoogleCast>;
    "react-native-google-mobile-ads": ConfigPluginOptions<typeof reactNativeGoogleMobileAds>;
    "react-native-health": ConfigPluginOptions<typeof reactNativeHealth>;
    "react-native-health-connect": ConfigPluginOptions<typeof reactNativeHealthConnect>;
    "react-native-image-marker": ConfigPluginOptions<typeof reactNativeImageMarker>;
    "react-native-keys": ConfigPluginOptions<typeof reactNativeKeys>;
    "react-native-legal": ConfigPluginOptions<typeof reactNativeLegal>;
    "react-native-libsodium": ConfigPluginOptions<typeof reactNativeLibsodium>;
    "react-native-localization-settings": ConfigPluginOptions<typeof reactNativeLocalizationSettings>;
    "react-native-localize-date": ConfigPluginOptions<typeof reactNativeLocalizeDate>;
    "react-native-map-link": ConfigPluginOptions<typeof reactNativeMapLink>;
    "react-native-maps": ConfigPluginOptions<typeof reactNativeMaps>;
    "react-native-msal": ConfigPluginOptions<typeof reactNativeMsal>;
    "react-native-navigation-mode": ConfigPluginOptions<typeof reactNativeNavigationMode>;
    "react-native-nfc-manager": ConfigPluginOptions<typeof reactNativeNfcManager>;
    "react-native-nitro-screen-recorder": ConfigPluginOptions<typeof reactNativeNitroScreenRecorder>;
    "react-native-orientation-director": ConfigPluginOptions<typeof reactNativeOrientationDirector>;
    "react-native-ota-hot-update": ConfigPluginOptions<typeof reactNativeOtaHotUpdate>;
    "react-native-permissions": ConfigPluginOptions<typeof reactNativePermissions>;
    "react-native-rate-app": ConfigPluginOptions<typeof reactNativeRateApp>;
    "react-native-render-lynx": ConfigPluginOptions<typeof reactNativeRenderLynx>;
    "react-native-screenshot-aware": ConfigPluginOptions<typeof reactNativeScreenshotAware>;
    "react-native-share": ConfigPluginOptions<typeof reactNativeShare>;
    "react-native-theoplayer": ConfigPluginOptions<typeof reactNativeTheoplayer>;
    "react-native-tiktok": ConfigPluginOptions<typeof reactNativeTiktok>;
    "react-native-twilio-video-webrtc": ConfigPluginOptions<typeof reactNativeTwilioVideoWebrtc>;
    "react-native-v8": ConfigPluginOptions<typeof reactNativeV8>;
    "react-native-video": ConfigPluginOptions<typeof reactNativeVideo>;
    "react-native-vision-camera": ConfigPluginOptions<typeof reactNativeVisionCamera>;
    "react-native-vlc-media-player": ConfigPluginOptions<typeof reactNativeVlcMediaPlayer>;
    "react-native-wifi-reborn": ConfigPluginOptions<typeof reactNativeWifiReborn>;
}

interface FuncOptionMap extends ThirdPartyPlugins {}

export function plugin<Name extends keyof FuncOptionMap>(name: Name): [Name];

export function plugin<Name extends keyof FuncOptionMap, Options extends FuncOptionMap[Name]>(
    name: Name,
    options?: Options,
): [Name, Options];

export function plugin<Name extends keyof FuncOptionMap, Options extends FuncOptionMap[Name]>(
    name: Name,
    options?: Options,
) {
    return options ? [name, options] : [name];
}

export type { ConfigPluginOptions } from "./types";
