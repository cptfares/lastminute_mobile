import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';

function CategoryCard({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={styles.categoryIcon}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );
}
const recommendedProducts = [
  {
    id: '1',
    title: 'UFC 300 VIP Experience',
    price: '$999.99',
    image:
      'https://images.unsplash.com/photo-1579882392185-ea7c6fd3a92a?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'PlayStation Plus 12-Month Subscription',
    price: '$59.99',
    image:
      'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'Coachella 2025 Weekend Pass',
    price: '$499.99',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    title: 'Netflix Premium Annual Gift Card',
    price: '$215.88',
    image:
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=60',
  },
];
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
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
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
  };

  return (
    <AuthProvider>
      <View style={styles.container}>
        <Header />

        <ScrollView style={styles.content}>
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
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <CategoryCard
              icon="ticket"
              title="Event Tickets & Passes"
              onPress={() => handleCategoryPress('concert_ticket')}
            />
            <CategoryCard
              icon="game-controller"
              title="gaming accounts"
              onPress={() => handleCategoryPress('gaming_account')}
            />
            <CategoryCard
              icon="card"
              title="gift cards "
              onPress={() => handleCategoryPress('gift_card')}
            />
            <CategoryCard
              icon="people"
              title="social media accounts "
              onPress={() => handleCategoryPress('social_media_account')}
            />
            <CategoryCard
              icon="document"
              title="Photos and Documents"
              onPress={() => handleCategoryPress('document')}
            />
          </ScrollView>

          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Offers</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => router.push('/product/1')}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Exclusive Offer! ⚡️</Text>
                <Text style={styles.featuredDescription}>
                  Get this document for just $10. Limited time only!
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>for you </Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => router.push('/product/1')}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Exclusive Offer! ⚡️</Text>
                <Text style={styles.featuredDescription}>
                  Get this document for just $10. Limited time only!
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.recommendedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>For You</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recommendedScroll}
              contentContainerStyle={styles.recommendedContent}
            >
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  onPress={() => router.push(`/product/${product.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 16,
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoryCard: {
    width: 120,
    height: 120,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'space-between',
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
    fontSize: 14,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 24,
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
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 16,
    height: 120,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  recommendedScroll: {
    marginHorizontal: -16,
  },
  recommendedContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
});
