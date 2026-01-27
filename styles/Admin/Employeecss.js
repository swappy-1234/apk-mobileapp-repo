import { Platform, StyleSheet } from "react-native";
import {wp, hp} from '../Responsive';


export default StyleSheet.create({
     employeeContainer : {
        display : "flex",
        justifyContent : "center",
        alignItems : 'center',
    },

employerDashboardCard1: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  width: '322.18px',
  height: '71px',
  marginBottom:10,
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
     newsButtonText : {
        marginVertical: 8,
        marginRight:20,
        backgroundColor: "#19CF99",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },
    buttons:{
        display:'flex',
        flexDirection:'row',
    },

    table: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerRow: {
    backgroundColor: "#19CF99",
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
  },
cell: {
  padding: 10,
  width: 120,             // FIXED WIDTH
  maxWidth: 120,          // PREVENT EXPANDING
  flexWrap: "wrap",       // WRAP LONG TEXT
  borderRightWidth: 1,
  borderColor: "#ccc",
},

 modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    color:"red",
  },
  successTitle:{
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    color:"#19CF99",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },

  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  deleteBtn1: {
    backgroundColor: "#F44336",
  },

  cancelBtn: {
    backgroundColor: "gray",
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
   card: {
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  elevation: 4, // Android
  shadowColor: "#000", // iOS
  shadowOpacity: 0.1,
  shadowRadius: 6,
},
headerRow: {
  flexDirection: "row",
  alignItems: "center",
},
index: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#19CF99",
  marginRight: 12,
},
branchName: {
  fontSize: 17,
  fontWeight: "700",
  color: "#222",
},
branchCode: {
  fontSize: 13,
  color: "#777",
  marginTop: 2,
},
divider: {
  height: 1,
  backgroundColor: "#eee",
  marginVertical: 12,
},
addressText: {
  fontSize: 14,
  color: "#444",
  lineHeight: 20,
},
footerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
},
metaText: {
  fontSize: 13,
  color: "#666",
},



metaRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},
metaItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},
metaText: {
  fontSize: 13,
  color: "#666",
},
 updateBtn: {
    backgroundColor: "#19CF99",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color:"white",
    marginRight:10,
    marginLeft:10,
    fontWeight:"bold"
  },
  deleteBtn: {
    backgroundColor: "#F44336",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color:"white",
    fontWeight:"bold"
  },
  actionText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:12,
  },
  modalCenter:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"rgba(0,0,0,0.6)",
  },
  modalBox:{
    width:"80%",
    backgroundColor:"#fff",
    padding:20,
    borderRadius:10, 
    alignItems:'center',
  },
   branchModalBox:{
    width:"80%",
    backgroundColor:"#fff",
    padding:20,
    borderRadius:10, 
  },
  modalText:{
    fontSize:16,
    textAlign:"center",
    marginBottom:20,
    marginTop:15,
  },
  modalActions:{
    flexDirection:"row",
    gap:20,
  },
  yesBtn:{
    backgroundColor:"#19CF99",
    padding:10,
    borderRadius:8,
    minWidth:70,
    alignItems:"center",
  },
  noBtn:{
    backgroundColor:"#D95347",
    padding:10,
    borderRadius:8,
    minWidth:70,
    alignItems:"center",
  },
  okBtn:{
    backgroundColor:"#19CF99",
    padding:10,
    borderRadius:8,
    minWidth:70,
    alignItems:"center",
  },

  modalCenter: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.4)",
},

branchModalBox: {
  width: "90%",
  maxHeight: "60%",   //  prevents full screen
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 16,
},
special:{
  fontWeight:"bold",
},


  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    margin:10,
    alignItems:"center",
    color:"#fff",
  },

  active: {
    backgroundColor: "#97E9C3",
  },

  inactive: {
    backgroundColor: "#FDEAEA",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
   message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    marginTop:15,
    color: "#444",
  },
 filterInput:{
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:8,
        padding:10,
        marginLeft:20,
        marginRight:20,
    },

     heading:{
      flexDirection:"row",
      textAlign:"center",
        fontSize:25,
        fontWeight:"bold",
        color:"#19CF99",
        marginBottom:"10",
    },

  

});