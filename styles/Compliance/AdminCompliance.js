import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({

    container : {
        alignItems  :'center'
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
                 borderLeftColor : '#19cf99',
                 borderLeftWidth : 4,
                 padding  : 10, 
            },

            button: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        width: 80,
        height: 30,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    
});