import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type OrderStatus = {
  status: string;
  date: string;
  completed: boolean;
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const orderStatuses: OrderStatus[] = [
    { status: 'Order Placed', date: '28 May', completed: true },
    { status: 'Order Confirmed', date: '28 May', completed: true },
    { status: 'Shipped', date: '28 May', completed: true },
    { status: 'Delivered', date: '28 May', completed: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{id}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {orderStatuses.map((status, index) => (
            <View key={status.status} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    status.completed && styles.timelineDotCompleted,
                  ]}
                >
                  {status.completed && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                {index < orderStatuses.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      status.completed && styles.timelineLineCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>{status.status}</Text>
                <Text style={styles.timelineDate}>{status.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsContainer}>
            <View style={styles.itemRow}>
              <Text style={styles.itemCount}>4 Items</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping details</Text>
          <View style={styles.shippingDetails}>
            <Text style={styles.address}>
              2715 Ash Dr. San Jose, South Dakota 83475
            </Text>
            <Text style={styles.phone}>101-234-7890</Text>
          </View>
        </View>
      </ScrollView>
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
  timeline: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotCompleted: {
    backgroundColor: '#6366f1',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#6366f1',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  itemsContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewAllText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  shippingDetails: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  address: {
    fontSize: 14,
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    color: '#6b7280',
  },
});
