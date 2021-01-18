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
import { Row } from "native-base";
import { useGlobalState } from "state-pool";
import { scan, imageUpload } from "../api/api";

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
  const [formVisible, setFormVisible] = useState(false);
  const [drawData, setDrawData] = useState(null);
  const [userID, setUserID, updateUserID] = useGlobalState("userID");
  const [filePath, setFilePath] = useState("");

  const [title, setTitle] = useState("");

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  const [selectArray, setSelectArray] = useState([]);
  const [arrayType, setArrayType, updateArrayType] =
    useGlobalState("arrayType");

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
        height: 1335,
        uri: "https://scannget-v2.s3.eu-west-1.amazonaws.com/temp/ocr.jpg",
        width: 900,
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
    setSelectArray([]);
  };
  const __scanPhoto = () => {
    setLoading(true);
    // let filename = (capturedImage.uri).split('/').pop();
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;
    
    // const uploadData = new FormData();
    // uploadData.append('fileData', { uri: capturedImage.uri, name: filename, type });
    // const imagepath = '';
    // // console.log(uploadData);
    // // return
    // imageUpload(uploadData).then((res) => {
    //   console.log("imageupload-------------------" + res.data.filepath);
    //   imagepath = axios.defaults.baseURL + res.data.filepath;
    // });
    imagepath = "https://scannget-v2.s3.eu-west-1.amazonaws.com/temp/ocr.jpg"

    const data = new FormData();
    data.append("url", imagepath);
    data.append("language", language);
    data.append("apikey", "K87766372188957");
    data.append("isOverlayRequired", "True");
    data.append("isTable", "True");
    data.append("FileType", ".Auto");
    data.append("isSearchablePdfHideTextLayer", "True");
    data.append("detectOrientation", "True");
    data.append("scale", "True");

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
        let widthRate =
            capturedImage.width / Dimensions.get("screen").width;
            let heightRate =
            capturedImage.height / Dimensions.get("screen").height;
            console.log("start====", widthRate, "=====", heightRate);
        console.log(res.ParsedResults)
        if(!res.ParsedResults) {
          setLoading(false);
          alert("Action Failed. Try again.");
          return
        }
        var parsedResults = res.data.ParsedResults;
        var ocrExitCode = res.data.OCRExitCode;
        var isErroredOnProcessing = res.data.IsErroredOnProcessing;
        var errorMessage = res.data.ErrorMessage;
        var errorDetails = res.data.ErrorDetails;
        var processingTimeInMilliseconds =
        res.data.ProcessingTimeInMilliseconds;
        if (parsedResults != null) {
          let content;
          if (selectArray.length != 0) {
            content = "draw";
            // let widthRate =
            // capturedImage.width / Dimensions.get("screen").width;
            // let heightRate =
            // capturedImage.height / Dimensions.get("screen").height;
            // console.log("start====", widthRate, "=====", heightRate);
            for (let i = 0; i < selectArray.length; i++) {
              for (let j = 0; j < parsedResults[0].TextOverlay.Lines.length; j++) {
                  for (let k = 0; k < parsedResults[0].TextOverlay.Lines[j].Words.length; k++) {                  
                      let topPoint = parsedResults[0].TextOverlay.Lines[j].Words[k].Top;
                      let leftPoint = parsedResults[0].TextOverlay.Lines[j].Words[k].Left;
                      
                      if ( selectArray[i].Left * widthRate <= leftPoint &&
                        (selectArray[i].Left + selectArray[i].Width) * widthRate >= leftPoint &&
                        selectArray[i].Top * heightRate <= topPoint &&
                        (selectArray[i].Top + selectArray[i].Height) * heightRate >= topPoint
                        ) {
                    setLoading(false);
                    content = selectArray[i].Title + " : " + parsedResults[0].TextOverlay.Lines[j].Words[k].WordText;
                  }
                }
              }
            }
          } else {
            content = parsedResults[0].ParsedText;
          }

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
              let formData = new FormData();
              formData.append("userId", userID);
              formData.append("imagePath", capturedImage.uri);
              formData.append("filePath", filename);
              formData.append("content", content);
    
              scan(formData).then((res) => {    
                console.log("scan-------", res.data.message);
              })
              
              Sharing.shareAsync(filename);
              navigation.replace("DrawerNavigationRoutes");
            });
          });



        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const onPress = (event) => {
    const { x, y, translationX, translationY } = event.nativeEvent;
    if (!start) setStart({ x: y, y: x });
    setDimensions({ w: translationX, h: translationY });
  };
  const onEnd = () => {
    if (!start) return;
    setEnd(start);
    setStart(null);
    setTitle("");
    setTitleVisible(true);
    setDrawData({
      Top: start.x,
      Left: start.y,
      Width: dimensions.w,
      Height: dimensions.h,
    });
  };

  const saveTitle = () => {
    if (title == "") {
      alert("Please input title");
      return;
    }
    let temp = [...selectArray];
    temp.push({
      Title: title,
      Top: drawData.Top,
      Left: drawData.Left,
      Width: drawData.Width,
      Height: drawData.Height,
    });
    setSelectArray(temp);
    // setTitle("");
    setDrawData(null);
    setStart(null);
    setTitleVisible(false);
  };

  const saveForm = () => {
    if (title == "") {
      alert("Please input title");
      return;
    }
    updateArrayType((old) => {
      let temp = [...old];
      temp.push({
        title: title,
        data: selectArray,
      });
      return temp;
    });
    setStart(null);
    setFormVisible(false);
  };

  const CameraPreview = ({ photo }) => {
    return (
      <PanGestureHandler onGestureEvent={onPress} onEnded={onEnd}>
        <View style={{ width: "100%", height: "100%", }}>
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
          }}
        >
          <Loader loading={loading} />
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
                <Text style={styles.modalText}>
                  Do you Want save? Please input title.
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setTitle}
                  value={title}
                  placeholder="Please input title"
                  keyboardType="text"
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={saveTitle}
                  >
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setTitleVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={formVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setFormVisible(!formVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Form type save</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setTitle}
                  value={title}
                  placeholder="Please input title"
                  keyboardType="text"
                />
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={saveForm}
                  >
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setFormVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          {selectArray.length != 0 && (
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectArray([]);
                }}
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
                  borderColor: "red",
                  borderWidth: 2,
                  backgroundColor: "#fff",
                  zIndex: 999,
                }}
              >
                <Ionicons name="trash" size={20} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFormVisible(true);
                  setTitle("");
                }}
                style={{
                  position: "absolute",
                  left: "5%",
                  top: "17%",
                  backgroundColor: flashMode === "off" ? "#000" : "#fff",
                  borderRadius: 50,
                  height: 30,
                  width: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#02a801",
                  borderWidth: 2,
                  backgroundColor: "#fff",
                  zIndex: 999,
                }}
              >
                <Ionicons name="save-sharp" size={20} color="#02a801" />
              </TouchableOpacity>
            </View>
          )}
          {arrayType.length != 0 && (
            <View style={styles.arrayType}>
              <Picker
                selectedValue={language}
                style={styles.pickerStyle}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectArray(itemValue);
                }}
              >
                {arrayType.map((item, index) => (
                  <Picker.Item
                    label={item.title}
                    value={item.data}
                    key={index}
                  />
                ))}
              </Picker>
            </View>
          )}
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
                      borderWidth: 1,
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
      <StatusBar style="auto" />
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
    width: "40%",
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
  arrayType: {
    position: "absolute",
    left: "60%",
    top: "10%",
    borderRadius: 50,
    height: 30,
    width: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "#0049ee",
    zIndex: 999,
  },
});
