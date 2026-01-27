import { StyleSheet, Platform } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
     completed: {
    color: "#65a30d", // lime-700
    fontWeight: "600",
  },
  pending: {
    color: "#1d4ed8", // blue-700
    fontWeight: "600",
  },
  lastDay: {
    color: "#f97316", // orange-500
    fontWeight: "600",
  },
  overdue: {
    color: "#dc2626", // red-600
    fontWeight: "600",
  },

  dash: {
    textAlign: "center",
    fontSize: 16,
  },

  completedBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  completedText: {
    fontWeight: "600",
  },

  revertBtn: {
    backgroundColor: "#fee2e2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  revertText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  container : {
          display : "flex",
          justifyContent : "center",
          alignItems : 'center',
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
  
      filterContainer: {
          display : 'flex',
          flexDirection : 'row',
          justifyContent : 'space-around',
           alignItems: 'center',
           backgroundColor: '#FFFFFF',
           borderRadius: 20,
           width: wp(322),
           height: hp(71),
           marginTop: 20,
           shadowColor: '#64646F',
           shadowOffset: { width: 0, height: 7 },
           shadowOpacity: 0.2,
           shadowRadius: 29,
           elevation: 5,
           overflow: 'visible', // ✅ VERY IMPORTANT for iOS
           zIndex: 1,
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
  
      nameStatus : {
          display : 'flex',
          flexDirection : 'row',
          justifyContent : 'space-between',
      },

       pageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },

  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  pageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  selectedText: {
    color: "#fff",
  },

  arrow: {
    fontSize: 16,
    fontWeight: "700",
  },
  
})