import { StyleSheet } from "react-native";
export default StyleSheet.create({
    heading:{
        fontSize:25,
        fontWeight:"bold",
        color:"#19CF99",
    },
    addBtn:{
        backgroundColor:"#19CF99",
        padding:12,
        borderRadius:8,
        marginLeft:10,
        color:"white"
    },
    addBtnText:{
        color:"#fff",
        fontWeight:"bold"
    },
    filterInput:{
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:8,
        padding:10,
        marginTop:10,
        marginBottom:10,
    },
    error:{
        color:"red",
        marginVertical:5,
    },
    card:{
        flexDirection:"row",
        padding:12,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:10, 
        marginBottom:10,
        alignItems:"center",
    },
    index:{
        fontWeight:"bold",
        width:30,
        
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

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},
   header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

})