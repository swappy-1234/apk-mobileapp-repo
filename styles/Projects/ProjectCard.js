import { StyleSheet } from "react-native";
import {wp, hp} from "../Responsive";

export default StyleSheet.create({
     cardItems: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    width: 160,
    borderRadius: 8,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  cardItemText: {
    fontSize: 15,
    color: "#333",
  },

  projectItems: {
    marginVertical: 10,
  },

  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },

  membersList: {
    paddingLeft: 10,
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  memberText: {
    fontSize: 14,
    color: "#333",
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
})