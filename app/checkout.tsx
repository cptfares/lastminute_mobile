import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createPurchase, updateProduct } from './service/service';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

type PaymentMethod = 'card' | 'crypto' | null;

export default function CheckoutScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const { user, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const params = useLocalSearchParams();

  const item = {
    id: params.id,
    name: params.title || 'Product',
    price: parseFloat(params.price) || 0,
    sellerId: params.sellerId,
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      showToast('Warning: Pick a payment method.', 'warning');
      return;
    }

    try {
      // Create transaction
      const transaction = createPurchase({
        buyerId: user._id,
        sellerId: item.sellerId,
        productId: item.id,
        amount: item.price,
        currency: 'LST',
        status: 'completed',
        paymentMethod: paymentMethod === 'card' ? 'credit_card' : 'crypto',
        deliveryStatus: 'pending',
      });

      // Update product status to "sold"
      updateProduct(item.id, { status: 'sold' });

      // Navigate to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Order placement failed:', error);
      showToast('error please try again ', 'warning');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
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
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentOptionIcon}>
              <Ionicons name="card" size={24} color="#6366f1" />
            </View>
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Credit Card</Text>
              <Text style={styles.paymentOptionDescription}>
                Pay with Visa, Mastercard, etc.
              </Text>
            </View>
            <View
              style={[
                styles.paymentOptionCheck,
                paymentMethod === 'card' && styles.paymentOptionCheckSelected,
              ]}
            >
              <Ionicons
                name="checkmark"
                size={16}
                color={paymentMethod === 'card' ? '#fff' : 'transparent'}
              />
            </View>
          </TouchableOpacity>

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
              <Text style={styles.paymentOptionTitle}>Cryptocurrency</Text>
              <Text style={styles.paymentOptionDescription}>Pay with LST</Text>
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
            <Text style={styles.summaryValue}>LST {item.price} </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Cost</Text>
            <Text style={styles.summaryValue}>LST 0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>LST0.00</Text>
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
            !paymentMethod && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={!paymentMethod}
        >
          <Text style={styles.placeOrderButtonText}>LST {item.price}</Text>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
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
    justifyContent: 'space-between',
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
