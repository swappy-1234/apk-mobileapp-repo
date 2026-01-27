import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { Link, useNavigation, useRoute } from "@react-navigation/native";
import talentflow from "../assets/Talentflow.png";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/Login";
import { url } from "../universalApi/universalApi";
import CompanyLogo from "../assets/Navbar/CompanyLogo.png";
import Loader from "./Loader/Loader";


// const url = "http://10.0.2.2:8080";
//const url = "http://localhost:8080";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const [isError, setIsError]=useState(false);
  const[error,setError]= useState("");

    const navigation = useNavigation();
    const [id, setId] = useState(''); // company
     const [isEmployeeId, setIsEmployeeId]=useState(false);
  const [token, setToken]=useState("");
  const [isIntialLogin, setIsIntialLogin]=useState(false);
  const route = useRoute();
  const sessionId = route.params?.session_id;
  const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const stored = await AsyncStorage.getItem("tenantId");
        setId(JSON.parse(stored));

    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(()=>{
    if(email){
      navigation.navigate("Login");
    }
  },[email, navigation]);

   useEffect(()=>{
    if(sessionId){
      setIsIntialLogin(true);
    }
  },[sessionId]);

 

    const handleChange = async () => {
      try{
        const response = await axios.post(`${url}/api/v1/employeeManager/login`,{
          email:email,
          password:password
        },
      {
          headers:{
            "content-Type":"application/json",
            "X-Tenant-ID": id,
          }
        })
        const {message, role ,token , firstName , lastName , employeeId} = response.data;
        setToken(token);
        
      if(message === 'Email not exists'){
        setError('* Email does not exists')
      }
      else if (message === 'Login Success') {
        console.log(token);
            console.log(firstName, lastName, employeeId);


            setIsError(false);
            setError("");
            if (employeeId!==null){
              let data=response.data;
              data.email=email;
        await AsyncStorage.setItem("companies", JSON.stringify(data));
       console.log("after login",email);
        await AsyncStorage.setItem("email", JSON.stringify(email));
        console.log("after saving", await AsyncStorage.getItem("email"));
      
         navigation.navigate('EmployeeDashboard');
        }
        else{
          setIsEmployeeId(true);
        }
      } 
      else{
        setError('* Incorrect email or password');
      }
      setLoading(false);
        
      }
      catch(err) {
        console.log(err.response.status);
         const status = err.response?.status;
         const backendMessage = err.response?.data?.message;
        if(err.response.status === 401){
          setIsError(true);
          setError('Unauthorized: Incorrect email or password')
        }
        else if (status === 404) {
          console.log("backendMessage",backendMessage);
          if(backendMessage.substring(0,7)==="Company"){
            navigation.navigate("Tenant");
          }
        }
        else if (status === 409) {
          setError(backendMessage);
        }
        else {
          setError("*An error occurred while logging in. Please try again.");
        }
         setLoading(false);
        

      }
    }
    
    
  
  return (
    <ImageBackground style={styles.login} source={require('../assets/LoginBanner.png')}>
      {loading && <Loader />}
      <View style={styles.loginBlock1}>
        <View style={styles.formContent}>
          <Image source={CompanyLogo} style={styles.logo} />
          <Text style={styles.title}>Sign In</Text>
          <View>
            <TextInput
              placeholder="Email"
              keyboardType="email"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Password"
              keyboardType="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.inputField, styles.inputMargin]}
            />
            <TouchableOpacity
              title="submit"
              style={styles.submitButton}
              onPress={handleChange}
              >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {navigation.navigate("ForgotPassword", {id})}}><Text style={styles.forgotPassword}>Forgot Password?</Text></TouchableOpacity>
           {isError  && <Text style={{color : 'red'}}>{error}</Text>}
          <View>
           
            <Text style={styles.terms}>
              Terms & conditions | Privacy Policy
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;