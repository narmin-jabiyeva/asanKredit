import {Text,StyleSheet} from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import ProfileScreen from "../screens/profile/ProfileScreen";
import PartnersScreens from "../screens/partners/PartnersScreens";
import BlankScreen from "../screens/BlankScreen";
import HomeLayout from "../layouts/HomeLayout";

const Tab = createBottomTabNavigator();

function HomeTabs({ navigation }) {

  return (
    <HomeLayout  navigation={navigation}>

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 75,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            paddingBottom: 5,
          },
        }}
      >
        <Tab.Screen
          name={"Profile"}
          component={ProfileScreen}
          options={{
            tabBarLabel: ({focused,color }) => {
              return <Text style={[styles.tabBarLabel,{color:color}]}>{'Profil'}</Text>;
            },
            tabBarActiveTintColor: "#10579B",
            tabBarInactiveTintColor: "#7E8B97",
            tabBarShowLabel: true,
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={"user"} size={30} color={color} />
            },
          }}
        />
        <Tab.Screen
          name={"Partners"}
          component={PartnersScreens}
          options={{
            tabBarLabel: ({focused,color }) => {
              return <Text style={[styles.tabBarLabel,{color:color}]}>{'Partnerlar'}</Text>;
            },
            tabBarActiveTintColor: "#10579B",
            tabBarInactiveTintColor: "#7E8B97",
            tabBarShowLabel: true,
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={"users"} size={30} color={color} />
            },
          }}
        />
        <Tab.Screen
          name={"Taksits"}
          component={BlankScreen}
          options={{
            tabBarLabel: ({focused,color }) => {
              return <Text style={[styles.tabBarLabel,{color:color}]}>{'Taksitlərim'}</Text>;
            },
            tabBarActiveTintColor: "#10579B",
            tabBarInactiveTintColor: "#7E8B97",
            tabBarShowLabel: true,
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={"list"} size={30} color={color} />
            },
          }}
        />
        <Tab.Screen
          name={"Support"}
          component={BlankScreen}
          options={{
            tabBarLabel: ({focused,color }) => {
              return <Text style={[styles.tabBarLabel,{color:color}]}>{'Dəstək'}</Text>;
            },
            tabBarActiveTintColor: "#10579B",
            tabBarInactiveTintColor: "#7E8B97",
            tabBarShowLabel: true,
            tabBarIcon: ({ focused, color, size }) => {
              return <Icon name={"headphones"} size={30} color={color} />
            },
          }}
        />
       
      </Tab.Navigator>
      </HomeLayout>
     
  );
}

export default HomeTabs;

const styles = StyleSheet.create({
  active: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D8B36C",
    alignItems: "center",
    justifyContent: "center",
  },
  activeWrap: {
    borderTopWidth: 4,
    borderTopColor: "#D8B36C",
    height: "100%",
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveWrap: {
    borderTopWidth: 2,
    borderTopColor: "#D8B36C",
    height: "100%",
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",

  },
  inactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#131111",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D8B36C",
    borderWidth: 1,
  },
  tabBarLabel: {
    fontSize: 13,
    textAlign: "center",
  },

});
