import { StyleSheet } from "react-native";

export default StyleSheet.create({
    inputColumn: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  required: {
    color: "red",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  errorText: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },

    textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },

  dateInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  dateText: {
    color: "#000",
    fontSize: 14,
  },
  placeholder: {
    color: "#999",
    fontSize: 14,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },

 
   disabledInput: {
    backgroundColor: "#f2f2f2",
    color: "#777",
  },

   tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 13,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cellText: {
    flex: 1,
    fontSize: 13,
  },
  pickerCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#777",
  },
 
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  okButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
//   tableHeader: {
//     flexDirection: "row",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "#f5f5f5",
//   },
//   headerText: {
//     flex: 1,
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//   },
//   cellText: {
//     flex: 1,
//     fontSize: 13,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#999",
//     fontSize: 14,
//   },
  
 tableContainer: {
  flex : 1,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow : 'visible'
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    alignItems: "center",
  },

  headerRow: {
    backgroundColor: "#f5f5f5",
  },

  cell: {
    paddingHorizontal: 8,
    fontSize: 13,
  },

  nameCol: {
    width: "30%",
    fontWeight: "500",
  },

  designationCol: {
    width: "25%",
  },

  roleCol: {
    width: "25%",
  },

  roleStyle : {
    width: 90,
    height : 20,
    borderWidth : 1,
    
    justifyContent : 'center',
    
  },

  roleName :  {
    fontSize : 13,
    width : 70
  },

  statusCol: {
    width: "20%",
  },

  noData: {
    textAlign: "center",
    padding: 15,
    color: "red",
  },
  container : {
  padding : 10
},
  
  rowAlign : {
    flexDirection : 'row',
    justifyContent : 'space-between'
  },
  heading : {
    fontSize : 20,
  },

  para : {
    color : 'grey'
  },
 

  head : {
    fontSize : 18,
    margin : 10
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