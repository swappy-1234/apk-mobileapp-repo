
import { useState, useEffect } from "react";
import { url } from "../../universalApi/universalApi";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styles from '../../styles/ForceChangePassword';


const ChangePassword = ({setIsChangePassword}) => {
     const [formData, setFormData] = useState({
    email : '',
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigation = useNavigation();
   const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState(null);

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
 

// Handle Change
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

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword, oldPassword } = formData;
    if(newPassword==="" && oldPassword==="" && confirmPassword===""){
        setError("Enter passwords")
        return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword === oldPassword) {
      setError(
        "Please choose a different password, the new one matches your current password."
      );
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
        `${url}/api/v1/employeeManager/change-password`,
        {
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );
      await AsyncStorage.removeItem('email');
      navigation.navigate('Login', {id});
    } catch (error) {
        console.log(error);
        
      if (error.response.status === 500) {
        setError(error.response.data);
      } else {
        setError("Failed to change password. Please try again.");
      }
    }
  };
    return (
        <>
        <View style={styles.employeeChangepassword}>
                    <View style={styles.employeeChangepasswordDashboard}>
                        <Text style={{fontWeight : 'bold', fontSize : 15}}>Change Password</Text>
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
                             {/* {old password} */}
                            <View style={styles.changeFormGroup}>
                                <TextInput 
                                value={formData.oldPassword}
                                onChangeText={(text) => handleChange('oldPassword',text)}
                                secureTextEntry={true}
                                placeholder="Old Password"
                                style={styles.inputField}
                                />
                            </View>
                            {/* {new password} */}
                             <View style={styles.changeFormGroup}>
                                <TextInput 
                                value={formData.newPassword}
                                onChangeText={(text) => handleChange('newPassword',text)}
                                secureTextEntry={true}
                                placeholder="New Password"
                                style={styles.inputField}
                                
                                />
                            </View>
                            {/* {confirm password} */}
                             <View style={styles.changeFormGroup}>
                                <TextInput 
                                value={formData.confirmPassword}
                                onChangeText={(text) => handleChange('confirmPassword',text)}
                                secureTextEntry={true}
                                placeholder="Confirm Password"
                                style={styles.inputField}
                                />
                            </View>
                             {error && (<View style={{color : 'red', fontSize:15}}><Text>{error}</Text></View>)}
                              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10}}>
                                                <TouchableOpacity  style={styles.viewButton}   
                                            onPress={() => setIsChangePassword(false)}>
                                                    <Text style={styles.buttonCancel}>
                                                        Cancel
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.viewButton}
                                            onPress={handleSubmit}
                                            >
                                            <Text style={styles.buttonConfirm}>
                                                        Change Password
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                        </View>
                    </View>
                </View>
        </>
    )
}


export default ChangePassword;