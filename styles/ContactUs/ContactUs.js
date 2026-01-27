import { StyleSheet } from "react-native";
import {hp,wp} from '../Responsive';

export default StyleSheet.create({
     inputCont: {
   width: '100%',
    maxWidth: 213,
    height: hp(81),
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    paddingBottom: 10,
  },
  input: {
   flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    
    padding: 16,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
  },

  mainHeading : {
    textAlign : 'center',
    fontSize : 22,
    fontWeight : 'bold',
    color : '#19CF99',
    margin : 10,
  },

  container : {
    width: '90%',                 // width: 100%
    maxWidth: 890,                 // works in RN (newer versions)
    height: 'auto',
    paddingVertical: 15,
    paddingHorizontal: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',           // center container
    marginHorizontal : 10,
    marginVertical : 20,
  },

   button: {
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
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

     pickerWrapper: {
     width: 300,
    overflow: "hidden", // IMPORTANT for Android
       borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
  },

  picker: {
    color: "#000",
  },

   overlay: {
    flex: 1,
   
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    alignItems: "center",

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },

  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },

  

});