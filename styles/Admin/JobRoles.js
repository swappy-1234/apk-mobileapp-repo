import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  heading: { fontSize: 25, fontWeight: "bold", color:'#19CF99'},
  row: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: "#19CF99",
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  filterInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: "red", marginVertical: 5 },

  // card: {
  //   flexDirection: "row",
  //   padding: 14,
  //   borderRadius: 12,
  //   marginBottom: 12,
  //   elevation:2,
  //   alignItems: "center",
  //   backgroundColor:"#fff",
  // },
 card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  index: { 
   fontSize:15,
   fontWeight:"bold",
   color:"#19CF99",
   alignItems:"center",
   marginRight:12,
  },
  roleName: { flex: 1, fontSize: 16 },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 7,
    padding: 8,
  },
  actions: { flexDirection: "row" },
  updateBtn: { backgroundColor: "#19CF99", padding: 6, borderRadius: 6, marginLeft: 5 },
  deleteBtn: { backgroundColor: "#D9534F", padding: 6, borderRadius: 6, marginLeft: 5 },
  saveBtn: { backgroundColor: "#19CF99", padding: 6, borderRadius: 6, marginLeft: 5 },
  cancelBtn: { backgroundColor: "gray", padding: 6, borderRadius: 6, marginLeft: 5 },
  actionText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  modalCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalActions: {
    flexDirection: "row",
    gap: 20,
  },
  yesBtn: { backgroundColor: "#19CF99", padding: 10, borderRadius: 8, minWidth: 70, alignItems: "center" },
  noBtn: { backgroundColor: "#D9534F", padding: 10, borderRadius: 8, minWidth: 70, alignItems: "center" },
  okBtn: { backgroundColor: "#19CF99", padding: 10, borderRadius: 8, minWidth: 70, alignItems: "center" },
  
  dropdown: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 10,
  marginRight:6,
  Width:150,
},

updateDropdown:{
   borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  minWidth:135,
},

dropdownText: {
  color: "#333",
},

modalOverlay: {
  flex: 1,
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
},

modalContent: {
  backgroundColor: "#fff",
  margin: 30,
  borderRadius: 8,
  padding: 10,
},

option: {
  padding: 12,
  borderBottomWidth: 1,
  borderColor: "#eee",
},
 daysText: {
    fontSize: 13,
    color:"#777",
    marginTop:2,
    marginLeft:25,
  },
   actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

   headerRow: {
    flexDirection: "row",
    alignItems:"center"
  },
   daysValue: {
    fontWeight: "bold",
  },

   leaveType:{
            fontSize:17,
            fontWeight:"700",
            color:"#222",
        },
        input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  minWidth:135,
  },
  errorInput: {
    borderColor: "red",
  },

    row:{
      flexDirection:"row",
      
      marginBottom:10,
    },
    col:{
      flex:1,
    },
    errorText:{
      color:"red",
    },
});
