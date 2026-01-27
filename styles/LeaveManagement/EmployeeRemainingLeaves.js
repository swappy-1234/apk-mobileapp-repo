import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    container : {
        alignItems : 'center',
    },

     cardContainer: {
                  display : 'flex',
                  justifyContent : 'center',
                  // alignItems  :'center',
                   backgroundColor: '#FFFFFF',
                   borderRadius: 20,
                   width: wp(350),
                   height: 'auto',
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

              rowAlign : {
                flexDirection : 'row',
                justifyContent : 'space-evenly'
              },

              search : {
                width : '25%',
                borderWidth : 1,
                borderRadius : 10,
                borderColor : 'grey',
                marginTop : 10,
              }
})