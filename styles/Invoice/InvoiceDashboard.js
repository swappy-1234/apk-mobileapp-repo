import { StyleSheet, Platform } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    container : {
        alignItems : 'center',
    },

    con : {
        flexDirection : 'row'
    },

    navigateButton : {
        justifyContent : 'center',
        alignItems : 'center',
    },

    navigateButtonText : {
         marginTop: 22,
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

    searchContainer : {
                    flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Platform.OS === 'ios' ? '' : '#FFFFFF',
                        width: wp(180),      // don’t use "px" in React Native
                        height: hp(50),
                        borderRadius: 20,
                        shadowColor: '#64646F',
                      shadowOffset: { width: 0, height: 7 },
                      shadowOpacity: 0.2,
                      shadowRadius: 29,
                      elevation: 5,
                      overflow: 'visible', // ✅ VERY IMPORTANT for iOS
                      marginVertical : Platform.OS === 'ios' ? 15 : 5,
                      marginHorizontal : Platform.OS === 'ios' ? 15 : 5,
                },
    
                filterSelects : {
            width: wp(150),
            height : hp,
        // borderWidth: 2,
        borderRadius: 10,
        borderColor: '#E3EBF1',
        fontSize: 16,
        color: '#6F96AA',
        paddingHorizontal: 10, // optional: adds inner spacing
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

        alignStyling : {
            flexDirection : 'row',
            justifyContent : 'space-between',
            alignItems : 'center',
        },

        textStyling : {
            flexDirection : 'row',
            justifyContent : 'space-around',
        },

         textStyling1 : {
            flexDirection : 'row',
            justifyContent : 'center',
            paddingHorizontal : 10,
        },

        buttonText  : {
            marginTop: 10,
        width: 80,
        height:30,
        borderRadius: 10,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical : 5,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
        }

});