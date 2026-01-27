import { StyleSheet } from "react-native";


export default StyleSheet.create({

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    backgroundColor: "#fff",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemRow: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  readOnly: {
    backgroundColor: "#f5f5f5",
    color: "#555",
  },
 
  removeBtn: {
    padding: 8,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginTop: 6,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

    
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },

  container: {
    backgroundColor: "#f9fafb",
    padding: 16,
    height : 'auto'
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  invoiceTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  dateBox: {
    marginTop: 8,
    alignItems: "center",
  },

  // card: {
  //   backgroundColor: "#fff",
  //   padding: 16,
  //   borderRadius: 10,
  //   marginBottom: 16,
  //   elevation: 2,
  // },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },

  bold: {
    fontWeight: "600",
  },

  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  itemCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  itemTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  totalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },

  totalRow: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },

  totalText: {
    fontSize: 16,
    fontWeight: "700",
  },

  submitBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
formContainer  : {
  alignItems  :'center'

},
  cardContainer : {
     width : 340,
        height : 'auto',
        backgroundColor : '#ffffff',
        borderRadius  :10,
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        gap : 10,
        marginBottom:10,
        padding : 10
  },

  heading : {
    fontSize : 20,
    fontWeight : 600
  },

  rowAlign : {
    flexDirection : 'row',
    
  },

  pickerStyle : {
    borderWidth : 1,
    borderColor : 'grey',
    borderRadius : 10
  },

  rowDate : {
    flexDirection : 'row',
    justifyContent : 'space-between'
  },


  dateInput : {
     borderWidth : 1,
    borderColor : 'grey',
    borderRadius : 10,
    padding : 10
  },

  textArea : {
    borderWidth : 1,
    borderColor : 'grey',
    borderRadius : 10,
    padding : 10,
    minHeight : 100
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


});