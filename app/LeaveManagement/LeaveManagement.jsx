import { useState, useEffect, } from "react";
import { View, ActivityIndicator } from "react-native";
import LeaveAdmin from "./LeaveAdmin";
import LeaveEmployee from "./LeaveEmployee";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, } from "@react-navigation/native";
const LeaveManagement = () => {
    const navigation = useNavigation();
    const [data, setData] = useState("");
    const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");

    console.log("stored response : ", JSON.parse(stored));
    setData(JSON.parse(stored));
   
  };

  const role = data.role;

  useEffect(() => {
    fetchStoredData();
  }, []);

  if (!role) {
    return <ActivityIndicator size="large" />
  }

console.log("role : ",  role);

    return (
        <View style={{flex:  1}}>
            {
                (role==="admin" || role==="manager") ? ( <LeaveAdmin/> ) : ( <LeaveEmployee/> )
            }
        </View>
    )
}

export default LeaveManagement;