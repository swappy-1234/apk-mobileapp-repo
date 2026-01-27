import { Dimensions, StyleSheet } from "react-native";

const {width, height} = Dimensions.get('window');


export default StyleSheet.create({
    login: {
        flex : 1,
        backgroundColor : "#18c390",
        justifyContent : "center",
        alignItems : "center",
    },
    loginBlock1: {
        backgroundColor : "#ffffff",
        width: width * 0.9, // 90% of the screen width
        maxWidth: 560,
        height: height * 0.8, // 70% of the screen height
        maxHeight: 650,
        borderRadius: 32,
        // boxShadow: "0 0 30px rgba(0,0,0,0.1)",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
        //flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },

    formContent: {
        width: width * 0.8, // responsive width
        //height: 400,
        // paddingTop: 15,
        // paddingBottom: 57,
        alignItems: "center",
    },

    logo: {
        width: width * 0.6,
        height: 54,
        // marginLeft: "auto",
        // marginRight: "auto",
        resizeMode: "contain",
        alignSelf: "center",
    },

    title: {
        paddingTop: 33,
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
        color: "#19CF99"
    },

    inputField: {
        width: 250,
        height: 50,
        // paddingLeft: "1.25rem",
        borderRadius: 32,
        fontSize: 12,
        color: "#333",
        backgroundColor: "#F2F2F2",
        marginTop: 34,
        paddingHorizontal: 16,
    },

    inputMargin: {
        marginTop: 24,
    },

    submitButton: {
        // marginTop: 22,
        // backgroundColor: "#19CF99",
        // width: 200,
        // height: 50,
        // borderRadius: 32,
        // borderWidth: 0,

        justifyContent: "center",
        alignItems: "center",
        // shadowColor: "transparent",
        // elevation: 4,
    },

    buttonText: {
          marginTop: 22,
        backgroundColor: "#19CF99",
        width: 200,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        // justifyContent: "center",
        // alignItems: "center",
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    forgotPassword: {
        color: "#1e40af",
        marginTop: 16,
    },

    terms: {
        fontSize: 12,
        textAlign: "center",
        paddingTop: 24,
    },

     modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // dim background
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",          // <-- control width
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 10,         // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },



})

// background-color: #18c390;
//     background-image: url('../../assets/LoginBanner.jpg');
//     height: 100vh;
//     width: 100vw;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;