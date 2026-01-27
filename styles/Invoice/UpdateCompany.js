import { StyleSheet } from "react-native";


export default StyleSheet.create({
  heading : {
    fontSize : 20,
    fontWeight : '600'

  },
     input: {
    borderWidth: 1,
    borderColor: "#ccc",
    height : 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
    marginTop : 5,
  },

  inputPicker : {
    borderWidth: 1,
    borderColor: "#ccc",
    height : 50,
    borderRadius: 8,
    
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    marginTop : 5,

  },

  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
  counterText: {
    fontSize: 12,
    marginTop: 2,
    alignSelf: "flex-end",
  },

   textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    minHeight: 100,
  },

   submitButton: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        width: 120,
        height: 50,
        borderRadius: 10,
        borderWidth: 0,
        textAlign: "center",
        paddingVertical: 15,
        shadowColor: "transparent",
         fontWeight: "bold",
         color: "#FFFFFF",
         fontSize: 16,
    },

})