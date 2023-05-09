import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import musicGallery from '../../assets/partners/mucisGallery.png';
import bakuElectronics from '../../assets/partners/bakuElectronics.png';
import kontaktHome from '../../assets/partners/kontaktHome.png';

const PARTNERS = [
  {
    logo: musicGallery,
    name: 'Music Gallery',
    maxAmount: 2000,
    loanTerm: 12,
    interest: 0,
  },
  {
    logo: bakuElectronics,
    name: 'Baku Elektronics',
    maxAmount: 3000,
    loanTerm: 12,
    interest: 2,
  },
  {
    logo: kontaktHome,
    name: 'Kontakt Home',
    maxAmount: 2000,
    loanTerm: 6,
    interest: 0,
  },
];
const PartnersScreens = ({}) => {
  const [partners, setPartners] = useState(PARTNERS);

  const list = ({item}) => {
    return (
      <View style={styles.card} key={item._id}>
        <Image resizeMode="contain" source={item.logo} style={styles.img} />
        <View style={styles.texts}>
          <View style={styles.row}>
            <Text style={styles.txtHeader}>{item.name}</Text>
            <Text style={styles.txt}>{item.loanTerm} ayadək</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.txt}> ₼{item.maxAmount} qədər</Text>
            <Text style={styles.txt}>{item.interest}%-dan</Text>
          </View>
        </View>
      </View>
    );
  };

  const searchPartners = value => {
    value = value.trim().toLowerCase();
    let list = PARTNERS;
    const filteredArray = list.filter(item =>
      item.name.toLowerCase().includes(value),
    );
    setPartners(filteredArray);
    if (value.trim() == '') {
      setPartners(PARTNERS);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.searchBar}>
          <Icon name={'search'} size={20} color={'#191919'} />
          <TextInput
            style={styles.searchText}
            placeholder="Axtrar"
            onChangeText={value => searchPartners(value)}
          />
        </View>
        <Icon name={'sliders'} size={35} color={'#191919'} />
      </View>

      <FlatList
        data={partners}
        renderItem={list}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        bounces={true}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        contentContainerStyle={{marginVertical: 20}}
      />
    </SafeAreaView>
  );
};

export default PartnersScreens;
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
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderColor: '#9E9E9E',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    width: '85%',
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
  searchText: {
    fontSize: 16,
    paddingHorizontal: 10,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    flexDirection: 'row',
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  texts: {
    width: '75%',
    marginHorizontal: 15,
  },
  txt: {
    color: '#757575',
    fontSize: 16,
    padding: 5,
  },
  txtHeader: {
    fontSize: 16,
  },
});
