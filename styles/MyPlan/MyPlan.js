import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container : {
        justifyContent : 'center',
        alignItems : 'center',
    },

    heading : {
        fontWeight : 'bold',
        fontSize : 25,

    },

    card : {
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

    cardAlign : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginVertical :10,
    },

    para : {
        fontSize : 18,
        fontWeight : '600',
        margin : 10,
        textAlign : 'center',

    },

      button: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        backgroundColor: "#19CF99",
        width: 200,
        height: 50,
        borderRadius: 32,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },
})