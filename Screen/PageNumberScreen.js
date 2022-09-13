import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useGlobalState } from "state-pool";
import { getFiles } from "../api/api";
import Loader from "./Components/Loader";

const PageNumberScreen = ({ navigation }) => {

    const [fileData, setFileData, updateFileData] = useGlobalState('fileData');
    const [fileCount, setFileCount, updateFileCount] = useGlobalState('fileCount');
    const [indexPage, setIndexPage, updateIndexPage] = useGlobalState('indexPage');
    const [perPage, setPerPage, updatePerPage] = useGlobalState('perPage');
    const [fileName, setFileName, updateFileName] = useGlobalState('fileName');
    const [ userID, setUserID, updateUserID ] = useGlobalState('userID');
    const [ loading, setLoading ] = useState(false);

    const perPageClick = (number) => {
        setLoading(true)
        if(number === 'all')
            number = 0
        updatePerPage((old) =>{ return number })
        updateIndexPage((old) => { return 0 })
        getFiles(userID, fileName, 0, number)
            .then(res => {
                setLoading(false)
                updateFileData((old) => {
                    return res.data;
                })
                updateFileCount((old) => {
                    return res.count
                })
                navigation.navigate('homeScreenStack')
            })
            .catch((err) => {
                setLoading(false);
            })
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />
            <Text>No File Shows</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick(10)
                }}>
                    <Text style={styles.circleText}>10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick(20)
                }}>
                    <Text style={styles.circleText}>20</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick(50)
                }}>
                    <Text style={styles.circleText}>50</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick(100)
                }}>
                    <Text style={styles.circleText}>100</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick(200)
                }}>
                    <Text style={styles.circleText}>200</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
            <TouchableOpacity style={styles.circleItem} onPress={() => {
                    perPageClick('all')
                }}>
                    <Text style={styles.circleText}>ALL</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PageNumberScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    row: {
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    circleItem: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#0049EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    circleText: {
        color: 'white',
        fontSize: 17
    }
})