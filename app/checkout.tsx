import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { blockchainService } from './service/blockchainService';
import { updateProduct } from './service/service';
import { ethers } from 'ethers';

type PaymentMethod = 'crypto' | null;

export default function CheckoutScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const params = useLocalSearchParams();

  const item = {
    id: typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '',
    name: params.title || 'Product',
    price: typeof params.price === 'string' ? parseFloat(params.price) : 0,
    sellerId: typeof params.sellerId === 'string' ? params.sellerId : Array.isArray(params.sellerId) ? params.sellerId[0] : '',
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      showToast('Please select a payment method', 'warning');
      return;
    }

    if (!user?.walletAddress || !user?.privateKey) {
      showToast('Please connect your wallet first', 'error');
      router.push('/(tabs)/wallet');
      return;
    }

    try {
      setIsProcessing(true);

      // Get seller's wallet address from their user ID
      const sellerWallet = await blockchainService.getWalletAddress(item.sellerId);
      if (!sellerWallet) {
        throw new Error('Seller wallet not found');
      }

      // Connect user's wallet
      const wallet = await blockchainService.connectWallet(user.privateKey);
      
      // Check if user has sufficient balance
      const balance = await blockchainService.getBalance(user.walletAddress);
      if (parseFloat(balance) < item.price) {
        showToast('Insufficient LST balance', 'error');
        return;
      }

      // Transfer LST tokens
      const tx = await blockchainService.transfer(
        wallet,
        sellerWallet,
        item.price.toString()
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Update product status to sold
      await updateProduct(item.id, { status: 'sold' });

      showToast('Payment successful!', 'success');
      router.push('/order-success');
    } catch (error) {
      console.error('Payment failed:', error);
      showToast(error instanceof Error ? error.message : 'Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'crypto' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('crypto')}
          >
            <View style={styles.paymentOptionIcon}>
              <Ionicons name="logo-bitcoin" size={24} color="#6366f1" />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>LST Token</Text>
              <Text style={styles.paymentOptionDescription}>Pay with LastMinute Token</Text>
            </View>
            <View
              style={[
                styles.paymentOptionCheck,
                paymentMethod === 'crypto' && styles.paymentOptionCheckSelected,
              ]}
            >
              <Ionicons
                name="checkmark"
                size={16}
                color={paymentMethod === 'crypto' ? '#fff' : 'transparent'}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>LST {item.price}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>LST {item.price}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (!paymentMethod || isProcessing) && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={!paymentMethod || isProcessing}
        >
          <Text style={styles.placeOrderButtonText}>
            {isProcessing ? 'Processing...' : `Pay LST ${item.price}`}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionText: {
    color: '#6b7280',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionCheckSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  summary: {
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  placeOrderButton: {
    height: 56,
    backgroundColor: '#6366f1',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
