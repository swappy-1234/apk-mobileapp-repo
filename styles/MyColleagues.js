import { StyleSheet, Dimensions } from "react-native";

const {width, height} = Dimensions.get('window');


export default StyleSheet.create({
    myTeam : {
        width : width,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    myTeamInner : {
        width: width,
    maxWidth: 1300, // not directly supported in RN; see note below
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10, // supported in React Native 0.71+

    }



})