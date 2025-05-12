module.exports = {
  expo: {
    name: "LastMinute Mobile",
    slug: "lastminute-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    platforms: ["ios", "android", "web"],
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/lastmin.png"
    },
    plugins: [
      "expo-router",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://back-end-6b5z.onrender.com/api"
    }
  }
}
