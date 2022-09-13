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
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Loader from "./Components/Loader";

const MemberShipScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const memberShip = (type) => {
    const MEMBERSHIPTYPE = {
      BASIC: 0,
      PRO: 4.99,
      ULTRA: 8.99,
      MEGA: 12.99
    };
    console.log(MEMBERSHIPTYPE[type]);
  }

  return (
      <View style={styles.mainBody}>
        <Loader loading={loading} />
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
});
