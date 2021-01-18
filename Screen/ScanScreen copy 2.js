import react, { useState, useRef, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Picker,
  Dimensions,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Document, Packer, Paragraph } from "docx";
import Loader from "./Components/Loader";
import {
  GestureEvent,
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const OCRCountryCode = [
  { name: "Arabic", key: "ara" },
  { name: "Bulgarian", key: "bul" },
  { name: "Chinese(Simplified)", key: "chs" },
  { name: "Chinese(Traditional)", key: "cht" },
  { name: "Croatian", key: "hrv" },
  { name: "Czech", key: "cze" },
  { name: "Danish", key: "dan" },
  { name: "Dutch", key: "dut" },
  { name: "English", key: "eng" },
  { name: "Finnish", key: "fin" },
  { name: "French", key: "fre" },
  { name: "German", key: "ger" },
  { name: "Greek", key: "gre" },
  { name: "Hungarian", key: "hun" },
  { name: "Korean", key: "kor" },
  { name: "Italian", key: "ita" },
  { name: "Japanese", key: "jpn" },
  { name: "Polish", key: "pol" },
  { name: "Portuguese", key: "por" },
  { name: "Russian", key: "rus" },
  { name: "Slovenian", key: "slv" },
  { name: "Spanish", key: "spa" },
  { name: "Swedish", key: "swe" },
  { name: "Turkish", key: "tur" },
];

export default function ScanScreen({ navigation }) {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [language, setLanguage] = useState("eng");
  const [loading, setLoading] = useState(false);
  const [draw, setDraw] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState("");
  const [titleVisible, setTitleVisible] = useState(false);
  const [drawData, setDrawData] = useState(null);

  const [title, setTitle] = useState("")

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  const [selectArray, setSelectArray] = useState([]);

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
      // const photo = await cameraRef.current.takePictureAsync();
      const photo = {
        height: 520,
        uri: "https://reactnative.dev/img/homepage/phones.png",
        width: 400,
      };
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
    setLoading(true);
    const data = new FormData();
    data.append("url", capturedImage.uri);
    data.append("language", language);
    data.append("apikey", "K87766372188957");
    data.append("isOverlayRequired", "True");

    const options = {
      method: "POST",
      url: "https://api.ocr.space/parse/image",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(options)
      .then(function (res) {
        setLoading(false);
        console.log(res.data);
        var parsedResults = res.data.ParsedResults;
        var ocrExitCode = res.data.OCRExitCode;
        var isErroredOnProcessing = res.data.IsErroredOnProcessing;
        var errorMessage = res.data.ErrorMessage;
        var errorDetails = res.data.ErrorDetails;
        var processingTimeInMilliseconds =
          res.data.ProcessingTimeInMilliseconds;
        console.log(parsedResults);
        if (parsedResults != null) {
          let content;
          if (draw != true) {
            content = parsedResults[0].ParsedText;
          } else {
            content = "draw";
          }
          setModalVisible(true);
          setResult(content);
          console.log(content);

          // let doc = new Document({
          //   sections: [
          //     {
          //       children: [new Paragraph({ text: content })],
          //     },
          //   ],
          // });

          // Packer.toBase64String(doc).then((base64) => {
          //   const filename = FileSystem.documentDirectory + "MyDoc.docx";
          //   FileSystem.writeAsStringAsync(filename, base64, {
          //     encoding: FileSystem.EncodingType.Base64,
          //   }).then(() => {
          //     console.log(`Saved file: ${filename}`);
          //     Sharing.shareAsync(filename);
          //     navigation.replace("DrawerNavigationRoutes");
          //   });
          // });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const drwaPolygon = () => {
    // setDraw(true);
  };

  const onPress = (event) => {
    const { x, y, translationX, translationY } = event.nativeEvent;
    if (!start) setStart({ x: y, y: x });
    setDimensions({ w: translationX, h: translationY });
    console.log("========", event.nativeEvent);
  };
  const onEnd = () => {
    if (!start) return;
    setEnd(start);
    setStart(null);
    setTitleVisible(true);
    setDrawData({ Top: start.y, Left: start.x, Width: dimensions.w, Height: dimensions.h});
    console.log(
      "==left:",
      start.y,
      "==top:",
      start.x,
      "==width:",
      dimensions.w,
      "==height:",
      dimensions.h
    );
  };

  const saveTitle = () => {
    // setSelectArray([...selectArray, { Title: title, Top: drawData.Top, Left: drawData.Left, Width: drawData.Width, Height: drawData.Height }]);
    setTitle("");
    setDrawData(null);
    setTitleVisible(false);
  }

  const CameraPreview = ({ photo }) => {
    return (
      <PanGestureHandler onGestureEvent={onPress} onEnded={onEnd}>
        <View style={{ width: "100%", height: "100%", backgroundColor: "red" }}>
          <View
            style={{
              position: "absolute",
              backgroundColor: "blue",
              top: start?.x ?? end?.x,
              left: start?.y ?? end?.y,
              width: dimensions?.w ?? 0,
              height: dimensions?.h ?? 0,
            }}
          />
        </View>
      </PanGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      {setPreviewVisible && !capturedImage ? (
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
      ) : (
          <ImageBackground
            source={{ uri: capturedImage.uri }}
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "red",
            }}
          >
            <Modal
          animationType="slide"
          transparent={true}
          visible={titleVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setTitleVisible(!titleVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Do you Want save? Please input title.</Text>
              <TextInput
                style={styles.input}
                onChange={setTitle}
                value={title}
                placeholder="Please input title"
                keyboardType="text"
              />
              <View style={{display: "flex"}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={saveTitle}
              >
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setTitleVisible(!titleVisible)}
              >
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </Modal>
          <PanGestureHandler onGestureEvent={onPress} onEnded={onEnd}>
            <View style={{ width: "100%", height: "100%" }}>
              {selectArray.map((item, index) => {
                return (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "#56ff0040",
                      top: item.Top,
                      left: item.Left,
                      width: item.Width,
                      height: item.Height,
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "#56ff00",
                      borderWidth: 1
                    }}
                    key={index}
                  >
                    <Text
                      style={{
                        color: "#0014ff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.Title}
                    </Text>
                  </View>
                );
              })}
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#56ff0040",
                  borderColor: "#56ff00",
                  borderWidth: 1,
                  top: start?.x ?? end?.x,
                  left: start?.y ?? end?.y,
                  width: dimensions?.w ?? 0,
                  height: dimensions?.h ?? 0,
                }}
              />
            </View>
          </PanGestureHandler>
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

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={language}
                  style={styles.pickerStyle}
                  onValueChange={(itemValue, itemIndex) => {
                    setLanguage(itemValue);
                  }}
                >
                  {OCRCountryCode.map((item, index) => (
                    <Picker.Item
                      label={item.name}
                      value={item.key}
                      key={index}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={__scanPhoto}
                style={styles.buttonStyle}
              >
                <Ionicons name="scan-sharp" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  pickerContainer: {
    backgroundColor: "#0049ee",
    borderWidth: 5,
    borderRadius: 50,
    borderColor: "#fff",
    height: 70,
  },
  pickerStyle: {
    height: 60,
    width: 130,
    color: "white",
    fontWeight: "bold",
  },
  buttonStyle: {
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
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
    backgroundColor: "#0049ee",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    // height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderColor: "#0049ee",
    borderRadius: 10,
  },
});
