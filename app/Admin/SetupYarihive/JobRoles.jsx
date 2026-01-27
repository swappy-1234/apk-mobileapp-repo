import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from '../../../styles/Admin/JobRoles';
import { url } from "../../../universalApi/universalApi";
import Department from "./Department/Department";

const JobRole = () => {
  const [newJobRole, setNewJobRole] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ jobRole: "", department:"" });
  const [filterText, setFilterText] = useState("");
  const [error, setError] = useState("");
  const navigation=useNavigation();
  const [departments, setDepartments]=useState([]);
  const [selectedDept, setSelectedDept]=useState("");
  const [fieldErrors, setFieldErrors] = useState({});
 const [openAddDept, setOpenAddDept] = useState(false);
const [openEditDept, setOpenEditDept] = useState(false);
  const [isModified, setIsModified]=useState(false);
  const [filteredRoles, setFilteredRoles] = useState([]);
   const [nameError, setNameError] = useState("");
  // Popups
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [successPopup, setSuccessPopup] = useState("");
  const [errorPopup, setErrorPopup] = useState({show:false, message:""});
  

  const [token, setToken] = useState("");
  const [tenantId, setTenantId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedCompany = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");

      if (storedCompany) {
        setToken(JSON.parse(storedCompany).token);
      }
      if (tenant) {
        setTenantId(JSON.parse(tenant));
      }
    };
    loadData();
  }, []);

  // ---------------------------------------------------
  // FETCH JOB ROLES
  // ---------------------------------------------------
  const fetchJobRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/apis/employees/jobRoles/jobRoles`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      });

      const data = await response.json();
      setJobRoles(data);
    } catch (err) {
      setError("Failed to fetch job roles");
    } finally {
      setLoading(false);
    }
  }, [token, tenantId]);

  useEffect(() => {
    if (token && tenantId) 
      fetchJobRoles();
    
  }, [token, tenantId]);

  // ---------------------------------------------------
  // ADD JOB ROLE
  // ---------------------------------------------------
  const handleAddJobRole = async () => {
    if (!newJobRole.trim()) {
      setError("Please enter job role name");
      return;
    }

    if(!selectedDept.trim()){
      setError("Please select a department");
      return;
    }


    const isDuplicate = jobRoles.some(
      (role) => role.jobRole.toLowerCase() === newJobRole.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Job role already exists");
      return;
    }
    

    setLoading(true);

    try {
      await fetch(`${url}/apis/employees/jobRoles/addJobRole`,{
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
        body: JSON.stringify({ jobRole: newJobRole, department:selectedDept }),
      });

      setSuccessPopup(`"${newJobRole}" role has been added successfully.`);
      setNewJobRole("");
      setSelectedDept("");
      fetchJobRoles();
    } catch {
        if (error.response?.status === 409) {
        return { error: error.response.data.message };
      }
      setError("Error adding job role");
    }

    setLoading(false);
  };


  const handleCheckBeforeDelete = async (jobRoleName, id) => {
    try {
      const checkResponse = await axios.get(
        `${url}/api/v1/employeeManager/check-jobrole-assigned`,
        {
          params: { jobRoleName },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantId,
          },
        }
      );
      if (checkResponse.status === 200) {
        setConfirmDelete({ show: true, id });
      }
    } catch (error) {
      console.log("Error response:", error.response);
      if (error.response?.status === 409) {
        setErrorPopup({
          show: true,
          message: error.response.data.message || "You cannot delete this job role because it was assigned to employees.",
        });
      }
       else {
        console.error("Error checking job role:", error);
        setErrorPopup({
          show: true,
          message: "Something went wrong while checking job role.",
        });
      }
    }
  };

  // ---------------------------------------------------
  // DELETE JOB ROLE
  // ---------------------------------------------------
  const handleDeleteJobRole = async (id) => {
    try {
      await fetch(`${url}/apis/employees/jobRoles/deleteJobRoleById/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": tenantId,
        },
      });

      setConfirmDelete({ show: false, id: null });
      fetchJobRoles();
    } catch {
      setErrorPopup("Failed to delete job role");
    }
  };

  // ---------------------------------------------------
  // UPDATE JOB ROLE
  // ---------------------------------------------------


// useEffect(() => {
//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get(
//         `${url}/api/department/getAll`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "X-Tenant-ID": tenantId,
//           },
//         }
//       );

//       setDepartments(response.data);
//     } catch (error) {
//       console.error("Error fetching departments:", error);
//     }
//   };

//   fetchDepartments();
// }, [url, token, tenantId]);
useEffect(() => {
  if (!token || !tenantId) {
    return; // ✅ stop early
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${url}/api/department/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": tenantId,
          },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error(
        "Error fetching departments:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  fetchDepartments();
}, [token, tenantId]);

const handleUpdateJobRole = async (id) => {
  if (!editedData.jobRole.trim() || !editedData.department.trim()) {
    setError("Job role required");
    return;
  }

   const isDuplicate = jobRoles.some(
      (d) =>
        d.id !== id &&
        d.jobRole.toLowerCase() ===
        editedData.jobRole.trim().toLowerCase()
    );

   if (isDuplicate) {
      setErrorPopup({
        show: true,
        message: "Job role already exists. Please enter a new job role.",
      });
      return;
    }

    

  try {
    await fetch(`${url}/apis/employees/jobRoles/updateJobRole/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
      },
      body: JSON.stringify(editedData),
    });

    setSuccessPopup("Job role updated successfully");
    setEditingId(null);
    fetchJobRoles(); 
  } catch (error) {
    console.error("Update failed", error);
     if (error.response?.status === 409) {
        return { error: error.response.data.message };
      }
    setError("Failed to update job role");
  }
};




   console.log("maahi:", departments);


  // ---------------------------------------------------
  // FILTER LIST
  // ---------------------------------------------------
useEffect(() => {
  let filteredRolesByJob = jobRoles.filter((role) =>
    role.jobRole?.toLowerCase().includes(filterText.toLowerCase())
  );

  let filteredRolesByDept = jobRoles.filter((role) =>
    (role.department || "").toLowerCase().includes(filterText.toLowerCase())
  );

  const combined = [...filteredRolesByJob, ...filteredRolesByDept];

  const unique = [];
  combined.forEach((r) => {
    if (!unique.some((u) => u.jobRoleId === r.jobRoleId)) {
      unique.push(r);
    }
  });

  setFilteredRoles(filterText ? unique : jobRoles);
}, [filterText, jobRoles]);


  // ---------------------------------------------------
  // UI Rendering
  // ---------------------------------------------------
  return (
    <ScrollView  contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.heading}>Job Roles</Text>
        </View>

        <View style={styles.deptSelectContainer}>

  <Modal visible={openAddDept} transparent animationType="fade">
    <TouchableOpacity
      style={styles.modalOverlay}
      onPress={() => setOpenAddDept(false)}
    >
      <View style={styles.modalContent}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept.id}
            style={styles.option}
            onPress={() => {
              setSelectedDept(dept.departmentName);
              setFieldErrors((prev) => ({ ...prev, department: "" }));
              setOpenAddDept(false);
            }}
          >
            <Text>{dept.departmentName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>

  {fieldErrors.department && (
    <Text style={styles.errorDepartment}>
      {fieldErrors.department}
    </Text>
  )}
</View>


      {/* Add Role Input */}
      <View style={styles.row}>
 <View style={styles.col}>
        <TouchableOpacity
    style={styles.dropdown}
    onPress={() => setOpenAddDept(true)}
  >
    <Text style={styles.dropdownText}>
      {selectedDept || "Select Department"}
    </Text>
  </TouchableOpacity>
  </View>
<View style={styles.col}>
        <TextInput
          placeholder="Enter new job role"
          style={[styles.input,{marginTop:0}]}
          value={newJobRole}
          onChangeText={(t) => {
            setNewJobRole(t);
            setError("");
          }}
        />
        </View>
        <View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddJobRole}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Filter */}
      {jobRoles.length > 0 && (
        <TextInput
          placeholder="Search by JobRole or Department"
          style={styles.filterInput}
          value={filterText}
          onChangeText={setFilterText}
        />
      )}

      {loading && <ActivityIndicator size="large" color="#19CF99" />}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

{filteredRoles.map((item,index)=>(
  <View key={item.jobRoleId} style={styles.card}>
  <View style={styles.headerRow}>
    <Text style={styles.index}>{index+1}.</Text>
    <Text style={styles.leaveType}>
      {editingId===item.jobRoleId?"Edit Job Role":item.jobRole}
    </Text>
  </View>
  {editingId===item.jobRoleId?(
    <>
    <TextInput style={[styles.input, editedData.jobRole==="" && styles.errorInput]} placeholder="Job role"
    value={editedData.jobRole} 
    // onChangeText={(value)=>{
    //   setEditedData({...editedData, jobRole:value});
    //   setIsModified(value!==item.jobRole || editedData.department !== item.department);
    // }}

     onChangeText={(text) => {
              if (text.length > 30) {
                setNameError("Jobrole name cannot exceed 30 characters");
              } else if(text.length<1){
                setNameError("Jobrole cannot be empty.");
              }
              else {
                setNameError("");
              }

              setEditedData({...editedData, jobRole:text});
               setIsModified(text!==item.jobRole || editedData.department !== item.department);
              // setIsModified(text !== item.departmentName);
            }}
    />
     <TouchableOpacity
      style={styles.updateDropdown}
      onPress={() => setOpenEditDept(true)}
    >
      <Text style={styles.dropdownText}>
        {editedData.department || "Select Department"}
      </Text>
    </TouchableOpacity>

    <Modal visible={openEditDept} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setOpenEditDept(false)}
      >
        <View style={styles.modalContent}>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              style={styles.option}
              onPress={() => {
                setEditedData((prev) => ({
                  ...prev,
                  department: dept.departmentName,
                }));
                  setIsModified(
      editedData.jobRole !== item.jobRole ||
      dept.departmentName !== item.department
    );
                setOpenEditDept(false);
              }}
            >
              <Text>{dept.departmentName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
      {nameError && (
                <Text style={styles.errorText}>{nameError}</Text>
              )}
    </>
  ):(
    <Text style={styles.daysText}>Department: <Text style={styles.daysValue}>{item.department}</Text></Text>
  )}

   <View style={styles.actionsRow}>
            {editingId === item.jobRoleId ? (
              <>
              {isModified &&(
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => handleUpdateJobRole(item.jobRoleId, editedData)}
                >
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
              )}
              

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {setEditingId(null);  setNameError(""); }}
                  
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => {
                    setEditingId(item.jobRoleId);
                    setEditedData({ jobRole: item.jobRole, department:item.department || "" });
                    setIsModified(false);
                    setOpenEditDept(false);
                  }}
                >
                  <Text style={styles.actionText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                     handleCheckBeforeDelete(item.jobRole, item.jobRoleId)
                  }
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
  </View>
))}
      {jobRoles.length > 0 &&
  filteredRoles.length === 0 &&
  filterText.trim() !== "" && (
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      No job roles found for the entered search.
    </Text>
)}


      {/* Confirm Delete Modal */}
      <Modal visible={confirmDelete.show} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this job role?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.yesBtn}
                onPress={() => handleDeleteJobRole(confirmDelete.id)}
              >
                <Text style={styles.actionText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => setConfirmDelete({ show: false, id: null })}
              >
                <Text style={styles.actionText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Popup */}
      <Modal visible={successPopup !== ""} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{successPopup}</Text>

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => setSuccessPopup("")}
            >
              <Text style={styles.actionText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Popup */}
      <Modal visible={errorPopup.show} transparent animationType="fade">
        <View style={styles.modalCenter}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalText, { color: "red" }]}>
              {errorPopup.message}
            </Text>

            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => setErrorPopup({show:false, message:""})}
            >
              <Text style={styles.actionText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
   
  );
};

export default JobRole;

