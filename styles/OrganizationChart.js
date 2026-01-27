import { StyleSheet} from "react-native";
import {wp, hp} from './Responsive';



export default StyleSheet.create({
    orgChartContainer : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
    },

    orgSearchFilters : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'flex-start',
        gap : 20,
        padding : 16,
    },

    

    filterSelects : {
        width: wp(271),           // no 'px' in RN
    height: hp,
    // borderWidth: 2,
    borderRadius: 10,
    borderColor: '#E3EBF1',
    fontSize: 16,
    color: '#6F96AA',
    paddingHorizontal: 10, // optional: adds inner spacing
    },

    searchInputs : {
        width : wp(275),
        height : hp(27),
        borderColor : '#AAAAAA'
    },

    orgNavbar : {
        marginLeft : 34,
    },

    orgContent : {
        display : 'flex',
        flexDirection : 'column',
    },

    filterContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  width: wp(322),
  height: hp(71),
  marginTop: 20,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#64646F',
  shadowOffset: { width: 0, height: 7 },
  shadowOpacity: 0.2,
  shadowRadius: 29,
  elevation: 5,
  overflow: 'visible', // ✅ VERY IMPORTANT for iOS
  zIndex: 1,
},

searchContainer : {
        flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: wp(322),      // don’t use "px" in React Native
    height: hp(71),
    borderRadius: 20,
    shadowColor: '#64646F',
  shadowOffset: { width: 0, height: 7 },
  shadowOpacity: 0.2,
  shadowRadius: 29,
  elevation: 5,
  overflow: 'visible', // ✅ VERY IMPORTANT for iOS
    },


    searchBoxes : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        width : wp(275),
    //      shadowColor: '#64646F',
    // shadowOffset: { width: 0, height: 7 },
    // shadowOpacity: 0.2,
    // // shadowRadius: 29,
    // // elevation: 10, // for Android shadow
    borderRadius : 16,
    position : 'relative',


    },

    searchInput : {
          width: '100%',            // full width of parent container
    height: hp(35),               // fixed height
    paddingLeft: 40,          // left padding
    paddingRight: 12,         // right padding
    fontSize: 14,             // text size
    },

    searchIcons : {
        marginHorizontal : 10,
        marginVertical : 10,
        width : wp(16),
        height : hp(16),
    },

  


    orgSearchBox : {
        position : 'relative',
    },

    orgSearchInput : {
        paddingVertical:10,
        paddingRight : 40,
        paddingLeft : 16,
         borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    width: wp(250), 
    },
    
    orgSearchIcon : {
         position: 'absolute', // same as CSS
    right: 12,            // distance from the right edge of parent
    top: 10,              // distance from the top edge of parent
    width: wp(18),            // fixed width
    height: hp(18),           // usually set height for icons/images
    },

   orgSuggestionsBox: {
  position: 'absolute',
  top: hp(50),            // distance below input
  left: 0,                // align properly under the input
  alignSelf: 'center',    // center in the container
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  width: wp(274),
  maxHeight: hp(250),     // better than fixed height (scrolls if list too long)
  paddingVertical: 8,
  paddingHorizontal: 12,

  // shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,           // Android layering
  zIndex: 9999,           // iOS layering
},


    orgSuggestionItem : {
         flexDirection: 'row',     // display: flex + default row in web
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    gap: 12, 
    },

    orgCountrySelect : {
        backgroundColor : "#ffffff",
        padding : 10,
        borderRadius : 10,
    },

    orgSection : {
        margin : 'auto',
        paddingTop : 20,
    },

    orgBlock : {
        display : 'flex',
        alignItems : 'center',
    },

    orgCard : {
         flexDirection: 'row',      // horizontal layout
    alignItems: 'center',      // vertical centering
    gap: 12,                   // works in RN >= 0.71, otherwise add marginRight on children
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    // width: wp(200),
    marginBottom: 0,
    elevation: 4, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    },

    orgCards : {
         flexDirection: "row",
        //  justifyContent : 'space-evenly',
    alignItems: "center",
    gap: 12,
     width : 200,
    backgroundColor: "#F1F6FA",
    borderRadius: 16,
    padding: 10,
    // width: "50%", // two columns per row
   
    marginBottom: 12,
    elevation: 4, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    },

  


    orgProfileImg : {
         width : wp(32),
        height : hp(32),
        borderRadius : 50,
        marginLeft : 10,
    },
    orgProfileImgLg : {
        width : wp(36),
        height : hp(36),
        borderRadius : 50,
        marginLeft : 15,
        marginTop : 16,   
    },

   

    orgNameLg:  {
        color : '#19cf99',
        fontWeight : 'bold',
        fontSize : 16,
        marginTop : 8,

    },

    orgId : {
        color : '#14172e',
        fontSize : 12,
    },



  

    orgLine : {
        backgroundColor : '#000',
        width : wp(1),
        height : hp(18),
    },

    orgLineCenter : {
         backgroundColor : '#000',
        width : wp(1),
        height : hp(18),
        alignSelf : 'center',
    },

    orgSectionBox : {
        backgroundColor : '#ffffff',
        padding : 16,
        borderRadius : 16,
        // marginLeft : 50,
         // shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal : 20,
   
    // shadow (Android)
    elevation: 4,
    },

    orgTitle : {
        textAlign : 'center',
        fontSize : 20,
        fontWeight : '600',
        marginBottom : 16,
    },

    orgGrid : {
        flexDirection: "column", // arrange horizontally
    // flexWrap: "wrap", // allow wrapping to next line (like grid rows)
    justifyContent: "space-between", // space between columns
    alignItems : 'center',
    padding: 12,
    },

     

        profileImage : {
        borderRadius : 20 ,
        width : wp(40),
        height : hp(40),
        backgroundColor : '#6F96AA',
    },

     orgName : {
        color : '#19cf99',
        fontWeight : 'bold',
        fontSize : 14,
      
    },

        orgRole : {
        color : '#14172e',
        fontSize : 12,
        fontWeight : '500',

    },

      orgCountry : {
        color : '#14172e',
        fontSize : 10,
    },













})