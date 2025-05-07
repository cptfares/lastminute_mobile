import { Platform } from 'react-native';

export function getLocalIp(): string {
  // For Android emulator and physical devices
  if (Platform.OS === 'android') {
    return '192.168.51.185'; // Standard Android emulator localhost address
  }
  // For iOS simulator and physical devices
  return '192.168.51.185';
}

export default getLocalIp;