import { StyleSheet } from "react-native";


export default StyleSheet.create({
  row: {
    flexDirection: "row",
  },

  headerRow: {
    backgroundColor: "#f1f5f9",
  },

  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 100,
    textAlign: "center",
    fontSize: 13,
  },

  nameCell: {
    width: 150,
    textAlign: "left",
  },

  idCell: {
    width: 120,
  },

  actionCell: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  gotoPage: {
    width: 70,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#fff",
  },

  //   hoursBox: {
  //   marginBottom: 4,
  // },

  actionRow: {
   
    justifyContent: "space-between",
    gap: 4,
    marginTop: 4,
  },

  button: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: "#2563eb",
    marginVertical: 2,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop : 8,
  },

  disabledButton: {
    backgroundColor: "#cbd5e1",
  },

  disabledText: {
    color: "#64748b",
  },

  container : {
     maxWidth : 890,
     
     maxHeight : 'auto',
    paddingHorizontal : 15,
    paddingVertical : 20,
    marginVertical : 15,
    marginHorizontal : 10,
    borderRadius : 20,
    backgroundColor  :'#FFFFFF',
     shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,           // Android layering
  zIndex: 9999,           // iOS layering
  },

  rowAlign : {
    flexDirection : 'row',
    justifyContent : 'space-around',
    marginVertical : 10,
  }

  
})