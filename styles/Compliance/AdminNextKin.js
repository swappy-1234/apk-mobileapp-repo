import { StyleSheet } from "react-native";


export default StyleSheet.create({
     card : {
    height : 'auto',
    width : 350,
    paddingHorizontal : 15,
    paddingVertical : 20,
    marginVertical : 15,
    borderRadius : 20,
    backgroundColor  :'#FFFFFF',
     shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,           // Android layering
  zIndex: 9999,           // iOS layering

  },

   input: {
   flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
  },

   labelCard : {
    marginVertical : 10,
    flexDirection : 'row',
    justifyContent : 'space-between'
  },

  label : {
    marginVertical : 5,
    fontWeight : '600'

  },

  pickerWrapper: {
     width: 250,
    overflow: "hidden", // IMPORTANT for Android
       borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
  },

  heading : {
    fontWeight : 'bold',
    fontSize : 20,
    textAlign : 'center',

  },

  button: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        width: 150,
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


});