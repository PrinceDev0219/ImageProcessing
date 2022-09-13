import react, { useState, useRef, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Document, Packer, Paragraph } from "docx";

export default function ScanScreen({ navigation }) {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    onHandlePermission();
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };

  const __takePicture = async () => {
    try {
      if (!cameraRef) return;
      const photo = await cameraRef.current.takePictureAsync();
      // const photo = {
      //   height: 520,
      //   uri: "https://d33wubrfki0l68.cloudfront.net/d74da08f08b4a17c368b58d36ee23c368b4a6819/fff62/img/homepage/phones.png",
      //   width: 400,
      // };
      setPreviewVisible(true);
      setCapturedImage(photo);
    } catch (e) {
      console.log(e);
    }
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };
  const __scanPhoto = () => {
    const data = new FormData();
    data.append("url", capturedImage.uri);
    data.append("language", "eng");
    data.append("apikey", "");
    data.append("isOverlayRequired", "True");

    const options = {
      method: "POST",
      url: "https://ocr43.p.rapidapi.com/v1/results",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "8fb18408e6msh2326c56053314f4p18c5e3jsnc4945db965b4",
        "X-RapidAPI-Host": "ocr43.p.rapidapi.com",
      },
      data: data,
    };

    axios
      .request(options)
      .then(function (response) {
        if (response.data.results[0].status.code == "ok") {
          const content =
            response.data.results[0].entities[0].objects[0].entities[0].text;

          let doc = new Document({
            sections: [
              {
                children: [new Paragraph({ text: content })],
              },
            ],
          });

          Packer.toBase64String(doc).then((base64) => {
            const filename = FileSystem.documentDirectory + "MyDoc.docx";
            FileSystem.writeAsStringAsync(filename, base64, {
              encoding: FileSystem.EncodingType.Base64,
            }).then(() => {
              console.log(`Saved file: ${filename}`);
              Sharing.shareAsync(filename);
              navigation.replace("DrawerNavigationRoutes");
            });
          });
        } else {
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const CameraPreview = ({ photo }) => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo.uri }}
          style={{
            flex: 1,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={__retakePicture}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderColor: "#fff",
                borderWidth: 5,
                borderRadius: 50,
                backgroundColor: "#0049ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera-reverse" size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={__scanPhoto}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderColor: "#fff",
                borderWidth: 5,
                borderRadius: 50,
                backgroundColor: "#0049ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="scan-sharp" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {setPreviewVisible && capturedImage ? (
        <CameraPreview photo={capturedImage} />
      ) : (
        <Camera style={styles.camera} ref={cameraRef} flashMode={flashMode}>
          <TouchableOpacity
            onPress={__handleFlashMode}
            style={{
              position: "absolute",
              left: "5%",
              top: "10%",
              backgroundColor: flashMode === "off" ? "#000" : "#fff",
              borderRadius: 50,
              height: 30,
              width: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#0049ee",
              borderWidth: 2,
              backgroundColor: "#fff",
            }}
          >
            <Ionicons name="flashlight" size={20} color="#0049ee" />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              flex: 1,
              width: "100%",
              padding: 20,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignSelf: "center",
                flex: 1,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={__takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderColor: "#fff",
                  borderWidth: 5,
                  borderRadius: 50,
                  backgroundColor: "#0049ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="camera" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
