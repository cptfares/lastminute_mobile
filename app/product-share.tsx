import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

export default function ProductShareScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [copyAnimation] = useState(new Animated.Value(0));
  const [showCopied, setShowCopied] = useState(false);

  const productLink = `https://lastmin.app/product/${id}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product on LastMin: ${productLink}`,
        url: productLink, // iOS only
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(productLink);
    setShowCopied(true);
    Animated.sequence([
      Animated.timing(copyAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(copyAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopied(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#10b981" />
        </View>

        <Text style={styles.title}>Product Listed Successfully!</Text>
        <Text style={styles.subtitle}>
          Do you already have a buyer? Securely close the deal with them!
        </Text>

        <View style={styles.linkContainer}>
          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>
              {productLink}
            </Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Ionicons
                name={showCopied ? 'checkmark' : 'copy-outline'}
                size={24}
                color="#6366f1"
              />
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.copiedTooltip,
              {
                opacity: copyAnimation,
                transform: [
                  {
                    translateY: copyAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.copiedText}>Copied to clipboard!</Text>
          </Animated.View>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.shareText}>Share via</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={24} color="#fff" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareButton, styles.whatsappButton]}
              onPress={() => {
                const url = `whatsapp://send?text=${encodeURIComponent(
                  `Check out this product on LastMin: ${productLink}`
                )}`;
                router.push(url);
              }}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#fff" />
              <Text style={styles.shareButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  linkContainer: {
    width: '100%',
    marginBottom: 32,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
  },
  copiedTooltip: {
    position: 'absolute',
    bottom: -30,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
  },
  copiedText: {
    color: '#fff',
    fontSize: 14,
  },
  shareSection: {
    width: '100%',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  doneButton: {
    backgroundColor: '#6366f1',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
