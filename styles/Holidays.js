import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container : {
         width : 370,
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
     viewButton : {
        justifyContent: "center",
        alignItems: "center",
    },

     holidaysButtonText : {
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

      holidaysInput : {
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

    holidayCardContainer : {
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',

    },

    holidayCard : {
       
       width : '75%',
        height : 75,
        borderColor : '#F1F1F1',
        borderWidth : 2,
        borderRadius : 20,
        padding : 8,
        margin  :10,
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#FFFFFF',
    },

     holidaysCard : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginHorizontal : 20,
        width : 250,
    },

     overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  message: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
 button: {
    paddingVertical: 12,
    borderRadius: 6,
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



})