import React, {useState, useEffect} from "react";
import { View, Text } from "react-native";
import styles from "../styles/Success";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Success = () => {
    const [email, setEmail] = useState('');

    const fetchData = async () => {
        const stored = await AsyncStorage.getItem("companies");
        console.log("stored response : ", JSON.parse(stored));
        setEmail(JSON.parse(stored));

    };

    useEffect(() => {
        fetchData();
    }, []);


    
    return(
        <View style={styles.container}>
            <Text style={styles.message}>Login Successful 🎉</Text>
            <Text style={styles.email}>Welcome , {email.firstName}</Text>
        </View>
    )
}

export default Success;