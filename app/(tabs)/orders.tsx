import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { useState } from 'react';

type OrderStatus =
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Returned'
  | 'Cancelled';

type Order = {
  id: string;
  orderNumber: string;
  items: number;
  status: OrderStatus;
};

const orders: Order[] = [
  { id: '1', orderNumber: '456765', items: 4, status: 'Processing' },
  { id: '2', orderNumber: '454569', items: 2, status: 'Shipped' },
  { id: '3', orderNumber: '454809', items: 1, status: 'Delivered' },
  { id: '4', orderNumber: '454810', items: 3, status: 'Processing' },
  { id: '5', orderNumber: '454811', items: 2, status: 'Cancelled' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>(
    'All'
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return '#6366f1'; // Indigo
      case 'Shipped':
        return '#10b981'; // Green
      case 'Delivered':
        return '#3b82f6'; // Blue
      case 'Returned':
        return '#f59e0b'; // Orange
      case 'Cancelled':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Default gray
    }
  };

  const filteredOrders =
    selectedStatus === 'All'
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  return (
    <View style={styles.container}>
      <Header />

      {/* Status Filter Section (Now Takes Less Space) */}
      <View style={styles.statusContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusScroll}
        >
          {[
            'All',
            'Processing',
            'Shipped',
            'Delivered',
            'Returned',
            'Cancelled',
          ].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status as OrderStatus | 'All')}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.statusButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  selectedStatus === status && styles.statusButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <View style={styles.content}>
        <ScrollView style={styles.ordersList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push(`/order/${order.orderNumber}`)}
              >
                <View
                  style={[
                    styles.orderIcon,
                    { backgroundColor: getStatusColor(order.status) + '20' },
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color={getStatusColor(order.status)}
                  />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>
                    Order #{order.orderNumber}
                  </Text>
                  <Text
                    style={[
                      styles.orderStatus,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status}
                  </Text>
                  <Text style={styles.orderItems}>{order.items} items</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noOrdersText}>No orders available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusContainer: {
    height: 40, // Smaller height to take less space
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statusScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#6366f1',
  },
  statusButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 12,
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 14,
    color: '#6b7280',
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
});
