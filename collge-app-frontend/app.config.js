export default {
  "expo": {
    "name": "Collge",
    "slug": "collge",
    "version": "1.3.1",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "backgroundColor": "#010101",
    "scheme": "collge",
    "newArchEnabled": true,
    "userInterfaceStyle": "automatic",
    "notification": {
      "icon": "./assets/images/logo.png",
      "color": "#010101"
    },
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "splash": {
      "image": "./assets/images/logo.png",
      "resizeMode": "cover",
      "backgroundColor": "#010101"
    },
    "assetBundlePatterns": [
      "**/*",
      "assets/images/*",
      "assets/fonts/*"
    ],
    "ios": {
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Collge needs access to your camera so you can capture photos and videos to share with friends, create posts, and update your profile picture.",
        "NSMicrophoneUsageDescription": "Collge uses the microphone to record audio when you create videos, so you can share richer, more personal content.",
        "NSLocationWhenInUseUsageDescription": "Collge uses your location while the app is open to help you find people near you through the Nearby feature.",
        "CFBundleAllowMixedLocalizations": true,
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        },
      },
      "bundleIdentifier": "com.collge.collgeio",
      "config": {
        "usesPushNotifications": true
      },
      "runtimeVersion": {
        "policy": "appVersion"
      },
      "buildNumber": "12"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#010101"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.HIGH_SAMPLING_RATE_SENSORS"
      ],
      "package": "com.collge.collgeio",
      "googleServicesFile": "./google-services.json",
      "runtimeVersion": "1.3.6",
      "usesCleartextTraffic": true,
      "versionCode": 13
    },
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": [
      "expo-router",
      "expo-asset",
      [
        "expo-image-picker",
        {
          "photosPermission": "This allows Collge to share photos from your library and save photos to your camera roll.",
          "cameraPermission": "Collge needs access to your camera so you can capture photos and videos to share with friends, create posts, and update your profile."
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "This allows Collge to share photos from your library and save photos to your camera roll.",
          "savePhotosPermission": "This allows Collge to share photos from your library and save photos to your camera roll.",
          "isAccessMediaLocationEnabled": true
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Collge uses your location while the app is open to help you find people near you through the Nearby feature."
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Collge needs access to your camera so you can capture photos and videos to share with friends, create posts, and update your profile.",
          "microphonePermission": "Collge uses the microphone to record audio when you create videos, so you can share richer, more personal content.",
          "recordAudioAndroid": true
        }
      ],
      [
        "expo-av",
        {
          "microphonePermission": "Collge uses the microphone to record audio when you create videos, so you can share richer, more personal content."
        }
      ],
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": false,
          "supportsPictureInPicture": false
        }
      ],
      [
        "expo-updates", {
          "username": "collge-admin"
        }
      ],
      "expo-secure-store",
      "expo-font",
      "react-native-compressor"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "62bf1d67-d6fb-4492-a1d3-ae9f7e030dbf"
      }
    },
    "owner": "collge",
    "updates": {
      "url": "https://u.expo.dev/62bf1d67-d6fb-4492-a1d3-ae9f7e030dbf"
    }
  }
}