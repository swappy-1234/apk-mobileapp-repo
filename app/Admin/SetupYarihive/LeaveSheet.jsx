import LayoutWrapper from "../../LayoutWrapper";
import {Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import styles from "../../../styles/Admin/LeaveSheetCss";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../../universalApi/universalApi";
import axios from "axios";
 
const LeaveSheet=()=>{
    const [newLeaveType, setNewLeaveType]=useState({
      leaveType:"",
      noOfDays:"",
    });
    const [error, setError]=useState("");
    const [filterText, setFilterText]=useState("");
    const [loading, setLoading]=useState(false);
    const [leaveSheet, setLeaveSheet]=useState([]);
    const [editingId, setEditingId]=useState(null);
    const [editedData, setEditedData]=useState({
        leaveType:"",
        noOfDays:"",
    });
    const [leaveTypes, setLeaveTypes]=useState([]);
    const [showSuccessPopup, setShowSuccessPopup]=useState("");
    const [confirmDelete, setConfirmDelete]=useState({show:false, id:null});
    const [errorPopup, setErrorPopup]=useState({show:false, message:""});
    const [type, setType]=useState("");
    const [isModified, setIsModified]=useState(false);
    const [nameError, setNameError]=useState("");
 
    const [token, setToken]=useState("");
    const [tenantId, setTenantId]=useState("");
 
    const normalizeLeaveType = (text) =>
    text.trim().replace(/\s+/g, " ");
   
    useEffect(()=>{
        const loadData = async ()=>{
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
            console.log("failed to load tenantId");
           }
        }
        loadData();
    },[]);
 
    useEffect(()=>{
        if(token && tenantId){
            fetchLeaveSheet();
        }
    },[token, tenantId]);
 
    // fetching leaves
    const fetchLeaveSheet=async()=>{
        setLoading(true);
        try{
            const response= await axios.get(`${url}/api/getSheets`,{
                headers:{
                    Authorization:`Bearer ${token}`,
                    "X-Tenant-ID":tenantId,
                }
            });
           setLeaveTypes(response.data || []);
        }catch(err){
            setError("failed to fetch leave sheets");
        }finally{
            setLoading(false);
        }
    };
 
const handleAddLeaveType = async () => {
  if (!newLeaveType.leaveType.trim()) {
    setError("Please Enter Leave Type");
    return;
  }
 
  if (!newLeaveType.noOfDays.trim()) {
    setError("Please Enter No of days");
    return;
  }
 
  setLoading(true);
 
  try {
    const payload = {
      leaveType: normalizeLeaveType(newLeaveType.leaveType),
      noOfDays: newLeaveType.noOfDays,
    };
 
    const response = await axios.post(
      `${url}/api/submitSheet`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId,
        },
      }
    );
 
    setLeaveTypes((prev) => [...prev, response.data]);
     setShowSuccessPopup(`"${payload.leaveType}" Leave Type added successfully.`);
 
    setNewLeaveType({ leaveType: "", noOfDays: "" });
    setError("");
    setIsEdit(false);
    setShowSuccessPopup(`"${payload.leaveType}" Leave Type added successfully.`);
 
  } catch (err) {
    setError(
      typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.message
    );
  } finally {
    setLoading(false);
  }
};
 
 
 
    const handleUpdate = async (id, index) => {
      setLoading(true);
 
    if (
      id === null ||
      id === undefined ||
      !editedData.leaveType.trim() ||
      editedData.noOfDays === ""
    ) {
      console.log("Validation failed");
      return;
    }
 
    const payload = {
      leaveType: editedData.leaveType.trim(),
      noOfDays: Number(editedData.noOfDays),
    };
   
 
 
    console.log("editedData", editedData)
    try {
      await axios.put(
        `${url}/api/updateSheet/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": tenantId,
          },
        }
      );
 
 
      const updatedList = [...leaveTypes];
      updatedList[index] = { ...updatedList[index], ...payload };
      setLeaveTypes(updatedList);
      setShowSuccessPopup(`"${payload.leaveType}" leave type has been updated successfully.`);
      setEditingId(null);
setIsModified(false);
setEditedData({ leaveType:"", noOfDays:"" });
      fetchLeaveSheet();
    } catch (err) {
     setErrorPopup({
        show: true,
        message: `${editedData.leaveType} leave type already exist.`,
      });
    //  setShowSuccessPopup(`${editedData.leaveType} leave type already exist`);
 
    }finally{
      setLoading(false);
    }
  };
   
    // filter list
    const filteredLeaves=leaveTypes.filter((leave)=>
        leave.leaveType.toLowerCase().includes(filterText.toLowerCase())
    );
 
const handleDeleteClick = async (id, name) => {
  try {
    const res = await axios.get(`${url}/api/isAssigned/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant-ID": tenantId,
      },
    });
 
    const assigned =
      res.data === true ||
      res.data?.assigned === true ||
      res.data?.isAssigned === true;
 
    if (assigned) {
      setErrorPopup({
        show: true,
        message: `Cannot delete "${name}" leave type because it is already assigned.`,
      });
      return;
    }
 
   
    setConfirmDelete({
      show: true,
      id,
      name,
    });
 
  } catch (err) {
    setError("Failed to check leave assignment");
  }
};
 
   const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${url}/api/deleteById/${confirmDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId,
        },
      });
 
      setLeaveTypes((prev) =>
        prev.filter((i) => i.id !== confirmDelete.id)
      );
      fetchLeaveSheet();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setConfirmDelete({ show: false, id: null, name: "" });
      setLoading(false);
    }
  };
 
 
    return(
        <ScrollView contentContainerStyle={{paddingBottom:100}}
        keyboardShouldPersistTaps="handled"
        >
 
            <View >
                <Text style={styles.heading}>Leave Types</Text>
 
                <View style={styles.row}>
                   <View style={styles.col}>
                    <TextInput placeholder="Leave type" style={styles.input}
                    value={newLeaveType.leaveType}
                    onChangeText={(a)=>{
                      setNewLeaveType({
                        ...newLeaveType,
                        leaveType:a,
                      })
                      setError("");}}
                    />
                    </View>
                     <View style={styles.col}>
                    <TextInput placeholder="No of days" style={[styles.input, styles.input1]} value={newLeaveType.noOfDays} keyboardType="numeric"
                    onChangeText={(a)=>{
                      setNewLeaveType({
                        ...newLeaveType,
                        noOfDays:a,
                      })
                      setError("");
                    }}
                    />
                    </View>
                    <View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddLeaveType}>
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                    </View>
                 
                </View>
                {leaveTypes.length > 0 &&(
                <TextInput placeholder="Search Leave Type"
                style={styles.filterInput} value={filterText} onChangeText={setFilterText}
                />)}
 
                {loading && <ActivityIndicator size="large" color="#19CF99" />}
                {error !== "" && <Text style={styles.error}>{error}</Text>}
 
                {filteredLeaves.map((item, index) => (
  <View key={item.id} style={styles.card}>
 
    {/* Header */}
    <View style={styles.headerRow}>
      <Text style={styles.index}>{index+1}.</Text>
      <Text style={styles.leaveType}>
        {editingId === item.id ? "Edit Leave Type" : item.leaveType}
      </Text>
    </View>
 
    {/* Content */}
    {editingId === item.id ? (
      <>
        <TextInput
          style={[
            styles.input,
            editedData.leaveType === "" && styles.errorInput,
          ]}
          placeholder="Leave Type"
          value={editedData.leaveType}
          // onChangeText={(value) => {
          //   setEditedData({ ...editedData, leaveType: value });
          //   setIsModified(value !== item.leaveType);
          // }}
           onChangeText={(text) => {
              if (text.length > 30) {
                setNameError("Leave Type cannot exceed 30 characters");
              } else if(text.length<1){
                setNameError("Leave Type cannot be empty.");
              }
              else {
                setNameError("");
              }
              setEditedData({ ...editedData, leaveType: text });
              setIsModified(text !== item.leaveType);
              // setEditedDepartment(text);
              // setIsModified(text !== item.departmentName);
            }}
 
        />
 
        <TextInput
          style={[
            styles.input,
            editedData.noOfDays === "" && styles.errorInput,
             nameError ? styles.inputError : null
          ]}
          placeholder="No. of Days"
          keyboardType="numeric"
          value={String(editedData.noOfDays ?? "")}
          // onChangeText={(value) => {
          //   const num = value === "" ? "" : Number(value);
          //   setEditedData({ ...editedData, noOfDays: num });
          //   setIsModified(num !== item.noOfDays);
          // }}
 
           onChangeText={(text) => {
              if (text.length > 30) {
                setNameError("No of days less then 100");
              } else if(text.length<1){
                setNameError("No of days cannot be empty.");
              }
              else {
                setNameError("");
              }
 setEditedData({ ...editedData, noOfDays: text });
  setIsModified(text !== item.noOfDays);
            }}
        />
          {nameError && (
            <Text style={styles.errorText}>{nameError}</Text>
          )}
      </>
    ) : (
      <Text style={styles.daysText}>
        No. of Days: <Text style={styles.daysValue}>{item.noOfDays}</Text>
      </Text>
    )}
 
    {/* Actions */}
    <View style={styles.actionsRow}>
      {editingId === item.id ? (
        <>
          {isModified && !nameError && (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => handleUpdate(item.id, index)}
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          )}
 
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setEditingId(null);
              setIsModified(false);
               setNameError("");
            }}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => {
              setEditingId(item.id);
              setEditedData({
                leaveType: item.leaveType,
                noOfDays: item.noOfDays,
              });
              setIsModified(false);
            }}
          >
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteClick(item.id, item.leaveType)}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
))}
 
{leaveTypes.length>0 && filteredLeaves.length===0 &&
filterText?.trim()!=="" && (<Text style={{ textAlign: "center", marginTop: 20 }}>No Leave Type found for that entered</Text>)}
 
{/* confirm delete modal */}
<Modal visible={confirmDelete.show} transparent animationType="fade">
  <View style={styles.modalCenter}>
    <View style={styles.modalBox}>
      <Text style={styles.modalText}>Are you sure you want to delete this Leave type?</Text>
      <View style={styles.modalActions}>
        <TouchableOpacity onPress={handleDelete} style={styles.yesBtn}>
          <Text style={styles.actionText}>Yes</Text>
        </TouchableOpacity >
        <TouchableOpacity onPress={()=>setConfirmDelete({show:false, id:null})} style={styles.noBtn}>
          <Text style={styles.actionText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
 
{/* success popup */}
<Modal visible={showSuccessPopup!==""} transparent animationType="fade">
  <View style={styles.modalCenter}>
    <View style={styles.modalBox}>
      {/* <Text style={styles.modalText}>"{editingId? editedData.leaveType:type}" Leave type has been {editingId?"updated":"added"} Successfully.</Text> */}
      <Text style={styles.modalText}>{showSuccessPopup}</Text>
      <TouchableOpacity onPress={()=>setShowSuccessPopup("")} style={styles.okBtn}>
        <Text style={styles.actionText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
 
{/* error popup */}
<Modal visible={errorPopup.show} transparent animationType="fade">
  <View style={styles.modalCenter} >
    <View style={styles.modalBox}>
      <Text style={[styles.modalText, {color:"red"}]}>{errorPopup.message}</Text>
      <TouchableOpacity style={styles.okBtn} onPress={()=>setErrorPopup({show:false, message:""})}>
        <Text style={styles.actionText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
 
 
            </View>
        </ScrollView>  
    )
}
export default LeaveSheet;