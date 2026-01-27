import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';


export default StyleSheet.create({
     formContainer : {
         display : "flex",
        justifyContent : "center",
        alignItems : 'center',
    },

    formCards : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        gap : 10,
        marginVertical : 10,
    },

     searchContainer : {
        flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            
            width: wp(130),      // don’t use "px" in React Native
            height: hp(40),

          
          overflow: 'visible', // ✅ VERY IMPORTANT for iOS
          borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 5,
                  borderRadius: 8,
    },

     pickerWrapper: {
        width : 100,
        height : 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  disabledPicker: {
    backgroundColor: "#f0f0f0",
  },

     filterSelects : {
        height : hp,
        width: wp(150),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#E3EBF1',
   

    paddingHorizontal: 5, // optional: adds inner spacing
    },

    leaveButton : {
         justifyContent: "center",
        alignItems: "center",
        marginVertical  :10,
    },

     buttonText: {
          marginTop: 22,
        backgroundColor: "#19CF99",
        width: 150 ,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        // justifyContent: "center",
        // alignItems: "center",
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    input : {
        width : '90%',
        borderWidth : 1,
        borderRadius : 6,
         borderColor: '#ccc',
    }



})