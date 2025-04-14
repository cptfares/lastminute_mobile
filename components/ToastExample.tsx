import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useToast } from '../app/context/ToastContext';

export default function ToastExample() {
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toast Examples</Text>

      <TouchableOpacity
        style={[styles.button, styles.successButton]}
        onPress={() =>
          showToast('Operation completed successfully!', 'success')
        }
      >
        <Text style={styles.buttonText}>Show Success Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.errorButton]}
        onPress={() =>
          showToast('An error occurred. Please try again.', 'error')
        }
      >
        <Text style={styles.buttonText}>Show Error Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.warningButton]}
        onPress={() =>
          showToast('Warning: This action cannot be undone.', 'warning')
        }
      >
        <Text style={styles.buttonText}>Show Warning Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.infoButton]}
        onPress={() => showToast('Here is some useful information.', 'info')}
      >
        <Text style={styles.buttonText}>Show Info Toast</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  errorButton: {
    backgroundColor: '#ef4444',
  },
  warningButton: {
    backgroundColor: '#f59e0b',
  },
  infoButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
