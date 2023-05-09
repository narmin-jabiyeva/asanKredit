import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

const Input = ({
  value,
  label,
  icon,
  placeholder,
  onChangeText,
  password = false,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={'rgba(0, 0, 0, 0.38)'}
          onChangeText={onChangeText}
          secureTextEntry={password}
          value={value}
        />
      </View>
    </View>
  );
};

export default Input;
const styles = StyleSheet.create({
  inputWrapper: {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 1,
    borderRadius: 5,

    position: 'relative',
    marginBottom: 5,
    marginTop: 25,
    ...Platform.select({
      ios: {
        padding: 15,
      },
      android: {
        alignItems: 'center',
        paddingHorizontal: 15,
      },
    }),
  },
  label: {
    position: 'absolute',
    backgroundColor: '#F8F9FB',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 5,
    top: -14,
    left: 10,
  },
  input: {
    width: '90%',
    ...Platform.select({
      ios: {
        fontSize: 16,
        marginLeft: 10,
      },
      android: {
        fontSize: 16,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
