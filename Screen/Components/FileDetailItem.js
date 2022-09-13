import React, { useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState } from "state-pool";
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import Constants from "expo-constants";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";


const { width } = Dimensions.get("window");

const date = new Date()
const today = date.toISOString().slice(0, 10);

const ItemText = ({ type, detail }) => {
    return (
        <View style={{ width: '50%', }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12 }}>{type} - {detail}</Text>
        </View>
    )
}

const makeTime = (time) => {
    var t = time.split(/[- :]/);

    // Apply each element to the Date function
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    let periodTime = date - d;
    if (periodTime < (10 * 1000))
        return "1 sec ago"
    if (periodTime < (60 * 1000))
        return new Date(periodTime).getSeconds() + " seconds ago";
    if (periodTime < (3600 * 1000))
        return new Date(periodTime).getMinutes() + " minuts ago";
    if (periodTime < (3600 * 24 * 1000))
        return new Date(periodTime).getHours() + " hours ago";
    if (periodTime < (3600 * 24 * 30 * 1000)){
        return new Date(periodTime).getDate() + " days ago"
    }
    if (periodTime < (3600 * 24 * 30 * 12 * 1000))
        return new Date(periodTime).getMonth() + " months ago"
    if (periodTime < (3600 * 24 * 30 * 12 * 10 * 1000))
        return new Date(periodTime).getFullYear() + " years ago"
    return "long time ago"
}

const isNew = (time, index) => {
    var t = time.split(/[- :]/);
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var new_date = new Date();

    if (new_date.getFullYear() === d.getFullYear() && new_date.getMonth() === d.getMonth() && new_date.getDate() === d.getDate()) {
        return true
    }

    return false;
}

const viewFile = async (file_url) => {
    // Linking.openURL("com.google.android.apps.docs.editors.sheets"+file_url)
    Linking.openURL("googlechrome://navigate?url="+file_url)
    // const pkg = Constants.manifest.releaseChannel
    //     ? Constants.manifest.android.package  // When published, considered as using standalone build
    //     : "com.google.android.apps.docs.editors.sheets"; // In expo client mode
    // startActivityAsync(
    //     'android.intent.action.MAIN',
    //     { data: 'package:' + pkg },
    // )


    // Linking.openURL(file_url)
    // navigation.navigate('excelScreenStack', { file: data.preview_link })
}

const FileDetailItem = ({ data, index }) => {
    const [token, setToken, updateToken] = useGlobalState("token")
    const [detailData, setDeatailData, updateDetailData] = useGlobalState('detailData')
    const navigation = useNavigation();

    return (
        <View style={styles.fullContainer}>
            <View style={styles.container}>
                <View style={styles.body}>
                    <ItemText type={"Buyer"} detail={data.buyer_name} />
                    <ItemText type={"Season"} detail={data.season_no} />
                    <ItemText type={"Full Buyer"} detail={data.buyer} />
                    <ItemText type={"FTY No"} detail={data.style_no} />
                    <ItemText type={"WS No"} detail={data.ws_no} />
                    <ItemText type={"Group"} detail={data.group_name} />
                    {/* <ItemText type={"MCN"} detail={data.mcn_name} /> */}
                    {/* <ItemText type={"Status"} detail={data.file_status} /> */}
                    {/* <ItemText type={"Production By"} detail={data.production_line} /> */}
                    <ItemText type={"Created At"} detail={makeTime(data.created_at)} />
                    <ItemText type={"Updated At"} detail={makeTime(data.updated_at)} />
                </View>
                <View style={styles.detail}>
                    <TouchableOpacity onPress={() => {
                        viewFile(data.preview_link)
                    }}
                        style={styles.iconContainer}
                    >
                        <Text style={styles.detailInfo} style={{ fontSize: 13 }}>View File</Text>
                        <FontAwesome name="file" size={19} color="#0049EE" style={styles.detailIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        updateDetailData((old) => { return data })
                        navigation.navigate('detailScreenStack')
                    }}
                        style={styles.iconContainer}
                    >
                        <Text style={styles.detailInfo} >View Detail</Text>
                        <Ionicons name="information-circle-sharp" size={24} color="#0049EE" style={{ ...styles.detailIcon, ...{ marginBottom: -3 } }} />
                    </TouchableOpacity>
                </View>
                {
                    isNew(data.created_at, index)
                        ? <View style={styles.newContainer}>
                            <Text>new</Text>
                        </View>
                        : null
                }
            </View>
        </View>
    )
}

export default FileDetailItem;

const styles = StyleSheet.create({
    fullContainer: {
        width: width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '95%',
        flex: 1,
        elevation: 2,
        shadowColor: '#545354',
        // borderBottomWidth: 1,
        borderBottomColor: '#585858',
    },
    body: {
        flex: 2,
        width: '100%',
        height: 100,
        flexWrap: 'wrap'
    },
    detail: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
        flexDirection: 'row',
        paddingRight: 20

    },
    detailInfo: {
        fontSize: 13,
        marginLeft: 10
    },
    detailIcon: {
        marginLeft: 5,
    },
    newContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#54f5b9',
        borderRadius: 50,
        position: 'absolute',
        right: 30,
        bottom: 40,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})