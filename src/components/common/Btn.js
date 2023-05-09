import React from 'react';
import {Button} from '@rneui/themed';

export default function Btn({onPress, title, loading, size = 'small'}) {
  return (
    <Button
      onPress={onPress}
      loading={loading}
      title={title}
      containerStyle={{
        width: size == 'small' ? '80%' : '90%',
        marginVertical: 20,
      }}
      buttonStyle={{
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        borderRadius: 5,
      }}
      titleStyle={{
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
      }}
    />
  );
}
