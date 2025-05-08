import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { addProduct } from '../service/service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Header from '../../components/Header';
import * as FileSystem from 'expo-file-system';

 
const categories = [
  { id: 'concert_ticket', name: 'Concert Tickets', icon: 'musical-notes' },
  { id: 'gaming_account', name: 'Gaming Accounts', icon: 'game-controller' },
  { id: 'social_media_account', name: 'Social Media', icon: 'logo-instagram' },
  {
    id: 'gift-card',
    name: 'Digital Gift Cards',
    icon: 'card',
  },
  {
    id: 'document',
    name: 'Photos and Documents',
    icon: 'document',
  },
];
 
export default function SellScreen() {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [digitalFiles, setDigitalFiles] = useState<
    Array<{ name: string; size: string; type: string; uri: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
 
 
  const uploadImageToCloudinary = async (imageUri: string, retries = 3): Promise<string | null> => {
    try {
      const fileName = imageUri.split('/').pop();
      const fileType = fileName?.split('.').pop();
  
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: `image/${fileType}`,
        name: fileName,
      } as any);
      formData.append('upload_preset', 'ADAAAAAAA');
  
      const response = await fetch('https://api.cloudinary.com/v1_1/dgficzevd/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error?.message || 'Unknown error'}`);
      }
  
      return data.secure_url;
    } catch (error) {
      console.error('Upload attempt error:', error);
      if (retries > 0) {
        console.log(`Retrying upload... ${retries} attempts remaining`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return uploadImageToCloudinary(imageUri, retries - 1);
      }
      throw new Error('Image upload failed after multiple attempts.');
    }
  };
  
 
 
 
 
 
 
 
 
 
  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          showToast('Uploading image...', 'info');
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'ADAAAAAAA');
  
          try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dgficzevd/image/upload', {
              method: 'POST',
              body: formData,
            });
  
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
            }
  
            const result = await res.json();
            setImages(prev => [...prev, result.secure_url]);
            showToast('Image uploaded successfully!', 'success');
          } catch (err) {
            console.error('Upload error:', err);
            if (err instanceof TypeError && err.message.includes('Network request failed')) {
              showToast('Network error. Please check your internet connection.', 'error');
            } else {
              showToast(err.message || 'Error uploading image', 'error');
            }
          }
        }
      };
      input.click();
    } else {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showToast('Permission to access media library is required!', 'error');
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
  
        if (!result.canceled && result.assets.length > 0) {
          const localUri = result.assets[0].uri;
          showToast('Uploading image...', 'info');
  
          try {
            const cloudinaryUrl = await uploadImageToCloudinary(localUri);
            setImages(prev => [...prev, cloudinaryUrl]);
            showToast('Image uploaded successfully!', 'success');
          } catch (error) {
            console.error('Cloudinary upload error:', error);
            showToast(error.message || 'Error uploading image', 'error');
          }
        }
      } catch (error) {
        console.error('Image picker error:', error);
        showToast('Error accessing image library', 'error');
      }
    }
  };
  
 
 
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/zip',
          'application/x-zip-compressed',
        ],
        copyToCacheDirectory: true,
      });
 
      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const file = result.assets[0];
        const fileSize = formatFileSize(file.size || 0);
        const fileType = getFileType(file.mimeType || '', file.name || '');
 
        setDigitalFiles([
          ...digitalFiles,
          {
            name: file.name || 'Unnamed file',
            size: fileSize,
            type: fileType,
            uri: file.uri,
          },
        ]);
 
        showToast('Digital content added successfully!', 'success');
      }
    } catch (error) {
      showToast('Error picking document', 'error');
      console.error('Error picking document:', error);
    }
  };
 
  const getFileType = (mimeType: string, fileName: string): string => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('zip')) return 'ZIP';
 
    // Fallback to extension if mime type is not specific enough
    const extension = fileName.split('.').pop()?.toUpperCase();
    if (extension) return extension;
 
    return 'File';
  };
 
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
 
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
 
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
 
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    showToast('Image removed', 'info');
  };
 
  const removeFile = (index: number) => {
    const newFiles = [...digitalFiles];
    newFiles.splice(index, 1);
    setDigitalFiles(newFiles);
    showToast('File removed', 'info');
  };
 
  const handleSubmit = async () => {
    if (!title || !price || !description || !category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
 
    if (images.length === 0) {
      showToast('Please add at least one image', 'error');
      return;
    }
 
    if (digitalFiles.length === 0) {
      showToast('Please add at least one digital file', 'error');
      return;
    }
 
    try {
      setIsSubmitting(true);
 
      // Simulate API call
      const newProduct = {
        sellerId: user._id, // ✅ Get user ID correctly
        type: category,
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: 1,
        currency: 'LST',
        images: images, // ✅ Cloudinary URLs
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'available',
      };
 
      try {
        const response = await addProduct(newProduct);
        console.log('Product added successfully:', response);
 
        router.push({
          pathname: '/product-share',
          params: { id: newProduct.sellerId },
        });
      } catch (error) {
        showToast(
          'Your digital product has been listed successfully!',
          'error'
        );
      }
    } finally {
      // Reset form
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImages([]);
      setDigitalFiles([]);
    }
 
    // Navigate to home
  };
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
            <Header />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sell Digital Product</Text>
        </View>
 
        <LinearGradient colors={['#f0f9ff', '#e0f2fe']} style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={24} color="#0284c7" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Selling Digital Products</Text>
            <Text style={styles.infoText}>
              List your digital items like tickets, accounts, or subscriptions.
              Add images and upload the digital files buyers will receive.
            </Text>
          </View>
        </LinearGradient>
 
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Product Details</Text>
 
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you selling?"
              value={title}
              onChangeText={setTitle}
            />
          </View>
 
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (LST)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
 
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your digital product in detail..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>
 
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={category === cat.id ? '#ffffff' : '#6366f1'}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat.id && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
 
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Product Images</Text>
          <Text style={styles.sectionDescription}>
            Add clear images of your digital product. For tickets, include event
            details.
          </Text>
 
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
 
            {images.length < 3 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={pickImage}
              >
                <Ionicons name="add" size={40} color="#6366f1" />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
 
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Digital Content</Text>
          <Text style={styles.sectionDescription}>
            Upload the digital files that buyers will receive after purchase
            (PDF, ZIP).
          </Text>
 
          <View style={styles.filesContainer}>
            {digitalFiles.map((file, index) => (
              <View key={index} style={styles.fileCard}>
                <View style={styles.fileIconContainer}>
                  <Ionicons
                    name={file.type === 'PDF' ? 'document-text' : 'archive'}
                    size={24}
                    color="#6366f1"
                  />
                </View>
                <View style={styles.fileInfo}>
                  <Text
                    style={styles.fileName}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {file.type} • {file.size}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeFileButton}
                  onPress={() => removeFile(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
 
            <TouchableOpacity
              style={styles.addFileButton}
              onPress={pickDocument}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#6366f1" />
              <Text style={styles.addFileText}>Upload Digital Content</Text>
            </TouchableOpacity>
          </View>
        </View>
 
        <View style={styles.termsContainer}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#6366f1" />
          <Text style={styles.termsText}>
            By listing this item, you agree to our Terms of Service and confirm
            this is a legitimate digital product.
          </Text>
        </View>
 
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Listing Product...</Text>
          ) : (
            <>
              <Ionicons name="pricetag-outline" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>List for Sale</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginLeft: 6,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  addImageText: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 4,
  },
  filesContainer: {
    gap: 12,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeFileButton: {
    padding: 6,
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  addFileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginLeft: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});