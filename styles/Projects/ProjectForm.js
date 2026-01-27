import { StyleSheet } from "react-native";


export default StyleSheet.create({
  section: {
    marginVertical: 15,
  },

  field: {
    marginBottom: 20,
  },

  // label: {
  //   fontWeight: "600",
  //   marginBottom: 6,
  //   fontSize: 15,
  // },

  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 6,
  //   padding: 10,
  //   fontSize: 14,
  // },

  textarea: {
    height: 100,
    textAlignVertical: "top", // ensures text starts at the top-left
  },

  submitButton: {
        justifyContent: "center",
        alignItems: "center",
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
  headerCell: {
    flex: 1,
    marginLeft: 10,
  },

  
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  cell: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

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
    marginTop: 20,
    color: "red",
    alignSelf: "center",
    fontSize: 14,
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
  }
});
