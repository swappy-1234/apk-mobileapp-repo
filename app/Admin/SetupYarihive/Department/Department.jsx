import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../../../styles/Admin/DepartmentCss';
import { url } from '../../../../universalApi/universalApi';

const Department=()=>{
    const [newDepartment, setNewDepartment]=useState("");
    const [error, setError]=useState("");
    const [departments, setDepartments]=useState([]);
    const [filterText, setFilterText]=useState("");
    const [loading, setLoading]=useState(false);
    const [editedData, setEditedData]=useState({departmentName:""});
    const [editingId, setEditingId]=useState(null);
    const [editedDepartment, setEditedDepartment]=useState("");
    const [isModified, setIsModified] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const [showSuccessPopup, setShowSuccessPopup] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const limits = { department: 30 };
    const [departmentName, setDepartmentName] = useState("");
    const [nameError, setNameError] = useState("");

  

    const [token, setToken]=useState("");
    const [tenantId, setTenantId]=useState("");

useEffect(()=>{
    const loadData=async()=>{
        try{
            const storedCompany=await AsyncStorage.getItem("companies");
              if(storedCompany){
            setToken(JSON.parse(storedCompany).token);
              }
        }catch(err){
            console.log("failed to load token", err);
        }
        
      try{
        const tenant=await AsyncStorage.getItem("tenantId");
        if(tenant){
            setTenantId(JSON.parse(tenant));
        }
    }catch(err){
        console.log("failed to load tenantId",err);
    }
    }
    loadData();
},[]);

useEffect(()=>{
    if(token && tenantId){
        fetchDepartments();
    }
},[token,tenantId]);

const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId,
        },
      });
      setDepartments(res.data);
      console.log("ba:", departments);
    //   setDisplayedDepartments(res.data);
    //   let data = response.data;
    //   setDepartments(res.data);
    console.log("aru",departments);

    } catch (err) {
      console.error("Error fetching departments", err);
    } finally {
      setLoading(false);
    }
  });


  const handleAddDepartment = async (e) => {
    e.preventDefault();

    // if(!newDepartment.trim()){
    //   setError("Please Enter department name");
    //   return;
    // }

    const trimmed = newDepartment.trim();

    let errors = {};
    if (!trimmed) errors.department = "Department cannot be empty.";
    if (trimmed.length > limits.department)
      errors.department = `Max ${limits.department} characters allowed.`;

    const duplicate = departments.some(
      (d) => d.departmentName.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) errors.department = "Department already exists.";

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      await axios.post(
        `${url}/api/department/add`,
        { departmentName: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": tenantId,
          },
        }
      );
      fetchDepartments();
      setShowSuccessPopup(`"${newDepartment}" department has been added successfully.`);
      setNewDepartment("");

    } catch {
      setErrorPopup("Error adding department.");
    }
  };

   //  UPDATE DEPARTMENT
  const handleUpdateDepartment = async (id) => {
    if (!editedDepartment.trim()) return;

    const duplicate = departments.some(
      (d) =>
        d.id !== id &&
        d.departmentName.toLowerCase() ===
        editedDepartment.trim().toLowerCase()
    );
    if (duplicate) {
      setErrorPopup({
        show: true,
        message: "Department already exists.",
      });
      return;
    }

    try {
      await axios.put(
        `${url}/api/department/update/${id}`,
        { departmentName: editedDepartment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID":tenantId,
          },
        }
      );
      setShowSuccessPopup(`"${editedDepartment}" department has been updated successfully.`)
      fetchDepartments();
      setEditingId(null);
      setIsModified(false);

    } catch {
      setErrorPopup(
        "Error updating department.",
      );
    }
  };


  const handleCheckBeforeDelete=async(departmentName, id)=>{
    try{
      const response=await axios.get(`${url}/api/v1/employeeManager/check-department-assigned`,{
        params:{departmentName},
        headers:{
          Authorization:`Bearer ${token}`,
          "X-Tenant-ID":tenantId,
        }
      }
      );
      if(response.status===200){
        setConfirmDelete({show:true, id});
      }
    }catch(error){
      console.log("error:", error.response);
      if(error.response?.status===409){
        setErrorPopup({show:true, message:error.response.data.message || "you cannot delete this department because it was assigned to employees."})
      }else{
        setErrorPopup({show:true, message:"something went wrong"})
      }
    }
  }

   const handleDeleteDepartment = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${url}/api/department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId,
        },
      });
       setConfirmDelete({ show: false, id: null });
        fetchDepartments();
    } catch {
      setErrorPopup("Error deleting department.");
    }finally{
      setLoading(false);
    }
  };

  const filteredDepartments=departments.filter((department)=>
    department.departmentName.toLowerCase().includes(filterText.toLowerCase())
);

  console.log("hanuman", filteredDepartments);


    return(
          <ScrollView contentContainerStyle={{paddingBottom:100}}
          keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Departments</Text>
            {/* Department input */}
            <View style={styles.row}>
                <TextInput placeholder='Enter new department' style={styles.input} value={newDepartment} 
                // onChangeText={(a)=>{setNewDepartment(a); setError("")}}
                 onChangeText={(e) => {
                    let v = e.replace(/^\s+/, "");
                    if (v) v = v[0].toUpperCase() + v.slice(1);
                    setNewDepartment(v);
                    setFieldErrors({});
                    setError("")
                  }}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddDepartment}>
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
            </View>
             {fieldErrors.department && (
                  <Text style={styles.charLimit}>{fieldErrors.department}</Text>
                )}
            {departments.length>0 &&(
            <TextInput placeholder='Search Department' value={filterText} onChangeText={setFilterText}
                style={styles.filterInput}
                />)}

                {loading && <ActivityIndicator size="large" color="#19CF99"/>}
                {error !== "" && <Text style={styles.error}>{error}</Text>}
                  
{filteredDepartments.map((item, index) => (
  <View key={item.id}>
    <View style={styles.card}>
      <Text style={styles.index}>{index + 1}.</Text>
<View style={{flex:1}}>
      {editingId === item.id ? (
        <>
          <TextInput
            value={editedDepartment}
            onChangeText={(text) => {
              if (text.length > 30) {
                setNameError("Department name cannot exceed 30 characters");
              } else if(text.length<1){
                setNameError("Department cannot be empty.");
              }
              else {
                setNameError("");
              }

              setEditedDepartment(text);
              setIsModified(text !== item.departmentName);
            }}
            style={[
              styles.editInput,
              nameError ? styles.inputError : null,
            ]}
          />

          {/*  ERROR ONLY FOR EDITING ITEM */}
          {nameError && (
            <Text style={styles.errorText}>{nameError}</Text>
          )}
        </>
      ) : (
        <Text style={styles.roleName}>{item.departmentName}</Text>
      )}
      </View>

      <View style={styles.actions}>
        {editingId === item.id ? (
          <>
            {isModified && !nameError && (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => handleUpdateDepartment(item.id)}
              >
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setEditingId(null);
                setNameError("");   // ✅ reset error
                setIsModified(false);
              }}
            >
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => {
                setEditingId(item.id);
                setEditedDepartment(item.departmentName);
                setNameError("");   // ✅ reset error
                setIsModified(false);
              }}
            >
              <Text style={styles.actionText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                handleCheckBeforeDelete(item.departmentName, item.id)
              }
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </View>
))}




                
                       {departments.length > 0 && filteredDepartments.length === 0 &&
                 filterText?.trim() !== "" && (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>No department found for that entered name.</Text>
                )}

              {/* confirm delete modal */}
                <Modal visible={confirmDelete.show} transparent animationType='fade'>
                  <View style={styles.modalCenter}>
                    <View style={styles.modalBox}>
                      <Text style={styles.modalText}>Are you sure you want to delete this department?</Text>
                      <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.yesBtn} onPress={()=>{handleDeleteDepartment(confirmDelete.id)}}>
                          <Text style={styles.actionText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noBtn} onPress={()=>setConfirmDelete({show:false, id:null})}>
                          <Text style={styles.actionText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                {/* error modal */}

                <Modal visible={errorPopup.show} transparent animationType='fade'>
                  <View style={styles.modalCenter}>
                    <View style={styles.modalBox}>
                      <Text style={[styles.modalText, {color:"red"}]}>{errorPopup.message}</Text>
                      <TouchableOpacity style={styles.okBtn} onPress={()=>setErrorPopup({show:false,message:""})}>
                        <Text style={styles.actionText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                {/* success popup */}

                <Modal visible={showSuccessPopup!==""} transparent animationType='fade'>
                  <View style={styles.modalCenter}>
                    <View style={styles.modalBox}>
                      <Text style={styles.modalText}>{showSuccessPopup}</Text>
                      <TouchableOpacity style={styles.okBtn}>
                        <Text style={styles.actionText} onPress={()=>setShowSuccessPopup("")}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

          </ScrollView>    
    )
}
export default Department;