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

   overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    maxHeight: "70%",
    borderRadius: 10,
    padding: 15,
  },
  closeWrapper: {
    alignItems: "flex-end",
  },
  closeText: {
    fontSize: 28,
    lineHeight: 28,
  },
  content: {
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  deleteBtn: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },

   actionRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent : 'space-around'
  },
  updateBtn: {
    backgroundColor: "#2563eb", // primary blue
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  updateText: {
    color: "#fff",
    fontWeight: "600",
  },
//    container: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 6,
//     marginVertical: 10,
//   },

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
    
        nameStatus : {
            display : 'flex',
            
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  arrow: {
    fontSize: 16,
    fontWeight: "600",
  },

  viewButtonText: {
       alignSelf : 'flex-end',
        color : '#1591EA',
         fontSize: 16,
    },

    updateButtonText: {
          marginVertical: 20,
        width: 120,
        height: 40,
        borderRadius: 10,
        textAlign: "center",
        paddingVertical: 10,
        shadowColor: "transparent",
        borderWidth : 2,
        borderColor : 'orange',
        color : 'orange',
         fontSize: 16,
        marginHorizontal : 10
    },

     deleteButtonText: {
          marginVertical: 20,
        width: 120,
        height: 40,
        borderRadius: 10,
        textAlign: "center",
        paddingVertical: 10,
        shadowColor: "transparent",
        borderWidth : 2,
        borderColor : 'red',
        color : 'red',
         fontSize: 16,
        marginHorizontal : 10
    },

    rowAlign : {
      flexDirection : 'row',
      justifyContent : 'space-around',
      marginVertical : 5,
    },

     buttonText: {
          marginVertical: 20,
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