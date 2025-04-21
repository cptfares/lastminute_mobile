import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { useAuth } from '../context/AuthContext';
import { getProductByUserID } from '../service/service';
import Product from '../entities/product';
import { useToast } from '../context/ToastContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(userProducts)

  useEffect(() => {
    if (user?._id) {
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    try {
      const products = await getProductByUserID(user._id);
      setUserProducts(products);
    } catch (err) {
      console.error('Error fetching user products:', err);
      setError('Failed to load your products');
      // Set sample data as fallback
      setUserProducts(userProducts);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.replace('/login');
    return null;
  }

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return `$${price.toFixed(2)}`;
  };

  // Sample data as fallback if API fails
  

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.userName}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.location}>Tunis, Tunisia</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings-outline" size={18} color="#6b7280" />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= 4 ? 'star' : 'star-outline'}
                size={24}
                color="#6366f1"
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/sell')}>
              <Text style={styles.sectionAction}>+ Add New</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading your products...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : userProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>
                You haven't listed any products yet
              </Text>
              <TouchableOpacity
                style={styles.sellButton}
                onPress={() => router.push('/(tabs)/sell')}
              >
                <Text style={styles.sellButtonText}>Sell Something</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {userProducts.products.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={styles.productCard}
                  onPress={() => {
                    router.push(`/product/${product._id}`);
                    showToast(`Viewing ${product.title}`, 'info');
                  }}
                >
                  <Image
                    source={{
                      uri:
                        product.images[0] ||
                        'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&auto=format&fit=crop&q=60',
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {product.title}
                    </Text>
                    <Text style={styles.productPrice}>
                      {formatPrice(product.price, product.currency)}
                    </Text>
                    <View style={styles.productStatus}>
                      <View
                        style={[
                          styles.statusDot,
                          product.status === 'available'
                            ? styles.statusAvailable
                            : product.status === 'sold'
                            ? styles.statusSold
                            : styles.statusCancelled,
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {product.status === 'available'
                          ? 'Available'
                          : product.status === 'sold'
                          ? 'Sold'
                          : 'Cancelled'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{user.age}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await signOut();
              router.replace('/login');
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    marginLeft: 4,
    color: '#6b7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    gap: 6,
  },
  settingsButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    color: '#6366f1',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: 8,
    color: '#ef4444',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  sellButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sellButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 4,
  },
  productStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusAvailable: {
    backgroundColor: '#10b981',
  },
  statusSold: {
    backgroundColor: '#6366f1',
  },
  statusCancelled: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    color: '#111827',
  },
  logoutSection: {
    padding: 24,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
