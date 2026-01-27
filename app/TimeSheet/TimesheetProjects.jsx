import { useEffect, useState } from "react";
import {View, Text, ScrollView,Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import LayoutWrapper from "../LayoutWrapper";
import { url } from "../../universalApi/universalApi";
import { Feather } from "@expo/vector-icons";
import styles from '../../styles/TimeSheet/TimesheetProjects';
import { useContext } from "react";
import { MyContext } from "../Context/MyContext";
import Loader from "../Loader/Loader";

const TimesheetProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigation=useNavigation();
    const [storedData, setStoredData] = useState("");
    const [id, setId] = useState("");
    const {role, employeeId, schemaName}=useContext(MyContext);
  
    const fetchStoredData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");
      console.log("stored response : ", JSON.parse(stored));
      setStoredData(JSON.parse(stored));
      setId(JSON.parse(tenant));
    };
  
    useEffect(() => {
      fetchStoredData();
    }, []);  
    
    const token = storedData.token;
    
    console.log('role : ', role) 

      useEffect(() => {
        console.log("role employeeId", role, employeeId)
            if(employeeId && role){
                console.log("role employeeId", role, employeeId)
                fetchProjects();
            }
        }, [employeeId, token, id, role]); 
    
    const fetchProjects = async () => {
        setIsLoading(true);
        let api=role==="employee"?`${url}/api/projects/all-projects/employee/${employeeId}`:`${url}/api/projectManager/getProject/managerId/${employeeId}`;
        try {
            const response = await axios.get(api, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-Tenant-ID": id,
                },
            })
 
            setProjects(response.data);
        }
        catch (e) {
            console.error("Error fetching Timesheet Projects",e)
        }
        finally {
            setIsLoading(false);
        }
    }; 
 
    return(
        <LayoutWrapper>
            <ScrollView>
                {isLoading && <Loader />}
                <View style={styles.container}>
                     <Pressable
                          onPress={() => navigation.goBack()}
                          style={{
                            padding: 10,
                            alignSelf : 'flex-end',
                          }}
                        >
                          <Feather name="arrow-left" size={24} color={roleColors[role]} />
                        </Pressable>
                    <Text style={[styles.heading, {color:roleColors[role]}]}>Projects</Text>
                
                            {
                                projects.length>0? projects.filter(project=>project.projectStatus !=="COMPLETED").map((each) => (
                                    <View key={each.id} style={styles.card}>
                               <View style={styles.rowAlign}>
                                <View>
                                 <Text style={styles.head}>PROJECT</Text>
                                <Text style={styles.name}>{each.projectName}</Text>
                                </View>
                                 <View>
                                    <Text style={styles.head}>CLIENT</Text>
                                <Text style={styles.name}>{each.clientName}</Text>
                                    </View>   
                                </View>
                                <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
                                
                                <TouchableOpacity onPress={() => navigation.navigate('TimeSheet/CreateTimesheet', {id : each.id})} style={styles.button}>
                                    <Text style={[styles.buttonText, {backgroundColor: roleColors[role]}]} >Create Timesheet</Text>
                                </TouchableOpacity>
                                </View>

                               )) : (
                                    <>
                                    <Text>No Projects Found</Text>
                                    </>
                                )
                            }
                            
                        
                      
                </View>
            </ScrollView>
        </LayoutWrapper>
    )
};

export default TimesheetProjects;