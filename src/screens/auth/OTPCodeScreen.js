import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import React, {useState, Fragment} from 'react';
import Btn from '../../components/common/Btn';
import Toast from 'react-native-toast-message';

const OTPCodeScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setloading] = useState(false);

  const register = () => {
    setloading(true);
    if (value.trim() < 4) {
      Toast.show({
        text1: 'Kodu düzgün daxil edin',
      });
      setloading(false);
    } else {
      navigation.navigate('HomeTabs');
      setloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.header}>
            Şifrəni sizin email ünvanınıza göndərdik
          </Text>
        </View>

        <View style={styles.code}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={4}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Fragment key={index}>
                <Text
                  key={`value-${index}`}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </Fragment>
            )}
          />
        </View>

        <View style={[styles.row, {justifyContent: 'center'}]}>
          <Text style={styles.txt}>Şifrəniz göndərilmıdi?</Text>
          <View style={styles.singInWrap}>
            <Text style={[styles.txt, styles.singIn]}>Yenidən göndər</Text>
          </View>
        </View>
      </View>
      <Btn title="TƏSDİQLƏ" onPress={register} loading={loading} />
    </SafeAreaView>
  );
};

export default OTPCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
  },
  wrapper: {
    width: '70%',
  },
  flexContainer: {
    backgroundColor: 'gray',
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '400',
  },
  txt: {
    color: '#3949AB',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  singIn: {
    color: '#FF9800',
  },
  singInWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#FF9800',
    marginLeft: 15,
  },
  codeFieldRoot: {
    height: 50,
    marginTop: 40,
    marginBottom: 25,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  cell: {
    marginHorizontal: 8,
    height: 50,
    width: 50,
    lineHeight: 50 - 5,
    // ...Platform.select({web: {lineHeight: 65}}),
    fontSize: 20,
    textAlign: 'center',
    // borderRadius: 8,
    color: '#3949AB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 1,
    // overflow:'hidden'
  },
  root: {
    minHeight: 800,
    padding: 20,
  },
});
