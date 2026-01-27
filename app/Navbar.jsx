import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Text, Pressable, ScrollView } from "react-native";
import talentflow from "../assets/Talentflow.png";
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/Navbar";
import dashboardBlack from "../assets/Navbar/dashboardBlack.png";
import dashboardWhite from "../assets/Navbar/dashboardWhite.png";
import myTeamBlack from "../assets/Navbar/myTeamBlack.png";
import taskBlack from "../assets/Navbar/taskBlack.png";
import taskWhite from "../assets/Navbar/taskWhite.png";
import organizationBlack from "../assets/Navbar/organizationBlack.png";
import organizationWhite from "../assets/Navbar/organizationWhite.png";
import timesheetBlack from "../assets/Navbar/timesheetBlack.png";
import timesheetWhite from "../assets/Navbar/timesheetWhite.png";
import leaveBlack from "../assets/Navbar/leaveBlack.png";
import leaveWhite from "../assets/Navbar/leaveWhite.png";
import CompanyLogo from "../assets/Navbar/CompanyLogo.png";
import profilePhoto from "../assets/Navbar/profilePhoto.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import roleColors from "./Colors/Colors";
import ChangePassword from "./Password/ChangePassword";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MyContext } from "./Context/MyContext";



// import { MyContext } from "../MyProvider/MyProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
 import axios from "axios";
 import Modal from 'react-native-modal';
import { url } from "../universalApi/universalApi";
import ForceChangePassword from "./ForceChangePassword";

import { Animated, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;





const Navbar = () => {
  const [isMenu, setIsMenu] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  // const context = useContext(MyContext);

  // const { updateState, updateCompanyDetails } = context;
  // console.log("update1 : ", updateState);
  const [employee, setEmployee] = useState({});
  const [companyDetails, setCompanyDetails] = useState({});
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const navigation = useNavigation();
  // const route = useRoute();
  //   const pathSegments = route.name.split("/");
  // const firstSegment = pathSegments[1];
  // console.log("Navigation available:", !!navigation);
  

  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const [activeMenu, setActiveMenu] = useState("");


  const slideAnim = useRef(new Animated.Value(-screenWidth)).current; // hidden at start
   const { role, updateRole } = useContext(MyContext);
  const {  updateEmployeeId } = useContext(MyContext);
  const { schemaName, updateSchemaName } = useContext(MyContext);
  const{themes,updateThemes,roleColors}=useContext(MyContext);
  const { updateState, tenantId, updateCompanyDetails} = useContext(MyContext);
   const [isDocumentsUpdated, setIsDocumentsUpdated] = useState(true);
  
 

  useEffect(() => {
    const fetchData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");
      const emailId = await AsyncStorage.getItem("email");
      console.log("stored response : ", JSON.parse(stored));
      setData(JSON.parse(stored));
      setId(JSON.parse(tenant));
      setEmail(JSON.parse(emailId));
    };
    fetchData();
  }, []);

  console.log("navbarrrr")
  // const role = data.role;
  const token = data.token;
  const employeeId = data.employeeId;

// //   useEffect(() => {
// //     if (!email) {
// //       navigation.navigate("/login");
// //     }
// //   }, [email]);
// //   console.log(employee)




  useEffect(() => {
    const fetchEmployee = async () => {
      //setIsLoading(true);
      console.log("token navbar",token, employeeId, id);
      try {
        
        console.log("upto");

        const response = await axios.get(
          `${url}/api/v1/employeeManager/getEmployeeCompanyDetails/${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": id,
            },
          }
        );

        console.log("employee navbar", response);
        console.log(response.status);

       setEmployee(response.data.employeeManager);

        updateRole(response.data.employeeManager.role);
        updateEmployeeId(response.data.employeeManager.employeeId);
        updateSchemaName(response.data.clientDetails.schemaName);
        setIsPasswordUpdated(response.data.employeeManager.isPasswordUpdated)
        setIsDocumentsUpdated(response.data.employeeManager.isDocumentsUpdated)
        updateState(response.data.employeeManager);
        setCompanyDetails(response.data.clientDetails);
        updateCompanyDetails(response.data.clientDetails);
        if(response.data.themes){
          updateThemes(response.data.themes);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        // if (error.response.status === 401) {
        //   await AsyncStorage.multiRemove([
        //     "employeeId",
        //     "email",
        //     "role",
        //     "firstName",
        //     "lastName",
        //     "token"
        //   ]);
        //   navigation.navigate('Login', {id});
        // }
        // setLoading(false);
      }
      //setIsLoading(false);
    };

    fetchEmployee();
  }, [employeeId, id, navigation, token]);


  const openMenu = () => {
  setIsMenu(true);
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  }).start();
};

const closeMenu = () => {
  Animated.timing(slideAnim, {
    toValue: -screenWidth,
    duration: 300,
    useNativeDriver: false,
  }).start(() => setIsMenu(false));
};

 const handleSignOut = async () => {
  try{
   await AsyncStorage.multiRemove([
    "token",
    "email",
    "role",
    "employeeId",
    "company"
  ]);

  navigation.replace("Login", {id});
  }
  catch (error) {
    console.log("Error clearing email : ", error);
  } 
  };

console.log("emp  :", employee.profilePhoto);
  return (
    <View style={styles.mobiles}>
      
      <View style={styles.mobileNavbar}>
        <View style={styles.mobileNavbarInner}>
          <Modal isVisible={!isPasswordUpdated}><ForceChangePassword isPasswordUpdated={isPasswordUpdated} setIsPasswordUpdated={setIsPasswordUpdated} /></Modal>
          <Image source={CompanyLogo} style={styles.talentflowLogo} size={1} />
          {/* <View>
          
           
            
              <Modal isVisible={isMoreOptions}
            onBackdropPress={() => setIsMoreOptions(false)}
            style={{ justifyContent: "flex-end", margin: 0 }}
            backdropOpacity={0}
            
            >
                <View style={styles.bottomCard}>
                 
    <TouchableOpacity
      onPress={() => setIsMoreOptions(false)}
      style={{ alignSelf: "flex-end" }}
    >
      <Entypo name="cross" size={28} color="#ffffff" />
    </TouchableOpacity>

                  <Text onPress={() => {setIsMoreOptions(false); navigation.navigate("Employee/MyProfile")}} style={{color : '#ffffff'}}>
                    My Profile
                  </Text>
                   <Text onPress={() => [setIsChangePassword(true), setIsMoreOptions(false)]} style={{color : '#ffffff'}}>
                    Change Password
                  </Text>
                  {
                    role === 'admin' &&  <Text onPress={() => setIsMoreOptions(false)} style={{color : '#ffffff'}}>
                    My Plan
                  </Text>
                  }
                  {
                    role === 'admin' &&  <Text onPress={() => setIsMoreOptions(false)} style={{color : '#ffffff'}}>
                    Contact Us
                  </Text>
                  }
                  <Text onPress={handleSignOut} style={{color : '#ffffff'}}>SignOut</Text>
                  </View>
                  </Modal>
             
          </View> */}
          {isMenu ? (
            <AntDesign 
              name="close"
              style={styles.menu}
              size={25}
              onPress={closeMenu}
            />
          ) : (
            <AntDesign
              name="menu"
              style={styles.menu}
              size={25}
              onPress={openMenu}
            />
          )}
        </View>
        {isMenu && (
          
          <Animated.View style={[styles.sideMenu, {left : slideAnim}]}>
           
             {/* {profile photo} */}
            {/* <TouchableOpacity onPress={() => setIsMoreOptions(true)}>
               <Image
              source={profilePhoto}
            />
            </TouchableOpacity> */}
            <View style={styles.profileContainer} >
              <TouchableOpacity style={{flexDirection  :'row'}}>
               <Pressable
                style={({ pressed }) => [
                  styles.profilePhotoContainer,
                  {
                    borderColor: roleColors[role],
                    // borderWidth: pressed ? 4 : 1, // hover → press
                    borderWidth : 1,
                  },
                ]}
                onPress={() => navigation.navigate("Employee/MyProfile")}
              >
                {employee?.profilePhoto ? (
                  <Image
                    source={{
                      uri: `${employee.profilePhoto}?t=${Date.now()}`,
                    }}
                    style={styles.profileImage}
                    resizeMode="cover"
                    onError={() => {
                      console.log('Image failed to load');
                    }}
                  />
                ) : (
                  <FontAwesome
                    name="user"
                    size={40}
                    color={roleColors[role]}
                    onPress={() => navigation.navigate("Employee/MyProfile")}
                  />
                )}
              </Pressable>
               
                    <Text onPress={() => navigation.navigate("Employee/MyProfile")} style={[styles.employeeProfile, {color: roleColors[role]}]}>{`${employee?.firstName || ""} ${
                      employee?.lastName || ""
                    }`}</Text>
                   
                  </TouchableOpacity>
                  <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], }} onPress={() => navigation.navigate("Employee/MyProfile")} />
               {/* <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} /> */}
            </View>
            <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
              style={[styles.navbarCard, {color : roleColors[role]} ]}
               onPress={() => {
                setActiveMenu('Dashboard');
                closeMenu();
                navigation.navigate("EmployeeDashboard");
                
              }}
            >
              <Ionicons name="home-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Dashboard</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role],marginTop : 8, marginRight : 25 }} onPress={() => navigation.navigate("EmployeeDashboard")} />
           
            </View>
            {
              role === 'admin' && 
               <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
              style={[styles.navbarCard, {color : roleColors[role]} ]}
               onPress={() => {
                setActiveMenu('Employee');
                closeMenu();
                navigation.navigate("Admin/Employee");
                
              }}
            >
              <Ionicons name="home-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Employee</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role],marginTop : 8, marginRight : 25 }} onPress={() => navigation.navigate("Admin/Employee")} />
           
            </View>
            }
            {
              role !== 'employee' && 
               <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
              style={[styles.navbarCard, {color : roleColors[role]} ]}
               onPress={() => {
                setActiveMenu('MyTeam');
                closeMenu();
                navigation.navigate("Admin/MyTeam/MyTeam");
                
              }}
            >
              <Ionicons name="home-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>My Team</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role],marginTop : 8, marginRight : 25 }} onPress={() => navigation.navigate("Admin/MyTeam/MyTeam")} />
           
            </View>
            }
              <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
             <TouchableOpacity
               style={[styles.navbarCard,]}
             onPress={() => {
              setActiveMenu('Projects');
              closeMenu();
                navigation.navigate("Compliance/ComplianceManagement");
                
              }}
            >
              <MaterialIcons name="work-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}}  />
              <Text style={{color: roleColors[role]}}>Compliance</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} onPress={() =>  navigation.navigate("Compliance/ComplianceManagement")} />
           
            </View>

            <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
               style={[styles.navbarCard,]}
              onPress={() => {
                setActiveMenu('Org');
                closeMenu();
                navigation.navigate("OrganizationChart");
                
              }}
            >
              <Ionicons name="people-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Organization Chart</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role],marginTop : 8, marginRight : 25 }} onPress={() =>navigation.navigate("OrganizationChart")} />
           
            </View>

             <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
             <TouchableOpacity
               style={[styles.navbarCard,]}
             onPress={() => {
              setActiveMenu('Projects');
              closeMenu();
                navigation.navigate("Projects/Projects");
                
              }}
            >
              <MaterialIcons name="work-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}}  />
              <Text style={{color: roleColors[role]}}>Projects</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} onPress={() =>  navigation.navigate("Projects/Projects")} />
           
            </View>

           <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
               style={[styles.navbarCard,]}
               onPress={() => {
                setActiveMenu('Tasks');
                closeMenu();
                navigation.navigate(role==="employee"?"Tasks/RecievedTasks":"Tasks/AssignedTasks");
               
              }}
            >
              <Ionicons name="checkmark-done-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Tasks</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role],marginTop : 8, marginRight : 25 }} onPress={() => navigation.navigate(role==="employee"?"Tasks/RecievedTasks":"Tasks/AssignedTasks")} />
           
            </View>
             <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
               style={[styles.navbarCard, ]}
              onPress={() => {
                setActiveMenu('Leave');
                closeMenu();
                navigation.navigate("LeaveManagement/LeaveManagement");
              
              }}
            >
              <Ionicons name="calendar-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Leave Management</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop  :8, marginRight : 25}} onPress={() => navigation.navigate("LeaveManagement/LeaveEmployee")} />
           
            </View>

           
            <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
               style={[styles.navbarCard, ]}
             onPress={() => {
              setActiveMenu('Timesheet');
              closeMenu();
                navigation.navigate("TimeSheet/TimesheetManagement");
                
              }}
            >
              <Ionicons name="document-text-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} alt="" />
              <Text style={{color: roleColors[role]}}>Timesheet</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} onPress={() =>  navigation.navigate("TimeSheet/TimesheetManagement")} />
            
            </View>
{
  role === 'admin' && 

          
<View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
             <TouchableOpacity
               style={[styles.navbarCard,]}
             onPress={() => {
              setActiveMenu('Invoice');
              closeMenu();
                navigation.navigate("Invoice/InvoiceDashboard");
                
              }}
            >
              <MaterialIcons name="work-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}}  />
              <Text style={{color: roleColors[role]}}>Invoice</Text>
              </TouchableOpacity>
               <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} onPress={() =>  navigation.navigate("Invoice/InvoiceDashboard")} />
           
            </View>
}

            {/*  <TouchableOpacity
               style={[styles.navbarCard, activeMenu === 'Timesheet' && styles.activeItem]}
             onPress={() => {
              setActiveMenu('Timesheet');
              closeMenu();
                navigation.navigate("TimeSheet/EmployeeTimesheet");
                
              }}
            >
              <Image source={activeMenu === 'Timesheet' ? timesheetWhite : timesheetBlack} alt="" />
              <Text style={[styles.navbarCardText, activeMenu === 'Timesheet' && styles.activeText]}>Timesheet</Text>
            </TouchableOpacity> */}
           

             {/* <Text onPress={() => [setIsChangePassword(true), setIsMoreOptions(false)]} style={{color :roleColors[role]}}>
                    Change Password
                  </Text>
                  {
                    role === 'admin' &&  <Text onPress={() => setIsMoreOptions(false)} style={{color :roleColors[role]}}>
                    My Plan
                  </Text>
                  }
                  {
                    role === 'admin' &&  <Text onPress={() => setIsMoreOptions(false)} style={{color :roleColors[role]}}>
                    Contact Us
                  </Text>
                  }
                  <Text onPress={handleSignOut} style={{color :roleColors[role]}}>SignOut</Text>
             */}
<View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
             <TouchableOpacity style={styles.navbarCard} onPress={() => setIsChangePassword(true)}>
  <Ionicons name="lock-closed-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} />
  <Text style={[styles.menuText, { color: roleColors[role] }]}>
    Change Password
  </Text>
  </TouchableOpacity>
   <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} />

</View>

{role === 'admin' && (
  <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
  <TouchableOpacity style={styles.navbarCard} onPress={() => navigation.navigate('MyPlan/Plan')}>
    <Ionicons name="card-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} />
    <Text style={[styles.menuText, { color: roleColors[role] }]}>
      My Plan
    </Text>
    </TouchableOpacity>
     <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }}  />
  
  </View>
)}


{role === 'admin' && (
  <View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
  <TouchableOpacity style={styles.navbarCard} onPress={() => navigation.navigate('ContactUs/ContactUs')}>
    <Ionicons name="headset-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} />
    <Text style={[styles.menuText, { color: roleColors[role] }]}>
      Contact Us
    </Text>
     
  </TouchableOpacity>
  <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }}  />
    </View>
)}

<View style={{display : 'flex',flexDirection : 'row', justifyContent : 'space-between'}}>
<TouchableOpacity style={styles.navbarCard} onPress={handleSignOut}>
  <Ionicons name="log-out-outline" size={20} style={{color : roleColors[role], marginHorizontal : 20}} />
  <Text style={[styles.menuText, { color: roleColors[role] }]}>
    Sign Out
  </Text>
  
</TouchableOpacity>
 <MaterialIcons name="keyboard-arrow-right" size={28} style={{color : roleColors[role], marginTop : 8, marginRight : 25 }} />
  </View>
 
          </Animated.View>
          
        )}
      </View>
     <Modal
     isVisible={isChangePassword}
     transparent
     animationType="fade"
     >
      <ChangePassword setIsChangePassword={setIsChangePassword} />
     </Modal>
    </View>
  );
};

export default Navbar;