import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalState } from "state-pool";
import { getFiles } from "../../api/api";
import Loader from "./Loader";

const PageFooter = () => {
  const [fileData, setFileData, updateFileData] = useGlobalState("fileData");
  const [fileCount, setFileCount, updateFileCount] =
    useGlobalState("fileCount");
  const [indexPage, setIndexPage, updateIndexPage] =
    useGlobalState("indexPage");
  const [perPage, setPerPage, updatePerPage] = useGlobalState("perPage");
  const [fileName, setFileName, updateFileName] = useGlobalState("fileName");
  const [searchString, setUpdateSearchString, updateSearchString] =
    useGlobalState("searchString");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  const [loading, setLoading] = useState(false);

  const nextPage = () => {
    if ((indexPage + 1) * perPage > fileCount) return;
    setLoading(true);
    getFiles(userID, searchString, indexPage + 1, perPage)
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
    updateIndexPage((old) => {
      return old + 1;
    });
  };

  const prevPage = () => {
    if (indexPage === 0) return;
    setLoading(true);
    getFiles(userID, updateSearchString, indexPage - 1, perPage)
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
    updateIndexPage((old) => {
      return old - 1;
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Loader loading={loading} />
        <Text>
          {indexPage * perPage}~{(indexPage + 1) * perPage} / {fileCount}
        </Text>
        <View style={styles.tool}>
          <TouchableOpacity
            style={styles.circleItem}
            onPress={() => {
              prevPage();
            }}
          >
            <Text style={styles.text}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleItem}
            onPress={() => {
              nextPage();
            }}
          >
            <Text style={styles.text}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PageFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  circleItem: {
    width: 80,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#0049EE",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
  tool: {
    flexDirection: "row",
  },
});
