import { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import {RadioButton} from 'react-native-paper';
import styles from "../../styles/Employee/Pension";



const Pension = ({ setIsUpdatePension, fetchPensionData, pensionData }) => {
   
    const [pensionForm, setPensionForm] = useState({
        employeeId : "",
        status: pensionData?.status,
        date:"",
    });
    const [showPicker, setShowPicker] = useState(false);
      const [storedData, setStoredData] = useState("");
  const [id, setId] = useState("");

  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    const parsed = JSON.parse(stored);
    setStoredData(parsed);
    setId(JSON.parse(tenant));
    if(parsed.employeeId) {
        setPensionForm((prev) => ({
            ...prev,
            employeeId : parsed.employeeId
        }))
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const role = storedData.role;
  const token = storedData.token;

   const handleSubmit = async () => {
       
        try {
            const response = await axios.post(`${url}/api/pension`, pensionForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Tenant-ID": id,
                },
            })
            console.log(response)
            setIsUpdatePension(false);
            fetchPensionData();
        }
        catch (e) {
            console.log("e", e)
        }
    }

    
/**
 * Convert "YYYY-MM-DD" to "DD-MM-YYYY".
 * If input is already "DD-MM-YYYY", it returns it unchanged.
 * If input doesn't match either pattern, it returns the original value.
 */
 

const isSubmitBtn=()=>{
    let b=true;
    if(pensionData.status===pensionForm.status && pensionData.date===pensionForm.date){
        b=false;
    }
    return b;

};



    return (
        <View style={styles.container}>
            <Icon name="close-circle-outline" size={28} color="#000" onPress={() => setIsUpdatePension(false)} />
            <View>
                <Text style={styles.heading}>Pension Status </Text>
                <View style={styles.cardContainer}>

  {/* OPT IN */}
  <View style={styles.cardAlign}>
    <RadioButton
      value="OPT_IN"
      status={pensionForm.status === "OPT_IN" ? "checked" : "unchecked"}
      onPress={() =>
        setPensionForm(prev => ({
          ...prev,
          status: "OPT_IN",
        }))
      }
    />
    <Text style={styles.label}>OPT IN</Text>
  </View>

  {/* OPT OUT */}
  <View style={styles.cardAlign}>
    <RadioButton
      value="OPT_OUT"
      status={pensionForm.status === "OPT_OUT" ? "checked" : "unchecked"}
      onPress={() =>
        setPensionForm(prev => ({
          ...prev,
          status: "OPT_OUT",
        }))
      }
    />
    <Text style={styles.label}>OPT OUT</Text>
  </View>

</View>


            </View>
            {/* <View>
               <DateTimePicker
  value={pensionForm.date ? new Date(pensionForm.date) : new Date()}
  mode="date"
  display="default"
  onChange={(event, selectedDate) => {
    if (selectedDate) {
      setPensionForm(prev => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
      }));
    }
  }}
/>

            </View> */}

             <View style={{ alignItems : 'center'}}>
  <TouchableOpacity onPress={() => setShowPicker(true)}>
    <Text  style={styles.dateStyle}>{pensionForm.date ? pensionForm.date : "Select Date"}</Text>
  </TouchableOpacity>

 {showPicker && (
  <DateTimePicker
    value={
      pensionForm.date
        ? new Date(pensionForm.date)
        : new Date()
    }
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowPicker(false);

      if (event.type === "dismissed") return;

      if (selectedDate) {
        const formattedDate = selectedDate
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD

        setPensionForm(prev => ({
          ...prev,
          date: formattedDate,
        }));
      }
    }}
  />
)}

</View>
            {
                isSubmitBtn() && 
                <TouchableOpacity onPress={handleSubmit} style={[styles.button,  ]}>
                    <Text style={styles.buttonText}>
                        Submit
                    </Text>
                </TouchableOpacity>
            }

        </View>
    )
};

export default Pension;