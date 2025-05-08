import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getWalletInfo, addFunds, getTransactionHistory } from '../service/service';
import { WalletTransaction } from '../entities/wallet';

export default function WalletScreen() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadAmount, setLoadAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const walletInfo = await getWalletInfo(token);
      setBalance(walletInfo.balance);
      const history = await getTransactionHistory(10, token);
      setTransactions(history);
    } catch (error: any) {
      showToast('error', error.message || 'Error fetching wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleLoadLST = async () => {
    if (!loadAmount || parseFloat(loadAmount) <= 0) {
      showToast('error', 'Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      await addFunds(parseFloat(loadAmount), 'Deposit', token);
      await fetchWalletData();
      setShowLoadModal(false);
      setLoadAmount('');
      showToast('success', 'Funds added successfully');
    } catch (error: any) {
      showToast('error', error.message || 'Error adding funds');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !transactions.length) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    return type === 'sale' ? 'arrow-up-circle' : 'arrow-down-circle';
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>LST Balance</Text>
          <Text style={styles.balanceAmount}>{balance} LST</Text>
          <Text style={styles.fiatEquivalent}>≈ ${balance.toFixed(2)} USD</Text>

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
          {transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <View
                style={[
                  styles.transactionIcon,
                  transaction.type === 'credit'
                    ? styles.saleIcon
                    : styles.purchaseIcon,
                ]}
              >
                <Ionicons
                  name={transaction.type === 'credit' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionType}>
                  {transaction.type === 'credit' ? 'Deposit' : 'Withdrawal'}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={styles.lstAmount}>{transaction.amount} LST</Text>
                <Text style={styles.fiatAmount}>${transaction.amount.toFixed(2)}</Text>
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
