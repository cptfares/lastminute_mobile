import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { getProductByID, getPurchasesByUser } from '../service/service';
import {Product} from '../entities/product';
import {Transaction} from '../entities/transactions';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import Header from '../../components/Header';


export default function OrdersScreen() {
  const { showToast } = useToast();

    const [transactions, setTransactions] = useState<(Transaction & { product: { product: Product | null } })[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<(Transaction & { product: { product: Product | null } }) | null>(null);


  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingOrderDetails, setViewingOrderDetails] = useState(false);
  const {token } = useAuth();
  
  let decodedToken = null;
  let userId = null;
  
  
  if (token) {
    try {
      console.log('Token available, attempting to decode...');
      decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      userId = decodedToken?.userId || decodedToken?.id;
      console.log('Extracted User ID:', userId);

      if (!userId) {
        console.warn('No userId found in decoded token:', decodedToken);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  } else {
    console.warn('No token available to decode.');
  }





  const fetchTransactionsWithProducts = async (userId) => {
    try {
      console.log('Starting to fetch transactions for user:', userId);
      setIsLoading(true);
      setError(null);
  
      // Fetch all transactions for the user
      const fetchedTransactions = await getPurchasesByUser(userId);
      console.log('Fetched transactions:', fetchedTransactions);
  
      if (!fetchedTransactions || fetchedTransactions.length === 0) {
        setTransactions([]); // No transactions found
        return;
      }
  
      console.log('Starting to fetch products for each transaction...');
      // Map the populated product data to our expected format
      const updatedTransactions = fetchedTransactions.map(transaction => {
        // Check if productId is populated with full product data
        const productData = typeof transaction.productId === 'object' && transaction.productId !== null
          ? transaction.productId as unknown as Product
          : null;

        return {
          ...transaction,
          product: { product: productData }
        };
      });
      console.log('Mapped transactions with products:', updatedTransactions);
      console.log('All products fetched. Updated transactions:', updatedTransactions);
  
      setTransactions(updatedTransactions);
      console.log("All transactions summary:", updatedTransactions.map(t => ({
        id: t._id,
        productTitle: t.product?.product?.title,
        amount: t.amount,
        date: t.createdAt
      })));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    console.log('Orders Screen mounted, userId:', userId);
    if (userId) {
      console.log('Calling fetchTransactionsWithProducts with userId:', userId);
      fetchTransactionsWithProducts(userId);
    } else {
      console.log('No userId available');
    }
  }, [userId]); 
  
  
// Log detailed order information when transactions change
useEffect(() => {
  if (transactions.length > 0) {
    console.log('=== Current Orders ===');
    transactions.forEach((transaction) => {
      const product = transaction.product?.product;
      console.log(`Order ID: ${transaction._id}`);
      console.log(`Product: ${product?.title || 'N/A'}`);
      console.log(`Amount: $${transaction.amount}`);
      console.log(`Purchase Date: ${formatDate(transaction.createdAt)}`);
      if (product?.images?.length) {
        console.log(`Product Images: ${product.images.join(', ')}`);
      }
      if (product?.metadata) {
        console.log('Product Metadata:', product.metadata);
      }
      console.log('------------------------');
    });
  }
}, [transactions]);


  

  const handleDownload = (contentType: string) => {

    showToast(`Downloading ${contentType}...`, 'success');

    setTimeout(() => {
      showToast(`${contentType} downloaded successfully!`, 'success');
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price: number, currency: string) => {
    return `$${price.toFixed(2)}`;
  };

  const getEventDate = (transaction: Transaction & { product: { product: Product } }) => {
    if (
      transaction?.product.product &&
      transaction.product.product.metadata &&
      transaction.product.product.metadata.concertTicket 
    ) {
      return formatDate(transaction.product.product.metadata.concertTicket.eventDate);
    }
    return 'Date not specified';
  };

  const openSupport = () => {
    showToast('Opening support chat...', 'info');
  };

  const goBackToOrdersList = () => {
    setViewingOrderDetails(false);
    showToast('Returning to orders list', 'info');

  };

  const renderOrdersList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!transactions || transactions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.ordersList}>
        {transactions.map((transaction) => (
          <TouchableOpacity
            key={transaction._id}
            style={styles.orderListItem}
            onPress={() => {
              if (transaction.product.product) {
                setSelectedTransaction(transaction as Transaction & { product: { product: Product } });
                setViewingOrderDetails(true);
              } else {
                console.warn('Cannot view details - product data is missing');
              }
            }}
          >
            <Image
              source={{
                uri:
                  transaction.product.product?.images?.[0] || 'https://via.placeholder.com/60'
              }}
              style={styles.orderListItemImage}
            />
            <View style={styles.orderListItemInfo}>
              <Text style={styles.orderListItemTitle}>
                {transaction.product.product?.title || 'Product Title'}
              </Text>
              <Text style={styles.orderListItemPrice}>
                {formatPrice(transaction.amount, transaction.currency)}
              </Text>
              <View style={styles.orderListItemMeta}>
                <Text style={styles.orderListItemDate}>
                  {formatDate(transaction.createdAt)}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: transaction.deliveryStatus === 'delivered' ? '#ecfdf5' : '#fff7ed'
                }]}>
                  <Text style={[styles.statusBadgeText, {
                    color: transaction.deliveryStatus === 'delivered' ? '#10b981' : '#f97316'
                  }]}>
                    {transaction.deliveryStatus.charAt(0).toUpperCase() + transaction.deliveryStatus.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.orderListItemMeta}>
                <Text style={styles.orderListItemDate}>
                  Payment: {transaction.paymentMethod}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: transaction.status === 'completed' ? '#ecfdf5' : '#fff7ed'
                }]}>
                  <Text style={[styles.statusBadgeText, {
                    color: transaction.status === 'completed' ? '#10b981' : '#f97316'
                  }]}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

    if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={40} color="#ef4444" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsLoading(true)} // This would trigger a re-fetch
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!viewingOrderDetails) {
    return (
      <>
        <Header />
        {renderOrdersList()}
      </>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Header />

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToOrdersList}
        >
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity onPress={openSupport}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#6366f1"
          />
        </TouchableOpacity>
      </View>

      {selectedTransaction && (
        <>
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{selectedTransaction?.deliveryStatus}</Text>
              </View>
                <Text style={styles.orderDate}>
                  Purchased on {formatDate(selectedTransaction?.createdAt)}
                </Text>
            </View>

            <View style={styles.productContainer}>
              <Image
                source={{ uri: selectedTransaction?.product?.product?.images?.[0] || 'https://via.placeholder.com/60' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{selectedTransaction.product.product?.title || 'N/A'}</Text>
                <Text style={styles.productPrice}>
                  {formatPrice(selectedTransaction.amount, selectedTransaction.currency)}
                </Text>
                <View style={styles.orderIdContainer}>
                  <Text style={styles.orderIdLabel}>Order ID:</Text>
                  <Text style={styles.orderId}>
                    ORD-{selectedTransaction._id}-{Date.now().toString().slice(-6)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Event Details</Text>

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Event Date</Text>
                  <Text style={styles.detailValue}>
                    {selectedTransaction.product.product?.metadata?.concertTicket?.eventDate ? 
                      formatDate(new Date(selectedTransaction.product.product.metadata.concertTicket.eventDate).toISOString()) : 
                      'N/A'
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="location-outline" size={20} color="#6366f1" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Access Type</Text>
                  <Text style={styles.detailValue}>
                    {selectedTransaction.product.product.metadata?.concertTicket || 'Digital Access'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#6366f1"
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Active</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.downloadSection}>
              <Text style={styles.sectionTitle}>Digital Content</Text>
              <Text style={styles.downloadDescription}>
                Download your digital content below. These files contain
                everything you need to access your purchase.
              </Text>

              <TouchableOpacity
                style={styles.downloadCard}
                onPress={() => handleDownload('Access Pass')}
              >
                <View style={styles.downloadIconContainer}>
                  <Ionicons name="ticket-outline" size={24} color="#6366f1" />
                </View>
                <View style={styles.downloadInfo}>
                  <Text style={styles.downloadTitle}>Digital Access Pass</Text>
                  <Text style={styles.downloadMeta}>PDF • 2.4 MB</Text>
                </View>
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color="#6366f1"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadCard}
                onPress={() => handleDownload('Event Guide')}
              >
                <View style={styles.downloadIconContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#6366f1"
                  />
                </View>
                <View style={styles.downloadInfo}>
                  <Text style={styles.downloadTitle}>Event Guide</Text>
                  <Text style={styles.downloadMeta}>PDF • 5.7 MB</Text>
                </View>
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color="#6366f1"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadCard}
                onPress={() => handleDownload('Exclusive Content')}
              >
                <View style={styles.downloadIconContainer}>
                  <Ionicons name="videocam-outline" size={24} color="#6366f1" />
                </View>
                <View style={styles.downloadInfo}>
                  <Text style={styles.downloadTitle}>Exclusive Content</Text>
                  <Text style={styles.downloadMeta}>ZIP • 156 MB</Text>
                </View>
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color="#6366f1"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.supportSection}>
            <LinearGradient
              colors={['#f9fafb', '#e5e7eb']}
              style={styles.supportCard}
            >
              <View style={styles.supportIconContainer}>
                <Ionicons name="help-buoy-outline" size={24} color="#6366f1" />
              </View>
              <View style={styles.supportContent}>
                <Text style={styles.supportTitle}>
                  Need help with your order?
                </Text>
                <Text style={styles.supportText}>
                  Our support team is available 24/7 to assist you with any
                  questions.
                </Text>
                <TouchableOpacity
                  style={styles.supportButton}
                  onPress={openSupport}
                >
                  <Text style={styles.supportButtonText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => Linking.openURL('mailto:support@example.com')}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Email Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => showToast('Report issue submitted', 'info')}
            >
              <Ionicons name="flag-outline" size={20} color="#6366f1" />
              <Text style={styles.secondaryButtonText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  ordersList: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 0,
    backgroundColor: '#f9fafb',
    height: '100%', // Explicitly set height to 100% to take up the screen

  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ef4444',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderHeader: {
    marginBottom: 16,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  orderId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  downloadSection: {
    marginBottom: 8,
  },
  downloadDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  downloadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  downloadMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  supportSection: {
    marginBottom: 24,
  },
  supportCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  supportText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  // Order list styles
  orderListItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  orderListItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  orderListItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderListItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderListItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  orderListItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderListItemDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  orderListItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});