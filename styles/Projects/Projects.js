import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
  container : {
    alignItems : 'center'
  },

  filtersBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    marginHorizontal : 10,
  },

  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: '48%',
  },

  picker: {
    // height: 40,
  },

  


     submitButton: {
        justifyContent: "center",
        alignItems: "center",
    },

   
     modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },

   overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10, // RN ≥ 0.71
  },
  yesBtn: {
    width: 80,
    paddingVertical: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  noBtn: {
    width: 80,
    paddingVertical: 8,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  errorBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 15,
  },
  okBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
  },


  searchContainer : {
          flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      width: wp(250),      // don’t use "px" in React Native
      height: hp(71),
      borderRadius: 20,
      shadowColor: '#64646F',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 5,
    overflow: 'visible', // ✅ VERY IMPORTANT for iOS
      },

      filterSelects : {
              width: wp(250),           // no 'px' in RN
          height: hp,
          // borderWidth: 2,
          borderRadius: 10,
          borderColor: '#E3EBF1',
          fontSize: 16,
          color: '#6F96AA',
          paddingHorizontal: 10, // optional: adds inner spacing
          },

           filterContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  width: wp(250),
  height: hp(71),
  marginTop: 20,
  flexDirection : 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  shadowColor: '#64646F',
  shadowOffset: { width: 0, height: 7 },
  shadowOpacity: 0.2,
  shadowRadius: 29,
  elevation: 5,
  overflow: 'visible', // ✅ VERY IMPORTANT for iOS
  zIndex: 1,
},

 searchIcons : {
        marginHorizontal : 10,
        marginVertical : 10,
        width : wp(16),
        height : hp(16),
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
            
             borderLeftWidth : 4,
             padding  : 10,
             
        },

        nameStyling : {
          color  : 'grey',
        },

        rowAlign : {
          flexDirection : 'row',
          justifyContent : 'space-around',
        },

        viewButtonText: {
          marginVertical: 20,
        width: 120,
        height: 40,
        borderRadius: 10,
        textAlign: "center",
        paddingVertical: 10,
        shadowColor: "transparent",
        borderWidth : 2,
        borderColor : '#1591EA',
        color : '#1591EA',
         fontSize: 16,
        marginHorizontal : 10
    },

    updateButtonText: {
          marginVertical: 20,
        width: 120,
        height: 40,
        borderRadius: 10,
        textAlign: "center",
        paddingVertical: 10,
        shadowColor: "transparent",
        borderWidth : 2,
        borderColor : 'orange',
        color : 'orange',
         fontSize: 16,
        marginHorizontal : 10
    },
    

});
