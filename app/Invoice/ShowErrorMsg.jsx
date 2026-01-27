import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import roleColors from "../Colors/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../styles/Invoice/ShowErrorMsg';

const ShowErrorMsg = ({setEmptyInvoice}) => {
    const [storedData, setStoredData] = useState("");
      
        const fetchStoredData = async () => {
          const stored = await AsyncStorage.getItem("companies");
          setStoredData(JSON.parse(stored));
        };
      
        useEffect(() => {
          fetchStoredData();
        }, []);
      
        const role = storedData.role;

    return(
       <View style={styles.container}>
  <Text style={styles.message}>
    At least one company must be registered before creating an invoice.
  </Text>

  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: roleColors[role] },
    ]}
    onPress={() => setEmptyInvoice(false)}
  >
    <Text style={styles.buttonText}>Close</Text>
  </TouchableOpacity>
</View>
    )
};

export default ShowErrorMsg;