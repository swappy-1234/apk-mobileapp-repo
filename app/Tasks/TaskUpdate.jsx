
import { useState, useEffect, useContext } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView ,Pressable} from "react-native";
import { MyContext } from "../Context/MyContext";
import { url } from "../../universalApi/universalApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../styles/TaskManagement/TaskForm';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const TaskUpdate = ({ setIsEdit, taskToEdit, setIsLoading }) => {
      const [taskDetails, setTaskDetails] = useState({
        taskId: taskToEdit.taskId,
        projectId: taskToEdit.projectId,
        projectName: taskToEdit.projectName,
        taskAssignedById: taskToEdit.taskAssignedById,
        taskAssignedByName: taskToEdit.taskAssignedByName,
        taskAssignedByEmail: taskToEdit.taskAssignedByEmail,
        personName: taskToEdit.personName,
        personId: taskToEdit.personId,
        personEmail: taskToEdit.personEmail,
        taskName: taskToEdit.taskName,
        taskDetails: taskToEdit.taskDetails,
        effectiveDate: taskToEdit.effectiveDate,
        dueDate: taskToEdit.dueDate,
        taskStatus: taskToEdit.taskStatus,
        employeeWorkStatus: taskToEdit.employeeWrokStatus
    });
    const [hover, setHover] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);

    const [isError, setIsError] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isTaskUpdated, setIsTaskUpdated] = useState(false);
    const { role, schemaName,roleColors} = useContext(MyContext);
     const [token, setToken] = useState(null);


useEffect(() => {
  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const parsed = JSON.parse(stored);
    setToken(parsed?.token);
  };

  fetchStoredData();
}, []);


     const handleChange = (name, value) => {
  setTaskDetails((prev) => ({
    ...prev,
    [name]: value,
  }));
};

    const handleSubmit = async () => {
        
        setIsLoading(true);

        if (taskDetails.taskAssignedById === "" || taskDetails.taskAssignedByEmail === "" || taskDetails.personName === "" || taskDetails.personEmail === "" || taskDetails.personId === "" || taskDetails.taskName === "" || taskDetails.taskDetails === "" || taskDetails.effectiveDate === "" || taskDetails.dueDate === "") {
            setIsError(true);
            setErrorMessage("Please fill all mandatory fields..")

        }
        else {
            const currentDate = new Date().setHours(0, 0, 0, 0);
            const cEffectiveDate = new Date(taskDetails.effectiveDate).setHours(0, 0, 0, 0);
            const cDueDate = new Date(taskDetails.effectiveDate).setHours(0, 0, 0, 0);

            if (taskDetails.dueDate < taskDetails.effectiveDate || (cDueDate.dueDate < currentDate)) {
                setIsError(true);
                setErrorMessage("Enter valid dates")
                setIsLoading(false);
            }
            else {

                setIsError(false);

                try {
                    const response = await axios.put(`${url}/apis/employees/tasks/${taskDetails.taskId}`, taskDetails, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "X-Tenant-ID": schemaName,
                        }
                    });

                    setIsTaskUpdated(true)

                    setIsLoading(false);

                }
                catch (e) {
                    alert(e.message);
                } finally {
                  setIsLoading(false);
                }
            }
        }




    };

    const confirmDelete = async () => {

        await axios.delete(`${url}/apis/employees/tasks/${taskDetails.taskId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'X-Tenant-ID': schemaName,  // Add the token to the Authorization header
            }
        });
        setIsDelete(false)
        // setIsTaskView(false)


    }

    const statusChange = (name, value) => {
       
        if (value === "Pening") {
            taskDetails.employeeWorkStatus = false;
            taskDetails.taskStatus = false;
        }
        else if (value === "Completed") {
            taskDetails.taskStatus = true;
            taskDetails.employeeWorkStatus = true;
        }
    }

    // useEffect(()=>{
    //     if(isTaskUpdated || isDelete){
    //         const timer=setTimeout(()=>{
    //             setIsEdit(false);
    //             setIsDelete(false);
    //         },5000);
    //         const handleClick=()=>{
    //             clearTimeout(timer);
    //             setIsEdit(false);
    //             setIsDelete(false);
    //         }
    //         document.addEventListener('click', handleClick);
    //         return()=>{
    //             clearTimeout(timer);
    //             document.removeEventListener('click', handleClick);
    //         }
    //     }
    // },[isTaskUpdated, isDelete]);
    return(
        <ScrollView>
            <View>
                 <TouchableOpacity
  onPress={() => setIsEdit(false)}
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
    !isTaskUpdated && (
        <View>
            <Text>Task {isUpdate ? "Details" : "Update"}</Text>
            <View style={styles.taskForm}>
  
  {/* Row 2 */}
  <View style={styles.row}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Employee Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={taskDetails.personName}
        editable={false}
        style={styles.inputDisabled}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Employee Email <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={taskDetails.personEmail}
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
      editable={!isUpdate}         
      onChangeText={(text) => handleChange("taskName", text)}
      style={[
        styles.input,
        isUpdate && styles.inputDisabled
      ]}
      />
    </View>

    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Task Description <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        value={taskDetails.taskDetails}
      editable={!isUpdate}         
      multiline                   
      numberOfLines={4}
      onChangeText={(text) => handleChange("taskDetails", text)}
      style={[
        styles.input,
        styles.textArea,
        isUpdate && styles.inputDisabled
      ]}
      />
    </View>
  </View>

  <View style={styles.row}>
  {/* Effective Date */}
  <View style={styles.inputBox}>
    <Text style={styles.label}>
      Effective Date <Text style={styles.required}>*</Text>
    </Text>

    <TextInput
      value={taskDetails.effectiveDate}
      editable={false}              
      style={[styles.input, styles.inputDisabled]}
    />
  </View>
 <View style={styles.inputBox}>
  <Text style={styles.label}>
    End Date <Text style={styles.required}>*</Text>
  </Text>

  <Pressable
    onPress={() => !isUpdate && setShowEndDate(true)}
    style={[
      styles.input,
      isUpdate && styles.inputDisabled,
      { justifyContent: "center" }
    ]}
  >
    <Text>
      {taskDetails.dueDate || "Select date"}
    </Text>
  </Pressable>

  {showEndDate && (
    <DateTimePicker
      value={
        taskDetails.dueDate
          ? new Date(taskDetails.dueDate)
          : new Date()
      }
      mode="date"
      minimumDate={
        taskDetails.effectiveDate
          ? new Date(taskDetails.effectiveDate)
          : undefined
      }
      display="default"
      onChange={(event, date) => {
        setShowEndDate(false);
        if (date) {
          handleChange(
            "dueDate",
            date.toISOString().split("T")[0]
          );
        }
      }}
    />
  )}
</View>

</View>

{taskDetails.employeeWorkStatus && (
  <View style={styles.rowSingle}>
    <View style={styles.inputBox}>
      <Text style={styles.label}>
        Task Status <Text style={styles.required}>*</Text>
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={taskDetails.status}
          onValueChange={(value) => statusChange(value)}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Revert to Pending" value="Pending" />
          <Picker.Item label="Update as Completed" value="Completed" />
        </Picker>
      </View>
    </View>
  </View>
)}



  {/* Buttons */}
  <View style={styles.buttonRow}>
    {isError && <Text style={styles.error}>{errorMessage}</Text>}

    <TouchableOpacity
      onPress={handleSubmit}
      style={[styles.submitBtn, { backgroundColor: roleColors[role] }]}
    >
      <Text style={styles.submitText}>Update</Text>
    </TouchableOpacity>
  </View>
</View>
            </View>
    )
}

{isTaskUpdated && (
  <View style={styles.successBox}>
    <Text style={styles.successText}>
      Task details were updated successfully for{" "}
      <Text style={styles.boldText}>
        {taskDetails.personName}
      </Text>
    </Text>

    <TouchableOpacity
      onPress={() => setIsEdit(false)}
      style={[
        styles.okButton,
        { backgroundColor: roleColors[role] }
      ]}
    >
      <Text style={styles.okButtonText}>Ok</Text>
    </TouchableOpacity>
  </View>
)}

            </View>
        </ScrollView>
    )
};

export default TaskUpdate;