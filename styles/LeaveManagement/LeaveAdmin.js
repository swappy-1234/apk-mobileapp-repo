import { StyleSheet, Platform } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
    leaveContainer : {
        display : "flex",
        justifyContent : "center",
        alignItems : 'center',
        height : 'auto'
    },

     searchContainer : {
            flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Platform.OS === 'ios' ? '' : '#FFFFFF',
                width: wp(322),      // don’t use "px" in React Native
                height: hp(71),
                borderRadius: 20,
                shadowColor: '#64646F',
              shadowOffset: { width: 0, height: 7 },
              shadowOpacity: 0.2,
              shadowRadius: 29,
              elevation: 5,
              overflow: 'visible', // ✅ VERY IMPORTANT for iOS
              marginVertical : Platform.OS === 'ios' ? 15 : 2,
        },

         filterSelects : {
        width: wp(271),
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

       adminStatus: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8, //  works like space-x-2
},

approveBtn: {
    borderWidth: 1,
    borderColor: "#19CF99",
    borderRadius: 7,
    padding: 5,
    backgroundColor: "white",
  },

  approveText: {
    color: "#19CF99",
    fontSize: 12,
  },

  approvePressed: {
    backgroundColor: "#19CF99",
  },

  approveTextPressed: {
    color: "white",
  },

  rejectBtn: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 7,
    padding: 5,
    backgroundColor: "white",
  },

  rejectText: {
    color: "red",
    fontSize: 12,
  },

  rejectPressed: {
    backgroundColor: "red",
  },

  rejectTextPressed: {
    color: "white",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },

  counter: {
    fontSize: 12,
    alignSelf: "flex-end",
    color: "#666",
    marginTop: 5,
  },

});