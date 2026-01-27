import { StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({

    container : {
        padding : 10
    },
     reportingFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },

  totalEmployeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  label: {
    color: "#6F96AA",
    fontSize: 13,
  },

  count: {
    fontWeight: "bold",
    fontSize: 16,
  },

  searchInput: {
    minWidth: 160,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
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

     overlay: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
    
})