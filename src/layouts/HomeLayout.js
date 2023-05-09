import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState, useContext} from 'react';
import logo from '../assets/logo/asanLogo.png';
import Icon from 'react-native-vector-icons/Feather';
import SideMenu from '../components/common/Drawer';
import {AuthContext} from '../context/AuthContext';

const HomeLayout = ({children, navigation}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {profilePhoto} = useContext(AuthContext);

  const openDrawer = () => {
    if (drawerOpen === true) {
      _drawer.close();
    } else {
      _drawer.open();
    }
    setDrawerOpen(!drawerOpen);
  };
  
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Icon name={drawerOpen ? 'x' : 'menu'} size={40} color={'#191919'} />
        </TouchableOpacity>
        <Image resizeMode="contain" source={logo} style={styles.logo} />
        <Image
          resizeMode="cover"
          source={{uri: profilePhoto ? profilePhoto : null}}
          style={styles.profilePhoto}
        />
      </View>
      <SideMenu navigation={navigation} onClose={() => setDrawerOpen(false)}>
        {children}
      </SideMenu>
    </>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    height: 25,
    width: 120,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
