import { StyleSheet } from "react-native";
export default StyleSheet.create({
    heading:{
        fontSize:25,
        fontWeight:"bold",
        color:"#19CF99",
    },
    row:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:5,
    },
    input:{
        flex:1,
        borderWidth:1,
        borderColor:"#ccc",
        padding:10,
        borderRadius:8,
    },
    addBtn:{
        backgroundColor:"#19CF99",
        padding:12,
        borderRadius:8,
        marginLeft:5,
        paddingHorizontal:18,
        marginTop:5,
        },
        addBtnText:{
            color:"#fff",
            fontWeight:"bold",
        },
        filterInput:{
            borderRadius:8,
            borderColor:"#ddd",
            borderWidth:1,
            padding:10,
            marginBottom:10,
        },
        error:{
            color:"red",
            marginVertical:5,
        },

        card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems:"center"
  },
  index: {
    fontSize:15,
    fontWeight: "bold",
    color: "#19CF99",
    alignItems:"center",
    marginRight:12,
  },
  daysText: {
    fontSize: 13,
    color:"#777",
    marginTop:2,
    marginLeft:25,
  },
  daysValue: {
    fontWeight: "bold",
  },
  col:{
    flex:1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  minWidth:135,
  },
  input1:{
    marginLeft:5,
  },
  errorInput: {
    borderColor: "red",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

   updateBtn:{
        backgroundColor:"#19CF99",
        padding:6,
        borderRadius:6,
        marginLeft:5,
    },
    deleteBtn:{
        backgroundColor:"#D9534F",
        padding:6,
        borderRadius:6,
        marginLeft:5,
    },
    actionText:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:12,
    },
     
        editInput:{
            flex:1,
            borderWidth:1,
            borderColor:"#aaa",
            borderRadius:7,
            padding:8,
        },
        leaveType:{
            fontSize:17,
            fontWeight:"700",
            color:"#222",
        },

        modalCenter:{
          flex:1,
          justifyContent:"center",
          alignItems:"center",
          backgroundColor:"rgba(0,0,0,0.6)"
        },
        modalBox:{
          width:"80%",
          backgroundColor:"#fff",
          padding:20,
          borderRadius:10,
          alignItems:"center",
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
    backgroundColor:"#D9534F",
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
 saveBtn:{
        backgroundColor:"#19CF99",
        padding:6,
        borderRadius:6,
        marginLeft:5,
    },
    cancelBtn:{
        backgroundColor:"gray",
        padding:6,
        borderRadius:6,
        marginLeft:5,
    },



    row:{
      flexDirection:"row",
      gap:12,
      marginBottom:10,
    },
    col:{
      flex:1,
    },
    label:{
      fontSize:13,
      fontWeight:"600",
      marginBottom:6,
    },

    errorText:{
      color:"red",
    }
   
})