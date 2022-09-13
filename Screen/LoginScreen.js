import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Picker,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "./Components/Loader";
import { loginApi } from "../api/api";
import { useGlobalState } from "state-pool";
import { I18n } from "i18n-js";
import Language from "../assets/Language.json";

const i18n = new I18n(Language);

const LoginScreen = ({ navigation }) => {
  const [locale, setLocale, updateLocale] = useGlobalState("locale");

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [token, setToken, updateToken] = useGlobalState("token");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");

  const getLocale = async () => {
    const _locale = await AsyncStorage.getItem('locale');
    updateLocale(() => {
      return _locale;
    });
  }

  const _setLocale = async (val) => {
    AsyncStorage.setItem("locale", val);
  }

  i18n.locale = locale ? locale : "en-US";
  i18n.enableFallback = true;
  
  const passwordInputRef = createRef();
  
  const handleSubmitPress = () => {
    setErrortext("");
    if (!userEmail) {
      alert(i18n.t("ALERTS.EmailInputAlert"));
      return;
    }
    if (!userPassword) {
      alert(i18n.t("ALERTS.PasswordInputAlert"));
      return;
    }
    setLoading(true);

    loginApi(userEmail, userPassword)
      .then(async (res) => {
        setLoading(false);
        if (res.status === true) {
          await AsyncStorage.setItem("user_email", userEmail);
          await AsyncStorage.setItem("api_token", res.data.apiToken);
          await AsyncStorage.setItem("user_id", res.data.id.toString());
          await updateToken((old) => {
            return res.data.apiToken;
          });
          await updateUserID((old) => {
            return res.data.id.toString();
          });

          navigation.replace("DrawerNavigationRoutes");
        } else setErrortext(i18n.t("ALERTS.WrongInfo"));
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getLocale();
  }, [])

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={styles.container}>
          <Picker
            selectedValue={locale}
            style={{
              height: 50,
              width: 130,
              color: "white",
            }}
            onValueChange={(itemValue, itemIndex) => {
              updateLocale(() => {
                return itemValue;
              });
              _setLocale(itemValue);
            }              
            }
          >
            <Picker.Item label="English" value="en-US" />
            <Picker.Item label="German" value="en-DE" />
          </Picker>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../Image/LOGO.png")}
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              marginBottom: 30,
            }}
          />
        </View>
        <View style={styles.loginContainer}>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                placeholder={i18n.t("INPUTS.Email")} //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                placeholder={i18n.t("INPUTS.Password")} //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>
                {i18n.t("BUTTONS.Login")}
              </Text>
            </TouchableOpacity>
            <View style={styles.BottomSectionStyle}>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate("RegisterScreen")}
              >
                {i18n.t("BUTTONS.CreateAccount")}
              </Text>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
              >
                {i18n.t("BUTTONS.ForgotPassword")}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0049ee", //'#0049EE',
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    margin: 10,
  },
  BottomSectionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    margin: 10,
  },
  loginContainer: {
    paddingTop: 20,
    backgroundColor: "#ffffff00",
    borderRadius: 20,
    marginHorizontal: 45,
  },
  buttonStyle: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#0049ee",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
  },
  container: {
    position:'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 30,
    top: 30,
    right: 10
  },
});
