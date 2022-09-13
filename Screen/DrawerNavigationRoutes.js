import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./DrawerScreens/HomeScreen";
import SettingsScreen from "./DrawerScreens/SettingScreen";
import CustomSidebarMenu from "./Components/CustomSidebarMenu";
import NavigationDrawerHeader from "./Components/NavigationDrawerHeader";
import DetailScreen from "./DetailScreen";
import PageNumberScreen from "./PageNumberScreen";
import ScanScreen from "./ScanScreen";
import ExcelViewer from "./Components/ExcelViewer";
import MemberShipScreen from "./MemberShipScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#0049EE", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const DetailScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="DetailScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#0049EE", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{
          title: "Detail", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const NumberScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="NumberScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#0049EE", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
      }}
    >
      <Stack.Screen
        name="NumberScreen"
        component={PageNumberScreen}
        options={{
          title: "Number", //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const MemberShipScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="MemberShipScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#0049EE",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="MemberShipScreen"
        component={MemberShipScreen}
        options={{
          title: "MemberShip",
        }}
      />
    </Stack.Navigator>
  );
};

const SettingScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#0049EE",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </Stack.Navigator>
  );
};

const ScanScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="ScanScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: "#0049EE",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          title: "Scan Screen",
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        activeTintColor: "#cee1f2",
        color: "#cee1f2",
        itemStyle: { marginVertical: 5, color: "white" },
        labelStyle: {
          color: "#d8d8d8",
        },
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}
    >
      <Drawer.Screen
        name="HomeScreenStack"
        options={{ drawerLabel: "Home Screen" }}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="DetailScreenStack"
        options={{ drawerLabel: "Detail Screen" }}
        component={DetailScreenStack}
      />
      <Drawer.Screen
        name="ExcelScreenStack"
        options={{ drawerLabel: "Excel Screen" }}
        component={ExcelViewer}
      />
      <Drawer.Screen
        name="NumberScreenStack"
        options={{ drawerLabel: "Number Screen" }}
        component={NumberScreenStack}
      />
      <Drawer.Screen
        name="SettingScreenStack"
        options={{ drawerLabel: "Setting Screen" }}
        component={SettingScreenStack}
      />
      <Drawer.Screen
        name="MemberShipScreenStack"
        options={{ drawerLabel: "Membership Screen" }}
        component={MemberShipScreenStack}
      />
      <Drawer.Screen
        name="ScanScreenStack"
        options={{ drawerLabel: "Scan Screen" }}
        component={ScanScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
