import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container:{
        padding:15,
        backgroundColor:"#fff",
    },
    heading:{
        fontSize:25,
        fontWeight:"bold",
        color:"#19CF99"
    },
    row:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:10,
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
        marginLeft:10,
    },
    addBtnText:{
        color:"#fff",
        fontWeight:"bold"
    },
    error:{
        color:"red",
        marginVertical:5,
    },
    filterInput:{
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:8,
        padding:10, 
        marginBottom:10,
    },
    // card:{
    //     flexDirection:"row",
    //     padding:12,
    //     borderWidth:1,
    //     borderColor:"#ddd",
    //     borderRadius:10, 
    //     marginBottom:10,
    //     alignItems:"center",
    // },

     card: {
        flexDirection:"row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    alignItems:"center",
  },
    index:{
        // fontWeight:"bold",
        // color:"#19CF99",
        // width:30,
        fontSize:15,
    fontWeight: "bold",
    color: "#19CF99",
    alignItems:"center",
    marginRight:12,
    },
    roleName:{
        flex:1,
        fontSize:16,
    },
    editInput:{
        flex:1,
        borderWidth:1, 
        borderColor:"#aaa",
        borderRadius:7,
        padding:8,
    },
    actions:{
        flexDirection:"row",
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
    charLimit:{
        color:"red",
        margin:5,
        marginTop:0,
    },
    errorText: {
  color: "red",
  fontSize: 12,
  marginTop: 4,
},

inputError: {
  borderColor: "red",
},

})