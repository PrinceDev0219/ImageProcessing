import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "./Components/Loader";
import { signUpApi } from "../api/api";
import { I18n } from "i18n-js";
import Language from "../assets/Language.json";
import { useGlobalState } from "state-pool";

const i18n = new I18n(Language);

const RegisterScreen = (props) => {
  const [ locale, setLocale, updateLocale ] = useGlobalState("locale");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const firstNameInputRef = createRef();
  const lastNameInputRef = createRef();
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const phoneNumberInputRef = createRef();

  
  i18n.locale = locale ? locale : "en-US";
  i18n.enableFallback = true;

  const handleSubmitButton = () => {
    setErrortext("");
    if (!firstName) {
      alert(i18n.t("ALERTS.FirstNameInputAlert"));
      return;
    }
    if (!lastName) {
      alert(i18n.t("ALERTS.LastNameInputAlert"));
      return;
    }
    if (!userEmail) {
      alert(i18n.t("ALERTS.EmailInputAlert"));
      return;
    }
    if (!password) {
      alert(i18n.t("ALERTS.PasswordInputAlert"));
      return;
    }
    if (!phoneNumber) {
      alert(i18n.t("ALERTS.PhoneNumberInputAlert"));
      return;
    }
    if (password.length < 6) {
      alert(i18n.t("ALERTS.PasswordLength"));
      return;
    }

    signUpApi(firstName, lastName, userEmail, password, phoneNumber)
      .then((res) => {
        setLoading(false);
        if (res.status === true) {
          setIsRegistraionSuccess(true);
        } else {
          setErrortext("Registration Unsuccessful");
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrortext("Registration Unsuccessful");
      });
    return;
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0049EE",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../Image/success.png")}
          style={{ height: 150, resizeMode: "contain", alignSelf: "center" }}
        />
        <Text style={styles.successTextStyle}>{i18n.t("ALERTS.RegistrationSuccessful")}</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonTextStyle}>{i18n.t("BUTTONS.Login")}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#0049EE" }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../Image/aboutreact.png")}
            style={{
              width: "50%",
              height: 100,
              resizeMode: "contain",
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(firstName) => setFirstName(firstName)}
              underlineColorAndroid="#f000"
              placeholder={i18n.t("INPUTS.FirstName")}
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              ref={firstNameInputRef}
              onSubmitEditing={() =>
                lastNameInputRef.current && lastNameInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(lastName) => setLastName(lastName)}
              underlineColorAndroid="#f000"
              placeholder={i18n.t("INPUTS.LastName")}
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              ref={lastNameInputRef}
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder={i18n.t("INPUTS.Email")}
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
              underlineColorAndroid="#f000"
              placeholder={i18n.t("INPUTS.PhoneNumber")}
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              ref={phoneNumberInputRef}
              onSubmitEditing={() =>
                phoneNumberInputRef.current &&
                phoneNumberInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(password) => setPassword(password)}
              underlineColorAndroid="#f000"
              placeholder={i18n.t("INPUTS.Password")}
              placeholderTextColor="#8b9cb5"
              secureTextEntry={true}
              ref={passwordInputRef}
              returnKeyType="next"
              // onSubmitEditing={() =>
              //   confirmPasswordInputRef.current &&
              //   confirmPasswordInputRef.current.focus()
              // }
              blurOnSubmit={false}
            />
          </View>
          {errortext != "" ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}
          >
            <Text style={styles.buttonTextStyle}>{i18n.t("BUTTONS.Register")}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
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
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});
