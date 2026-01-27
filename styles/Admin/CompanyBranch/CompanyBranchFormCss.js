import { StyleSheet } from "react-native";
export default StyleSheet.create({
    card:{
        backgroundColor:"#fff",
        borderRadius:12, 
        padding:12,
        marginBottom:12,
        shadowColor:"#000",
        shadowOpacity:"0.04",
        shadowRadius:6,
        elevation:2.
    },
    cardHeader:{
        fontSize:20,
        fontWeight:"700",
        marginBottom:8,
        color:"#19CF99", 
    },
    row:{
        flexDirection:"row",
        gap:12,
        marginBottom:10
    },
    col:{
        flex:1,
    },
    label:{
        fontSize:13, 
        fontWeight:"600",
        marginBottom:6
    },
    input:{
        borderWidth:1,
        borderColor:"#e6e6e6",
        padding:12,
        borderRadius:10,
        backgroundColor:"#fff"
    },
    error:{
        color:"red",
        marginTop:6,
        fontSize:12,
    },
    cancelBtn:{
        backgroundColor:"gray",
        padding:6,
        borderRadius:6,
        width:50,
    },
    submitBtn:{
        backgroundColor:"#19CF99",
        padding:6,
        borderRadius:6,
        width:60,
        marginLeft:70,
       alignItems:"center"
    },
    actionText:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:12,
    },
    space:{
        justifyContent:"space-between",
    },
    modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

modalContainer: {
  backgroundColor: "#fff",
  padding: 16,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  maxHeight: "70%",
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
  padding: 12,
  alignItems: "center",
},

closeText: {
  color: "#19CF99",
  fontWeight: "bold",
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
star:{
    color:"red",
},
loaderOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
}

})