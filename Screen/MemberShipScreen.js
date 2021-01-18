import React, { useState, createRef, useEffect, useCallback } from "react";
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
  Pressable
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "./Components/Loader";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { payment, memberShipSave } from "../api/api";
import { Linking } from "react-native-web";
import { useGlobalState } from "state-pool";

const MemberShipScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({});
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment  } = useStripe();
  const [ paymentMethod, setPaymentMethod ] = useState();
  const [userID, setUserID, updateUserID] = useGlobalState("userID");

  const memberShip = async (type) => {
    const MEMBERSHIPTYPE = {
      BASIC: {name: "BASIC", value: 0},
      PRO: {name: "PRO", value: 4.99},
      ULTRA: {name: "ULTRA", value: 8.99},
      MEGA: {name: "MEGA", value: 12.99}
    };
    setAmount(MEMBERSHIPTYPE[type].value);
    setName(MEMBERSHIPTYPE[type].name);
    setLoading(true);
    await initializePaymentSheet(MEMBERSHIPTYPE[type].name, MEMBERSHIPTYPE[type].value);    
  }

  const fetchPaymentSheetParams = async (name, value) => {
    const response = await fetch("http://10.10.13.226:5000/payment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({amount: value, name: name})
    });
    const data = await response.json();
    return data;
  };

  const initializePaymentSheet = async (name, value) => {
    const data = await fetchPaymentSheetParams(name, value);
    
    try {
      console.log("start==", data)
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        customerId: data.customer,
        customerEphemeralKeySecret: data.ephemeralKey,
        style: 'automatic',
        customFlow: true,
        merchantDisplayName: 'ScanToGo',
      });
      console.log("initsheet==", initSheet)
      if(initSheet.error) {
        console.log(initSheet.error)
        return alert(initSheet.error.message);
      }     
      setLoading(false);
      const { error } = await presentPaymentSheet({clientSecret: data.clientSecret});
      console.log(error)
      if (error) {
        alert(`Error code: ${error.code}`, error.message);
      } else {
        setModalVisible(false);
        setModalVisible(true)
      }
      }
    catch(e) {

      console.log("catch-",e)
    }
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    const response = await confirmPaymentSheetPayment();
        if (response.error) {
            alert(`Error ${response.error.code}`);
            console.error(response.error.message);
        } else {
            memberShipSave({user_id: userID, packageType: name, price: amount, quantity: 1000}).then((res) => {
              if(res == "success") console.log("Payment----Okay");
              else console.log("Payment----failed");
            })
            setModalVisible(false)
            setLoading(false);
            alert('Purchase completed!');
        }
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
            <Text style={{fontSize:18, fontWeight:'bold', marginBottom:10}}>Checkout</Text>
            <View style={{width:"100%"}}>
              <Text style={styles.cardTitle}>{name}</Text>
              <Text style={styles.cardSubTitle}>€{amount}/mo</Text>
              <View style={{flexDirection:"row", width:"60%", justifyContent:"space-between"}}>
              <TouchableOpacity
                style={{width:"45%", backgroundColor:"#0049EE", margin:"auto", paddingVertical:5, paddingHorizontal:5, borderRadius:5}}
                activeOpacity={0.5}
                onPress={openPaymentSheet}
              >
                <Text style={styles.cardButtonTextStyle}>Checkout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width:"45%", backgroundColor:"#0049EE", margin:"auto", paddingVertical:5, paddingHorizontal:5, borderRadius:5}}
                activeOpacity={0.5}
                onPress={()=>setModalVisible(!modalVisible)}
              >
                <Text style={styles.cardButtonTextStyle}>Cancel</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            {
              // flex: 1,
            }
          }
        >
          <View style={styles.topTitleSection}>
            <Text style={styles.topTitle}>Membership Status:</Text>
            <Text
              style={{
                ...styles.topTitle,
                ...{
                  backgroundColor: "orange",
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 10,
                  color: "white",
                },
              }}
            >
              Free
            </Text>
          </View>
          <View style={styles.topTitleSection}>
            <Text style={styles.topTitle}>Quantity Left:</Text>
            <Text
              style={{
                ...styles.topTitle,
                ...{
                  backgroundColor: "green",
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 10,
                  color: "white",
                },
              }}
            >
              25/25
            </Text>
          </View>
          <View style={styles.topDateSection}>
            <Text style={styles.topTitle}>Date Status:</Text>
            <View
              style={{
                ...styles.topDateSubSection,
                ...{
                  backgroundColor: "green",
                  paddingRight: 10,
                  paddingLeft: 10,
                },
              }}
            >
              <Text style={styles.topDate}>2022-08-30</Text>
              <Text
                style={{
                  ...styles.topTitle,
                  ...{ marginLeft: 10, marginRight: 10, color: "white" },
                }}
              >
                to
              </Text>
              <Text style={styles.topDate}>2022-08-30</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={[styles.card, styles.elevation]}>
              <Text style={styles.cardTitle}>Basic</Text>
              <Text style={styles.cardSubTitle}>€0.00/mo</Text>
              <Text style={styles.cardContent}>Currently subscribe</Text>
              <Text style={{ ...styles.cardContent, ...{ color: "#0049EE" } }}>
                Manage And View Usage
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterTitle}>25/month</Text>
                <Text style={styles.cardFooterSubTitle}>Hard Limit</Text>
              </View>
            </View>
            <View style={[styles.card, styles.elevation]}>
              <Text style={styles.cardTitle}>Pro</Text>
              <Text style={styles.cardSubTitle}>€4.99/mo</Text>
              <TouchableOpacity
                style={styles.cardButtonStyle}
                activeOpacity={0.5}
                onPress={()=>memberShip('PRO')}
              >
                <Text style={styles.cardButtonTextStyle}>Change Plan</Text>
              </TouchableOpacity>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterTitle}>100/month</Text>
                <Text style={styles.cardFooterSubTitle}>+ € 0.0039 each other</Text>
              </View>
            </View>
            <View style={[styles.card, styles.elevation]}>
              <Text style={styles.cardTitle}>Ultra</Text>
              <Text style={styles.cardSubTitle}>€8.99/mo</Text>
              <TouchableOpacity
                style={styles.cardButtonStyle}
                activeOpacity={0.5}
                onPress={()=>memberShip('ULTRA')}
              >
                <Text style={styles.cardButtonTextStyle}>Change Plan</Text>
              </TouchableOpacity>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterTitle}>200/month</Text>
                <Text style={styles.cardFooterSubTitle}>+ € 0.0039 each other</Text>
              </View>
            </View>
            <View style={[styles.card, styles.elevation]}>
              <Text style={styles.cardTitle}>Mega</Text>
              <Text style={styles.cardSubTitle}>€12.99/mo</Text>
              <TouchableOpacity
                style={styles.cardButtonStyle}
                activeOpacity={0.5}
                onPress={()=>memberShip('MEGA')}
              >
                <Text style={styles.cardButtonTextStyle}>Change Plan</Text>
              </TouchableOpacity>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterTitle}>300/month</Text>
                <Text style={styles.cardFooterSubTitle}>+ € 0.0039 each other</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
  );
};
export default MemberShipScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  topTitleSection: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    height: 40,
  },
  topDateSection: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    height: 25,
  },
  topDateSubSection: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    height: 25,
    marginLeft: 30,
    borderRadius: 10,
  },
  cardContainer: {
    flex: 1,
    marginBottom: 10,
    marginTop: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: 175,
    marginVertical: 10,
    marginHorizontal: 10,
    // flex:1
  },
  cardTitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  cardSubTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 5,
  },
  cardContent: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: 2,
  },
  cardFooterTitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 2,
  },
  cardFooterSubTitle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    marginTop: 10,
    paddingVertical: 2,
  },
  cardButtonStyle: {
    flex: 1,
    backgroundColor: "#0049EE",
    padding: 10,
    borderRadius: 8,
    marginHorizontal:20
  },
  cardButtonTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  shadowProp: {
    shadowColor: "red",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 5,
    shadowColor: "#52006A",
  },
  topTitle: {
    fontSize: 16,
    fontWeight: "bold",
    height: 25,
  },
  topDate: {
    fontSize: 16,
    fontWeight: "bold",
    height: 25,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
