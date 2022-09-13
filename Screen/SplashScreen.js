import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalState, store } from "state-pool";
import StoreData from "../store";

Object.keys(StoreData).map((key) => {
  store.setState(key, StoreData[key]);
});

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true);
  const [token, setToken, updateToken] = useGlobalState("token");
  const [user_id, setUserId, updateUserId] = useGlobalState("user_id");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      AsyncStorage.getItem("user_email").then((value) => {
        if (value === null) {
          navigation.replace("Auth");
        } else {
          updateUserId((old) => {
            return value;
          });
          AsyncStorage.getItem("token").then((value) => {
            updateToken((old) => {
              return value;
            });
            AsyncStorage.getItem("user_id").then((value) => {
              updateUserID((old) => {
                return value;
              });
              navigation.replace("DrawerNavigationRoutes");
            });
          });
        }
      });
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../Image/aboutreact.png")}
        style={{ width: "90%", resizeMode: "contain", margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0049EE",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
