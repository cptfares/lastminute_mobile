import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProductByID } from '../service/service';
import Product from '../entities/product';

export default function ProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log(id);
    const fetchProduct = async () => {
      try {
        const data = await getProductByID(id as string);
        console.log(data);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!product) return <Text style={styles.error}>Product not found</Text>;

  const total = product.price * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.title}</Text>
          <Text style={styles.productPrice}>
            {product.currency} {product.price.toFixed(2)}
          </Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={[
                  styles.quantityButton,
                  quantity === 1 && styles.quantityButtonDisabled,
                ]}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity === 1 ? '#9ca3af' : '#fff'}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={incrementQuantity}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => router.push('/cart')}
        >
          <Text style={styles.addToCartPrice}>
            {product.currency} {total.toFixed(2)}
          </Text>
          <Text style={styles.addToCartText}>Add to Bag</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  error: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'red' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: { padding: 8 },
  favoriteButton: { padding: 8 },
  content: { flex: 1 },
  productImage: { width: '100%', height: 300, backgroundColor: '#f3f4f6' },
  productInfo: { padding: 24 },
  productName: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  productPrice: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
  quantityContainer: { marginTop: 16 },
  quantityLabel: { fontSize: 16, fontWeight: '500', marginBottom: 12 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: { backgroundColor: '#e5e7eb' },
  quantityText: { fontSize: 18, fontWeight: '500' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  addToCartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  addToCartPrice: { color: '#fff', fontSize: 18, fontWeight: '600' },
  addToCartText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
