import { Platform, StyleSheet } from "react-native";
import {wp,hp} from '../Responsive';

export default StyleSheet.create({
   


    employeeMainInner : {
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
    },

    employeeProfile : {
        fontSize : 18,
        color : '#19CF99',
        fontWeight : 600,
        marginBottom : 20,
    },

     profilePhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,        // 80 / 2
    height: 80,
    width: 80,
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  profileContainer : {
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-around',
    alignItems : 'center',
  },

 

   button: {
    width: '90%',
    height: hp(27),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal : 10,
    backgroundColor: '#19CF99', // set your button bg
  },

  button1: {
    width: '40%',
    height: hp(27),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal : 10,
    backgroundColor: '#19CF99', // set your button bg
  },

  buttonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
   employeeInside: {
    width: '100%',
    maxWidth: 213,
    height: hp(81),
    marginVertical: 10,
  },

  employeeText: {
    fontSize: 14,
    color: '#000000',
    paddingBottom: 10,
  },

  employeeBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 200,
    
    padding: 16,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E3EBF1',
    // gap alternative below
  },

  cardContainer : {
    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'center',
    alignItems : 'center',

  },

  card : {
    maxWidth : 890,
    width : '90%',
    height : 'auto',
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

    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 15,
  },
  closeWrapper: {
    alignItems: 'flex-end',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoCard: {
    marginTop: 15,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  primaryBtn: {
    padding: 10,
    borderRadius: 5,
  },
  secondaryBtn: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
  },

  cardAlign : {
    flexDirection  : 'row',
    justifyContent : 'space-around',
    alignItems : 'center',
    marginVertical : 10,

  },

})