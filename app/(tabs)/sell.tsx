import { useState } from 'react';
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

type ProductType = 'ticket' | 'gift-card' | 'subscription';

export default function SellScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    quantity: '1',
  });
  const [imageUrl, setImageUrl] = useState('');

  const productTypes = [
    {
      id: 'ticket' as ProductType,
      title: 'Event Tickets & Passes',
      icon: 'ticket',
      description: 'Concert tickets, sports events, etc.',
    },
    {
      id: 'gift-card' as ProductType,
      title: 'Digital Gift Cards',
      icon: 'card',
      description: 'Amazon, Netflix, gaming cards, etc.',
    },
    {
      id: 'subscription' as ProductType,
      title: 'Subscriptions & Services',
      icon: 'repeat',
      description: 'Software licenses, memberships, etc.',
    },
  ];

  const handleSubmit = () => {
    // Here you would typically upload the data to your backend
    console.log('Submitting:', { ...formData, type: selectedType, imageUrl });
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>What are you selling?</Text>

        {!selectedType ? (
          <View style={styles.typeSelection}>
            {productTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.typeCard}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={styles.typeIcon}>
                  <Ionicons name={type.icon as any} size={24} color="#6366f1" />
                </View>
                <Text style={styles.typeTitle}>{type.title}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedType(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
              <Text style={styles.backButtonText}>Choose different type</Text>
            </TouchableOpacity>

            <View style={styles.imageUpload}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.uploadedImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload" size={32} color="#6366f1" />
                  <Text style={styles.uploadText}>Upload Image</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG up to 10MB</Text>
                </View>
              )}
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Choose File</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                placeholder="Enter product title"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(text) =>
                  setFormData({ ...formData, quantity: text })
                }
                placeholder="1"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                placeholder="Describe your product..."
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>List for Sale</Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  typeSelection: {
    gap: 16,
  },
  typeCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    gap: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  imageUpload: {
    alignItems: 'center',
    gap: 16,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  uploadPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
