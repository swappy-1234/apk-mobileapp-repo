import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmployeeTimesheet from "./EmployeeTimesheet";
import AdminTimesheet from "./AdminTimesheet";

const TimesheetManagement = () => {
  const [storedData, setStoredData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem("companies");
      if (stored) {
        setStoredData(JSON.parse(stored));
      }
    } catch (e) {
      console.log("Storage error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const role = storedData?.role;

  return (
    <View style={{ flex: 1 }}>
      {(role === "admin" || role === "manager") ? (
        <AdminTimesheet />
      ) : (
        <EmployeeTimesheet />
      )}
    </View>
  );
};

export default TimesheetManagement;
