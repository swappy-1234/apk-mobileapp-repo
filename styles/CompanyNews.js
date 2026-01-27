import { StyleSheet} from "react-native";



export default StyleSheet.create({
    container : {
        width : 330,
        height : 'auto',
        backgroundColor : '#ffffff',
        borderRadius  :10,
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        gap : 10,
        marginBottom:10,
        
    },

    textContainer : {
        justifyContent : 'center',
        alignItems : 'center',

    },

    companyNewsInner : {
        display : 'flex',
        flexDirection : 'column',
        gap : 5,
        width : '100%',
    },

    companyNewsView : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        width : '100%',
        gap : 5,
    },

    newsView : {
        width : '100%',
        height : 120,
        borderColor : '#DEDEDE',
        borderWidth : 1,
        borderRadius : 20,
        padding : 8,
        marginVertical : 10,
        marginHorizontal : 10,
        justifyContent : 'center',
        alignItems : 'center',
    },

    newsViewText1 : {
        fontSize : 18,
        fontWeight : 'bold',
        padding : 2,
        borderRadius : 5,
    },

    newsViewText2 : {
        fontSize : 15,
    },

    
    viewButton : {
        justifyContent: "center",
        alignItems: "center",
    },


    newsButtonText : {
        marginVertical: 15,
        backgroundColor: "#19CF99",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    newsButtonCancel : {
        marginVertical: 15,
        backgroundColor: "#DEDEDE",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         fontSize: 16,
    },

    newsButtonDelete : {
        marginVertical: 15,
        backgroundColor: "#f63333ff",
        width: 150,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingTop: 12,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

    newsInput : {
         width: 250,
        height: 50,
        // paddingLeft: "1.25rem",
        borderRadius: 20,
        fontSize: 12,
        color: "#333",
        backgroundColor: "#F2F2F2",
        marginTop: 10,
        paddingHorizontal: 16,
        marginHorizontal : 10,

    },

    newsTextarea : {
         width: 250,
        height: 75,
        // paddingLeft: "1.25rem",
        borderRadius: 20,
        fontSize: 12,
        color: "#333",
        backgroundColor: "#F2F2F2",
        marginTop: 10,
        paddingHorizontal: 16,
        marginHorizontal : 10,
    },


    newsCard : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginHorizontal : 20,
        width : 250,
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