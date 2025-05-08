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
import { blockchainService } from '../service/blockchainService';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WalletScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadAmount, setLoadAmount] = useState('');

  useEffect(() => {
    if (user?.walletAddress && user?.privateKey) {
      connectWalletWithCredentials();
    }
  }, [user?.walletAddress, user?.privateKey]);

  const connectWalletWithCredentials = async () => {
    try {
      if (!user?.privateKey) return;
      
      await blockchainService.connectWallet(user.privateKey);
      await fetchBalance();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Error', 'Failed to connect wallet automatically. Please try again.');
    }
  };

  const fetchBalance = async () => {
    try {
      if (!user?.walletAddress) return;
      const lstBalance = await blockchainService.getBalance(user.walletAddress);
      setBalance(lstBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleLoadLST = async () => {
    try {
      setIsLoading(true);
      
      if (!loadAmount || isNaN(parseFloat(loadAmount))) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }

      if (!user?.privateKey || !user?.walletAddress) {
        Alert.alert('Error', 'Wallet not connected. Please log in again.');
        return;
      }

      const wallet = await blockchainService.connectWallet(user.privateKey);
      const success = await blockchainService.purchaseLST(wallet, parseFloat(loadAmount));

      if (success) {
        Alert.alert('Success', `Successfully loaded ${loadAmount} LST`);
        setShowLoadModal(false);
        setLoadAmount('');
        await fetchBalance(); // Refresh the balance
      } else {
        Alert.alert('Error', 'Failed to load LST. Please try again.');
      }
    } catch (error) {
      console.error('Error loading LST:', error);
      Alert.alert('Error', 'Failed to load LST: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>LST Balance</Text>
          {user?.walletAddress ? (
            <>
              <Text style={styles.balanceAmount}>{balance} LST</Text>
              <Text style={styles.walletAddress}>
                Wallet: {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowLoadModal(true)}
                  disabled={isLoading}
                >
                  <Ionicons name="add-circle" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>
                    {isLoading ? 'Processing...' : 'Buy LST'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="send" size={24} color="#fff" />
                  <Text style={styles.actionButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.connectingText}>Connecting wallet...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Buy LST Modal */}
      <Modal
        visible={showLoadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLoadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy LST Tokens</Text>
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
              keyboardType="numeric"
              placeholder="Enter amount"
            />

            <TouchableOpacity
              style={[styles.modalButton, isLoading && styles.modalButtonDisabled]}
              onPress={handleLoadLST}
              disabled={isLoading}
            >
              <Text style={styles.modalButtonText}>
                {isLoading ? 'Processing...' : 'Buy Tokens'}
              </Text>
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
  connectingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  connectingText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  connectButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  walletAddress: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
    marginTop: 8,
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
  modalButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
