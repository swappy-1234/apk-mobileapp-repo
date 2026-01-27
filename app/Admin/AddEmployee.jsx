import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import countries from "../../assets/Countries/countries.json";
import styles from "../../styles/Admin/AddEmployeeCss";
import { url } from "../../universalApi/universalApi";
import { Picker } from "@react-native-picker/picker";


const AddEmployee =({onClose, isUpdate=false, employeeToEdit = null,onSuccess})=>{

  const [employees, setEmployees] = useState([]);
  const [employeeIdError,setEmployeeIdError] = useState();
  const [corporateEmailError,setCorporateEmailError] = useState();
  const today=new Date().toISOString().split("T")[0];
  const [jobRoles, setJobRoles] = useState([]); 
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false); 
  const [datePickerTarget, setDatePickerTarget] = useState(null); 
  const [pickerModal, setPickerModal] = useState({ visible: false, items: [], key: "", title: "" });
  const [pickerSearch, setPickerSearch] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const navigation=useNavigation();
  const [isAddingCompleted, setIsAddingCompleted]=useState(false);
  const [addedEmployee, setAddedEmployee] = useState({});
  const [successPopup, setSuccessPopup]=useState(false);
  const [errorPopup, setErrorPopup] = useState({show:false, message:""});

  // refs for focusing (prevents keyboard losing focus)
  const lastNameRef = useRef();
  const corporateEmailRef = useRef();
  const [error, setError] = useState("");
  // const [successPopup, setSuccessPopup] = useState("");

   const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    gender:"",
    streetAddress: "",
    city: "",
    region: "",
    postalCode: "",
    dateOfBirth: "",
    workingCountry: "",
    employeeId: "",
    dateOfJoining: "",
    corporateEmail: "",
    jobRole: "",
    employmentStatus: "",
    reportingTo: "",
    role: "",
    leaveManagement: false,
    organizationChart: false,
    timeSheet: false,
    task: false,
    invoice: false,
  });

  useEffect(() => {
    if (isUpdate && employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName || "",
        lastName: employeeToEdit.lastName || "",
        country: employeeToEdit.country || "",
        gender:employeeToEdit.gender || "",
        streetAddress: employeeToEdit.streetAddress || "",
        city: employeeToEdit.city || "",
        region: employeeToEdit.region || "",
        postalCode: employeeToEdit.postalCode || "",
        dateOfBirth: employeeToEdit.dateOfBirth || "",
        workingCountry: employeeToEdit.workingCountry || "",
        employeeId: employeeToEdit.employeeId || "",
        dateOfJoining: employeeToEdit.dateOfJoining || "",
        corporateEmail: employeeToEdit.corporateEmail || "",
        jobRole: employeeToEdit.jobRole || "",
        employmentStatus: employeeToEdit.employmentStatus || "",
        reportingTo: employeeToEdit.reportingTo || "",
        role: employeeToEdit.role || "",
        leaveManagement: employeeToEdit.leaveManagement || false,
        organizationChart: employeeToEdit.organizationChart || false,
        timeSheet: employeeToEdit.timeSheet || false,
        task: employeeToEdit.task || false,
        invoice: employeeToEdit.invoice || false,
        branch: employeeToEdit.branch || "",
        department: employeeToEdit.department || "",
      });
    }
  }, [isUpdate, employeeToEdit]);

   const limits = {
    firstName : 15,
    lastName : 15,
    employeeId: 15,
  };

  const  letterOnlyFields=[
    "firstName",
    "lastName",
  ]
  const [auth, setAuth] = useState({
  token: "",
  tenantId: "",
  employeeId: "",
});

useEffect(() => {
  const loadAuth = async () => {
    const storedCompany = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    if (storedCompany && tenant) {
      const parsed = JSON.parse(storedCompany);
      setAuth({
        token: parsed.token,
        tenantId: JSON.parse(tenant),
        employeeId: parsed.employeeId,
      });
    }
  };

  loadAuth();
}, []);

useEffect(() => {
  if (!auth.token || !auth.tenantId || !auth.employeeId) return;

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/v1/employeeManager/getEmployeeCompanyDetails/${auth.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "X-Tenant-ID": auth.tenantId,
          },
        }
      );
      setCompanyDetails(response.data.clientDetails);
    } catch (error) {
      console.error("Company details API error", error);
    }finally{
      setLoading(false);
    }
  };

  fetchEmployee();
}, [auth]);

useEffect(() => {
  if (companyDetails?.workingCountry) {
    setFormData((prev) => ({
      ...prev,
      workingCountry: companyDetails.workingCountry,
    }));
  }
}, [companyDetails]);


useEffect(() => {
  if (!auth.token || !auth.tenantId) return;

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/api/v1/employeeManager/AdminsAndManagers`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "X-Tenant-ID": auth.tenantId,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }finally{
      setLoading(false);
    }
  };

  fetchEmployees();
}, [auth]);

useEffect(() => {
  if (!auth.token || !auth.tenantId) return;

  const fetchJobRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/apis/employees/jobRoles/jobRoles`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "X-Tenant-ID": auth.tenantId,
        },
      });
      const data = await res.json();
      setJobRoles(data);
    } catch (e) {
      console.log("Job roles fetch error", e);
    }finally{
      setLoading(false);
    }
  };

   const fetchBranchAndDepartments = async () => {
    setLoading(true);

      try {
        const response = await axios.get(
          `${url}/api/v1/employeeManager/branch-depart-job`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": auth.tenantId,
            },
          }
        );
        
        setDepartments(response.data.department);
        setBranches(response.data.compiniesBranch);
      } catch (err) {
        console.error("error fetching : ", err);
      }finally{
        setLoading(false);
      }
    };

  fetchJobRoles();
  fetchBranchAndDepartments();
}, [auth]);



  const updateForm = (patch) => setFormData((p) => ({ ...p, ...patch }));

  const openPickerModal = (key, items, title = "Select") => {
    setPickerModal({ visible: true, items, key, title });
    setPickerSearch("");
  };

  const closePickerModal = () => {
    setPickerModal({ ...pickerModal, visible: false });
  };

  const openDatePicker = (field) => {
    setDatePickerTarget(field);
    setDatePickerVisible(true);
  };

  

  const handleDateChange = (event, date) => {
    setDatePickerVisible(false);
    if (date && datePickerTarget) {
      const iso = date.toISOString().split("T")[0];
       handleChange(datePickerTarget, iso);
      setDatePickerTarget(null);
    }
  };

  

  const validate = () => {
    const newErrors = {};
    const namePattern = /^[a-zA-Z\s]*$/;
    
if (!formData.firstName)
  newErrors.firstName = "First name is required.";
else if (!namePattern.test(formData.firstName))
  newErrors.firstName = "Only letters allowed.";
else if (formData.firstName.length > 30)
  newErrors.firstName = "First name cannot exceed 30 characters.";


if (!formData.lastName)
  newErrors.lastName = "Last name is required.";
else if (!namePattern.test(formData.lastName))
  newErrors.lastName = "Only letters allowed.";
else if (formData.lastName.length > 30)
  newErrors.lastName = "First name cannot exceed 30 characters.";


    if (!formData.country) newErrors.country = "Country required.";
    if(!formData.gender) newErrors.gender="Please select gender.";

    if (!/^[A-Z0-9]+$/.test(formData.employeeId))
  newErrors.employeeId =
    "Use only uppercase letters & digits. Example: MTL1010.";

    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining required.";
   if (!/\S+@\S+\.\S+/.test(formData.corporateEmail))
  newErrors.corporateEmail = "Please enter a valid email address.";

    
    if (!formData.jobRole) newErrors.jobRole = "Choose job role.";
    if (!formData.role) newErrors.role = "Choose the role.";

    if (!formData.country) newErrors.country = "Country is required.";
if (!formData.gender) newErrors.gender = "Please select gender.";
if (!formData.jobRole) newErrors.jobRole = "Please choose job role";
if(!formData.employmentStatus) newErrors.employmentStatus="Please choose employment status.";
if(!formData.branch) newErrors.branch="Please choose branch.";
if(!formData.department) newErrors.department="Please choose department.";
if (!formData.role) newErrors.role = "Please select role.";
if (formData.role === "employee" && !formData.reportingTo)
  newErrors.reportingTo = "Please add reporting manager.";



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleChange = (name, value) => {
  if (!name) return;

  let cleanedValue = value ?? "";

  // Remove leading spaces
  cleanedValue = cleanedValue.replace(/^\s+/, "");

  // Letters-only fields → strip invalid chars (NO return)
  if (letterOnlyFields.includes(name)) {
    cleanedValue = cleanedValue.replace(/[^A-Za-z\s]/g, "");
  }

  // Normalize empty values (NO return)
  if (cleanedValue.trim() === "") {
    cleanedValue = "";
  }

  // Capitalize safely
  if (
    cleanedValue.length > 0 &&
    !["role", "employeeId", "email", "corporateEmail"].includes(name)
  ) {
    cleanedValue =
      cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1);
  }

  if (name === "employeeId") {
  cleanedValue = cleanedValue
    .replace(/[^A-Za-z0-9]/g, "") // only letters & numbers
    .toUpperCase();
}


  /* ---------- SPECIAL FIELD HANDLING ---------- */

  if (name === "branch") {
    const selectedBranch = branches.find(
      (b) => b.branchName === cleanedValue
    );

    setFormData((prev) => ({
      ...prev,
      branch: cleanedValue,
      workingCountry: selectedBranch?.country || "",
    }));
  } 
  // else if (name === "department") {
  //   setFormData((prev) => ({
  //     ...prev,
  //     department: cleanedValue,
  //     jobRole: "",
  //   }));
  // } 
  else if (name === "corporateEmail") {
    const emailVal = cleanedValue.toLowerCase();
    setFormData((prev) => ({
      ...prev,
      corporateEmail: emailVal,
      email: emailVal,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  }

  /* ---------- LIVE ERROR CLEANUP ---------- */

  setErrors((prev) => {
    const updated = { ...prev };

    if (limits[name] && cleanedValue.length > limits[name]) {
      updated[name] = `${name.replace(
        /([A-Z])/g,
        " $1"
      )} cannot exceed ${limits[name]} characters`;
    } else if (!cleanedValue) {
      updated[name] = `${name.replace(
        /([A-Z])/g,
        " $1"
      )} is required`;
    } else {
      delete updated[name];
    }

    return updated;
  });
};



 const handleSubmit = async (e) => {
   setLoading(true);
    // const validationErrors = validate();
    // setErrors(validationErrors);

    // if (Object.keys(validationErrors).length > 0) {
    //   return;
    // }
     if (!validate()) {
      return;
    }


    const queryParams = new URLSearchParams(formData).toString();

    try {
      setLoading(true);

      if (isUpdate) {
        
        await axios.put(
          `${url}/api/v1/employeeManager/update/${employeeToEdit.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "X-Tenant-ID": auth.tenantId,
            },
          }
        );

       setSuccessPopup(true);
        // setEmployeeRegistered(true);
        onSuccess("updated");
        // setModalMessage("Updated");
      } else {
        console.log("Entering API")
        // Add employee
        await axios.post(`${url}/api/v1/employeeManager/add`, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "X-Tenant-ID": auth.tenantId,
          },
        });
         onSuccess("Added");


        console.log("Exited api");
      }

      // setIsModalOpen(false);
    }
     catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data ||
    "Failed to submit form";

  console.log("Backend error message:", message);

  // Reset first
  setEmployeeIdError("");
  setCorporateEmailError("");

  if (message.includes("Corporate email already exists")) {
    setCorporateEmailError("Corporate email already exists");
  } 
  else if (message.includes("Employee Id already exists")) {
    setEmployeeIdError("Employee Id already exists");
  }

  // Optional popup (only if you want)
  if (error.response?.status === 409) {
    setErrorPopup({
      show: true,
      message,
    });
  }
}

    finally {
      setLoading(false);
    }
  };
  const filteredItems = pickerModal.items.filter((it) => (pickerSearch.trim() === "" ? true : String(it.label || it).toLowerCase().includes(pickerSearch.toLowerCase())));

  // function SearchablePickerModal() {
  //   if (!pickerModal.visible) return null;
  //   return (
  //     <Modal visible={pickerModal.visible} animationType="slide" transparent>
  //       <SafeAreaView style={styles.modalContainer}>
  //         <View style={styles.modalCard}>
  //           <Text style={styles.modalTitle}>{pickerModal.title}</Text>
  //           <TextInput
  //             placeholder="Search..."
  //             style={styles.modalSearch}
  //             value={pickerSearch}
  //             onChangeText={setPickerSearch}
  //             autoFocus
  //           />
  //           <FlatList
  //             data={filteredItems}
  //             keyExtractor={(item, idx) => String(item.value ?? item).concat(idx)}
  //             renderItem={({ item }) => {
  //               const label = item.label ?? item;
  //               const value = item.value ?? item;
  //               return (
  //                 <TouchableOpacity
  //                   style={styles.modalItem}
  //                   onPress={() => {
  //                     handleChange(pickerModal.key, value);
  //                     closePickerModal();
  //                   }}
  //                 >
  //                   <Text>{label}</Text>
  //                 </TouchableOpacity>
  //               );
  //             }}
  //             style={{ maxHeight: 320 }}
  //           />
  //           <TouchableOpacity style={styles.modalClose} onPress={closePickerModal}>
  //             <Text style={{ color: "#fff" }}>Close</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </SafeAreaView>
  //     </Modal>
  //   );
  // }

  return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View>
          <View style={{ flexDirection: 'row', justifyContent:"space-between",  marginBottom: 10 }}>
            <Text style={styles.mainHeader}>{isUpdate? "Update Employee Details Form": "Add Employee Details Form"}</Text>
                    <TouchableOpacity onPress={()=>onClose(false)}>
                  <Ionicons name="close" size={25} color="#19CF99"/>
                </TouchableOpacity>
                
                  </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Personal Information</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>First Name <Text style={styles.star}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(t) => handleChange("firstName",t)}
                  placeholder="First name"
                />
                {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Last Name <Text style={styles.star}>*</Text></Text>
                <TextInput
                  ref={lastNameRef}
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(t) => handleChange("lastName",t)}
                  placeholder="Last name"
                />
                {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
            <Text style={styles.label}>Country <Text style={styles.star}>*</Text></Text>
            <TouchableOpacity style={styles.input} onPress={() => openPickerModal("country", countries.map((c) => ({ label: c, value: c })), "Country")}>
              <Text>{formData.country || "Select country"}</Text>
            </TouchableOpacity>
            {errors.country && <Text style={styles.error}>{errors.country}</Text>}
            </View>
            <View style={styles.col}>
            <Text style={styles.label}>Gender <Text style={styles.star}>*</Text></Text>
            {/* <TouchableOpacity style={styles.input} onPress={()=>openPickerModal("gender",[{label:"FEMALE",value:"FEMALE"},{label:"MALE",value:"MALE"},{label:"OTHERS", value:"OTHERS"}],"gender" )}>
               <Text>{formData.gender || "Select gender"}</Text>
            </TouchableOpacity> */}
 <View style={styles.input1}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(v) =>handleChange("gender", v) }
        >
          <Picker.Item label="Select Gender" value="" style={styles.ge}/>
          <Picker.Item label="Male" value="MALE" style={styles.ge} />
          <Picker.Item label="Female" value="FEMALE" style={styles.ge}/>
           <Picker.Item label="Others" value="OTHERS" style={styles.ge}/>
        </Picker>
      </View>
             {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
          </View>
          </View>
          </View>

         {/* {loading && <ActivityIndicator size="large" color="#19CF99"/>} */}

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Professional Information</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Employee ID <Text style={styles.star}>*</Text></Text>
                <TextInput style={styles.input} value={formData.employeeId} onChangeText={(t) =>handleChange("employeeId",t)}
 placeholder="MTL1010"  autoCapitalize="characters"
  autoCorrect={false}
  autoComplete="off"
  keyboardType="default"/>
                {errors.employeeId && <Text style={styles.error}>{errors.employeeId}</Text>}
              </View>

                <View style={styles.col}>
              <Text style={styles.label}>Reporting To <Text style={styles.star}>*</Text></Text>
              <TouchableOpacity style={styles.input} onPress={() => openPickerModal("reportingTo", managers.map((m) => ({ label: `${m.firstName} ${m.lastName || ""}`, value: m.employeeId })), "Reporting To")}>
                <Text>{managers.find((m) => m.employeeId === formData.reportingTo) ? `${managers.find((m) => m.employeeId === formData.reportingTo).firstName}` : (formData.reportingTo ? formData.reportingTo : "Select manager")}</Text>
              </TouchableOpacity>
              {errors.reportingTo && <Text style={styles.error}>{errors.reportingTo}</Text>}
            </View>

            </View>
            <View style={styles.row}>
          
          <View style={styles.col}>
                <Text style={styles.label}>Date of Joining <Text style={styles.star}>*</Text></Text>
                <TouchableOpacity style={styles.input} onPress={() => openDatePicker("dateOfJoining")}>
                  <Text>{formData.dateOfJoining || "Select date"}</Text>
                </TouchableOpacity>
                {errors.dateOfJoining && <Text style={styles.error}>{errors.dateOfJoining}</Text>}
              </View> 

 <View style={styles.col}>
            <Text style={styles.label}>Corporate Email <Text style={styles.star}>*</Text></Text>
            <TextInput ref={corporateEmailRef} style={styles.input} value={formData.corporateEmail} onChangeText={(t) =>handleChange("corporateEmail",t)}
 placeholder="name@company.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" blurOnSubmit={false} />
            {errors.corporateEmail && <Text style={styles.error}>{errors.corporateEmail}</Text>}
</View>
</View>

<View style={styles.row}>
 <View style={styles.col}>
              <Text style={styles.label}>Branch <Text style={styles.star}>*</Text></Text>
              <TouchableOpacity style={styles.input} onPress={() => openPickerModal("branch", branches.map((m) => ({ label:m.branchName , value:m.branchName })), "Branch")}>
                <Text>{formData.branch || "Select branch"}</Text>
              </TouchableOpacity>
              {errors.branch && <Text style={styles.error}>{errors.branch}</Text>}
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Department <Text style={styles.star}>*</Text></Text>
              <TouchableOpacity style={styles.input} onPress={() => openPickerModal("department", departments.map((m) => ({ label: m.departmentName, value: m.departmentName })), "Department")}>
               <Text>{formData.department || "Select department"}</Text>
              </TouchableOpacity>
              {errors.department && <Text style={styles.error}>{errors.department}</Text>}
            </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Designation <Text style={styles.star}>*</Text></Text>
                <TouchableOpacity style={styles.input} onPress={() => openPickerModal("jobRole", jobRoles.map((r) => ({ label: r.jobRole, value: r.jobRole })), "Designation")}>
                  <Text>{formData.jobRole || "Select Designation"}</Text>
                </TouchableOpacity>
                {errors.jobRole && <Text style={styles.error}>{errors.jobRole}</Text>}
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Employment Status <Text style={styles.star}> *</Text></Text>
                {/* <TouchableOpacity style={styles.input} onPress={() => openPickerModal("employmentStatus", [{ label: "Full-Time", value: "full-time" }, { label: "Part-Time", value: "part-time" }], "Employment Status")}>
                  <Text>{formData.employmentStatus || "Select status"}</Text>
                </TouchableOpacity> */}
                <View style={styles.input1}>
        <Picker
          selectedValue={formData.employmentStatus}
          onValueChange={(v) =>handleChange("employmentStatus", v) }
        >
          <Picker.Item label="Select Employment Status" value="" style={styles.ge}/>
          <Picker.Item label="Full-Time" value="full-time" style={styles.ge} />
          <Picker.Item label="Part-Time" value="part-time" style={styles.ge}/>
        </Picker>
      </View>
                {errors.employmentStatus && <Text style={styles.error}>{errors.employmentStatus}</Text>}
              </View>
            </View>

           

          

            <Text style={[styles.label, { marginTop: 10 }]}>Role <Text style={styles.star}>*</Text></Text>
          
<View style={styles.roleRow}>
  {["admin", "manager", "employee"].map((r) => (
    <TouchableOpacity
      key={r}
      onPress={() => {
        if (r === "employee") {
          updateForm({
            role: r,
            leaveManagement: false,
            timeSheet: false,
            task: false,
            organizationChart: false,
            invoice: false,
          });
        } else {
          updateForm({
            role: r,
            leaveManagement: true,
            timeSheet: true,
            task: true,
            organizationChart: true,
            invoice: true,
          });
        }
      }}
      style={[
        styles.roleBtn,
        formData.role === r && styles.roleBtnActive
      ]}
    >
      <Text
        style={
          formData.role === r
            ? styles.roleTextActive
            : styles.roleText
        }
      >
        {r.charAt(0).toUpperCase() + r.slice(1)}
      </Text>
    </TouchableOpacity>
  ))}
</View>


{errors.role && (
  <Text style={{ color: "red", marginTop: 4 }}>{errors.role}</Text>
)}


{formData.role === "employee" && (
  <View style={{ marginTop: 20 }}>
    <Text style={styles.accessHeading}>Give Access</Text>

    <View style={styles.accessContainer}>
      
    
      {companyDetails?.leaveManagement && (
        <TouchableOpacity
          style={styles.accessRow}
          onPress={() =>
            updateForm({ leaveManagement: !formData.leaveManagement })
          }
        >
          <View
            style={[
              styles.checkbox,
              formData.leaveManagement && styles.checkboxActive
            ]}
          />
          <Text style={styles.accessLabel}>Leave</Text>
        </TouchableOpacity>
      )}

     
      {companyDetails?.timeSheet && (
        <TouchableOpacity
          style={styles.accessRow}
          onPress={() =>
            updateForm({ timeSheet: !formData.timeSheet })
          }
        >
          <View
            style={[
              styles.checkbox,
              formData.timeSheet && styles.checkboxActive
            ]}
          />
          <Text style={styles.accessLabel}>TimeSheet</Text>
        </TouchableOpacity>
      )}

      
      {companyDetails?.task && (
        <TouchableOpacity
          style={styles.accessRow}
          onPress={() =>
            updateForm({ task: !formData.task })
          }
        >
          <View
            style={[
              styles.checkbox,
              formData.task && styles.checkboxActive
            ]}
          />
          <Text style={styles.accessLabel}>Task</Text>
        </TouchableOpacity>
      )}

    
      {companyDetails?.organizationChart && (
        <TouchableOpacity
          style={styles.accessRow}
          onPress={() =>
            updateForm({
              organizationChart: !formData.organizationChart
            })
          }
        >
          <View
            style={[
              styles.checkbox,
              formData.organizationChart && styles.checkboxActive
            ]}
          />
          <Text style={styles.accessLabel}>Organization</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
)}
          </View>

         
          <View style={{ marginVertical: 12 }}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {/* {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>{submitSuccess ? "Submitted" : "Submit"}</Text>} */}
              {/* <Text style={{ color: "#fff", fontWeight: "700" }}> {isUpdate?"Update":"Submit"}</Text> */}
              {loading ? (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <ActivityIndicator color="#fff" size="small" />
    <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 8 }}>
      {isUpdate ? "Updating..." : "Submitting..."}
    </Text>
  </View>
) : (
  <Text style={{ color: "#fff", fontWeight: "700" }}>
    {submitSuccess
      ? isUpdate
        ? "Updated"
        : "Submitted"
      : isUpdate
      ? "Update"
      : "Submit"}
  </Text>
)}

            </TouchableOpacity>
          </View>
         
          {datePickerVisible && (
            <DateTimePicker
              value={formData[datePickerTarget] ? new Date(formData[datePickerTarget]) : new Date()}
              mode="date"
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          </View>

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
                              handleChange(pickerModal.key, item.value);
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

                <Modal visible={errorPopup.show} transparent animationType="fade">
                        <View style={styles.modalCenter}>
                          <View style={styles.modalBox}>
                            <Text style={[styles.modalMessage, { color: "red" }]}>
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

      </KeyboardAvoidingView>
   
  );

}

export default AddEmployee;
