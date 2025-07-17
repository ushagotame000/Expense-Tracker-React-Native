import React, { ReactNode } from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle,
  StyleProp
} from 'react-native';

type ReusableModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  backdropOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  dismissable?: boolean;
};

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  backdropOpacity = 0.5,
  containerStyle,
  contentStyle,
  dismissable = true
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        activeOpacity={1}
        onPress={dismissable ? onClose : undefined}
      >
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity 
            activeOpacity={1}
            style={[styles.content, contentStyle]}
            onPress={(e) => e.stopPropagation()}
          >
            {children}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  }
});

export default ReusableModal;