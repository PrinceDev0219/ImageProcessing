import React from "react"
import { View, Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native"
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const ExcelViewer = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={async () => {
                    await navigation.goBack();
                }} style={styles.back}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <WebView
                style={styles.webview}
                source={{ uri: route.params.file }}
            />
        </View>
    )
}

export default ExcelViewer

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        zIndex: 99,
    },
    webview: {
        position: 'absolute',
        top: 50,
        width: width,
        height: height
    },
    back: {
        position: 'absolute',
        top: 20,
        left: 20,
    }
})