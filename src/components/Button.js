import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export function CustomButton({ 
  title, 
  onPress, 
  type = 'primary', 
  loading = false, 
  disabled = false 
}) {
  const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = type === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      style={[buttonStyle, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? 'white' : colors.primary} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

// src/components/common/Input.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export function CustomInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  ...props
}) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.gray}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: colors.text,
  },
});

// src/components/common/ScreenContainer.js
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';

export function ScreenContainer({ children, style }) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});