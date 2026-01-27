import { StyleSheet, Dimensions } from "react-native";

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    employeeDashboard : {
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        
        // width : width,     
    },

    employeeDashboardInner : {
        flex : 1,
        backgroundColor : "#f1f1f1",
        width : width,
        
    },

    scrollStyle  :{
        alignItems  :'center',
        padding  :20,
        
        
    },


    employeeDashboardBlock1 : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent :'center',
        alignItems : 'center',
       

    },

    employeeDashboardBlock1Card1  :{
        width : width * 0.9,
        height : 'auto',
        backgroundColor : '#ffffff',
        borderRadius  :10,
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        gap : 10,
        marginBottom:10,
        padding : 5,

    },


    employeeDashboardBlock1Card1Inner : {
        flexDirection : 'row',
        flexWrap : 'wrap',
        justifyContent : 'space-between',
        padding : 10,
    },

    employeeDashboardBlock1Card1Box1 : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        width : '49%',
        backgroundColor : '#ffffff',
        borderRadius :10,
        gap : 5,
        shadowColor : '#000',
        shadowOffset : {width : 2, height : 2},
        shadowOpacity : 0.3,
        shadowRadius : 8,
        elevation : 5, // adds shadow on android
        padding  :5,
        color : 'rgb(32,32,32)',
        marginBottom : 10,
    },

    employeeDashboardBlock1Card1Box1Card1 : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        gap : 10,
    },

    iconContainer: {
        width : 33.81,
        height : 33.81,
        borderColor : "#E3EBF1",
        borderWidth : 2,
        borderRadius : 50,
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
    },

    
    employeeDashboardBlock1Card1InnerText : {
        justifyContent : 'center',
        alignItems : 'center',

    },

    modalCenter:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.6)",
    },
    modalBox:{
        width:"80%",
        backgroundColor:"#fff",
        padding:20,
        borderRadius:10,
        alignItems:"center",
    },
    modalText:{
        fontSize:16,
        textAlign:"center",
        marginBottom:20,
    },







    




    
})