import { Platform, StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    leaveContainer : {
         display : "flex",
        justifyContent : "center",
        alignItems : 'center',
    },

    leaveButton : {
         justifyContent: "center",
        alignItems: "center",
    },

    datesAlign : {
        flexDirection : 'row',
    },

    cardContainer: {
            display : 'flex',
            justifyContent : 'center',
            // alignItems  :'center',
             backgroundColor: '#FFFFFF',
             borderRadius: 20,
             width: wp(350),
             height: hp(200),
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

        typeStatus : {
             display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        },

        deleteButton : {
            flexDirection : 'row',
            justifyContent: "center",
            // alignItems: "flex-end",

        },

        deleteText : {
            marginTop: 22,
        backgroundColor: "red",
        width: 100,
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

         searchContainer : {
        flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Platform.OS === 'ios' ? '' : '#FFFFFF',
            width: wp(322),      // don’t use "px" in React Native
            height: hp(71),
            borderRadius: 20,
            shadowColor: '#64646F',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.2,
          shadowRadius: 29,
          elevation: 5,
          overflow: 'visible', // ✅ VERY IMPORTANT for iOS
          marginVertical : Platform.OS === 'ios' ? 15 : 2,
    },

     filterSelects : {
        width: wp(271),
        height : hp,
    // borderWidth: 2,
    borderRadius: 10,
    borderColor: '#E3EBF1',
    fontSize: 16,
    color: '#6F96AA',
    paddingHorizontal: 10, // optional: adds inner spacing
    },

     viewButton : {
        justifyContent: "center",
        alignItems: "center",
    },


     buttonCancel : {
        marginVertical: 15,
        backgroundColor: "#DEDEDE",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         fontSize: 16,
    },

    buttonDelete : {
        marginVertical: 15,
        backgroundColor: "#f63333ff",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
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

buttonText: {
          marginVertical: 20,
        width: 120,
        height: 40,
        borderRadius: 10,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical: 10,
        shadowColor: "transparent",
         color: "#FFFFFF",
         fontSize: 16,
        marginHorizontal : 10
    },





    
})