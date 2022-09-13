import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateProfile, getProfile, imageUpload } from "../../api/api";
import { I18n } from "i18n-js";
import Language from "../../assets/Language.json";
import { useGlobalState } from "state-pool";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";

const i18n = new I18n(Language);

const SettingsScreen = () => {
  const [ locale, setLocale, updateLocale ] = useGlobalState("locale");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birth, setBirth] = useState("00-00-0000");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  i18n.locale = locale ? locale : "en-US";
  i18n.enableFallback = true;
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      let formData = new FormData();
      formData.append("fileName", result.uri);
      formData.append("contentType", result.type);
      formData.append("fileKey", "avatars/" + new Date().getTime().toString());
      imageUpload(formData).then((res) => {
        console.log("imageupload-------------------" + res.data);
      });
    }
  };

  useEffect(() => {
    getProfile(userID).then((res) => {
      setEmail(res.data.email);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setAddress(res.data.address);
      setPhoneNumber(res.data.phoneNumber);
      setBirth(res.data.birth);
    });
  }, []);

  const onUpdate = () => {
    updateProfile({
      firstName: firstName,
      lastName: lastName,
      email: email,
      id: userID,
      address: address,
      birth: birth,
      role: "USER",
      phoneNumber: phoneNumber,
      status: "ACTIVE",
    }).then((res) => {
      if (res.status === true) alert(i18n.t("ALERTS.ProfileSuccess"));
      else alert(i18n.t("ALERTS.ValidateAlert"));
    });
  };

  const onPassChange = () => {
    if (password !== repassword) {
      alert("Please confirm password");
      return;
    }
    if (password.length < 6) {
      alert("Password has to great than 6");
      return;
    }
    updateProfile({ id: userID, password: password }).then((res) => {
      if (res === "success") alert("Change your password correctly");
      else alert(i18n.t("ALERTS.ValidateAlert"));
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0049ee" }}>
      <View style={{ ...styles.row, ...{ justifyContent: "flex-start" } }}>
        <Text style={{ fontSize: 17, color: "white", fontWeight: "bold" }}>
        {i18n.t("PAGES.Profile")}
        </Text>
      </View>
      <View style={styles.avtarContainer}>
        <View style={styles.avtarImageContainer}>
          {image && <Image source={{ uri: image }} style={styles.avtarImage} />}
          {!image && (
            <Image
              source={require("../../assets/icon.png")}
              style={styles.avtarImage}
            />
          )}
        </View>
        <View style={styles.row}>
          <TextInput
            placeholderTextColor="#8b9cb5"
            style={{ ...styles.textInput, ...{ width: "100%" } }}
            placeholder={i18n.t("INPUTS.FirstName")}
            defaultValue={firstName}
            onChangeText={(txt) => setFirstName(txt)}
          />
        </View>
        <View style={styles.row}>      
          <TextInput
            placeholderTextColor="#8b9cb5"
            style={{
              ...styles.textInput,
              ...{ width: "100%" },
            }}
            placeholder={i18n.t("INPUTS.LastName")}
            defaultValue={lastName}
            onChangeText={(txt) => {
              setLastName(txt);
            }}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            placeholderTextColor="#8b9cb5"
            editable={false}
            style={{ ...styles.textInput, ...{ width: "100%" } }}
            placeholder={i18n.t("INPUTS.Email")}
            readonly
            defaultValue={email}
            onChangeText={(txt) => {
              setEmail(txt);
            }}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            placeholderTextColor="#8b9cb5"
            style={{ ...styles.textInput, ...{ width: "100%" } }}
            placeholder={i18n.t("INPUTS.Address")}
            defaultValue={address}
            onChangeText={(txt) => {
              setAddress(txt);
            }}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            placeholderTextColor="#8b9cb5"
            style={{ ...styles.textInput, ...{ width: "100%" } }}
            placeholder={i18n.t("INPUTS.PhoneNumber")}
            defaultValue={phoneNumber}
            onChangeText={(txt) => {
              setPhoneNumber(txt);
            }}
          />
        </View>
        <View style={styles.datepickerrow}>
          <Text style={{ color: "white", fontSize: 18 }}>birth</Text>
          <DatePicker
            style={styles.datePickerStyle}
            date={birth}
            mode="date"
            placeholder="select date"
            placeholderTextColor="#8b9cb5"
            format="DD-MM-YYYY"
            minDate="01-01-1970"
            maxDate="31-12-2025"
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                borderWidth: 0,
                marginBottom: 10,
                fontSize: 18,
                color: "white",
              },
            }}
            onDateChange={(birth) => {
              setBirth(birth);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              onUpdate();
            }}
          >
            <Text style={styles.buttonTextStyle}>{i18n.t("BUTTONS.Update")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  datepickerrow: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    height: 40,
    padding: 2,
    borderColor: "white",
  },
  avtarContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 50,
  },
  avtarImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avtarImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7c7b7b",
    borderWidth: 1,
  },
  changePhoto: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    height: 40,
    padding: 3,
    fontSize: 18,
    color: "white",
    borderColor: "#dadae8",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#0049EE",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    borderRadius: 5,
  },
  datePickerStyle: {
    width: "90%",
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#0049ee",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
