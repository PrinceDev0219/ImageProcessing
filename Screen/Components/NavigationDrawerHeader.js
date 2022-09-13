// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGlobalState } from "state-pool";
import { getFiles } from "../../api/api";
import Loader from "./Loader";

const width = Dimensions.get("screen").width;

const NavigationDrawerHeader = (props) => {
  const [currentPage, setCurrentPage] = useState("");
  const [searchString, setSearchString, updateSearchString] =
    useGlobalState("searchString");
  const [searchFlag, setSearchFlag, updateSearchFlag] =
    useGlobalState("searchFlag");
  const navigation = useNavigation();

  const [fileData, setFileData, updateFileData] = useGlobalState("fileData");
  const [fileCount, setFileCount, updateFileCount] =
    useGlobalState("fileCount");
  const [indexPage, setIndexPage, updateIndexPage] =
    useGlobalState("indexPage");
  const [perPage, setPerPage, updatePerPage] = useGlobalState("perPage");
  const [fileName, setFileName, updateFileName] = useGlobalState("fileName");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  const [loading, setLoading] = useState(false);

  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  useFocusEffect(
    React.useCallback(() => {
      setCurrentPage(navigation.getState().routeNames[0]);
    }, [])
  );

  const getFileData = async () => {
    setLoading(true);
    await updateIndexPage(() => {
      return 0;
    });
    getFiles(userID, searchString, 0, perPage)
      .then(async (res) => {
        setLoading(false);
        await updateFileData((old) => {
          return res.data;
        });
        await updateFileCount((old) => {
          return res.count;
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      {currentPage === "HomeScreen" && searchFlag === false ? (
        <TouchableOpacity onPress={toggleDrawer}>
          <Ionicons name="menu-outline" size={30} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (searchFlag === true) setSearchFlag(false);
            else if (navigation.canGoBack()) navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      )}
      <View style={styles.searchKeyContainer}>
        {searchFlag ? (
          <TextInput
            style={styles.searchKey}
            placeholder="Search file"
            placeholderTextColor="#39393a"
            color={"white"}
            defaultValue={searchString}
            onChangeText={(txt) => {
              updateSearchString(() => {
                return txt;
              });
            }}
          />
        ) : null}
      </View>
      <View style={styles.toolContainer}>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => {
            if (!searchFlag) setSearchFlag(!searchFlag);
            else getFileData();
          }}
        >
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => {
            navigation.push("ScanScreen");
          }}
        >
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => {
            navigation.navigate("numberScreenStack");
          }}
        >
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default NavigationDrawerHeader;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    width: width,
    height: 70,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  toolItem: {
    width: 30,
    marginRight: 20,
  },
  searchKeyContainer: {
    width: width - 170,
  },
  searchKey: {
    width: "100%",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    fontSize: 17,
    padding: 5,
  },
});
