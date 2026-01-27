import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f6f7fb",
    paddingBottom: 80,
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#19CF99",
    marginLeft:10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { fontWeight: "700", marginBottom: 8, color: "#19CF99" },
  row: { flexDirection: "row", gap: 12, marginBottom: 10 },
  col: { flex: 1 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
 input1: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    height:45,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  ge:{
    fontSize:14,
  },
  star:{
    color:"red",
  },
  error: { color: "red", marginTop: 6, fontSize: 12 },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  roleBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e6e6e6" },
  roleBtnActive: { backgroundColor: "#19CF99", borderColor: "#19CF99" },
  roleText: {},
  roleTextActive: { color: "#fff", fontWeight: "700" },
  fileBtn: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, backgroundColor: "#fafafa" },
  submitBtn: { backgroundColor: "#19CF99", padding: 14, borderRadius: 12, alignItems: "center" },

  // modal styles
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalCard: { width: "92%", maxHeight: "80%", backgroundColor: "#fff", padding: 12, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  modalSearch: { borderWidth: 1, borderColor: "#eee", padding: 8, borderRadius: 8, marginBottom: 8 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#f1f1f1" },
  modalClose: { marginTop: 8, backgroundColor: "#19CF99", padding: 10, borderRadius: 8, alignItems: "center" },

  roleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},

roleBtn: {
  flex: 1,
  marginHorizontal: 5,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: "#F1F1F1",
  alignItems: "center",
},

roleBtnActive: {
  backgroundColor: "#19CF99",
},

roleText: {
  color: "#444",
  fontWeight: "500",
},

roleTextActive: {
  color: "white",
  fontWeight: "600",
},

accessHeading: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 10,
},

accessContainer: {
  backgroundColor: "#F8F8F8",
  padding: 10,
  borderRadius: 10,
},

accessRow: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 6,
},

checkbox: {
  width: 20,
  height: 20,
  borderColor: "#19CF99",
  borderWidth: 2,
  borderRadius: 4,
  marginRight: 10,
},

checkboxActive: {
  backgroundColor: "#19CF99",
},

accessLabel: {
  fontSize: 15,
},

modalCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1a8763",
  },

  modalMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },

  modalText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },

  // okBtn: {
  //   marginTop: 20,
  //   backgroundColor: "#1a8763",
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },

   okBtn:{
    backgroundColor:"#19CF99",
    padding:10,
    borderRadius:8,
    minWidth:70,
    alignItems:"center",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  copyRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#f5f6fa",
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginVertical: 5,
  borderRadius: 8,
},

copyLabel: {
  fontSize: 14,
  color: "#333",
  flex: 1,
  paddingRight: 10,
},


pickerOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
},

pickerContainer: {
  width: "60%",
  maxHeight: "50%",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

searchInput: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
},

option: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

optionText: {
  fontSize: 16,
},

closeBtn: {
  marginTop: 10,
  alignItems: "center",
  backgroundColor:"#19CF99",
  padding:10,
  borderRadius:12,
},

closeText: {
  color: "#fff",
  fontWeight: "bold",
},

});