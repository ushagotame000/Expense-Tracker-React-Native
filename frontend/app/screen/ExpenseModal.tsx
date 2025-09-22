import ReusableModal from '@/components/ReusableModal';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

type ExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (expense: { description: string; amount: string }) => void;
};

const ExpenseModal: React.FC<ExpenseModalProps> = ({ visible, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    onSubmit({ description, amount });
    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <ReusableModal
      visible={visible}
      onClose={onClose}
      animationType="fade"
      backdropOpacity={0.7}
      contentStyle={styles.modalContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.modalTitle}>Add New Expense</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Dinner, Groceries, etc."
            placeholderTextColor="#a0aec0"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#a0aec0"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={!description || !amount}
          >
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ReusableModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 25,
    backgroundColor: '#f7fafc',
  },
  container: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#48bb78',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseModal;