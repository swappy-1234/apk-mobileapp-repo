import { StyleSheet, Dimensions } from "react-native";

const {width,height} = Dimensions.get('window');

export default StyleSheet.create({
    mobiles: {
       
        top: 10,
        
        // height : height * 0.15,
        // padding : 10,
        height : 100,
        width : '100%'
    },

  
    mobileNavbarInner: {
        flexDirection : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding : 10,
        // width : width,
        height : 80,
        width : '100%',
    },

    talentflowLogo: {
        width : 200,
        height : 40,
        marginTop : 20,
       
    },

    menu: {
        
        alignSelf : 'flex-end',
        color : '#19CF99',
        fontWeight : 'bold',
        
        
    },
     
    mobileNavitems: {

        position : 'absolute',
        top: 85,
        left : 0,
        right : 0,
        backgroundColor : "#19CF99",
        paddingHorizontal : 16,
        overflow : 'hidden',
        zIndex : 9999,
        borderBottomLeftRadius : 8,
        borderBottomRightRadius : 8,
        height : 300,
        
    },

    navbarCard : {
        padding  :11,
        backgroundColor : "#ffffff",
        flexDirection : 'row',
       
        alignItems : 'center',
        gap : 3,
        borderWidth : 0,
        borderRadius : 10,
        width : '100%',
        marginTop : 8,
    },

    navbarCardText : {
        fontSize : 12,
        fontWeight : '600',
        color : "#19CF99",
    },

    sideMenu: {
        alignItems : 'center',
  position: "absolute",
  top: 80,
  bottom: 0,
  width: "100%",
  height : 1400,
  backgroundColor: "#fff",
  padding: 20,
  elevation: 10,
  zIndex: 999,
},

activeItem: {
  backgroundColor: "#19cf99",   // light blue (or any color you choose)
  width : '100%',
  borderRadius: 8,
 flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
},

activeText : {
    color : '#ffffff',
},

 bottomCard: {
    backgroundColor: "#19cf99",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 10,
      bottom : 0,
      height:'auto',
    
  },
  employeeProfile : {
        fontSize : 18,
        color : '#19CF99',
        fontWeight : 600,
        marginVertical : 22,
    },

     profilePhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,        // 80 / 2
    height: 60,
    width: 60,
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },

  profileContainer : {
    width : '100%',
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
  },








})