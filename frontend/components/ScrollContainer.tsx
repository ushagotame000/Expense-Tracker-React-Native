// components/ScrollContainer.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScrollContainerProps extends ViewProps {
  children: React.ReactNode;
  disableSafeArea?: boolean;
  contentContainerStyle?: object;
}

const ScrollContainer = ({
  children,
  style,
  contentContainerStyle,
  disableSafeArea = false,
  ...props
}: ScrollContainerProps) => {
  const Container = disableSafeArea ? View : SafeAreaView;
  
  return (
    <Container style={[styles.container, style]} {...props}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer, 
          contentContainerStyle
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set your default background color
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ScrollContainer;