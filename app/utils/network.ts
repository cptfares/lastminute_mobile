import { NetworkInfo } from "react-native-network-info";

export function getLocalIp(): string {
  let ip = "localhost";

  // Attempt to get the local IP address
  NetworkInfo.getIPAddress().then((address) => {
    ip = address;
  });

  return ip;
}