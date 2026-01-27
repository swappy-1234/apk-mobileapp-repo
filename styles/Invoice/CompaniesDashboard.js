import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
  container : {
    alignItems : 'center'
  },

  heading : {
    fontWeight : '600',
    fontSize : 20
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
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  closeContainer: {
    alignItems: "flex-end",
  },
  closeText: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // buttons side by side
    marginVertical: 10,
  },
  buttonStatus: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // equal width
    marginHorizontal: 5,
  },
  approve: {
    borderColor: 'orange',
  },
  reject: {
    borderColor: 'red',
  },
  buttonTextStatus: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  approveText: {
    color: 'orange',
  },
  rejectText: {
    color: 'red',
  },
   navigateButton : {
       alignSelf : 'flex-start'
    },

    navigateButtonText : {
         marginVertical: 22,
         marginHorizontal : 10,
        width: 200,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    rowStyling : {
      flexDirection : 'row',
      justifyContent : 'space-between',
    },

    headingText : {
      fontWeight : '500',
      fontSize : 15,
    },

    emailText : {
      color : 'grey',
    },

    countryText : {
      fontSize : 15,
    },

    styling : {
      flexDirection : 'row',
      justifyContent : 'space-around',
      marginVertical : 5,
        }
});