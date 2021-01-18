import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import FileDetailItem from "../Components/FileDetailItem";
import { getFiles } from "../../api/api";
import { useGlobalState } from "state-pool";
import Loader from "../Components/Loader";
import { useNavigation } from "@react-navigation/native";
import GDrive from "expo-google-drive-api-wrapper";

let flatList = null;

const _initGoogleDrive = async () => {
  // Getting Access Token from Google
  let token = await GoogleSignin.getTokens();
  if (!token) return alert('Failed to get token');
  console.log('res.accessToken =>', token.accessToken);
  // Setting Access Token
  GDrive.setAccessToken(token.accessToken);
  // Initializing Google Drive and confirming permissions
  GDrive.init();
  // Check if Initialized
  return GDrive.isInitialized();
};

const HomeScreen = () => {
  const [fileData, setFileData, updateFileData] = useGlobalState("fileData");
  const [fileCount, setFileCount, updateFileCount] = useGlobalState("fileCount");
  const [indexPage, setIndexPage, updateIndexPage] = useGlobalState("indexPage");
  const [perPage, setPerPage, updatePerPage] = useGlobalState("perPage");
  const [fileName, setFileName, updateFileName] = useGlobalState("fileName");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  const [searchString, setUpdateSearchString, updateSearchString] = useGlobalState("searchString");
  const [searchFlag, setSearchFlag, updateSearchFlag] = useGlobalState("searchFlag");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // _initGoogleDrive();

  useEffect(() => {
    updateSearchFlag((old) => {
      return false;
    });
    updateSearchString((old) => {
      return "";
    });
    updateIndexPage((old) => {
      return 0;
    });
    navigation.closeDrawer();
    // setLoading(true);
    // getFiles(userID, fileName, 0, perPage)
    //   .then((res) => {
    //     setLoading(false);
    //     updateFileData((old) => {
    //       return res.data;
    //     });
    //     updateFileCount((old) => {
    //       return res.count;
    //     });
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  }, []);

  const nextPage = () => {
    if ((indexPage + 1) * perPage > fileCount) return;
    // flatList.scrollToOffset({ x: 0, animated: false });
    setLoading(true);
    setTimeout(() => {
      getFiles(userID, searchString, indexPage + 1, perPage)
        .then(async (res) => {
          setLoading(false);
          await updateFileData((old) => {
            return old.concat(res.data);
          });
          await updateFileCount((old) => {
            return res.count;
          });
        })
        .catch(() => {
          setLoading(false);
        });
      updateIndexPage((old) => {
        return old + 1;
      });
    }, 400);
  };

  const prevPage = () => {
    if (indexPage === 0) return;
    // setLoading(true)
    getFiles(userID, updateSearchString, indexPage - 1, perPage)
      .then(async (res) => {
        // setLoading(false)
        await updateFileData((old) => {
          return res.data;
        });
        await updateFileCount((old) => {
          return res.count;
        });
      })
      .catch(() => {
        // setLoading(false)
      });
    updateIndexPage((old) => {
      return old - 1;
    });
  };

  const reloadPage = () => {
    setLoading(true);
    updateIndexPage((old) => {
      return 0;
    });
    getFiles(userID, updateSearchString, 0, perPage)
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
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <View>
        
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  listHeaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshing: { marginTop: 5, marginBottom: -10 },
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  emptyContainer: {
    position: "absolute",
    top: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});
