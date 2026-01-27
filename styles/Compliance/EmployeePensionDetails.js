import { StyleSheet, Platform } from "react-native";
import {wp, hp} from '../Responsive';

export default StyleSheet.create({
    container : {
        alignItems : 'center'
    },

    heading : {
        fontSize : 18,
        fontWeight : 600,
    },

    alignStyling : {
        flexDirection : 'row',
        justifyContent : 'space-around'
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

    
             button : {
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




})