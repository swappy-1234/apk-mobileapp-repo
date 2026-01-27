import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import JobRole from "../../Admin/SetupYarihive/JobRoles"
import CompanyBranch from "../../Admin/SetupYarihive/CompanyBranch/CompanyBranch";
import Department from "../../Admin/SetupYarihive/Department/Department";
import  LeaveSheet  from "../../Admin/SetupYarihive/LeaveSheet";
import { useNavigation, useRoute } from "@react-navigation/native";
import LayoutWrapper from "../../LayoutWrapper";
import { Ionicons } from '@expo/vector-icons';
import styles from '../../../styles/Admin/SetUpYariHiveCss';

const SetUpYariHive = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get tab param from navigation route (if any)
  const tabParam = route.params?.tab || "branch";
  const [activeTab, setActiveTab] = useState(tabParam);

  // Optional: sync activeTab with route.params
  useEffect(() => {
    if (route.params?.tab) setActiveTab(route.params.tab);
  }, [route.params?.tab]);

  return (
    <LayoutWrapper>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{ paddingLeft: 20, paddingRight:20, paddingBottom:20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
         <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
             {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
          <TouchableOpacity onPress={() => navigation.navigate("Admin/Employee")}>
        <Ionicons name="arrow-back" size={25} color="#19CF99"/>
      </TouchableOpacity>
             <Text style={styles.heading}>Setup YariHive</Text>
         
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "branch" && { backgroundColor: "#19CF99" },
            ]}
            onPress={() => setActiveTab("branch")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "branch" && { color: "white" },
                activeTab !== "branch" && { color: "#19CF99" },
              ]}
            >
              Branch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "department" && { backgroundColor: "#19CF99" },
            ]}
            onPress={() => setActiveTab("department")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "department" && { color: "white" },
                activeTab !== "department" && { color: "#19CF99" },
              ]}
            >
              Department
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "jobRoles" && { backgroundColor: "#19CF99" },
            ]}
            onPress={() => setActiveTab("jobRoles")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "jobRoles" && { color: "white" },
                activeTab !== "jobRoles" && { color: "#19CF99" },
              ]}
            >
              Job Roles
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "leaveSheet" && { backgroundColor: "#19CF99" },
            ]}
            onPress={() => setActiveTab("leaveSheet")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "leaveSheet" && { color: "white" },
                activeTab !== "leaveSheet" && { color: "#19CF99" },
              ]}
            >
              LeaveSheet
            </Text>
          </TouchableOpacity>
        </View>

        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === "jobRoles" && <JobRole />}
          {activeTab === "branch" && <CompanyBranch />}
          {activeTab === "department" && <Department />}
          {activeTab === "leaveSheet" && <LeaveSheet />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </LayoutWrapper>
  );
};

export default SetUpYariHive;

