import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AssignedTasks from "./AssignedTasks";
import RecievedTasks from "./RecievedTasks"
import { MyContext } from "../Context/MyContext";

const TaskManagement = () => {
  const { role, state } = useContext(MyContext);
  const navigation = useNavigation();

  console.log("roleee : ", role);
  console.log("state : ", state);
  useEffect(() => {
    if (state && Object.keys(state).length !== 0) {
      if (!state.task) {
        navigation.replace("EmployeeDashboard"); // instead of "/"
      }
    }
  }, [navigation, state]);

  return (
    <View >
      {(role !== "employee") ? (
        <AssignedTasks />
      ) : (
        <RecievedTasks />
      )}
    </View>
  );
};

export default TaskManagement;
