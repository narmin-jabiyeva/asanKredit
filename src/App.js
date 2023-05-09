import React, {useState, useMemo} from 'react';
import {AuthContext} from './context/AuthContext';
import {
  StatusBar,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  );

  const toastConfig = {
    success: ({text1}) => (
      <View
        style={{
          backgroundColor: '#FF9800',
          width: '90%',
          margin: 30,
          padding: 15,
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 20,
            color: '#fff',
            fontFamily: 'Helvetica',
            fontWeight: '600',
          }}>
          {text1}
        </Text>
      </View>
    ),
  };

  const authContext = useMemo(() => {
    return {
      setToken(token) {
        setUserData(token);
      },
      token: userData,
      profilePhoto: profilePhoto,
      setProfilePhoto: photo => setProfilePhoto(photo),
    };
  });

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <SafeAreaView style={{flex: 1}}>
          <RootNavigation />
        </SafeAreaView>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </AuthContext.Provider>
  );
};

export default App;
