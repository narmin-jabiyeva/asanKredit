import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';
import Btn from '../../components/common/Btn';
import {getRandomInt} from '../../utils/functions';
import {Overlay, LinearProgress, BottomSheet} from '@rneui/themed';
import {AuthContext} from '../../context/AuthContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ProfileScreen = ({}) => {
  const [loan, setLoan] = useState(getRandomInt());
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [askCamera, setAskCamera] = useState(false);

  const {token, setProfilePhoto, profilePhoto} = useContext(AuthContext);

  useEffect(() => {
    let subs = true;
    if (progress <= 1 && progress !== 0) {
      setTimeout(() => {
        if (subs) {
          setProgress(progress + 0.3);
        }
      }, 2000);
    }
    if (progress > 1) {
      setLoan(getRandomInt());
    }
    return () => {
      subs = false;
    };
  }, [progress]);

  const checkLimit = () => {
    setVisible(true);
    setProgress(0.1);
  };

  const closeModal = () => {
    setVisible(false);
    setProgress(0);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const launchCameraFunction = () => {
    let options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    if (Platform.OS === 'android') {
      requestCameraPermission().then(() => {
        launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response);
            alert('ImagePicker Error: ' + response.errorCode);
          } else {
            console.log('response', response);
            setProfilePhoto(response.assets[0].uri);
            setAskCamera(false);
          }
        });
      });
    } else {
      launchCamera(options, response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response);
          alert('ImagePicker Error: ' + response.errorCode);
          setAskCamera(false);
        } else {
          setAskCamera(false);
          setProfilePhoto(response.assets[0].uri);
        }
      })
    }
  };

  const launchGalery = () => {
    let options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        setAskCamera(false);
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        alert('ImagePicker Error: ' + response.errorCode);
      } else {
        setAskCamera(false);
        setProfilePhoto(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Overlay
        isVisible={visible}
        onBackdropPress={closeModal}
        overlayStyle={styles.modal}>
        <TouchableOpacity style={styles.close} onPress={closeModal}>
          <Icon name={'x'} size={30} color={'#191919'} />
        </TouchableOpacity>
        <Text style={styles.boldtext}>{progress > 1 ? loan : ''}</Text>
        <LinearProgress
          style={{marginTop: 10, height: 30, borderRadius: 7, marginBottom: 10}}
          value={progress}
          variant="determinate"
          color="#FF9800"
        />
        <Text style={styles.boldtext}> </Text>
      </Overlay>

      <BottomSheet
        modalProps={{}}
        isVisible={askCamera}
        onBackdropPress={() => setAskCamera(false)}>
        <View style={styles.bottomSheet}>
          <TouchableOpacity
            style={styles.sheetBtn}
            onPress={launchCameraFunction}>
            <Icon name={'camera'} size={60} color={'#191919'} />
            <Text style={styles.btnTxt}>Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetBtn} onPress={launchGalery}>
            <Icon name={'image'} size={60} color={'#191919'} />
            <Text style={styles.btnTxt}>Qalereya</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setAskCamera(true)}>
            <Image
              resizeMode="cover"
              source={{uri: profilePhoto ? profilePhoto : null}}
              style={styles.image}
            />
          </TouchableOpacity>

          <View style={styles.texts}>
            <Text style={styles.txt}>Salam</Text>
            <Text style={styles.name}>{token?.email}</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.boldtext}>Limitiniz</Text>
          <Text style={[styles.boldtext, {color: '#4CAF50'}]}>₼{loan}</Text>
          <View style={styles.qr}>
            <QRCode value={token?.email} size={240} />
          </View>
        </View>

        <Btn title="LİMİTİ YOXLA" onPress={checkLimit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    // paddingHorizontal: 15,
    // paddingVertical: 30,
    // alignItems:'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
  },

  image: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9E9E9E',
    width: '90%',
  },
  txt: {
    color: '#7E8B97',
    fontSize: 13,
  },
  name: {
    color: '#191919',
    fontSize: 20,
    fontWeight: 700,
  },
  texts: {
    paddingHorizontal: 15,
  },
  boldtext: {
    color: '#757575',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
    height: 30,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  qr: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  modal: {
    width: '80%',
    padding: 20,
    height: 300,
    justifyContent: 'center',
  },
  close: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  bottomSheet: {
    height: 150,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  sheetBtn: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    fontSize: 20,
  },
});




