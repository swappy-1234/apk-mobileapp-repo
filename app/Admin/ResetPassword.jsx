import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { url } from "../../universalApi/universalApi";
import styles from '../../styles/Admin/ResetPassword'

const ResetPassword=({isResetId, setResetEmployeeData})=>{
    const [error, setError]=useState("");
    const [newPassword, setNewPassword]=useState("");
    const employeeId=isResetId;

    const [token, setToken]=useState("");
    const [tenantId, setTenantId] = useState("");

    useEffect(()=>{
        const loadData=async()=>{
            const storedCompany=await AsyncStorage.getItem("companies");
            const tenant=await AsyncStorage.getItem("tenantId");
            if(storedCompany){
                setToken(JSON.parse(storedCompany).token);
            }

            if(tenant){
                setTenantId(JSON.parse(tenant));
            }
        }
        loadData();
    },[]);

    const handleChangePassword = async (employeeId) =>{
        console.log(newPassword)
    const validatePassword = (password) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      return passwordRegex.test(password);
    };

    if (!validatePassword(newPassword)) {
      setError(
        "Password must have at least one uppercase, one lowercase, one number, and one special character"
      );
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    try{
        await axios.post(`${url}/api/v1/employeeManager/reset-password/${employeeId}/${newPassword}`,
            null,
            {
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json",
                    "X-Tenant-ID":tenantId,
                }
            })
            setNewPassword("");
            setResetEmployeeData(false);
    }catch(error){
        if (error.response) {
        console.error("Error response from server:", error.response.data);
        setError(
          `Error: ${error.response.data.message || "Password change failed"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("Network error. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
    }

    return(
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
           <View>
            <Text style={styles.title}>Reset Password</Text>
            <View>
              <Text style={styles.title}>Employee Id</Text>
              <TextInput 
              value={employeeId}
              />
            </View>
            <View>
              <Text style={styles.title}>New Password</Text>
              <TextInput
              onChangeText={(text)=>setNewPassword(text)}
              />
            </View>
            {error && (
              <View>
                <Text>{error}</Text>
              </View>
            )}
            <View style={styles.modalButtons}>
             <TouchableOpacity  style={[styles.actionBtn, styles.deleteBtn]}
              onPress={()=>setResetEmployeeData(false)}>
              <Text style={styles.actionText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity  style={[styles.actionBtn, styles.cancelBtn]}
              onPress={()=>handleChangePassword(employeeId)}>
              <Text style={styles.actionText}>Change Password</Text>
             </TouchableOpacity>
            </View>
           </View>
           </View>
        </View>
    )
}
export default ResetPassword;