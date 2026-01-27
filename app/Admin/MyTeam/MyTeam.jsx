import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LayoutWrapper from "../../LayoutWrapper";
import styles from "../../../styles/Admin/MyTeam";
import { url } from "../../../universalApi/universalApi";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "../../Pagination/Pagination";
 
const MyTeam = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [restrainEmployees, setRestrainEmployees] = useState([]);
  const [popUpShow, setPopShow]=useState({selectedEmployeeId:"", selectedEmployeeName:"",action:"", popupStatus:false});
  const [errorPopUp, setErrorPopUp]=useState({isPopUp:false, message:""})
 
  const ITEMS_PER_PAGE = 5;
 
const [currentPage, setCurrentPage] = useState(1);
 
const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
 
const paginatedData = filteredEmployees.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
 
 
 
    const [isToken, setToken]=useState("");
    const [tenantId, setTenantId]=useState("");
 
useEffect(() => {
  const loadData = async () => {
    try {
      const storedCompany = await AsyncStorage.getItem("companies");
      if (storedCompany) {
        setToken(JSON.parse(storedCompany));
      }
 
      const tenant = await AsyncStorage.getItem("tenantId");
      if (tenant) {
        setTenantId(JSON.parse(tenant));
      }
 
    } catch (err) {
      console.log("Failed to load auth data", err);
    }
  };
 
  loadData();
}, []);
 
const token=isToken.token;
const employeeId=isToken.employeeId;
 
 
useEffect(()=>{
    console.log("TOKEN ", token);
  console.log("TENANT ", tenantId);
  console.log("EMPLOYEE ID ", employeeId);
    if(token && tenantId && employeeId){
        fetchEmployees(employeeId);
    }
},[token,tenantId,employeeId]);
 
 const fetchEmployees = async (employeeId) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${url}/api/v1/employeeManager/reporting-to/${employeeId}/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      }
    );
    setEmployees(response.data || []);
    setFilteredEmployees(response.data || []);
    console.log("Aravi: ", response.data);
  } catch (err) {
    console.error("API ERROR:", err?.response || err);
    setError("Failed to load employees");
  } finally {
    setLoading(false);
  }
};
 
 
 
  /** Search by name or designation */
  useEffect(() => {
    if (filterText.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const text = filterText.toLowerCase();
      setFilteredEmployees(
        employees.filter(
          (emp) =>
            emp.firstName.toLowerCase().includes(text) ||
            emp.lastName.toLowerCase().includes(text) ||
            emp.jobRole.toLowerCase().includes(text)
        )
      );
    }
  }, [filterText, employees]);
 
 
    const handleRelease = async (employeeId) => {
    try {
      setLoading(true);
      const response=await axios.put(
        `${url}/api/v1/employeeManager/request-release/${employeeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantId,
          },
        }
      );
 
      setEmployees(prev =>
      prev.map(emp =>
        emp.employeeId === employeeId
          ? { ...emp, benchStatus: "RELEASE" }
          : emp
      )
    );
 
    setFilteredEmployees(prev =>
      prev.map(emp =>
        emp.employeeId === employeeId
          ? { ...emp, benchStatus: "RELEASE" }
          : emp
      )
    );
 
    setPopShow({employeeId:"",employeeName:"",action:"",popupStatus:false})
 
    } catch (error) {
     
      setPopShow({employeeId:"",employeeName:"",action:"",popupStatus:false})
      setErrorPopUp({isPopUp:true, message:error.response.data.message});
    } finally {
      setLoading(false);
    }
  };
 
    const handleRestrain = async (employeeId) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${url}/api/v1/employeeManager/restrain-release/${employeeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantId,
          },
        }
      );
 
      setEmployees(prev =>
      prev.map(emp =>
        emp.employeeId === employeeId
          ? { ...emp, benchStatus: "WORKING" }
          : emp
      )
    );
 
    setFilteredEmployees(prev =>
      prev.map(emp =>
        emp.employeeId === employeeId
          ? { ...emp, benchStatus: "WORKING" }
          : emp
      )
    );
    setPopShow({employeeId:"",employeeName:"",action:"",popupStatus:false})
     
    } catch (error) {
      console.error("Error restraining employee",error);
     
    }finally{
      setLoading(false);
    }
  }
 
  useEffect(() => {
  setCurrentPage(1);
}, [filterText]);
 
 
  return (
    <LayoutWrapper>
      <ScrollView contentContainerStyle={{ paddingTop:0, padding: 15, paddingBottom: 100 }}>
        <Text style={styles.heading}>Reporting Employees</Text>
 
        {employees.length > 0 && (
          <TextInput
            placeholder="Search by name or designation"
            style={styles.filterInput}
            value={filterText}
            onChangeText={setFilterText}
          />
        )}
 
        {loading && <ActivityIndicator size="large" color="#19CF99" />}
        {error !== "" && <Text style={styles.error}>{error}</Text>}
 
        {paginatedData.map((item, index) => (
          <View key={item.employeeId} style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.index}>
               {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}.
                </Text>
 
              <View style={{ flex: 1 }}>
                <Text style={styles.branchName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.branchCode}>
                  Designation: {item.jobRole}
                </Text>
                 <Text style={styles.branchCode}>
             Role: {item.role?.toUpperCase()}
            </Text>
              </View>
               <View style={{flexDirection:"row"}}>
                      <TouchableOpacity>
{item.benchStatus === "RELEASE" ? <Text style={styles.updateBtn} onPress={() => setPopShow({employeeId:item.employeeId, employeeName:item.firstName+" "+item.lastName, popupStatus:true, action:"restrain"})}> Restrain</Text> : <Text style={styles.deleteBtn} onPress={() => setPopShow({employeeId:item.employeeId, employeeName:item.firstName+" "+item.lastName, popupStatus:true, action:"release"})}> Release</Text>}                        
                       
                        </TouchableOpacity>
                    </View>
            </View>
 
 
            <View style={styles.divider} />
 
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>
                 <Ionicons name="mail-outline" size={16} color="#19CF99" /> {item.corporateEmail}
                </Text>
              </View>
 
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>
                <Ionicons name="earth-outline" size={16} color="#19CF99" /> {item.workingCountry}
                </Text>
              </View>
            </View>
          </View>
        ))}
 
        <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
 
 
        {employees.length > 0 &&
          filterText.trim() !== "" &&
          filteredEmployees.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No employee found for the search
            </Text>
          )}
 
          {popUpShow.popupStatus && popUpShow.action === "release" && (
  <Modal transparent animationType="fade" visible>
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalText}>
          Are you sure you want to release{" "}
          <Text style={{ fontWeight: "bold" }}>
            {popUpShow.employeeName}
          </Text>{" "}
          from your team?
        </Text>
 
        <View style={styles.modalActions}>
          <TouchableOpacity
            onPress={() => handleRelease(popUpShow.employeeId)}
            style={styles.yesBtn}
          >
            <Text style={styles.actionText}>Yes</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            onPress={() =>
              setPopShow({
                employeeId: "",
                employeeName: "",
                action: "",
                popupStatus: false,
              })
            }
            style={styles.noBtn}
          >
            <Text style={styles.actionText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
 
  {popUpShow.popupStatus && popUpShow.action === "restrain" && (
  <Modal transparent animationType="fade" visible>
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalText}>
          Are you sure you want to Restrain{" "}
          <Text style={{ fontWeight: "bold" }}>
            {popUpShow.employeeName}
          </Text>{" "}
          to your team?
        </Text>
 
        <View style={styles.modalActions}>
          <TouchableOpacity
            onPress={() => handleRestrain(popUpShow.employeeId)}
            style={styles.yesBtn}
          >
            <Text style={styles.actionText}>Yes</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            onPress={() =>
              setPopShow({
                employeeId: "",
                employeeName: "",
                action: "",
                popupStatus: false,
              })
            }
            style={styles.noBtn}
          >
            <Text style={styles.actionText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
 
 
<Modal visible={errorPopUp.isPopUp} transparent animationType="fade">
  <View style={styles.modalCenter} >
    <View style={styles.modalBox}>
      <Text style={[styles.modalText, {color:"red"}]}>{errorPopUp.message}</Text>
      <TouchableOpacity style={styles.okBtn} onPress={()=>setErrorPopUp({isPopUp:false, message:""})}>
        <Text style={styles.actionText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
 
 
 
      </ScrollView>
    </LayoutWrapper>
  );
};
 
export default MyTeam;
 