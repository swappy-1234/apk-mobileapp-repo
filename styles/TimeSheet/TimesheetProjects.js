import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    container : {
        alignItems : 'center',
    },

    card : {
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
                       overflow: 'visible', //  VERY IMPORTANT for iOS
                       borderLeftColor : '#19cf99',
                       borderLeftWidth : 4,
                       padding  : 10,
    },

    heading : {
        fontWeight : '600',
        fontSize : 22,
    },

     button : {
        justifyContent : 'center',
        alignItems : 'center',
    },

    buttonText : {
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

     rowAlign : {
    flexDirection : 'row',
    justifyContent : 'space-around',
   
  },

  head : {
    color : 'grey'
  },

  name : {
    fontSize : 18,
  },


});