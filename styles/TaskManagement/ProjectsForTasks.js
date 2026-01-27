import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    container : {
        padding : 10

    },
     filtersInnerBlock: {
    flexDirection: "row",
    gap: 10,               // RN 0.71+
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
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

          heading : {
            fontSize : 20,
          },

          para : {
            fontSize : 15,
            color : 'grey'

          },

          statusAlign : {
            textAlign : 'right'
          },
          rowAlign : {
            flexDirection : 'row',
            justifyContent : 'space-around'
          },


          buttonText: {
          marginVertical: 10,
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
    
})