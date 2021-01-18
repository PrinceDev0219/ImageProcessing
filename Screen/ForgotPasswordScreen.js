import React, { useState, createRef } from "react";
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
  Modal,
  Pressable,
} from "react-native";
import { I18n } from "i18n-js";
import Loader from "./Components/Loader";
import Language from "../assets/Language.json";
import { forgotPasswordApi, resetPasswordApi } from "../api/api";
import { useGlobalState } from "state-pool";

const i18n = new I18n(Language);

const ForgotPasswordScreen = ({ navigation }) => {
  const [ locale, setLocale, updateLocale ] = useGlobalState("locale");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [verifyCode, setVerifiCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [token, setToken, updateToken] = useGlobalState("token");
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  const [modalVisible, setModalVisible] = useState(false);

  i18n.locale = locale ? locale : "en-US";
  i18n.enableFallback = true;

  const resetPassword = () => {
    setErrortext("");
    if (!verifyCode) {
      alert(i18n.t("ALERTS.VerifyCodeInputAlert"));
      return;
    }
    if (!userEmail) {
      alert(i18n.t("ALERTS.EmailInputAlert"));
      return;
    }
    if (!userPassword) {
      alert(i18n.t("ALERTS.PasswordInputAlert"));
      return;
    }
    setLoading(true);

    resetPasswordApi(verifyCode, userEmail, userPassword)
      .then(async (res) => {
        setLoading(false);
        console.log(res);
        if (res.status === true) {
          setModalVisible(false);
          alert(i18n.t("ALERTS.PasswordReset"));
          navigation.replace('LoginScreen');
        } else setErrortext("Please check your some informations");
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  const handleSubmitPress = () => {
    setErrortext("");
    if (!userEmail) {
      alert(i18n.t("ALERTS.EmailInputAlert"));
      return;
    }
    setLoading(true);

    forgotPasswordApi(userEmail)
      .then(async (res) => {
        setLoading(false);
        console.log(res);
        if (res.status === true) {
          setModalVisible(true);
        } else setErrortext("Please check your email id or password");
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../Image/LOGO-dark.png")}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: "contain",
                  marginBottom: 30,
                }}
              />
            </View>
            <Text style={styles.modalText}>{i18n.t("PAGES.Reset")}</Text>
            <View style={styles.modalContainer}>
              <KeyboardAvoidingView enabled>
                <View style={styles.ModalSectionStyle}>
                  <TextInput
                    style={styles.ModalinputStyle}
                    onChangeText={(verifyCode) => setVerifiCode(verifyCode)}
                    underlineColorAndroid="#f000"
                    placeholder={i18n.t("INPUTS.VerifyCode")}
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.ModalSectionStyle}>
                  <TextInput
                    style={styles.ModalinputStyle}
                    onChangeText={(userEmail) => setUserEmail(userEmail)}
                    placeholder={i18n.t("INPUTS.Email")}
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="none"
                    defaultValue={userEmail}
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.ModalSectionStyle}>
                  <TextInput
                    style={styles.ModalinputStyle}
                    onChangeText={(userPassword) =>
                      setUserPassword(userPassword)
                    }
                    placeholder={i18n.t("INPUTS.Password")} //12345
                    placeholderTextColor="#8b9cb5"
                    keyboardType="default"
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
                  style={styles.modalbuttonStyle}
                  activeOpacity={0.5}
                  onPress={resetPassword}
                >
                  <Text style={styles.modalbuttonTextStyle}>{i18n.t("BUTTONS.Reset")}</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
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
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>{i18n.t("BUTTONS.SendRequest")}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0049ee", 
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
  ModalSectionStyle: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    marginBottom: 10,
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
  modalContainer: {
    paddingTop: 20,
    backgroundColor: "#ffffff00",
    borderRadius: 20,
    marginHorizontal: 45,
    width: "100%",
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
  modalbuttonStyle: {
    backgroundColor: "#0049ee",
    borderWidth: 0,
    color: "#0049ee",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  modalbuttonTextStyle: {
    color: "#ffffff",
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
  ModalinputStyle: {
    flex: 1,
    color: "#0049ee",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
    width: "100%",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: "#0049ee",
    fontWeight: "bold",
  },
});
