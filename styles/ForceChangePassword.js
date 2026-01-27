import { StyleSheet } from "react-native";

export default StyleSheet.create({
    employeeChangepassword: {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',

    },

    employeeChangepasswordDashboard : {
        backgroundColor : '#ffffff',
        borderRadius : 10,
        textAlign : 'center',
        width : '100%',
        // maxWidth : 300,
        height : 'auto',
         justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : 10,

    },

    changeFormGroup : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        textAlign : 'left',
        fontSize : 14,
        
    },

    inputField : {
        width: 250,
        height: 50,
        // paddingLeft: "1.25rem",
        borderRadius: 32,
        fontSize: 12,
        color: "#333",
        backgroundColor: "#F2F2F2",
        paddingHorizontal: 16,
        marginVertical : 10,
    },


    viewButton : {
          justifyContent: "center",
        alignItems: "center",

    },
    buttonConfirm : {
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
    buttonCancel : {
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

    }

})