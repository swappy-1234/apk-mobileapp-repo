import { Platform, StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';


export default StyleSheet.create({
     cardContainer: {
            display : 'flex',
            justifyContent : 'center',
            // alignItems  :'center',
             backgroundColor: '#FFFFFF',
             borderRadius: 20,
             width: wp(350),
          //    height: hp(200),
             marginTop: 20,
             shadowColor: '#64646F',
             shadowOffset: { width: 0, height: 7 },
             shadowOpacity: 0.2,
             shadowRadius: 29,
             elevation: 5,
             overflow: 'visible', // ✅ VERY IMPORTANT for iOS
             borderLeftColor : '#19cf99',
             borderLeftWidth : 4,
             padding  : 10,
             
        },

        input: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  enabledInput: {
    backgroundColor: "#fff",
    borderColor: "#888",
  },
  disabledInput: {
    backgroundColor: "#e5e5e5",
    borderColor: "#ccc",
    opacity: 0.6,
  },

  bottomCard : {
   display : 'flex',
            justifyContent : 'center',
            // alignItems  :'center',
             backgroundColor: '#FFFFFF',
             borderRadius: 20,
             width: wp(300),
          //    height: hp(200),
             marginTop: 20,
             shadowColor: '#64646F',
             shadowOffset: { width: 0, height: 7 },
             shadowOpacity: 0.2,
             shadowRadius: 29,
             elevation: 5,
             overflow: 'visible', // ✅ VERY IMPORTANT for iOS
             padding  : 10,
  },

   submitButton: {
        justifyContent: "center",
        alignItems: "center",
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

    createButton : {
      flexDirection : 'row',
      width : '40%',
      justifyContent : 'space-around',
      alignItems : 'center',
      borderWidth : 1,
      borderColor : 'black',
      borderRadius : 8,
      padding : 8,
      alignSelf : 'flex-end',
      margin : 10
    },
})