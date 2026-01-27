import { useState, useEffect, useRef } from "react";
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../styles/Projects/ProjectCard';
import { Picker } from "@react-native-picker/picker";
import  Modal  from "react-native-modal";
import Loader from "../Loader/Loader";

const ProjectCard = ({ each, handleUpdate, setCompletedProject,employees }) => {
     const [isCardOpen, setIsCardOpen] = useState(false);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
   const [managerModer, setManagerModel] = useState(false);
  const [confirmModel, setConfirmModel] = useState(false);
  const [selectedProject,setSelectedProject] = useState();
  const [newManagerId, setNewManagerId] = useState();
  const [isLoading,setIsLoading] = useState(false);
   const [data, setData] = useState("");
        const [id, setId] = useState("");
    
        useEffect(() => {
            const fetchData = async () => {
            const stored = await AsyncStorage.getItem("companies");
            const tenant = await AsyncStorage.getItem("tenantId");
            console.log("stored response : ", JSON.parse(stored));
            setData(JSON.parse(stored));
            setId(JSON.parse(tenant));
        };
            fetchData();
        }, []);
    
        const role = data.role;
        const token = data.token;

         const updateProjectManager = async (id, newManagerId) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${url}/api/projectManager/${id}/manager?newManagerId=${newManagerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );

      console.log("Project manager updated:", response.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error updating project:", e);
    }
  };
console.log("each : ", each);
    return(
        <View style={styles.cardContainer}>
        <View style={{flexDirection : 'row', justifyContent : 'space-between', marginBottom : 10}}>
          <View>
            <Text>{each.projectStatus}</Text>
          </View>
          <View>
            {(role !== "employee" && each.projectStatus !=="COMPLETED") && (
              <Entypo name="dots-three-vertical" size={18}
                ref={buttonRef}
                onPress={() => setIsCardOpen(!isCardOpen)}
                style={{ width: 20, height: 20}}
              />
            )}
            {isCardOpen && (
  <View ref={cardRef} style={styles.cardItems}>
    {/* Update */}
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => {
        handleUpdate(each);
        setIsCardOpen(false);
      }}
    >
      <Text style={styles.cardItemText}>Update</Text>
    </TouchableOpacity>

    {/* Completed (if not completed already) */}
    {each.projectStatus !== "COMPLETED" && (
      <TouchableOpacity
        style={styles.cardItem}
        onPress={() =>
          setCompletedProject({
            projectTitle: each.projectName,
            projectId: each.id,
            isProjectCompletedModal: true,
          })
        }
      >
        <Text style={styles.cardItemText}>Completed</Text>
      </TouchableOpacity>
    )}

    {/* Update Manager */}
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => {
        setSelectedProject(each);
        setManagerModel(true);
      }}
    >
      <Text style={styles.cardItemText}>Update Manager</Text>
    </TouchableOpacity>
  </View>
)}

          </View>

        </View>
        <View>
          <Text>Project Title : {each.projectName}</Text>
          <Text>Project Description : {each.projectDescription}</Text>
          <Text>Client Name : {each.clientName}</Text>
          <Text>Start Date : {each.startDate}</Text>
          <View style={styles.projectItems}>
  <Text style={styles.label}>Project Members:</Text>

  <View style={styles.membersList}>
    {each.projectMembers.map((member, index) => (
      <View key={index} style={styles.memberRow}>
        <Text style={styles.memberText}>{member.employeeId}</Text>
        <Text style={styles.memberText}>{member.employeeName}</Text>
      </View>
    ))}
  </View>
</View>

        </View>
        {/* Update Manager Modal */}
{managerModer && (
  <Modal transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>Update Project Manager</Text>

        {/* Project Title */}
        <TextInput
          style={styles.input}
          placeholder="Project Title"
          value={selectedProject?.projectName || ""}
          editable={false} // disabled
        />

        {/* Manager Dropdown */}
        <Picker
          selectedValue={newManagerId}
          onValueChange={(value) => setNewManagerId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Manager" value="" />

          {employees?.map((emp) => (
            <Picker.Item
              key={emp.employeeId}
              label={`${emp.firstName} ${emp.lastName}`}
              value={emp.employeeId}
            />
          ))}
        </Picker>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              if (!newManagerId) {
                alert("Please enter new Manager ID");
                return;
              }
              setConfirmModel(true);
            }}
          >
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => setManagerModel(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}

{/* Confirm Modal */}
{confirmModel && (
  <Modal transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.message}>
          Are you sure you want to migrate all employees under this project to
          the new manager?
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              updateProjectManager(selectedProject.id, newManagerId);
              setConfirmModel(false);
              setManagerModel(false);
            }}
          >
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => setConfirmModel(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
        </View>
    )
}

export default ProjectCard;



{/* <Entypo name="dots-three-vertical" size={24} color="black" /> */}