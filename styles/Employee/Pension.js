import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        width: '90%',                 // width: 100%
    maxWidth: 890,                 // works in RN (newer versions)
    height: 'auto',
    paddingVertical: 15,
    paddingHorizontal: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',           // center container
    marginHorizontal : 10,
    marginVertical : 10,
    },

    label : {
        marginTop : 8,

    },

    dateStyle : {
        borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  width : 150,
                  textAlign : 'center',

    },

    cardContainer : {
        flexDirection : 'row',
        justifyContent : 'space-around',
        marginVertical : 10,
    },

    cardAlign : {
        flexDirection : 'row',
        justifyContent : 'center',
        marginVertical : 10,
    },




     button: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        backgroundColor: "#19CF99",
        width: 130,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 15,
    },

    heading : {
        fontWeight : '600',
        fontSize : 18,
        textAlign : 'center',

    },


    

});