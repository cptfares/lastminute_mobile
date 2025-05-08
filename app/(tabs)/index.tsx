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
import {Product} from '../entities/product';
import { useAuth } from '../context/AuthContext';
import FloatingChatButton from '@/components/FloatingChatButton';

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
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        console.log('Fetched products:', products);

        if (products && products.length > 0) {
          const availableProducts = products.filter(product => product.status !== 'sold');
          const shuffledProducts = [...availableProducts].sort(
            () => 0.5 - Math.random()
          );

          // Only show available products
          setRecommendedProducts(shuffledProducts.slice(0, 4));
          setTrendingProducts(shuffledProducts.slice(4, 6));
          
          // Log filtered products for debugging
          console.log('Available products:', availableProducts.length);
          console.log('Filtered out sold products:', products.length - availableProducts.length);

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
          <View style={{  }}>
        {/* Other components like header, products, etc. */}
    </View>

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
            onPress={() => handleCategoryPress('concert_ticket')}
            backgroundImage="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=60"
          />
          <CategoryCard
            icon="card"
            title="Digital Gift Cards"
            onPress={() => handleCategoryPress('gift-card')}
            backgroundImage="data:image/jpeg;base64,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JF+8TyF7W/Qz02nhy1RR8610lPVWTXn9NiQNVuOB15cJMVizMgpAB0FybAcSeEAh+3tviu33PDgtmIDuOAAOtv01gE52XTKoAeQmAZsAQBAEAQBAEAQBAEApeAVgCAIAgGsxmyQxLIcjniQLhvB14GAYK4t6RC1Bl6Enun8rn2T4N84BtKGJDacxxB4jzEyYwRPf7dCrjStWlV7yLYUnPcOpN1PutrbhrYcJjBS1Wmlbun9zlbbLxNOsMP2VRapOlMA3PiLaEePCayrjLqs/M51c9RTLlrcov5s6FsL7PW7Mti6hzkaIlrJ+Zrd4/oPGVpaGmXb7HqtFxXX0r+ZZzejSZcq/Z6oYEVnyX1BVb25jMDYedpB/DYp5TOsvxDZyOLis+SatU5DQDSdJI883kxcQwuAw7hHHkCLWDeB/t4zIKWpoMwCr5AD5AcfKAWcVtFKNMVKxykgd3mWtwA84BD8djsVtB+zp9ylfUDz948zx05TAJZu1uvTw63tdjxY8TAJMotAKwBAEAQBAEAQBAEAQBAEAQBAEAQC3WoqwKsAQeRgGmxGynp60jdR/DJIt/ptxXy1HhAGD2lrlINxxBFnHmo9oeKzILu0KRr0yKdXs2IsKigG1+QPSaTTawS0TjCalKOSzsnBtQQU87PY6s5vc29xfdH6zEItIk1FsbZc2EvRfvqZbteSFY8wBAI/tveKnQulMBqvlovS5H7QDQbG3dxOLq/ecU7c8qAkAA6W+UwDouzdmJRUKqgAdBAM+AIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIBh47ZyVR3hqODDQg9QRqIBp61KtRNzd15uo7w/Og0fzFjAL9DaCMOI/MNVPhf3T4GZBkwCxisWlMFnYKB1MAhm0d5auKZqGEBsGCs1mF+F9baC3PrpMA3m726apZ6nebj4A/XxgEupUgosIBcgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgFCIBq8XsdSS6MabniV5+DKdG9YBqMVsrE8AKZ8VZ6f/AEi4gGuXdGrUa9RgPK7fqfpAJRsrYtOgLKvrzPmYBtAIBWAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIBbSsCSOn+aSKF0ZycV2MtFySmBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAs1Wuco48z0H1kFknJ8kfqZXk81FC5SOA0Pkf+bfrNZx5OWS7bfRhF+WDBWZAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgFk0Bcm5BPQn9pB7BZbTa+pnJRqJIIznXqB9JiVMmmuZ/XH+hkuoLAC9/GTQWEkYPU2AgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAf/Z"
          />
          <CategoryCard
            icon="game-controller"
            title="gaming accounts"
            onPress={() => handleCategoryPress('gaming_account')}
            backgroundImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5tEGqNEC_FW04gJ-0vfD2oL7Sdc3v530eUA&s"
          />
                    <CategoryCard
            icon="logo-instagram"
            title="Social Media"
            onPress={() => handleCategoryPress('social_media_account')}
            backgroundImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo98YmZvCnLxgNysYwGvsVBQhL7Bu6Nudz8Lr3eaehRjFQLmYBgmpevCELJSxNktSpkBo&usqp=CAU"
          />
                    <CategoryCard
            icon="document"
            title="Photos and Documents"
            onPress={() => handleCategoryPress('document')}
            backgroundImage="https://www.shutterstock.com/image-photo/businessman-using-computer-document-management-600nw-2016196394.jpg"
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
              onPress={() =>       router.push({
                pathname: '/search',

              })}
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
              onPress={() => showToast('This feature is coming soon', 'info')}
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
