import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import styles from '../../styles/Compliance/ComplianceManagement'
import AdminCompliance from "./AdminCompliance";
import { EmployeePensionDetails } from "./EmployeePensionDetails";
import EmployeeCompliance from "./EmployeeCompliance";
import LayoutWrapper from "../LayoutWrapper";

const ComplianceManagement = () => {
//   const route = useRoute();
const {role} = useContext(MyContext);
  const navigation = useNavigation();

//   const { section } = route.params || {};
  // const [tab, setTab] = useState("all-compliance");

//   useEffect(() => {
//     if (section) {
//       setTab(section);
//     }
//   }, [section]);

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        {
          (role === 'admin' || role === 'manager') ? (
            <>
            {/* Buttons */}
      <View style={styles.btnsBlock}>
         {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Compliance/AdminCompliance")}
        >
          <Text style={styles.btnText}>Employees Compliance</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Compliance/EmployeePensionDetails")}
        >
          <Text style={styles.btnText}>Employees Pension</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Compliance/EmployeeCompliance")}
        >
          <Text style={styles.btnText}>My Compliance</Text>
        </TouchableOpacity>

      </View>

      <AdminCompliance/>
            </>
          ) : (
            <>
            <EmployeeCompliance/>
            </>
          )
        }
      

    

      {/* Conditional Rendering
      {tab === "all-compliance" && <AdminCompliance />}
      {tab === "all-pension" && <EmployeePensionDetails />}
      {tab === "my-compliance" && <EmployeeCompliance />} */}
    </View>
    </LayoutWrapper>
    
  );
};

export default ComplianceManagement;
