import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LayoutWrapper from "../LayoutWrapper"
import styles from "../../styles/Admin/BenchEmployees";
import { url } from "../../universalApi/universalApi";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "../Pagination/Pagination";
import { useNavigation } from "@react-navigation/native";


const BenchEmployees = () => {
   const navigation=useNavigation();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [restrainEmployees, setRestrainEmployees] = useState([]);
  const [popUpShow, setPopShow] = useState({
  employeeId: "",
  employeeName: "",
  action: "",
  popupStatus: false,
  managerName: "",
  managerId: "",
});

  const [managers, setManagers] = useState([]);
   const [pickerModal, setPickerModal] = useState({ visible: false, items: [], key: "", title: "" });
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedManagers, setSelectedManagers] = useState({});
  const [selectedManagerId, setSelectedManagerId] = useState([]);
  const [filteredBenchEmployees, setFilteredBenchEmployees] = useState([]);

   const [data, setData] = useState("");
    const [tenantId, setTenantId] = useState("");
     const [filterCountry, setFilterCountry] = useState("");
     const [benchEmployeess, setBenchEmployeess] = useState([]);
     const [totalEmployees, setTotalEmployees] = useState(0);
      const [branches, setBranches] = useState([]);
    const [department, setDepartment] = useState([]);
    const [filterBranch, setFilterBranch] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");
     const [responseMessage, setResponseMessage] = useState();
      const [benchEmployees, setBenchEmployees] = useState([]);
      const [tempSelectedManagers, setTempSelectedManagers] = useState({});


  const ITEMS_PER_PAGE = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(filteredBenchEmployees.length / ITEMS_PER_PAGE);

const paginatedData = filteredBenchEmployees.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

 const openPickerModal = (key, items, title = "Select") => {
    setPickerModal({ visible: true, items, key, title });
    setPickerSearch("");
  };

  const closePickerModal = () => {
    setPickerModal({ ...pickerModal, visible: false });
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
      console.log("Bench Employees", benchEmployees);

      setBenchEmployees(benchEmployees);
      setFilteredBenchEmployees(benchEmployees);

      console.log("benchhh", benchEmployees);
      setBenchEmployees(benchEmployees);
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


  const fetchAdminManager = async () => {
        try {
            const response = await axios.get(`${url}/api/v1/employeeManager/AdminsAndManagers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                        "X-Tenant-ID": tenantId
                    }
                })
            console.log("managersdata:", response.data);
            setManagers(response.data);
 
        } catch (error) {
            console.error("error fetching admin and managers", error);
        }
 
    }
    useEffect(() => {
        if (tenantId) {
            fetchAdminManager();
        }
    }, [tenantId])

     console.log("selectedManagerId:", selectedManagerId);
 
    const selectedManager = (id) => {
        let filteredData = selectedManagerId.filter((each) => each.id === id)[0];
        return filteredData?.managerId;
    }

 const updateReportingManager = async (employeeId, reportingTo) => {
  try {
    setLoading(true);

    await axios.put(
      `${url}/api/v1/employeeManager/update-reporting/${employeeId}`,
      {}, // ✅ EMPTY BODY (IMPORTANT)
      {
        params: {
          reportingToValue: reportingTo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      }
    );

    fetchEmployees(); // refresh list

   setPopShow({
  employeeId: "",
  employeeName: "",
  popupStatus: false,
  action: "",
  managerId: "",
  managerName: ""
});

  } catch (error) {
    console.log("error occurred while updating manager", error?.response?.data || error);
  } finally {
    setLoading(false);
  }
};


  const filterData = () => {
         let data = benchEmployees.filter(each => (each.firstName + " " + each.lastName).toLowerCase().includes(filterText.toLowerCase())); 
         setFilteredBenchEmployees(data);
     }
     useEffect(() => {
         filterData();
     }, [filterText, benchEmployees])
 

  useEffect(() => {
  setCurrentPage(1);
}, [filterText]);


const openManagerPicker = (employee) => {
 setPopShow({
  employeeId: item.employeeId,
  employeeName: item.firstName + " " + item.lastName,
  popupStatus: true,
  action: "update",
  managerId: "",
  managerName: ""
});

};


const selectManager = (manager) => {
  setTempSelectedManagers(prev => ({
    ...prev,
    [manager.employeeId]: manager.employeeIdValue
  }));

  setPopShow(prev => ({
    ...prev,
    managerId: manager.employeeIdValue,
    managerName: `${manager.firstName} ${manager.lastName}`,
  }));
};

const handleConfirmUpdate = async () => {
  await updateReportingManager(popUpShow.employeeId, popUpShow.managerId);

  // ✅ commit temp → final
  setSelectedManagers(prev => ({
    ...prev,
    [popUpShow.employeeId]: popUpShow.managerId
  }));

  // ❌ clear temp
  setTempSelectedManagers(prev => {
    const copy = { ...prev };
    delete copy[popUpShow.employeeId];
    return copy;
  });
};

const closePopup = () => {
  setTempSelectedManagers(prev => {
    const copy = { ...prev };
    delete copy[popUpShow.employeeId];
    return copy;
  });

  setPopShow({
    employeeId: "",
    employeeName: "",
    popupStatus: false,
    action: "",
    managerId: "",
    managerName: "",
  });
};




  return (
    <LayoutWrapper>
      <ScrollView contentContainerStyle={{ paddingTop:0, padding: 15, paddingBottom: 100 }}>
        <View style={styles.header}>
                 <TouchableOpacity onPress={() => navigation.navigate("Admin/Employee")}>
                        <Ionicons name="arrow-back" size={25} color="#19CF99"/>
                      </TouchableOpacity>
                <Text style={styles.heading}>Bench Employees</Text>
                </View>
{/* No bench employees at all */}
{!loading &&
  benchEmployees.length === 0 &&
  filterText.trim() === "" && (
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      No bench employees available.
    </Text>
)}

        {benchEmployees.length > 0 && (
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
             Employee ID: {item.employeeId}
            </Text>
             <Text style={styles.branchCode}>
                  Designation: {item.jobRole}
                </Text>
                <View style={{flexDirection:'row'}}>
              <Text style={styles.label}>
  Manager :
</Text>

<TouchableOpacity
  style={styles.input}
  onPress={() =>
    openPickerModal(
      item.employeeId, // 🔑 key = employeeId
      managers.map((m) => ({
        label: `${m.firstName} ${m.lastName || ""}`,
        value: m.employeeId,
      })),
      "Manager"
    )
  }
>
  <Text>
 {tempSelectedManagers[item.employeeId]
  ? (() => {
      const manager = managers.find(
        (m) => m.employeeId === tempSelectedManagers[item.employeeId]
      );
      return manager
        ? `${manager.firstName} ${manager.lastName || ""}`
        : "Select manager";
    })()
  : "Select manager"}
</Text>

</TouchableOpacity>
</View>


              </View>
               {/* <View style={{flexDirection:"column", gap:"6" }}>
                        <TouchableOpacity>
<Text style={styles.updateBtn}
//  onPress={() => 
// setPopShow({employeeId:item.employeeId, employeeName:item.firstName+" "+item.lastName, popupStatus:true, action:"update",managerId: "", 
//   managerName: ""})
// }
onPress={() => {
  const selectedManagerId = selectedManagers[item.employeeId];

  if (!selectedManagerId) {
    alert("Please select a manager");
    return;
  }

  const manager = managers.find(
    (m) => m.employeeId === selectedManagerId
  );

  setPopShow({
    employeeId: item.employeeId,
    employeeName: item.firstName + " " + item.lastName,
    popupStatus: true,
    action: "update",
    managerId: manager.employeeId,
    managerName: `${manager.firstName} ${manager.lastName}`,
  });
}}

  > Update</Text>
                        </TouchableOpacity>
                    </View> */}
{tempSelectedManagers[item.employeeId] && (
  <TouchableOpacity
    onPress={() => {
      const manager = managers.find(
        (m) => m.employeeId === tempSelectedManagers[item.employeeId]
      );

      setPopShow({
        employeeId: item.employeeId,
        employeeName: `${item.firstName} ${item.lastName}`,
        popupStatus: true,
        action: "update",
        managerId: manager.employeeId,
        managerName: `${manager.firstName} ${manager.lastName}`,
      });
    }}
  >
    <Text style={styles.updateBtn}>Update</Text>
  </TouchableOpacity>
)}


            </View>
          </View>
        ))}

         {/* Search applied but no match */}
{!loading &&
  benchEmployees.length > 0 &&
  filterText.trim() !== "" &&
  filteredBenchEmployees.length === 0 && (
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      No employee found for the search
    </Text>
)}

{filteredBenchEmployees.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}

{popUpShow.popupStatus &&
 popUpShow.action === "update" &&
  (
  <Modal transparent animationType="fade" visible>
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text>Please select a manager</Text>
        <TouchableOpacity
          onPress={() =>
            setPopShow({
              employeeId: "",
              employeeName: "",
              popupStatus: false,
              action: "",
              managerId: "",
              managerName: "",
            
            })
          }
        >
          <Text>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


{popUpShow.popupStatus &&
 popUpShow.action === "update" &&
 (
  <Modal transparent animationType="fade" visible>
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalText}>
          Are you sure want to move <Text style={{ fontWeight: "bold" }}>{popUpShow.employeeName}</Text>
          {" "}to{" "}
          <Text style={{ fontWeight: "bold" }}>{popUpShow.managerName}</Text> team?
        </Text>

        <View style={styles.modalActions}>

       <TouchableOpacity onPress={handleConfirmUpdate} style={styles.yesBtn}>
  <Text style={styles.actionText}>Yes</Text>
</TouchableOpacity>

        <TouchableOpacity onPress={closePopup} style={styles.noBtn}>
  <Text style={styles.actionText}>No</Text>
</TouchableOpacity>

        </View>
      </View>
    </View>
  </Modal>
)}

      </ScrollView>
       <Modal
                        visible={pickerModal.visible}
                        transparent
                        animationType="slide"
                        onRequestClose={closePickerModal}
                      >
                        <View style={styles.pickerOverlay}>
                          <View style={styles.pickerContainer}>
                            <Text style={styles.modalTitle}>{pickerModal.title}</Text>
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search..."
                              value={pickerSearch}
                              onChangeText={setPickerSearch}
                            />
                            <FlatList
                              style={{ maxHeight: 300 }}
                              data={pickerModal.items.filter((item) =>
                                item.label.toLowerCase().includes(pickerSearch.toLowerCase())
                              )}
                              keyExtractor={(_, index) => index.toString()}
                              keyboardShouldPersistTaps="handled"
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  style={styles.option}
                                   onPress={() => {
    selectManager({
      employeeId: pickerModal.key, // this is the employee's ID
      firstName: item.label.split(" ")[0], // split full name
      lastName: item.label.split(" ")[1] || "",
      employeeIdValue: item.value, // managerId
    });

    closePickerModal();
  }}
                                >
                                  <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                              )}
                            />
                            <TouchableOpacity onPress={closePickerModal} style={styles.closeBtn}>
                              <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
    </LayoutWrapper>
  );
};

export default BenchEmployees;
