import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalState } from "state-pool";
import * as Linking from "expo-linking";

const ItemText = ({ type, detail }) => {
  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{ fontSize: 17, marginTop: 10 }}
    >
      {type} - {detail}
    </Text>
  );
};

const DetailScreen = ({ navigation }) => {
  const [detailData, setDeatailData, updateDetailData] =
    useGlobalState("detailData");
  const date = new Date();
  const makeTime = (time) => {
    var t = time.split(/[- :]/);
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

    let periodTime = date - d;
    if (periodTime < 10 * 1000) return "1 sec ago";
    if (periodTime < 60 * 1000)
      return new Date(periodTime).getSeconds() + " seconds ago";
    if (periodTime < 3600 * 1000)
      return new Date(periodTime).getMinutes() + " minuts ago";
    if (periodTime < 3600 * 24 * 1000)
      return new Date(periodTime).getHours() + " hours ago";
    if (periodTime < 3600 * 24 * 30 * 1000) {
      return new Date(periodTime).getDate() + " days ago";
    }
    if (periodTime < 3600 * 24 * 30 * 12 * 1000)
      return new Date(periodTime).getMonth() + " months ago";
    if (periodTime < 3600 * 24 * 30 * 12 * 10 * 1000)
      return new Date(periodTime).getFullYear() + " years ago";
    return "long time ago";
  };
  return (
    <View style={styles.container}>
      <ItemText type={"FileName"} detail={detailData.filename} />
      <ItemText type={"Buyer"} detail={detailData.buyer_name} />
      <ItemText type={"Season"} detail={detailData.season_no} />
      <ItemText type={"FTY No"} detail={detailData.style_no} />
      <ItemText type={"Full Buyer"} detail={detailData.buyer} />
      <ItemText type={"Group"} detail={detailData.group_name} />
      <ItemText type={"Ws No"} detail={detailData.ws_no} />
      <ItemText type={"MCN"} detail={detailData.mcn_name} />
      <ItemText type={"Status"} detail={detailData.file_status} />
      <ItemText type={"Production by"} detail={detailData.production_line} />
      <ItemText type={"Created at"} detail={makeTime(detailData.created_at)} />
      <ItemText type={"Updated at"} detail={makeTime(detailData.updated_at)} />
      <TouchableOpacity
        style={styles.detail}
        onPress={() => {
          Linking.openURL(
            "googlechrome://navigate?url=" + detailData.preview_link
          );
        }}
      >
        <Text style={styles.detailInfo}>View File</Text>
        <FontAwesome
          name="file"
          size={23}
          color="#0049EE"
          style={styles.detailIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  detail: {
    marginTop: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    flexDirection: "row",
    paddingRight: 20,
  },
  detailInfo: {
    fontSize: 17,
    marginLeft: 10,
  },
  detailIcon: {
    marginLeft: 5,
  },
});
