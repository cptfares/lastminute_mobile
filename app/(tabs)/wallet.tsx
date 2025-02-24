import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

type Transaction = {
  id: string;
  type: 'sale' | 'purchase';
  productName: string;
  amount: string;
  lstAmount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

export default function WalletScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    '1D' | '1W' | '1M' | '1Y'
  >('1W');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadAmount, setLoadAmount] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      productName: 'Coachella Weekend Pass',
      amount: '$500.00',
      lstAmount: '500 LST',
      date: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      type: 'purchase',
      productName: 'Netflix Gift Card',
      amount: '$250.00',
      lstAmount: '250 LST',
      date: 'Yesterday',
      status: 'completed',
    },
    {
      id: '3',
      type: 'sale',
      productName: 'UFC 300 Ticket',
      amount: '$1000.00',
      lstAmount: '1000 LST',
      date: '3 days ago',
      status: 'completed',
    },
  ];

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLoadLST = () => {
    // Here you would handle the LST loading process
    console.log('Loading LST:', loadAmount);
    setShowLoadModal(false);
    setLoadAmount('');
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    return type === 'sale' ? 'arrow-up-circle' : 'arrow-down-circle';
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>LST Balance</Text>
          <Text style={styles.balanceAmount}>1,750 LST</Text>
          <Text style={styles.fiatEquivalent}>≈ $1,750.00 USD</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowLoadModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Load LST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="send" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>LST Activity</Text>
            <View style={styles.periodSelector}>
              {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.chart}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>
                LST Price Chart Coming Soon
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View
                style={[
                  styles.transactionIcon,
                  transaction.type === 'sale'
                    ? styles.saleIcon
                    : styles.purchaseIcon,
                ]}
              >
                <Ionicons
                  name={getTransactionIcon(transaction.type)}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.productName}
                </Text>
                <Text style={styles.transactionType}>
                  {transaction.type === 'sale' ? 'Sold' : 'Purchased'}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.lstAmount}>{transaction.lstAmount}</Text>
                <Text style={styles.fiatAmount}>{transaction.amount}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={isLoading}
          >
            <Text style={styles.loadMoreText}>
              {isLoading ? 'Loading...' : 'Load More'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLoadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLoadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Load LST</Text>
              <TouchableOpacity
                onPress={() => setShowLoadModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Amount (LST)</Text>
            <TextInput
              style={styles.modalInput}
              value={loadAmount}
              onChangeText={setLoadAmount}
              placeholder="Enter LST amount"
              keyboardType="numeric"
            />
            <Text style={styles.modalEquivalent}>
              ≈ ${parseFloat(loadAmount || '0').toFixed(2)} USD
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleLoadLST}
            >
              <Text style={styles.modalButtonText}>Load LST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  balanceCard: {
    backgroundColor: '#6366f1',
    padding: 24,
  },
  balanceLabel: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  fiatEquivalent: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  chartSection: {
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  periodButtonActive: {
    backgroundColor: '#6366f1',
  },
  periodButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  chart: {
    marginTop: 16,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  transactionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleIcon: {
    backgroundColor: '#10b981',
  },
  purchaseIcon: {
    backgroundColor: '#6366f1',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  lstAmount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fiatAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadMoreButton: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  modalEquivalent: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
