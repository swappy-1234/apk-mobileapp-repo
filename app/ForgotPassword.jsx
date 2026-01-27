import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { Link, useNavigation, useRoute } from "@react-navigation/native";
import talentflow from "../assets/Talentflow.png";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/Login';
import {url} from '../universalApi/universalApi';
import Modal from 'react-native-modal';


// const url = "http://10.0.2.2:8080";
//const url = "http://localhost:8080";


const ForgotPassword = () => {
 
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
  const [isPasswordUpdated, setIsPasswordUpdated]=useState(false);

    const fetchData = async () => {
        const stored = await AsyncStorage.getItem("tenantId");
        setId(JSON.parse(stored));

    };

    useEffect(() => {
        fetchData();
    }, []);

  //   useEffect(()=>{
  //   if(email){
  //     navigation.navigate("Login");
  //   }
  // },[email, navigation]);

   useEffect(()=>{
    if(sessionId){
      setIsIntialLogin(true);
    }
  },[sessionId]);

 

    const handleChange = async () => {
        if(!email){
            setIsError(true);
            setError("Email is Required");
            return;
        }
        else{
            setIsError(false);
            setError("");
        }
      try{
        const response=await axios.post(`${url}/api/v1/employeeManager/forgotPassword/${email}`,{
          email:email,
          password:password
        },
      {
          headers:{
            "content-Type":"application/json",
            "X-Tenant-ID": id,
          }
        })
       console.log("response",response)
       if(response.status===200){
        setIsPasswordUpdated(true);
       }
        
      }
      catch(err) {
        console.log(err.response.status)
        if(err.status === 404){
          setIsError(true);
          setError('Email Id Not Found...')
        }

      }
    }
    
    
  
  return (
    <ImageBackground style={styles.login} source={require('../assets/LoginBanner.png')}>
      <View style={styles.loginBlock1}>
        <Modal isVisible={isPasswordUpdated} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
        <Text>Your password has been updated successfully. Please check your email for your credentials.</Text>
        <TouchableOpacity onPress={()=>{
            setIsPasswordUpdated(false);
            navigation.navigate('Login', {id})
        }} style={styles.submitButton}><Text style={styles.buttonText}>Okay!</Text></TouchableOpacity>
        </View>
        </View>
        </Modal>

        <View style={styles.formContent}>
          <Image source={talentflow} style={styles.logo} />
          <Text style={styles.title}>Sign In</Text>
          <View>
            <TextInput
              placeholder="Email"
              keyboardType="email"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
            />
            <TouchableOpacity
              title="submit"
              style={styles.submitButton}
              onPress={handleChange}
              >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
         
          <TouchableOpacity onPress={() => {navigation.navigate("Login", {id})}}><Text style={styles.forgotPassword}>Back to Login</Text></TouchableOpacity>
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

export default ForgotPassword;

