import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import ToastExample from '../../components/ToastExample';
import { useToast } from '../context/ToastContext';
import { useEffect, useState } from 'react';
import { getAllProducts } from '../service/service';
import Product from '../entities/product';

function CategoryCard({
  icon,
  title,
  onPress,
  backgroundImage,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  backgroundImage: string;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.categoryCard}
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.categoryGradient}
        >
          <View style={styles.categoryIcon}>
            <Ionicons name={icon as any} size={24} color="#fff" />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

function ProductCard({
  image,
  title,
  price,
  onPress,
}: {
  image: string;
  title: string;
  price: string;
  onPress: () => void;
}) {
  const { showToast } = useToast();

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      onLongPress={() => showToast(`Added ${title} to favorites`, 'success')}
    >
      <Image source={{ uri: image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        console.log('Fetched products:', products);

        if (products && products.length > 0) {
          const shuffledProducts = [...products].sort(
            () => 0.5 - Math.random()
          );

          setRecommendedProducts(shuffledProducts.slice(0, 4));
          setTrendingProducts(shuffledProducts.slice(4, 6));

          console.log('Recommended:', shuffledProducts.slice(0, 4));
          console.log('Trending:', shuffledProducts.slice(4, 6));
        } else {
          console.warn('No products found.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (text: string) => {
    if (text.trim()) {
      router.push({
        pathname: '/search',
        params: { query: text.trim() },
      });
    }
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/search',
      params: { category },
    });
    showToast(`Browsing ${category} category`, 'info');
  };

  // Sample data as fallback if API fails
  const sampleRecommendedProducts = [
    {
      _id: '1',
      title: 'UFC 300 VIP Experience',
      price: 999.99,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1579882392185-ea7c6fd3a92a?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user1',
      type: 'concert_ticket' as any,
      description: 'VIP experience for UFC 300',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
    {
      _id: '2',
      title: 'PlayStation Plus 12-Month Subscription',
      price: 59.99,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user2',
      type: 'gaming_account' as any,
      description: '12-month PlayStation Plus subscription',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
    {
      _id: '3',
      title: 'Coachella 2025 Weekend Pass',
      price: 499.99,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user3',
      type: 'concert_ticket' as any,
      description: 'Weekend pass for Coachella 2025',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
    {
      _id: '4',
      title: 'Netflix Premium Annual Gift Card',
      price: 215.88,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user4',
      type: 'social_media_account' as any,
      description: 'Annual Netflix Premium subscription gift card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
  ];

  const sampleTrendingProducts = [
    {
      _id: '5',
      title: 'Music Festival Pass',
      price: 349.99,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user5',
      type: 'concert_ticket' as any,
      description: 'Pass for upcoming music festival',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
    {
      _id: '6',
      title: 'Gaming Gift Card',
      price: 99.99,
      currency: 'USD',
      images: [
        'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&auto=format&fit=crop&q=60',
      ],
      sellerId: 'user6',
      type: 'gaming_account' as any,
      description: 'Gift card for gaming platform',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'available' as any,
    },
  ];

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover Digital Assets</Text>
          <Text style={styles.heroSubtitle}>Buy and sell with confidence</Text>

          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={20} color="#6b7280" />
              <TextInput
                placeholder="Search assets"
                style={styles.searchInput}
                placeholderTextColor="#6b7280"
                returnKeyType="search"
                onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => showToast('Filters coming soon!', 'info')}
            >
              <Ionicons name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Explore Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          <CategoryCard
            icon="ticket"
            title="Event Tickets & Passes"
            onPress={() => handleCategoryPress('events')}
            backgroundImage="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            icon="card"
            title="Digital Gift Cards"
            onPress={() => handleCategoryPress('gift-cards')}
            backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            icon="repeat"
            title="Subscriptions & Services"
            onPress={() => handleCategoryPress('subscriptions')}
            backgroundImage="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=60"
          />
        </ScrollView>

        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Offers</Text>
            <TouchableOpacity
              onPress={() => showToast('View all featured offers', 'info')}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => {
              router.push('/product/1');
              showToast('Viewing exclusive offer', 'success');
            }}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Limited Time</Text>
                </View>
                <Text style={styles.featuredTitle}>Exclusive Offer! ⚡️</Text>
                <Text style={styles.featuredDescription}>
                  Get this document for just $10. Limited time only!
                </Text>
                <View style={styles.featuredCTA}>
                  <Text style={styles.featuredCTAText}>Get it now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You</Text>
            <TouchableOpacity
              onPress={() => showToast('View all recommended products', 'info')}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading recommendations...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedScroll}
              contentContainerStyle={styles.recommendedContent}
            >
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  image={
                    product.images[0] ||
                    'https://images.unsplash.com/photo-1579882392185-ea7c6fd3a92a?w=800&auto=format&fit=crop&q=60'
                  }
                  title={product.title}
                  price={formatPrice(product.price, product.currency)}
                  onPress={() => router.push(`/product/${product._id}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity
              onPress={() => showToast('View all trending items', 'info')}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading trending items...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.trendingGrid}>
              {trendingProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={styles.trendingItem}
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
                    style={styles.trendingImage}
                  />
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTitle}>{product.title}</Text>
                    <Text style={styles.trendingPrice}>
                      {formatPrice(product.price, product.currency)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Toast Example Component */}
        <ToastExample />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#6366f1',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: 40,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingRight: 8,
    gap: 12,
  },
  categoryCard: {
    width: 160,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
  },
  featuredGradient: {
    width: '100%',
    height: '100%',
  },
  featuredContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  featuredCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredCTAText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recommendedSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  recommendedScroll: {
    overflow: 'visible',
  },
  recommendedContent: {
    paddingRight: 16,
    gap: 16,
  },
  productCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  trendingSection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  trendingGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  trendingItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  trendingInfo: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },
  errorText: {
    marginLeft: 8,
    color: '#ef4444',
    fontSize: 14,
  },
});
