import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute} from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, TextInput } from "react-native";
import styles from "../../styles/Admin/Employeecss";
import { url } from "../../universalApi/universalApi";
import LayoutWrapper from "../LayoutWrapper";
import SetUpYariHive from "./SetupYarihive/SetUpYariHive";
import { Ionicons } from "@expo/vector-icons";
import AddEmployee from "./AddEmployee";
import Pagination from "../Pagination/Pagination";


const Employee = () => {
  const [countries, setCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterText, setFilterText]=useState("");

  const [data, setData] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigation=useNavigation();
  const [loading, setLoading]=useState(false);
  const [selfDelete, setSelfDelete]=useState(false);
  const [allEmployee, setAllEmployee]=useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [DeleteWarning, setDeleteWarning] = useState(false);
  // const [isResetId, setIsResetId] = useState(null);
  // const [resetEmployeeData, setResetEmployeeData] = useState(false);
  const [showModal, setShowModal]=useState(false);
  const [editEmployee, setEditEmployee]=useState(null);
  const [isUpdateEmployee, setIsUpdateEmployee] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [employeeRegistered, setEmployeeRegistered] = useState(false);
  const [updateEmployee, setUpdateEmployee] = useState({});
  const [releaseEmployees, setReleaseEmployees] = useState([]);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [BenchEmployee, setBenchEmployee] = useState(false);
  const [benchEmployees, setBenchEmployees] = useState([]);
  const [release, setRelease] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [finalReleaseStatus, setFinalReleaseStatus] = useState();
  const [finalReleaseEmployeeData, setFinalReleseEmployeeData] = useState();
  const [benchEmployeess, setBenchEmployeess] = useState([]);
  const route = useRoute();
  
  // Get tab param from navigation route (if any)
  const tabParam = route.params?.tab || "allEmployee";
  const [tab, setTab] = useState(tabParam);
  const [open, setOpen] = useState(null);
  const hasReleaseRequests = benchEmployees.some((emp) => emp.status === false);
  const hasBenchEmployee = benchEmployees.some((emp) => emp.status === false);
  const [employeeView, setEmployeeView] = useState("all");
  const [branches, setBranches] = useState([]);
  const [department, setDepartment] = useState([]);
  const [filterBranch, setFilterBranch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
   const [responseMessage, setResponseMessage] = useState();


  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

const paginatedData = filteredEmployees.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);


   const ROLE_LABELS = {
  employee: "Employee",
  admin: "Admin",
  manager: "Manager",
};

// Optional: sync activeTab with route.params
  // useEffect(() => {
  //   if (route.params?.tab) setActiveTab(route.params.tab);
  // }, [route.params?.tab]);

const handleEmployeeSuccess = (message) => {
    console.log("aaa", message);

    if (message == "Added") {
      setShowModal(false);
      setModalMessage("Registered");
      fetchEmployees();
    } else {
      setIsUpdateEmployee(false);
      setModalMessage("Updated");
      fetchEmployees();
    }

    setEmployeeRegistered(true);
  };

  // const openModal=(e)=>{
  //     setShowModal(true);
  //     setEditEmployee(null);
  //   }

  //   const closeModal=()=>{
  //     setShowModal(false);
  //   }

  //   const handleEdit=(employee)=>{
  //     console.log("edit employee: ", employee);
  //     setEditEmployee(employee);
  //     setShowModal(true);
  //   }

  const handleEmployeeAdded=()=>{
    setShowModal(true);
  }

     const handleUpdate = (emp) => {
    setIsUpdateEmployee(true);
    setUpdateEmployee(emp);
  };


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



  // ---------- FETCH COUNTRIES ----------
  useEffect(() => {
    if (!token || !tenantId) return;

    const fetchJobRolesAndCountry = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${url}/api/v1/employeeManager/metadata/roles-country`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": tenantId,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setCountries(data.availableCountries || []);
      } catch (error) {
        console.error("Error fetching job roles and countries:", error);
      }
    };

    fetchJobRolesAndCountry();
  }, [tenantId, token]);

  // ---------- FILTER LOGIC ----------
  useEffect(() => {
    let filtered = [...employees];

    if (filterEmployeeId) {
      filtered = filtered.filter((each) =>
        each.employeeId?.toLowerCase().includes(filterEmployeeId.toLowerCase())
      );
    }

    if (filterName) {
      filtered = filtered.filter((each) =>
        (each.firstName + " " + each.lastName)
          .toLowerCase()
          .includes(filterName.toLowerCase())
      );
    }

    if (filterEmail) {
      filtered = filtered.filter((each) =>
        each.corporateEmail?.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }

    if (filterDesignation) {
      filtered = filtered.filter((each) =>
        each.jobRole?.toLowerCase().includes(filterDesignation.toLowerCase())
      );
    }

    if (filterRole) {
      filtered = filtered.filter(
        (each) => each.role?.toLowerCase() === filterRole.toLowerCase()
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (each) => each.employeeStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredEmployees(filtered);
  }, [
    filterEmployeeId,
    filterName,
    filterEmail,
    filterDesignation,
    filterRole,
    filterStatus,
    employees,
  ]);


    const getAllBenchEmployees = async (token, tenantId) => {
    try {
      const response = await axios.get(`${url}/api/benchEmployee/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bench employees:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!token || !tenantId) return;
    const fetchBenchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getAllBenchEmployees(token, tenantId);
        setBenchEmployees(data);
      } catch (error) {
        console.error("Error fetching bench employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBenchEmployees();
  }, [token, tenantId]);

   const deleteBenchEmployee = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/benchEmployee/delete`, {
        params: {
          id: id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      });

      return response;
    } catch (error) {
      console.error("Error deleting bench employee:", error);
      throw error;
    }
  };


   const RejectRelease = async (emp) => {
    try {
      await deleteBenchEmployee(emp.id);

      // Remove deleted employee from UI list
      setBenchEmployees((prev) =>
        prev.filter((employee) => employee.id !== emp.id)
      );

    } catch (error) {
      console.error("Deleting bench employee failed", error);
    }
  };

  const handleInputChange = (employeeId, value) => {
    setManagerInputs((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

   const handleClearReporting = async (emp) => {
    try {
      const response = await fetch(
        `${url}/api/benchEmployee/clear-reporting/${emp}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": tenantId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear reporting manager");
      }

      const result = await response.text(); // Assuming backend returns plain text
      setResponseMessage(result);
      setError("");
    } catch (err) {
      console.error("Error while clearing bench employees", err);
      setError(err.message);
      setResponseMessage("");
    }
  };



   const handleDeleteEmployee = async (employeeId) => {
    if (!token || !tenantId) return;

    try {
      const response = await fetch(
        `${url}/api/v1/employeeManager/employees/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": tenantId,
          },
        }
      );

      if (response.ok) {
        console.log(response);
        setEmployees((prev) =>
          prev.filter((emp) => emp.employeeId !== employeeId)
        );

        await fetchEmployees();

        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete employee:", errorData);
      }
    } catch (error) {
      console.error("Error while deleting employee:", error);
    }
  };

const handleDeleteModalOpen = async (emp) => {
  const userData = JSON.parse(await AsyncStorage.getItem("companies"));
  const selfId = userData?.employeeId;

  if (emp.role?.toLowerCase() === "manager") {
    try {
      const response = await axios.get(
        `${url}/api/v1/employeeManager/reporting-to/${emp.employeeId}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantId,
          },
        }
      );

      if (response.data.length > 0) {
        setDeleteWarning(true);
        return;
      }

      if (emp.employeeId === selfId) {
        setSelfDelete(true);
        return;
      }

      setEmployeeToDelete(emp);
      setIsDeleteModalOpen(true);
      return;

    } catch (e) {
      console.log("Error fetching team:", e.message);
      return;
    }
  }

  if (emp.employeeId === selfId) {
    setSelfDelete(true);
    return;
  }

  setEmployeeToDelete(emp);
  setIsDeleteModalOpen(true);
};



  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
  setCurrentPage(1);
}, [filteredEmployees]);


  return (
    <LayoutWrapper>
      <ScrollView contentContainerStyle={{  paddingBottom: 100 }}>
        <View style={styles.employeeContainer}>
          <View style={styles.employerDashboardCard1}>
            <FontAwesome name="users" size={28} color="#19CF99" />
            <Text>Total Employees</Text>
            <Text>{totalEmployees}</Text>
          </View>

          <View style={styles.searchContainer}>
            <Picker
  selectedValue={filterCountry}
  onValueChange={(value) => setFilterCountry(value)}
  style={styles.filterSelects}
>
  <Picker.Item label="Filter by country" value="" />

  {countries.map((country, index) => (
    <Picker.Item key={index} value={country} label={country} />
  ))}
</Picker>

          </View>

         
<View style={styles.buttons}>
<TouchableOpacity onPress={()=>navigation.navigate("Admin/ReleaseEmployees")}>
  <Text style={styles.newsButtonText}>Release Request</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>navigation.navigate("Admin/BenchEmployees")}>
  <Text style={styles.newsButtonText}>Bench Employees</Text>
</TouchableOpacity>
</View>


          {allEmployee === true && (
             <View style={styles.buttons}>
            <TouchableOpacity onPress={()=>navigation.navigate("Admin/SetupYarihive/SetUpYariHive")}>
              <Text style={styles.newsButtonText}>+ Setup YariHive</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.newsButtonText} onPress={handleEmployeeAdded}
              //  onPress={()=>navigation.navigate("Admin/AddEmployee")}
               >+ Add Employee</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
        
{loading && <ActivityIndicator size="large" color="#19CF99"/>}

 {employees.length>0 && (
  <View>
    <Text style={styles.heading}>All Employees</Text>
                <TextInput placeholder="Search Name" style={styles.filterInput} value={filterName}
                onChangeText={setFilterName} 
                >
                </TextInput>
                </View>
                )}
        {/* ---------- TABLE SECTION ---------- */}
        {allEmployee && 
       <ScrollView contentContainerStyle={{ padding: 12 }}>
   {paginatedData.map((emp, index) => (
  <View key={index} style={styles.card}>
    {/* Header */}
    <View style={styles.headerRow}>
      <Text style={styles.index}>
       {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}.
        </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.branchName}>{emp.firstName} {emp.lastName}</Text>
        <Text style={styles.branchCode}>Employee ID:{emp.employeeId}</Text>
      </View>
      <View>
      <View
          style={[
            styles.statusChip,
            emp.employeeStatus === "ACTIVE"
              ? styles.active
              : styles.inactive,
          ]}
        >
          <Text style={styles.statusText}>{emp.employeeStatus}</Text>
        </View>

      <View style={{flexDirection:"row"}}>
        <TouchableOpacity   onPress={()=>{
           handleUpdate(emp);
        }}
><Text style={styles.updateBtn}>Update</Text></TouchableOpacity>
        <TouchableOpacity  onPress={() => handleDeleteModalOpen(emp)}
><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
      </View>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Address */}
    <Text style={styles.addressText}>
    {ROLE_LABELS[emp.role] || emp.role}, {emp.jobRole}, {emp.department}
    </Text>

    {/* Footer */}
    <View style={styles.metaRow}>
 <View style={styles.metaItem}>
  <Ionicons name="mail-outline" size={16} color="#19CF99" />
  <Text style={styles.metaText}>{emp.corporateEmail}</Text>
</View>


  <View style={styles.metaItem}>
    <Ionicons name="earth-outline" size={16} color="#19CF99" />
    <Text style={styles.metaText}>{emp.branch}</Text>
  </View>
</View>

  </View>
))}

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>


{employees.length>0 && filterName?.trim()!=="" && filteredEmployees.length===0 &&(
  <Text style={{ textAlign: "center", marginTop: 20 }}>No Employee found for that entered name.</Text>
)}

</ScrollView>
}
      </ScrollView>



{showModal && (
    <Modal>
      <AddEmployee
        onClose={setShowModal}
        onSuccess={handleEmployeeSuccess}
      />
   
</Modal>
)}

 {isUpdateEmployee && (
          <Modal>
            <AddEmployee
              onClose={setIsUpdateEmployee} 
              isUpdate={true}
              employeeToEdit={updateEmployee} 
              onSuccess={handleEmployeeSuccess}
            />
          </Modal>
        )}


        {employeeRegistered && (
          <Modal transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.successTitle}>Employee {modalMessage} Successfully</Text>
                <Text style={styles.modalText}>The employee has been {modalMessage} to your organization.</Text>
                 <TouchableOpacity
          style={styles.okBtn}
          onPress={() => setEmployeeRegistered(false)}
        >
          <Text style={styles.actionText}>OK</Text>
        </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

      {DeleteWarning && (
  <Modal visible={DeleteWarning} transparent animationType="fade">
    <View style={styles.modalCenter}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>Delete Not Allowed</Text>

        <Text style={styles.message}>
          This manager has reporting employees.  
          You must reassign them before deleting.
        </Text>

        <TouchableOpacity
          style={styles.okBtn}
          onPress={() => setDeleteWarning(false)}
        >
          <Text style={styles.actionText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


     {selfDelete && (
  <Modal visible={selfDelete} transparent animationType="fade">
    <View style={styles.modalCenter}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>Account Deletion Blocked</Text>

        <Text style={styles.message}>
          You cannot delete your own admin account.  
          Contact another admin to deactivate your account.
        </Text>

        <TouchableOpacity
          style={styles.okBtn}
          onPress={() => setSelfDelete(false)}
        >
          <Text style={styles.actionText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


      {isDeleteModalOpen && (
  <Modal
    visible={isDeleteModalOpen} transparent  animationType="fade"  onRequestClose={handleDeleteModalClose} >
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalText}>
          Are you sure you want to delete{" "}
          <Text style={{ fontWeight: "bold" }}>
            {employeeToDelete?.firstName} {employeeToDelete?.lastName}
          </Text>
          ?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.yesBtn]}
            onPress={() => handleDeleteEmployee(employeeToDelete.id)}
          >
            <Text style={styles.actionText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.noBtn]}
            onPress={handleDeleteModalClose}
          >
            <Text style={styles.actionText}>No</Text>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  </Modal>
)}





    </LayoutWrapper>
  );
};

export default Employee;
