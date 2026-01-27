// import React from "react";
// import {Text,View} from 'react-native'
// import {styles} from '../../styles/EmployeeDashboard'
// const AdminDadhboard=()=>{
//    return(
//           <View style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//               <Text>rama</Text>
//           </View>
//       )
// }
// export default AdminDadhboard;
import React, {useState, useEffect} from "react";
import { View, Text, Image, ScrollView } from "react-native";
import styles from '../../styles/EmployeeDashboard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dicon from '../../assets/Dashboard/Dicon.png';
import Icon1 from '../../assets/Dashboard/Icon1.png';
import Icon2 from '../../assets/Dashboard/Icon2.png';
import Icon3 from '../../assets/Dashboard/Icon3.png';
import Icon4 from '../../assets/Dashboard/Icon4.png';
import Icon5 from '../../assets/Dashboard/Icon5.png';
import Icon6 from '../../assets/Dashboard/Icon6.png';
import Icon7 from '../../assets/Dashboard/Icon7.png';
import Icon8 from '../../assets/Dashboard/Icon8.png';
import Icon9 from '../../assets/Dashboard/Icon9.png';
import Icon10 from '../../assets/Dashboard/Icon10.png';
import Icon11 from '../../assets/Dashboard/Icon11.png';
import axios from "axios";
import CompanyNews from "../CompanyNews";
import Holidays from "../Holidays";
import { url } from "../../universalApi/universalApi";
import LayoutWrapper from "../LayoutWrapper";


const AdminDadhboard = () => {
     const [data, setData] = useState('');
     const [id, setId] = useState('');
      const [taskData, setTaskData] = useState({
    overDueTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    tasksEfficiency: 0,
  });
 
  const [timeSheetData, setTimeSheetData] = useState({
    pending: 0,
    approve: 0,
    reject: 0,
    total: 0,
  });
 
  const [leaveData, setLeaveData] = useState({
    pending: 0,
    approved: 0,
    reject: 0,
    leaveCount: 0,
  });
  
//  const url = "http://10.0.2.2:8080";
  //const url = "http://localhost:8080";

    const fetchData = async () => {
        const stored = await AsyncStorage.getItem("companies");
        const tenant = await AsyncStorage.getItem("tenantId");
        const email = await AsyncStorage.getItem("email");
        console.log("email : ", JSON.parse(email));
        console.log("stored response : ", JSON.parse(stored));
        setData(JSON.parse(stored));
        setId(JSON.parse(tenant));

    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("tenant id", id);
     const token = data.token;
    const employeeId = data.employeeId;
     console.log("token", token);
      console.log("employee id", employeeId);
       const role = data.role;
       console.log("role : ", role);
       console.log(`Bearer ${token}`);

    useEffect(() => {
    
   
    const fetchData = async () => {
        console.log("1");
      try {
        console.log("2");
        console.log("tokennnn : ", token);
        console.log("company : ", id);
        // let taskApi=role==="employee"?`${url}/apis/employees/TasksDetails/personId/${employeeId}/mobile`:`${url}/apis/employees/TasksDetails/managerId/${employeeId}/mobile`;
        const response = await axios.get(`${url}/apis/employees/TasksDetails/personId/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id, // Add the token to the Authorization header
            },
          }
        );
        console.log("3");
        console.log("tasks : ", response);
        setTaskData(response.data);
        console.log("task performance");
      } catch (error) {
        console.log("4");
        console.error("Error fetching data:", error);
      }
 
      try {
        console.log("11");
        // let timeSheetsApi=role==="employee"?`${url}/api/timesheets/employeeId/${employeeId}/total/timesheetsMobile`:`${url}/api/timesheets/managerId/${employeeId}/total/timesheetsMobile`;
        const response = await axios.get(`${url}/api/timesheets/employeeId/${employeeId}/total/timesheets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
            },
          }
        );
        console.log("22");
        console.log("timesheet : ", response);
        setTimeSheetData(response.data);
        console.log("timesheet performance");
      } catch (error) {
        console.log("33");
        console.error("Error fetching data:", error);
      }
      try {
        console.log("111");
        // let leaveApi=role==="employee"?`${url}/api/leaves/getStatus/${employeeId}/mobile`:`${url}/api/leaves/getStatusForManager/${employeeId}/mobile`;
        const response = await axios.get(`${url}/api/leaves/getStatus/${employeeId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
            },
          }
        );
        console.log("222");
        console.log("leaves : ", response);
        setLeaveData(response.data);
        console.log("leave performance");
      } catch (error) {
        console.log("333");
        console.error("Error fetching data:", error);
      }
 
    //   try{
    //     const response = await axios.get(`${url}/api/v1/employeeManager/getEmployee/${employeeId}`,
    //       {
    //         headers:{
    //           Authorization: `Bearer ${token}`,
    //           "X-Tenant-ID": id,
    //         },
    //       }
    //     );
    //     console.log("Greeting data ",response);
        
    //   }catch(error){
    //     console.error("Error fetching data:", error);
    //   }
    };
 
    fetchData();
   
  }, [employeeId, id, token, role]);

   
    return (
        <View style={styles.employeeDashboard}>
          <LayoutWrapper>
            {/* <Navbar /> */}
            <ScrollView style={styles.employeeDashboardInner} contentContainerStyle={styles.scrollStyle} ishowsVerticalScrollIndicator={true} ndicatorStyle="black">
                {/* <View style={styles.employeeDashboardInnerBlock}> */}
                    <View style={styles.employeeDashboardBlock1}>
                        <View style={styles.employeeDashboardBlock1Card1}>
                            <View style={styles.employeeDashboardBlock1Card1InnerText}>
                            <Text style={{marginTop : 10}}>Performance Metrics</Text>
                            {role === 'employee' ? <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Monitor your performance metrics and improve your
                      efficiency.
                            </Text> : <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Monitor your team performance metrics and improve your team
                      efficiency.</Text>}

                        </View>

                        <View style={styles.employeeDashboardBlock1Card1Inner}>
                            {/* pending tasks */}
                            <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Dicon} />
                                    </View>
                                    <Text style={{fontSize : 13}}>Pending</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(80, 80, 240)", alignSelf:"center"}}>{taskData.pendingTasks}</Text>
                            </View>
                            {/* Overdue Tasks */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon1} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Overdue</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(241, 93, 93)", alignSelf:"center" }}>{taskData.overDueTasks}</Text>
                            </View>
                              {/* Completed Tasks */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon2} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Completed</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"#19CF99", alignSelf:"center" }}>{taskData.completedTasks}</Text>
                            </View>
                             {/* Total Tasks */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon3} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Work Efficiency</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf:"center", color:"rgb(32, 32, 32)" }}>{taskData.tasksEfficiency}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.employeeDashboardBlock1Card1}>
                        <View style={styles.employeeDashboardBlock1Card1InnerText}>
                            <Text style={{marginTop : 10}}>Holiday Planner</Text>
                            {role === 'employee' ? <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Track every minute to refine and maximise your
                      performance.
                            </Text> : <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Track every minute to refine and maximise your team
                      performance.
                      </Text>}

                        </View>

                        <View style={styles.employeeDashboardBlock1Card1Inner}>
                            {/* pending leaves */}
                            <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon4} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Pending</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(80, 80, 240)", alignSelf:"center"}}>{leaveData.pending}</Text>
                            </View>
                            {/* rejected leaves */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon5} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Rejected</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(241, 93, 93)", alignSelf:"center" }}>{leaveData.reject}</Text>
                            </View>
                              {/* Approved Leaves */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon6} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Approved</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"#19CF99", alignSelf:"center" }}>{leaveData.approved}</Text>
                            </View>
                             {/* Total Leaves */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon7} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Total</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf:"center" }}>{leaveData.leaveCount}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.employeeDashboardBlock1Card1}>
                        <View style={styles.employeeDashboardBlock1Card1InnerText}>
                            <Text style={{marginTop : 10}}>Timesheet Performance</Text>
                            {role === 'employee' ? <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Track your work hours and manage your productivity with a
                      timesheet.
                            </Text> : <Text style={{fontSize : 12, alignSelf : 'center', textAlign : 'center'}}>
                                Track your team work hours and manage your team productivity with a
                      timesheet.
                      </Text>}

                        </View>

                        <View style={styles.employeeDashboardBlock1Card1Inner}>
                            {/* pending timesheets */}
                            <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon8} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Pending</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(80, 80, 240)", alignSelf:"center" }}>{timeSheetData.pending}</Text>
                            </View>
                            {/* rejected timesheets*/}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon9} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Rejected</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"rgb(241, 93, 93)", alignSelf:"center" }}>{timeSheetData.reject}</Text>
                            </View>
                              {/* Approved timesheets */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon10} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Approved</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", color:"#19CF99", alignSelf:"center" }}>{timeSheetData.approve}</Text>
                            </View>
                             {/* Total Timesheets */}
                             <View style={styles.employeeDashboardBlock1Card1Box1}>
                                <View style={styles.employeeDashboardBlock1Card1Box1Card1}>
                                    <View style={styles.iconContainer}>
                                        <Image source={Icon11} alt="" />
                                    </View>
                                    <Text style={{fontSize : 13}}>Total</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf:"center" }}>{timeSheetData.total}</Text>
                            </View>
                        </View>
                    </View>
                   
                    </View>
                {/* </View> */}
                 <View>
                    <CompanyNews />
                    <Holidays />
                       </View>
            </ScrollView>
</LayoutWrapper>
        </View>
    )
}

export default AdminDadhboard;