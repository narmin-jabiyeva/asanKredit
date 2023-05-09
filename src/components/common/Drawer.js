import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useContext} from 'react';
import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {AuthContext} from '../../context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const SideMenu = ({children, onClose}) => {
  console.warn = () => {};

  const {token, profilePhoto} = useContext(AuthContext);

  const [data, setData] = useState([
    {
      id: 'c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Dil',
      icon: 'date-range',
    },
    {
      id: 'c605-48d3-a4f8-fbd91aa97f63',
      name: 'Ayarlar',
      icon: 'settings',
    },
    {
      id: 'c605-48d3-a4f8-fbd91aa97f64',
      name: 'Bildirişlər',
      icon: 'notifications',
    },
    {
      id: 'c605-48d3-a4f8-fbd91aa97f65',
      name: 'Çıxmaq',
      icon: 'arrow-forward',
    },
  ]);

  const renderItem = ({item, drag, isActive}) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onPress={item.onPress}
          onLongPress={drag}
          disabled={isActive}
          style={styles.item}>
          <Icon name={item.icon} size={30} color={'#191919'} />
          <Text style={styles.itemTxt}>{item.name}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };
  const Content = () => {
    return (
      <View style={styles.container}>
        <View style={{height: 1, backgroundColor: '#E6E9F0'}} />
        <View style={styles.row}>
          <Image
            resizeMode="cover"
            source={{uri: profilePhoto}}
            style={styles.image}
          />

          <View style={styles.texts}>
            <Text style={styles.txt}>Salam</Text>
            <Text style={styles.name}>{token?.email}</Text>
          </View>
        </View>
        <GestureHandlerRootView style={{width: '100%', height: '100%'}}>
          <DraggableFlatList
            data={data}
            onDragEnd={({data}) => setData(data)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            bounces={false}
          />
        </GestureHandlerRootView>
      </View>
    );
  };

  return (
    <Drawer
      side="left"
      type="overlay"
      tapToClose={false}
      openDrawerOffset={50}
      onClose={onClose}
      styles={{
        main: {backgroundColor: 'transparent'},
        drawer: {backgroundColor: '#fff'},
        drawerOverlay: {
          backgroundColor: 'transparent',
        },
        mainOverlay: {
          backgroundColor: 'transparent',
        },
      }}
      ref={ref => (_drawer = ref)}
      content={<Content />}>
      {children}
    </Drawer>
  );
};

export default SideMenu;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: 'center',
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
  itemTxt: {
    color: '#191919',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    // borderColor:'#000',
    // borderWidth: 2
  },
});
