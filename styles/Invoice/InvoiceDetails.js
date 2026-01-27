import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container : {
        alignItems : 'center',
    },

   cardContainer : {
            maxWidth : 890,
    width : '90%',
    height : 'auto',
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

        heading : {
            fontWeight : 'bold',
            fontSize : 20,
        },

        sideHeading : {
            fontWeight : '600',
            fontSize : 15,
        },

        alignStyling : {
            flexDirection : 'row',
            justifyContent : 'space-between',
        }


});