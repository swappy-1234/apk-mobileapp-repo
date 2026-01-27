// import { Label } from "@react-navigation/elements";
// import { Dimensions, StyleSheet } from "react-native";

// const {width, height} = Dimensions.get('window');


// export default StyleSheet.create({
//     login: {
//         flex : 1,
//         backgroundColor : "#18c390",
//         justifyContent : "center",
//         alignItems : "center",
//     },

//      loginBlock1: {
//         backgroundColor : "#ffffff",
//         width: width * 0.9, // 90% of the screen width
//         maxWidth: 560,
//         height: height * 0.8, // 70% of the screen height
//         maxHeight: 650,
//         borderRadius: 32,
//         // boxShadow: "0 0 30px rgba(0,0,0,0.1)",
//         shadowColor: "#000",
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 8,
//         //flex: 1,
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         paddingVertical: 20,
//     },

//     formContent: {
//         width: width * 0.8, // responsive width
//         //height: 400,
//         // paddingTop: 15,
//         // paddingBottom: 57,
//         alignItems: "center",
//     },

   

//     inputField: {
//         width: 250,
//         height: 50,
//         // paddingLeft: "1.25rem",
//         borderRadius: 32,
//         fontSize: 12,
//         color: "#333",
//         backgroundColor: "#F2F2F2",
//         marginTop: 34,
//         paddingHorizontal: 16,
//     },
    

//     inputMargin: {
//         marginTop: 24,
//         fontSize: 16,
//     },

//     submitButton: {
//         // marginTop: 22,
//         // backgroundColor: "#19CF99",
//         // width: 200,
//         // height: 50,
//         // borderRadius: 32,
//         // borderWidth: 0,

//         justifyContent: "center",
//         alignItems: "center",
//         // shadowColor: "transparent",
//         // elevation: 4,
//     },

//      logo: {
//         width: width * 0.6,
//         height: 54,
//         // marginLeft: "auto",
//         // marginRight: "auto",
//         resizeMode: "contain",
//         alignSelf: "center",
//     },

//     buttonText: {
//           marginTop: 22,
//         backgroundColor: "#19CF99",
//         width: 200,
//         height: 50,
//         borderRadius: 32,
//         borderWidth: 0,
//         // justifyContent: "center",
//         // alignItems: "center",
//         textAlign: "center",
//         paddingTop: 12,
//         shadowColor: "transparent",
//          fontWeight: "bold",
//          color: "#FFFFFF",
//          fontSize: 16,
//     },

//     countryCard: {
//         width: 250,
//         height: 'auto',
//         maxHeight : 200,
//         backgroundColor: "#f9f9f9",
//         padding: 12,
//         marginVertical: 6,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: "#ddd",
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowOffset: {width: 0, height: 2},
//         shadowRadius: 3, 

//     },

//     countryText: {
//         fontSize: 16,
//         color: "#333",
//         textAlign: "center",
//         height: 50,
//     },



// })



import { Dimensions, StyleSheet, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  login: {
    flex: 1,
    backgroundColor: "#18c390",
    justifyContent: "center",
    alignItems: "center",
  },

  loginBlock1: {
    backgroundColor: "#ffffff",
    width: width * 0.9,
    maxWidth: 560,
    minHeight: height * 0.75,
    borderRadius: 32,
    paddingVertical: 20,
    justifyContent : 'center',
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  formContent: {
    width: width * 0.8,
    alignItems: "center",
  },

  inputField1: {
    width: 250,
    height: 50,
    borderRadius: 32,
    backgroundColor: Platform.OS === "ios" ? "" : "#F2F2F2",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8, // FIX iOS TEXT ALIGNMENT
    justifyContent: "center",
    marginVertical : Platform.OS === "ios" ? 30 : 8,
  },

  inputField2: {
    width: Platform.OS === "ios" ? 200 :  250,
    height: 50,
    borderRadius: 32,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8, // FIX iOS TEXT ALIGNMENT
    justifyContent: "center",
    textAlign : Platform.OS !== "ios" ? 'auto' : 'center',
    
  },

  

  inputMargin: {
    marginTop: 20,
    fontSize: 16,
  },

  submitButton: {
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    backgroundColor: "#19CF99",
    width: 200,
    height: 50,
    borderRadius: 32,
    textAlign: "center",
    paddingVertical : 15,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  logo: {
    width: width * 0.6,
    height: 54,
    resizeMode: "contain",
    alignSelf: "center",
  },

  countryCard: {
    // position : 'absolute',
    // width: 250,
    // maxHeight: 200,
    // backgroundColor: "#f9f9f9",
    // padding: 10,
    // marginTop: 10,
    // borderRadius: 10,
    // borderColor: "#ddd",
    // borderWidth: 1,
    // zIndex: 999,
    position: 'absolute',
      top: 200,            // distance below input
                   // align properly under the input
      alignSelf: 'center',    // center in the container
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      width: 250,
      maxHeight: 200,     // better than fixed height (scrolls if list too long)
      paddingVertical: 8,
      paddingHorizontal: 12,
    
      // shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,           // Android layering
      zIndex: 9999,           // iOS layering
  },

  countryText: {
    fontSize: 16,
    color: "#333",
    height: 50,
    textAlign: "center",
    paddingVertical: 14,
  },
});
