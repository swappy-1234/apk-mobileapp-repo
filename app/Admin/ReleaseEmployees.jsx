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
import LayoutWrapper from "../LayoutWrapper"
import styles from "../../styles/Admin/ReleaseEmployees";
import { url } from "../../universalApi/universalApi";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "../Pagination/Pagination";
import { useRoute, useNavigation } from "@react-navigation/native";

const ReleaseEmployees = () => {
  
  const navigation=useNavigation();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [restrainEmployees, setRestrainEmployees] = useState([]);
  const [popUpShow, setPopShow]=useState({selectedEmployeeId:"", selectedEmployeeName:"",action:"", popupStatus:false});
  const [filteredReleaseEmployees, setFilteredReleaseEmployees] = useState([]);


   const [data, setData] = useState("");
  const [tenantId, setTenantId] = useState("");
   const [filterCountry, setFilterCountry] = useState("");
   const [benchEmployeess, setBenchEmployeess] = useState([]);
   const [releaseEmployees, setReleaseEmployees] = useState([]);
   const [totalEmployees, setTotalEmployees] = useState(0);
    const [branches, setBranches] = useState([]);
  const [department, setDepartment] = useState([]);
  const [filterBranch, setFilterBranch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
   const [responseMessage, setResponseMessage] = useState();


  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil( filteredReleaseEmployees.length / ITEMS_PER_PAGE);

const paginatedData =  filteredReleaseEmployees.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);



useEffect(() => {
    const fetchData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");

      if (stored) setData(JSON.parse(stored));
      if (tenant) setTenantId(JSON.parse(tenant));
    };

    fetchData();
  }, []);

  const role = data.role;
  const token = data.token;
const employeeId=data.employeeId;


  const fetchEmployees = async () => {
  if (!token || !tenantId) return;

  let api = `${url}/api/v1/employeeManager/employeesByOrder`;
  if (filterCountry !== "") {
    api = `${url}/api/v1/employeeManager/getEmployeesByWorkingCountry/${filterCountry}`;
  }

  setLoading(true);

  try {
    const response = await fetch(api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await response.json();
     const activeEmployees = data.filter(
        (each) => each.employeeStatus === "ACTIVE"
      );

      const benchEmployees = activeEmployees.filter(
        (each) => each.benchStatus === "ONBENCH"
      );
      const releaseEmployees = activeEmployees.filter(
        (each) => each.benchStatus === "RELEASE"
      )
      console.log("Bench Employees", benchEmployees);
      console.log("Release Employees", releaseEmployees);

      setReleaseEmployees(releaseEmployees);
      setFilteredReleaseEmployees(releaseEmployees);

      console.log("benchhh", benchEmployees);
      setBenchEmployeess(benchEmployees);
      setReleaseEmployees(releaseEmployees);
      console.log("Employeee", data);

      const activeData = data.filter((each) => each.employeeStatus === "ACTIVE");
      setTotalEmployees(activeData.length);
      let allBranches = data.map((each) => each.branch);
      const newBranches = new Set(allBranches);
      setBranches([...newBranches]);

      let allDepartments = data.map((each) => each.department);
      const newDepartment = new Set(allDepartments);
      setDepartment([...newDepartment]);
      setEmployees(data);
      setLoading(false);
  } catch (error) {
    console.error(error);
  }finally{
    setLoading(false);
  }
};

useEffect(() => {
  fetchEmployees();
}, [tenantId, token, filterCountry]);


  


  const handleRelease = async (employeeId) => {

        try {
            const response = await axios.put(`${url}/api/v1/employeeManager/move-to-bench/${employeeId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                        "X-Tenant-Id": tenantId,
                    }

                }
            )

            console.log(response.data);
            setPopShow({selectedEmployeeId:"", selectedEmployeeName:"",action:"", popupStatus:false})
            fetchEmployees();

        } catch (error) {
            console.log("Employees are not moved to bench", error);

        }

    }

  const handleRestrain = async (employeeId) => {

        try {

            const response = await axios.put(`${url}/api/v1/employeeManager/restrain-release/${employeeId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                        "X-Tenant-Id": tenantId
                    }
                }
            )
            console.log("restrain:", response.data)
            fetchEmployees();
            setPopShow({selectedEmployeeId:"", selectedEmployeeName:"",action:"", popupStatus:false})
        } catch (error) {
            console.error("error while restraining employees", error)
        }

    }


     const filterData = () => {
        let data = releaseEmployees.filter(each => (each.firstName + " " + each.lastName).toLowerCase().includes(filterText.toLowerCase())); 
        setFilteredReleaseEmployees(data);
    }
    useEffect(() => {
        filterData();
    }, [filterText, releaseEmployees])

    useEffect(() => {
  setCurrentPage(1);
}, [filterText, releaseEmployees]);




  return (
    <LayoutWrapper>
      <ScrollView contentContainerStyle={{ paddingTop:0, padding: 15, paddingBottom: 100 }}>
<View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.navigate("Admin/Employee")}>
                <Ionicons name="arrow-back" size={25} color="#19CF99"/>
              </TouchableOpacity>
        <Text style={styles.heading}>Release Employees</Text>
        </View>

       {/* No release employees at all */}
{!loading &&
  releaseEmployees.length === 0 &&
  filterText.trim() === "" && (
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      No release employees available.
    </Text>
)}

        {releaseEmployees.length > 0 && (
          <TextInput
            placeholder="Search by name "
            style={styles.filterInput}
            value={filterText}
            onChangeText={setFilterText}
          />
        )}

        {loading && <ActivityIndicator size="large" color="#19CF99" />}
        {error !== "" && <Text style={styles.error}>{error}</Text>}


        {paginatedData .map((item, index) => (
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
             Employee ID: {item.employeeId}
            </Text>
             <Text style={styles.branchCode}>
                  Designation: {item.jobRole}
                </Text>
              </View>
               <View style={{flexDirection:"column", gap:"6" }}>
                      
                         <TouchableOpacity>
<Text style={styles.deleteBtn} onPress={() => setPopShow({employeeId:item.employeeId, employeeName:item.firstName+" "+item.lastName, popupStatus:true, action:"release"})}> Release</Text>                       
                        </TouchableOpacity>

                        <TouchableOpacity>
<Text style={styles.updateBtn} onPress={() => setPopShow({employeeId:item.employeeId, employeeName:item.firstName+" "+item.lastName, popupStatus:true, action:"restrain"})}> Restrain</Text>
                        </TouchableOpacity>
                    </View>
            </View>


            {/* <View style={styles.divider} />

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
            </View> */}
          </View>
        ))}

         <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />


       {/* Search applied but no match */}
{!loading &&
  releaseEmployees.length > 0 &&
  filterText.trim() !== "" &&
  filteredReleaseEmployees.length === 0 && (
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      No employee found for the search
    </Text>
)}


 

          {popUpShow.popupStatus && popUpShow.action === "release" && (
  <Modal transparent animationType="fade" visible>
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalText}>
          Are you sure you want to move{" "}
          <Text style={{ fontWeight: "bold" }}>
            {popUpShow.employeeName}
          </Text>{" "}
          to bench?
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
          ?
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



      </ScrollView>
    </LayoutWrapper>
  );
};

export default ReleaseEmployees;
