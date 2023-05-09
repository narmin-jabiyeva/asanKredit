import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import React, {useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckBox} from '@rneui/themed';
import Btn from '../../components/common/Btn';
import Input from '../../components/common/Input';
import {validateEmail} from '../../utils/functions';
import {AuthContext} from '../../context/AuthContext';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const {setToken} = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const goToRegister = () => {
    navigation.navigate('Registration');
  };

  const inputHandler = (value, name) => {
    value = value.trim();
    setUser({
      ...user,
      [name]: value,
    });

    if (name === 'email') {
      if (validateEmail(value) || value == '') {
        setErrors({
          ...errors,
          email: '',
        });
      } else {
        setErrors({
          ...errors,
          email: 'Düzgün email daxil edin',
        });
      }
    }
  };

  const submit = () => {
    setloading(true);
    let err = errors;

    if (!validateEmail(user.email) || user.email == '')
      err.email = 'Düzgün email daxil edin';
    else err.email = '';

    if (user.password == '') err.password = 'Parol daxil edin';
    else err.password = '';

    setErrors({...err});

    if (!err.email && !err.password) {
      auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          setToken({
            name: user.name,
            email: user.email,
            QRLink: user.email,
          });
          setloading(false);
          navigation.navigate('HomeTabs');
        })
        .catch(error => {
          setloading(false);
          console.log('error', error);
          if (error.code === 'auth/user-not-found') {
            Toast.show({
              text1: 'İstifadəçi tapılmadı!',
            });
          }
          if (error.code === 'auth/wrong-password') {
            Toast.show({
              text1: 'Şifrə yanlışdır!',
            });
          }
          if (error.code === 'auth/too-many-requests') {
            Toast.show({
              text1:
                'Bir çox uğursuz giriş cəhdləri səbəbindən bu hesaba giriş müvəqqəti olaraq deaktiv edilib',
            });
          }
          if (error.code === 'auth/network-request-failed') {
            Toast.show({
              text1: 'Şəbəkə xətası baş verdi, yenidən cəhd edin',
            });
          }
        });
    } else {
      setloading(false);
    }
  };

  const submitWithFaceId = async () => {
    setloading(true);
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
    const {available, biometryType} = await rnBiometrics.isSensorAvailable();
    let metric = Platform.OS === 'android' ? 'Biometrics' : 'FaceID';

    if (!available || biometryType !== BiometryTypes[metric]) {
      Alert.alert('Oops!', 'Face ID is not available on this device.');
      setloading(false);
      return;
    }

    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      Alert.alert(
        'Oops!',
        'You have to sign in using your credentials first to enable Face ID.',
      );
      setloading(false);
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const payload = `${userId}__${timestamp}`;

    const {success, signature} = await rnBiometrics.createSignature({
      promptMessage: 'Sign in',
      payload,
    });

    if (!success) {
      Alert.alert(
        'Oops!',
        'Something went wrong during authentication with Face ID. Please try again.',
      );
      setloading(false);
      return;
    }
    setloading(false);
    navigation.navigate('HomeTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
      <View style={styles.flexContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.header}>Xoş Gəlmişsiniz</Text>

          <Input
            label={'Email'}
            icon={<Icon name="mail" size={20} color="#222222" />}
            placeholder={'Email ünvanınız'}
            onChangeText={v => inputHandler(v, 'email')}
          />
          <Text style={styles.errorTxt}>{errors.email}</Text>

          <Input
            label={'Şifrəniz'}
            icon={<MaterialIcon name="key" size={20} color="#222222" />}
            placeholder={'Şifrənizi daxil edin'}
            onChangeText={v => inputHandler(v, 'password')}
            password={true}
          />
          <Text style={styles.errorTxt}>{errors.password}</Text>

          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <CheckBox
              checked={checked}
              onPress={toggleCheckbox}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={'checkbox-blank-outline'}
              title="Məni xatırla"
              containerStyle={{backgroundColor: '#F8F9FB', marginLeft: -10}}
              checkedColor="#757575"
              uncheckedColor="#757575"
              textStyle={{color: '#757575', fontSize: 14, fontWeight: '400'}}
            />
            <Text style={styles.passwordText}>Sifrəni Unutdun?</Text>
          </View>

          <View style={[styles.row, {justifyContent: 'center'}]}>
            <Text style={styles.txt}>Hesabınız yoxdur?</Text>
            <TouchableOpacity style={styles.singInWrap} onPress={goToRegister}>
              <Text style={[styles.txt, styles.singIn]}>Yeni hesab yarat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Btn title="DAXIL OL" onPress={submit} loading={loading} />
      <Btn title="USE FACE ID" onPress={submitWithFaceId} loading={loading} />
      </ScrollView>  
        </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 50,
    flex: 1,
    justifyContent:'center'
  },
  header: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
  },
  wrapper: {
    width: '80%',
  },
  flexContainer: {
    backgroundColor: '#F8F9FB',
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
  errorTxt: {
    color: 'red',
    fontSize: 10,
    height: 12,
    marginBottom: 5,
  },
});
