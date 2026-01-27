
import LayoutWrapper from "../../../LayoutWrapper";
import {Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal} from 'react-native';
import styles from '../../../../styles/Admin/CompanyBranch/CompanyBranch'
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../../../universalApi/universalApi";
import { XMLParser } from "fast-xml-parser";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import CompanyBranchForm from "./CompanyBranchForm";


const CompanyBranch=()=>{
    const [branches, setBranches]=useState([]);
    const [token, setToken]=useState("");
    const [tenantId, setTenantId]=useState("");
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState("");
    const [filterText, setFilterText]=useState("");
    const [editingId, setEditingId]=useState(null);
    const [editedData, setEditedData]=useState({CompanyBranch:""});
    const [confirmBranchDelete, setConfirmBranchDelete]=useState({show:false, id:null, name:""})
    const [errorBranchPopup, setErrorBranchPopup]=useState({show:false, message:""});
    const [showModal, setShowModal]=useState(false);
    const [editBranch, setEditBranch]=useState(null);
    const [branchData, setBranchData]=useState();
    const [successPopup, setSuccessPopup]=useState(false);

    const openModal=(e)=>{
      e.preventDefault();
      setShowModal(true);
      setEditBranch(null);
    }

    const closeModal=()=>{
      setShowModal(false);
    }

    const handleEdit=(branch)=>{
      console.log("edit branch: ", branch);
      setEditBranch(branch);
      setShowModal(true);
    }

    const handleSave = async (branchData) => {
  try {
    setLoading(true);

    if (editBranch) {
      const formData = new FormData();

      formData.append("branchCode", (branchData.branchCode ?? "").trim());
      formData.append("branchName", (branchData.branchName ?? "").trim());
      formData.append("streetAddress", (branchData.streetAddress ?? "").trim());
      formData.append("state", (branchData.state ?? "").trim());
      formData.append(
        "postalCode",
        (branchData.postalCode ?? "").toString().trim()
      );
      formData.append("country", (branchData.country ?? "").trim());
      formData.append("city", (branchData.city ?? "").trim());

     await axios.put(
  `${url}/api/branch/${editBranch.id}`,
  null, 
  {
    params: {
      branchName: branchData.branchName?.trim() || "",
      branchCode: branchData.branchCode?.trim() || "",
      streetAddress: branchData.streetAddress?.trim() || "",
      city: branchData.city?.trim() || "",
      state: branchData.state?.trim() || "",
      postalCode: String(branchData.postalCode ?? "").trim(),
      country: branchData.country?.trim() || "",
      tenantId: tenantId
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant-ID": tenantId,
    },
  }
);



    } else {
      await axios.post(`${url}/api/branch/add`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": tenantId,
        },
      });
    }

    setBranchData(branchData.branchName);
    setSuccessPopup(true);
    fetchBranches();

    return { success: true };

  } catch (error) {
    console.log("Error:", error);
      if (error.response?.status === 409) {
        return { error: error.response.data.message };
      }
    return { error: "Something went wrong. Try again." };
  } finally {
    setLoading(false);
  }
};


    useEffect(()=>{
        const loadData=async()=>{
            const storedCompany=await AsyncStorage.getItem("companies");
            const tenant=await AsyncStorage.getItem("tenantId");
            if(storedCompany){
                setToken(JSON.parse(storedCompany).token);
            }
            if(tenant){
                setTenantId(JSON.parse(tenant));
            }
        }
        loadData();
    },[]);

const parser = new XMLParser({
  ignoreAttributes: false,
});

const fetchBranches = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch(`${url}/api/branch`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant-ID": tenantId,
      },
    });

    const text = await response.text();
    const parsed = parser.parse(text);

    let branchList = parsed?.List?.item || [];

    if (!Array.isArray(branchList)) {
      branchList = [branchList];
    }

    setBranches(branchList);
  } catch (err) {
    console.log(err);
    setError("Failed to fetch branches");
  } finally {
    setLoading(false);
  }
}, [token, tenantId]);



    useEffect(()=>{
        if(token && tenantId){
            fetchBranches();
        }
    },[token, tenantId]);

   const filteredBranches = branches.filter((e) =>
  e.branchName?.toLowerCase().includes(filterText.toLowerCase())
);

    //const displayedBranches=branches.filter((e)=>e.branches?.toLowerCase().includes(filterText).toLowerCase());

    const handleCheckBeforeDelete=async(id, branchName)=>{
      setLoading(true);
        try{
            const checkResponse=await axios.get(`${url}/api/v1/employeeManager/check-branch-assigned`,{
                params:{branchName},
                headers:{
                    Authorization:`Bearer ${token}`,
                  
                    "X-Tenant-ID":tenantId,
                }
            });
            if(checkResponse.status === 200){
                setConfirmBranchDelete({show:true,id:id, name:branchName});
            }
        }catch(error){
            console.log("error", error.response);
            if(error.response?.status === 409){
                setErrorBranchPopup({show:true, message:error.response.data.message || "You cannot delete this Branch because it is assigned to some employees."})
            }else{
                setErrorBranchPopup({
                    show:true,
                    message:"something went wrong while deleting branch.",
                })
            }
        }finally{
          setLoading(false);
        }
    }

    //delete branch
    const handleDeleteBranch=async(id)=>{
      setLoading(true);
        try{
            await fetch(`${url}/api/branch/${confirmBranchDelete.id}`,{
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type":"application/json",
                    "X-Tenant-ID":tenantId,
                }
            });
            setConfirmBranchDelete({
                show:false,
                id:null,
                name:"",
            });
            fetchBranches();
        }catch{
            setErrorBranchPopup("failed to delete branch.")
        }finally{
          setLoading(false);
        }
    }

    return(
        <ScrollView contentContainerStyle={{paddingBottom:100}} >
         
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Text style={styles.heading}>Branch</Text>
                <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}
                onPress={openModal}
                >Add</Text></TouchableOpacity>
            </View>
            {branches.length>0 && (
                <TextInput placeholder="Search Branch Name" style={styles.filterInput} value={filterText}
                onChangeText={setFilterText} 
                >
                </TextInput>
                )}
                {loading && <ActivityIndicator size="large" color="#19CF99" />}
                {error !== "" && <Text style={styles.error}>{error}</Text>}

                {filteredBranches.map((item, index) => (
  <View key={index} style={styles.card}>
    {/* Header */}
    <View style={styles.headerRow}>
      <Text style={styles.index}>{index + 1}.</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.branchName}>{item.branchName}</Text>
        <Text style={styles.branchCode}>Code: {item.branchCode}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity><Text style={styles.updateBtn} onPress={()=>handleEdit(item)}>Update</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.deleteBtn} onPress={()=>handleCheckBeforeDelete(item.id, item.branchName)}>Delete</Text></TouchableOpacity>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Address */}
    <Text style={styles.addressText}>
      {item.streetAddress}, {item.city}, {item.state}
    </Text>

    {/* Footer */}
    <View style={styles.metaRow}>
 <View style={styles.metaItem}>
  <Ionicons name="mail-outline" size={16} color="#19CF99" />
  <Text style={styles.metaText}>{item.postalCode}</Text>
</View>


  <View style={styles.metaItem}>
    <Ionicons name="earth-outline" size={16} color="#19CF99" />
    <Text style={styles.metaText}>{item.country}</Text>
  </View>
</View>

  </View>
))}

{branches.length>0 && filterText?.trim()!=="" && filteredBranches.length===0 &&(
  <Text style={{ textAlign: "center", marginTop: 20 }}>No Branch found for that entered branch.</Text>
)}

{/* confirm delete modal */}
<Modal visible={confirmBranchDelete.show} transparent animationType="fade">
    <View style={styles.modalCenter}>
        <View style={styles.modalBox}>
            <Text style={styles.modalText}>Are you sure want to delete this branch?</Text>
            <View style={styles.modalActions}>
             <TouchableOpacity style={styles.yesBtn} onPress={()=>handleDeleteBranch(confirmBranchDelete.id)}><Text style={styles.actionText}>Yes</Text></TouchableOpacity>
             <TouchableOpacity style={styles.noBtn} onPress={()=>setConfirmBranchDelete({show:false, id:null, name:""})}><Text style={styles.actionText}>No</Text></TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>

{/* error popup modal*/}
<Modal visible={errorBranchPopup.show} transparent animationType="fade">
    <View style={styles.modalCenter}>
        <View style={styles.modalBox}>
            <Text style={[styles.modalText, {color:"red"}]}>{errorBranchPopup.message}</Text>
            <TouchableOpacity style={styles.okBtn} onPress={()=>setErrorBranchPopup({show:false, message:""})}><Text style={styles.actionText}
            >OK</Text></TouchableOpacity>
        </View>
    </View>
</Modal>

{/* branch form */}
  {/* <Modal visible={showModal} transparent animationType="fade">
    <View style={styles.modalCenter}>
      <View style={[styles.branchModalBox, {flex:1}]}>
         <CompanyBranchForm
    onClose={closeModal}
    onSave={handleSave}
    editData={editBranch}
    />
      </View>
    </View>
  </Modal> */}
  <Modal visible={showModal} transparent animationType="fade">
  <View style={styles.modalCenter}>
    <View style={[styles.branchModalBox,{flex:1}]}>
      <CompanyBranchForm
        onClose={closeModal}
        onSave={handleSave}
        editData={editBranch}
      />
    </View>
  </View>
</Modal>


  <Modal visible={successPopup} transparent animationType="fade">
    <View style={styles.modalCenter}>
      <View style={styles.modalBox}>
        {editBranch?
        <Text style={styles.modalText}><Text style={styles.special}>"{branchData}"</Text> branch has been updated successfully.</Text>
        :<Text style={styles.modalText}><Text style={styles.special}>"{branchData}"</Text> branch has been added successfully.</Text>
        }
        <TouchableOpacity onPress={()=>{setSuccessPopup(false)}} style={styles.okBtn}><Text style={styles.actionText}>OK</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>


        </ScrollView>
    )
}
export default CompanyBranch;