import { useState, useEffect, useContext } from "react";
import {Text, View, ScrollView, Pressable, TouchableOpacity, TextInput} from 'react-native';
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../Loader/Loader";
import styles from '../../styles/TaskManagement/TaskForm';
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from 'react-native-modal';


const TaskForm = ({ setIsModalOpen, selectedEmployee, selectedEmployeeId, selectedEmployeeEmail, projectName, clientName, projectId, projectStartDate }) => {
     const [taskDetails, setTaskDetails] = useState({
        taskAssignedById: "",
        taskAssignedByName:"",
        taskAssignedByEmail: "",
        personName: selectedEmployee,
        personId: selectedEmployeeId,
        personEmail: selectedEmployeeEmail,
        taskName: "",
        taskDetails: "",
        effectiveDate: "",
        dueDate: "",
        projectName:projectName,
        clientName:clientName,
        projectId:projectId
    });
   const [showEffectivePicker, setShowEffectivePicker] = useState(false);
const [showDuePicker, setShowDuePicker] = useState(false);

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage]=useState("");
    const [isLoading, setIsLoading]=useState(false);
    const [isTaskAdded, setIsTaskAdded]=useState(false);
    const {role,schemaName,roleColors}=useContext(MyContext);
    const [storedData, setStoredData] = useState(null);
const [emailId, setEmailId] = useState("");

useEffect(() => {
  const fetchStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem("companies");
      
      const email = await AsyncStorage.getItem("email");

     console.log("stored : ", JSON.parse(stored));
      setStoredData(JSON.parse(stored));
    
      setEmailId(JSON.parse(email));
    } catch (err) {
      console.error("AsyncStorage error:", err);
    }
  };

  fetchStoredData();
}, []);

useEffect(() => {
  if (!storedData) return;

  setTaskDetails((prev) => ({
    ...prev,
    taskAssignedById: storedData.employeeId,
    taskAssignedByName: `${storedData.firstName} ${storedData.lastName}`,
    taskAssignedByEmail: emailId,
  }));
}, [emailId, storedData]);

const token = storedData?.token;

   const handleChange = (name, value) => {
  setTaskDetails((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const projectStart = projectStartDate
  ? new Date(projectStartDate)
  : new Date();

const effectiveDateObj = taskDetails.effectiveDate
  ? new Date(taskDetails.effectiveDate)
  : new Date();
const parseDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return new Date(year, month - 1, day);
};

const formatYYYYMMDD = (date) => {
  return date.toISOString().split("T")[0];
};

const formatDDMMYYYY = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};


   const handleSubmit = async () => {
  setIsLoading(true);

  // 1️⃣ Mandatory field validation
  if (
    !taskDetails.taskAssignedById ||
    !taskDetails.taskAssignedByEmail ||
    !taskDetails.personName ||
    !taskDetails.personEmail ||
    !taskDetails.personId ||
    !taskDetails.taskName ||
    !taskDetails.taskDetails ||
    !taskDetails.effectiveDate ||
    !taskDetails.dueDate
  ) {
    setIsError(true);
    setErrorMessage("Please fill all mandatory fields.");
    setIsLoading(false);
    return;
  }

  // 2️⃣ Date validation
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const effectiveDate = parseDDMMYYYY(taskDetails.effectiveDate).setHours(0,0,0,0);
const dueDate = parseDDMMYYYY(taskDetails.dueDate).setHours(0,0,0,0);


  if (dueDate < effectiveDate || effectiveDate < currentDate || dueDate < currentDate) {
    setIsError(true);
    setErrorMessage("Enter valid dates");
    setIsLoading(false);
    return;
  }

  // 3️⃣ API call
  setIsError(false);

  try {
    const response = await axios.post(
      `${url}/apis/employees/tasks`,
      taskDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": schemaName,
        },
      }
    );

    setIsTaskAdded(true);
  } catch (error) {
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};


    // useEffect(()=>{
    //     if(isTaskAdded){
    //         const timer=setTimeout(()=>{
    //             setIsModalOpen(false);
    //         },5000);
    //         const handleClick=()=>{
    //             clearTimeout(timer);
    //             setIsModalOpen(false);
    //         }
    //         document.addEventListener('click', handleClick);
    //         return()=>{
    //             clearTimeout(timer);
    //             document.removeEventListener('click', handleClick);
    //         }
    //     }
    // },[isTaskAdded]);
    
    return (
        <ScrollView>
                <View>
                    <TouchableOpacity
  onPress={() => setIsModalOpen(false)}
  style={{
    padding: 8,
    alignSelf: "flex-end",
  }}
>
  <Text
    style={{
      fontSize: 28,
      color: roleColors[role],
      fontWeight: "bold",
    }}
  >
    ×
  </Text>
</TouchableOpacity>

{
    !isTaskAdded &&  <View>
        {isLoading && <Loader/>}
        <Text>Create Task</Text>
        <View style={styles.taskForm}>
  {/* Row 1 */}
  <View style={styles.row}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Project Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={projectName}
        editable={false}
        style={styles.inputDisabled}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Client Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={clientName}
        editable={false}
        style={styles.inputDisabled}
      />
    </View>
  </View>

  {/* Row 2 */}
  <View style={styles.row}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Employee Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={selectedEmployee}
        editable={false}
        style={styles.inputDisabled}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Employee Id <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={selectedEmployeeId}
        editable={false}
        style={styles.inputDisabled}
      />
    </View>
  </View>

  {/* Row 3 */}
  <View style={styles.row}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Task Title <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={taskDetails.taskName}
        onChangeText={(text) => handleChange("taskName", text)}
        style={styles.input}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Task Description <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={taskDetails.taskDetails}
        onChangeText={(text) => handleChange("taskDetails", text)}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />
    </View>
  </View>

  {/* Row 4 */}
  {/* <View style={styles.row}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Effective Date <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={taskDetails.effectiveDate}
        onChangeText={(text) => handleChange("effectiveDate", text)}
        style={styles.input}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        End Date <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={taskDetails.dueDate}
        onChangeText={(text) => handleChange("dueDate", text)}
        style={styles.input}
      />
    </View>
  </View> */}

  <View style={styles.row}>
  <View style={styles.inputBox}>
    <Text style={styles.label}>
      Effective Date <Text style={styles.required}>*</Text>
    </Text>

    <Pressable
      onPress={() => setShowEffectivePicker(true)}
      style={styles.input}
    >
      <Text>
        {taskDetails.effectiveDate || "Select Date"}
      </Text>
    </Pressable>

    {showEffectivePicker && (
      <DateTimePicker
        value={
    taskDetails.effectiveDate
      ? parseDDMMYYYY(taskDetails.effectiveDate)
      : new Date()
  }
        mode="date"
        minimumDate={projectStart}
        display="default"
        onChange={(event, selectedDate) => {
          setShowEffectivePicker(false);
          if (selectedDate) {
            handleChange(
              "effectiveDate",
             formatDDMMYYYY(selectedDate) // ✅ FIXED
            );
          }
        }}
      />
    )}
  </View>
  <View style={styles.inputBox}>
    <Text style={styles.label}>
      End Date <Text style={styles.required}>*</Text>
    </Text>

    <Pressable
      onPress={() => {
        if (!taskDetails.effectiveDate) {
          alert("Please select Effective Date first");
          return;
        }
        setShowDuePicker(true);
      }}
      style={styles.input}
    >
      <Text>
        {taskDetails.dueDate || "Select Date"}
      </Text>
    </Pressable>

    {showDuePicker && (
      <DateTimePicker
        value={
    taskDetails.dueDate
      ? parseDDMMYYYY(taskDetails.dueDate)
      : parseDDMMYYYY(taskDetails.effectiveDate)
  }
        mode="date"
        minimumDate={parseDDMMYYYY(taskDetails.effectiveDate)}
        display="default"
        onChange={(event, selectedDate) => {
          setShowDuePicker(false);
          if (selectedDate) {
            handleChange(
              "dueDate",
              formatDDMMYYYY(selectedDate) // ✅ FIXED
            );
          }
        }}
      />
    )}
  </View>
</View>


  {/* Buttons */}
  <View style={styles.buttonRow}>
    {isError && <Text style={styles.error}>{errorMessage}</Text>}

    <TouchableOpacity
      onPress={handleSubmit}
      style={[styles.submitBtn, { backgroundColor: roleColors[role] }]}
    >
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>
  </View>
</View>


        </View>
}


  <Modal isVisible={isTaskAdded}>
  <View style={styles.successBox}>
    <Text style={styles.successText}>
      New task was assigned to{" "}
      <Text style={styles.boldText}>
        {taskDetails.personName}
      </Text>
    </Text>

    <TouchableOpacity
      onPress={() => setIsModalOpen(false)}
      style={[
        styles.okButton,
        { backgroundColor: roleColors[role] }
      ]}
    >
      <Text style={styles.okButtonText}>Ok</Text>
    </TouchableOpacity>
  </View>
  </Modal>


                </View>
          </ScrollView>
    )
};

export default TaskForm;