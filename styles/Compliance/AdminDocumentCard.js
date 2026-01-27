import { StyleSheet } from "react-native";

export default StyleSheet.create({
    card : {
    height : 'auto',
    width : '350',
    paddingHorizontal : 15,
    paddingVertical : 20,
    marginVertical : 15,
    borderRadius : 20,
    backgroundColor  :'#FFFFFF',
     shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,           // Android layering
  zIndex: 9999,           // iOS layering

  },

   input: {
   flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
  
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
  },

  labelCard : {
    marginVertical : 10,
    flexDirection : 'row',
    justifyContent : 'space-around'
  },

  label : {
    fontWeight : '600'

  },

  button: {
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
          marginTop: 22,
        
        width: 150,
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

     overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  close: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    height: 400,
  },
  preview: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },

   statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // buttons side by side
    marginVertical: 10,
  },
  buttonStatus: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // equal width
    marginHorizontal: 5,
  },
  approve: {
    borderColor: 'green',
  },
  reject: {
    borderColor: 'red',
  },
  buttonTextStatus: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  approveText: {
    color: 'green',
  },
  rejectText: {
    color: 'red',
  },
})