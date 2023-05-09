import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Btn from '../../components/common/Btn';
import Input from '../../components/common/Input';
import {validateEmail, validatePassword} from '../../utils/functions';
import {CheckBox} from '@rneui/themed';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {AuthContext} from '../../context/AuthContext';

const RegistrationScreen = ({navigation, route}) => {
  const [checked, setChecked] = React.useState(false);
  const [loading, setloading] = useState(false);
  const {setToken} = useContext(AuthContext);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    passwordRepeat: '',
    password: '',
  });
  
  const [passwordErrors, setPasswordErrors] = useState({
    passwordLength: {
      text: 'Şifrənin uzunluğu 8-dən az və 16-dan çox olmamalıdır',
      isFixed: false,
    },
    letter: {text: 'a-dan z-ə və A-dan z-ə hərflər', isFixed: false},
    simvols: {text: 'Icazə verilən simvollar _!', isFixed: false},
    required: {
      text: 'Ən azı bir böyük hərf, bir rəqəm və bir xüsusi simvol olmalıdır',
      isFixed: false,
    },
  });

  const getBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
    let metric = Platform.OS === 'android'? 'Biometrics':'FaceID'
    const {available, biometryType} = await rnBiometrics.isSensorAvailable();
    console.log(BiometryTypes);
    if (available && biometryType === BiometryTypes[metric]) {
      const {publicKey} = await rnBiometrics.createKeys();
      await AsyncStorage.setItem('userId', '12345');
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
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
    if (name === 'password') {
      let errors = validatePassword(passwordErrors,value);
      setPasswordErrors(errors.errors);
      if(user.passwordRepeat.trim()){
      if (value === user.passwordRepeat.trim()) {
        setErrors({
          ...errors,
          passwordRepeat: '',
        });
      } else {
        setErrors({
          ...errors,
          passwordRepeat: 'Şifrələr eyni olmalıdır',
        });
      }}
    }
    if (name === 'passwordRepeat') {
      if (value === user.password) {
        setErrors({
          ...errors,
          passwordRepeat: '',
        });
      } else {
        setErrors({
          ...errors,
          passwordRepeat: 'Şifrələr eyni olmalıdır',
        });
      }
    }
  };

  const register = user => {
    setloading(true);
    auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        setloading(false);
        setToken({
          name: user.name,
          email: user.email,
          QRLink: 'https://www.youtube.com/', //`Users/cubics/Desktop/test/asanKredit/qr-link.html$${user.name}$${user.email}`,
          password: user.password,
        });
        console.log(user);
        if (user.faceId) {
          getBiometrics();
        }
        setUser({
          name: '',
          email: '',
          password: '',
          passwordRepeat: '',
        });

        navigation.navigate('OTP');
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Toast.show({
            text1: 'Email artıq mövcuddur',
          });
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Toast.show({
            text1: 'That email address is invalid!',
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
        setloading(false);
      });
  };

  const submit = () => {
    let err = errors;
    if (user.name == '') err.name = 'Ad və soyadı daxil edin';
    else err.name = '';

    if (!validateEmail(user.email) || user.email == '')
      err.email = 'Düzgün email daxil edin';
    else err.email = '';

    if (user.password == '' && !validatePassword(passwordErrors,user.password).validated)
      err.password = 'Parol daxil edin';
    else err.password = '';

    if (user.passwordRepeat == '' || user.passwordRepeat !== user.password)
      err.passwordRepeat = 'Şifrələr eyni olmalıdır';
    else err.passwordRepeat = '';
    setErrors({...err});
    if (!err.name && !err.email && !err.password && !err.passwordRepeat) {
      user.faceId = checked;
      register(user);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.flexContainer}>
          <View style={styles.wrapper}>
            <Text style={styles.header}>Yeni Hesabın Qeydiyyatı</Text>
            <Input
              label={'Şəxsi məlumat'}
              icon={<Icon name="mail" size={20} color="#222222" />}
              placeholder={'Ad və soyad'}
              onChangeText={v => inputHandler(v, 'name')}
              value={user.name}
            />
            <Text style={styles.errorTxt}>{errors.name}</Text>
            <Input
              label={'Email'}
              icon={<Icon name="mail" size={20} color="#222222" />}
              placeholder={'Email ünvanınız'}
              onChangeText={v => inputHandler(v, 'email')}
              value={user.email}
            />
            <Text style={styles.errorTxt}>{errors.email}</Text>

            <Input
              label={'Şifrəniz'}
              icon={<MaterialIcon name="key" size={20} color="#222222" />}
              placeholder={'Yeni şifrə'}
              onChangeText={v => inputHandler(v, 'password')}
              password={true}
              value={user.password}
            />
            <Text style={styles.errorTxt}>{errors.password}</Text>
            <Text
              style={[
                styles.errorTxt,
                {
                  color: passwordErrors.passwordLength.isFixed
                    ? 'green'
                    : 'red',
                },
              ]}>
              {passwordErrors.passwordLength.text}
            </Text>
            <Text
              style={[
                styles.errorTxt,
                {color: passwordErrors.letter.isFixed ? 'green' : 'red'},
              ]}>
              {passwordErrors.letter.text}
            </Text>
            <Text
              style={[
                styles.errorTxt,
                {color: passwordErrors.simvols.isFixed ? 'green' : 'red'},
              ]}>
              {passwordErrors.simvols.text}
            </Text>
            <Text
              style={[
                styles.errorTxt,
                {color: passwordErrors.required.isFixed ? 'green' : 'red'},
              ]}>
              {passwordErrors.required.text}
            </Text>

            <Input
              label={'Təkrar şifrə'}
              icon={<MaterialIcon name="key" size={20} color="#222222" />}
              placeholder={'Şifrənin təkrarı'}
              onChangeText={v => inputHandler(v, 'passwordRepeat')}
              password={true}
              value={user.passwordRepeat}
            />
            <Text style={styles.errorTxt}>{errors.passwordRepeat}</Text>

            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <CheckBox
                checked={checked}
                onPress={() => setChecked(!checked)}
                iconType="material-community"
                checkedIcon="checkbox-outline"
                uncheckedIcon={'checkbox-blank-outline'}
                title="Face id istifadə et"
                containerStyle={{backgroundColor: '#F8F9FB', marginLeft: -10}}
                checkedColor="#757575"
                uncheckedColor="#757575"
                textStyle={{color: '#757575', fontSize: 14, fontWeight: '400'}}
              />
            </View>

            <View style={[styles.row, {justifyContent: 'center'}]}>
              <Text style={styles.txt}>Hesabınız mövcüddur?</Text>
              <TouchableOpacity style={styles.singInWrap} onPress={goToLogin}>
                <Text style={[styles.txt, styles.singIn]}>
                  Hesabınıza daxil olun
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Btn title="QEYDİYYAT" onPress={submit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 50,
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
  inputWrapper: {
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: 'relative',
    marginVertical: 15,
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
    paddingVertical: 10,
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
