import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

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
            onPress={() => handleCategoryPress('events')}
          />
          <CategoryCard
            icon="card"
            title="Digital Gift Cards"
            onPress={() => handleCategoryPress('gift-cards')}
          />
          <CategoryCard
            icon="card"
            title="Digital Gift Cards"
            onPress={() => handleCategoryPress('gift-cards')}
          />
          <CategoryCard
            icon="repeat"
            title="Subscriptions & Services"
            onPress={() => handleCategoryPress('subscriptions')}
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
      </ScrollView>
    </View>
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
});
