
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../universalApi/universalApi";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import styles from '../styles/ForceChangePassword';





const ForceChangePassword = ({setIsPasswordUpdated}) => {
    const [formData, setFormData] = useState({
      email : '',
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigation = useNavigation();
  const [newPassword, setNewPassword]=useState("");
  const [confirmPassword, setConfirmPassword]=useState("");
    const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState(null);
    const [error, setError] = useState("");
  
 

  useEffect(() => {
    const fetchData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");
      const emailId = await AsyncStorage.getItem("email");
      console.log("stored response : ", JSON.parse(stored));
       console.log("emailId : ", emailId);
       console.log("aa",await AsyncStorage.getItem("email"));
      setData(JSON.parse(stored));
      setId(JSON.parse(tenant));
      setEmail(JSON.parse(stored).email);
      const parsed = emailId;
      setFormData((prev) => ({
        ...prev,
        email : parsed
      }))
    };
    fetchData();
  }, []);

  const role = data.role;
  const token = data.token;
  const employeeId = data.employeeId;
 

  const handleChange = (name, value) => {
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(newPassword==="" || confirmPassword===""){
        setError("Enter passwords")
        return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must have at least one uppercase, one lowercase, one number, and one special character"
      );
      return;
    }

    try {
      if (!token) {
        setError("No authorization token found");
        return;
      }

      await axios.post(
        `${url}/api/v1/employeeManager/force-change-password/${email}/${newPassword}`,
        {
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      setIsPasswordUpdated(true);
      
    } catch (error) {
        console.log(error);
        
      if (error.response.status === 500) {
        setError(error.response.data);
      } else {
        setError("Failed to change password. Please try again.");
      }
    }
  };

   const logout = async () => {
    try {
      await AsyncStorage.removeItem("email");
      console.log("bbbb");
      navigation.navigate("Login");  // screen name from navigator
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  console.log("email : ", email);

    return(
        <>
        {email!==null && <View style={styles.employeeChangepassword}>
            <View style={styles.employeeChangepasswordDashboard}>
                <Text>Change Password</Text>
                <View>
                    {/* {email} */}
                    <View style={styles.changeFormGroup}>
                        <TextInput 
                        value={email}
                        onChangeText={(text) => handleChange('email',text)}
                        keyboardType="email-address"
                        editable={false}
                        style={styles.inputField}
                        />
                    </View>
                    {/* {new password} */}
                     <View style={styles.changeFormGroup}>
                        <TextInput 
                        value={newPassword}
                        onChangeText={(text) => setNewPassword(text)}
                        secureTextEntry={true}
                        placeholder="New Password"
                        style={styles.inputField}
                        
                        />
                    </View>
                    {/* {confirm password} */}
                     <View style={styles.changeFormGroup}>
                        <TextInput 
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        style={styles.inputField}
                        />
                    </View>
                     {error && (<View style={{color : 'red', fontSize:15}}><Text>{error}</Text></View>)}
                      <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10}}>
                                        <TouchableOpacity  style={styles.viewButton}   
                                    onPress={logout}>
                                            <Text style={styles.buttonCancel}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.viewButton}
                                    onPress={handleSubmit}
                                    >
                                    <Text style={styles.buttonConfirm}>
                                                Confirm
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                </View>
            </View>
        </View>}
        </>
    )
}

export default ForceChangePassword;