import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import countries from "../../assets/Countries/countries.json";
import { MyContext } from "../../MyProvider/MyProvider";
import { url } from "../../universalApi/universalApi";
import LayoutWrapper from "../LayoutWrapper";
import axios from "axios";
import { useNavigation } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";


const UpdateEmployee =()=>{
  // ---- state ----
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
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

  const [jobRoles, setJobRoles] = useState([]); 
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
  const[isAddingCompleted, setIsAddingCompleted]=useState(false);
  const [addedEmployee, setAddedEmployee] = useState({});

  // refs for focusing (prevents keyboard losing focus)
  const lastNameRef = useRef();
  const employeeIdRef = useRef();
  const corporateEmailRef = useRef();
  const [error, setError] = useState("");
  // const [successPopup, setSuccessPopup] = useState("");

   useEffect(() => {
    const fetchData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");
      const emailId = await AsyncStorage.getItem("email");
      console.log("stored response : ", JSON.parse(stored));
      setData(JSON.parse(stored));
      setId(JSON.parse(tenant));
      setEmail(JSON.parse(emailId));
    };
    fetchData();
  }, []);

  const role = data?.role ?? "";
  const token = data?.token ?? "";
  const employeeId = data?.employeeId ?? "";

   useEffect(() => {
    const fetchEmployee = async () => {
      //setIsLoading(true);
      try {
        console.log(token);
        console.log("upto");

        const response = await axios.get(
          `${url}/api/v1/employeeManager/getEmployeeCompanyDetails/${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": id,
            },
          }
        );
        setCompanyDetails(response.data.clientDetails);
        console.log("anitha", response.data.clientDetails);
      } catch (error) {
        console.error("Add Employee file comapny Details api",error);
      }
    };

    fetchEmployee();
  }, [employeeId, id, navigation, token]);

  

useEffect(() => {
  const loadAuth = async () => {
    const storedCompany = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    if (storedCompany) {
      setToken(JSON.parse(storedCompany).token);
    }
    if (tenant) {
      setTenantId(JSON.parse(tenant));
    }
  };

  loadAuth();
}, []);


const [token1, setToken] = useState("");
const [tenantId, setTenantId] = useState("");

const fetchJobRoles = async () => {
  try {
    const response = await fetch(`${url}/apis/employees/jobRoles/jobRoles`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token1}`,
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
      },
    });

    const data = await response.json();
    setJobRoles(data);
  } catch (error) {
    console.log("Job roles fetch error", error);
  }
};

  useEffect(() => {
  if (token1 && tenantId) {
    fetchJobRoles();
  }
}, [token1, tenantId]);

useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${url}/api/v1/employeeManager/AdminsAndManagers`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token1}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": tenantId,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setManagers(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [token1, tenantId]);



  const updateForm = (patch) => setFormData((p) => ({ ...p, ...patch }));

  const openPickerModal = (key, items, title = "Select") => {
    setPickerModal({ visible: true, items, key, title });
    setPickerSearch("");
  };

  const closePickerModal = () => setPickerModal({ visible: false, items: [], key: "", title: "" });
  const openDatePicker = (field) => {
    setDatePickerTarget(field);
    setDatePickerVisible(true);
  };

  const handleDateChange = (event, date) => {
    setDatePickerVisible(false);
    if (date && datePickerTarget) {
      const iso = date.toISOString().split("T")[0];
      updateForm({ [datePickerTarget]: iso });
      setDatePickerTarget(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    const namePattern = /^[a-zA-Z\s]*$/;
    if (!formData.firstName || !namePattern.test(formData.firstName)) newErrors.firstName = "First name must contain only letters.";
    if (!formData.lastName || !namePattern.test(formData.lastName)) newErrors.lastName = "Last name must contain only letters.";
    if (!formData.country) newErrors.country = "Country required.";
    if (!formData.workingCountry) newErrors.workingCountry = "Working country required.";

    if (!/^[A-Z0-9]+$/.test(formData.employeeId) || formData.employeeId.length === 0) 
      newErrors.employeeId = "Employee ID must contain only uppercase letters and digits.For Example : MTL1010";

    //  if (!/^[A-Z0-9]+$/.test(formData.employeeId)) {
    //   newErrors.employeeId =
    //     "Employee ID must contain only uppercase letters and digits.For Example : MTL1010";
    // }
    if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining required.";
    if (!formData.corporateEmail || !/^[a-zA-Z0-9._%+-]+@middlewaretalents\.com$/.test(formData.corporateEmail)) 
      newErrors.corporateEmail = "Please enter a valid email address with @middlewaretalents.com domain.";

    // const emailPattern = /^[a-zA-Z0-9._%+-]+@middlewaretalents\.com$/;
    // if (!emailPattern.test(formData.corporateEmail)) {
    //   newErrors.corporateEmail =
    //     "Please enter a valid email address with @middlewaretalents.com domain.";
    // }
    
    if (!formData.jobRole) newErrors.jobRole = "Choose job role.";
    if (!formData.role) newErrors.role = "Choose the role.";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Validation", "Please fix highlighted errors.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
       Object.keys(formData).forEach((k) => {
      fd.append(k, String(formData[k] ?? ""));
    });
      const res = await fetch(`${url}/api/v1/employeeManager/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
          "X-Tenant-ID": id,
        },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();

    //Alert.alert("Success", "Employee added successfully");
    setSubmitSuccess(true);
    setIsAddingCompleted(true);
    setAddedEmployee(json);
    // setSuccessPopup(true);
    // console.log("harsha",json);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = pickerModal.items.filter((it) => (pickerSearch.trim() === "" ? true : String(it.label || it).toLowerCase().includes(pickerSearch.toLowerCase())));

  function SearchablePickerModal() {
    if (!pickerModal.visible) return null;
    return (
      <Modal visible={pickerModal.visible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{pickerModal.title}</Text>
            <TextInput
              placeholder="Search..."
              style={styles.modalSearch}
              value={pickerSearch}
              onChangeText={setPickerSearch}
              autoFocus
            />
            <FlatList
              data={filteredItems}
              keyExtractor={(item, idx) => String(item.value ?? item).concat(idx)}
              renderItem={({ item }) => {
                const label = item.label ?? item;
                const value = item.value ?? item;
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      updateForm({ [pickerModal.key]: value });
                      closePickerModal();
                    }}
                  >
                    <Text>{label}</Text>
                  </TouchableOpacity>
                );
              }}
              style={{ maxHeight: 320 }}
            />
            <TouchableOpacity style={styles.modalClose} onPress={closePickerModal}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <LayoutWrapper>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
         {isAddingCompleted ? (
          <Modal visible={isAddingCompleted} transparent animationType="fade">
  <View style={styles.modalCenter}>
    <View style={styles.modalBox}>

      <Text style={styles.successTitle}>Success!</Text>
      <Text style={styles.modalMessage}>
        The employee has been successfully registered.
      </Text>

      {/* <View>
  <Text style={[styles.modalText, { fontWeight: "bold", marginBottom: 8 }]}>
    Login Credentials
  </Text>

  <TouchableOpacity
    onPress={() => Clipboard.setStringAsync(addedEmployee.corporateEmail)}
  >
    <Text style={[styles.modalText, { color: "#007bff" }]}>
      Corporate Email: {addedEmployee.corporateEmail} (Tap to copy)
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => Clipboard.setStringAsync(addedEmployee.password)}
  >
    <Text style={[styles.modalText, { color: "#007bff" }]}>
      Password: {addedEmployee.password} (Tap to copy)
    </Text>
  </TouchableOpacity>
</View> */}
<View>
  <Text style={[styles.modalText, { fontWeight: "bold", marginBottom: 10 }]}>
    Login Credentials
  </Text>

  {/* EMAIL ROW */}
  <View style={styles.copyRow}>
    <Text style={styles.copyLabel}>Corporate Email: {addedEmployee.corporateEmail}</Text>

    <TouchableOpacity
      onPress={() => {
        Clipboard.setStringAsync(addedEmployee.corporateEmail);
        ToastAndroid.show("Email copied!", ToastAndroid.SHORT);
      }}
    >
      <Ionicons name="copy-outline" size={22} color="#007bff" />
    </TouchableOpacity>
  </View>

  {/* PASSWORD ROW */}
  <View style={styles.copyRow}>
    <Text style={styles.copyLabel}>Password: {addedEmployee.password}</Text>

    <TouchableOpacity
      onPress={() => {
        Clipboard.setStringAsync(addedEmployee.password);
        ToastAndroid.show("Password copied!", ToastAndroid.SHORT);
      }}
    >
      <Ionicons name="copy-outline" size={22} color="#007bff" />
    </TouchableOpacity>
  </View>
</View>


      <TouchableOpacity
        style={styles.okBtn}
        onPress={() => navigation.navigate("Admin/Employee")}
      >
        <Text style={styles.actionText}>OK</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

         ):(
          <View>
          <View style={{ flexDirection: 'row', alignItems: 'center',  marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Admin/Employee")}>
                  <Ionicons name="arrow-back" size={25} color="#19CF99"/>
                </TouchableOpacity>
                <Text style={styles.mainHeader}>Update Employee</Text>
                  </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Personal Information</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(t) => updateForm({ firstName: t.charAt(0).toUpperCase() + t.slice(1) })}
                  placeholder="First name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  ref={lastNameRef}
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(t) => updateForm({ lastName: t.charAt(0).toUpperCase() + t.slice(1) })}
                  placeholder="Last name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
              </View>
            </View>

            <Text style={styles.label}>Country</Text>
            <TouchableOpacity style={styles.input} onPress={() => openPickerModal("country", countries.map((c) => ({ label: c, value: c })), "Country")}>
              <Text>{formData.country || "Select country"}</Text>
            </TouchableOpacity>
            {errors.country && <Text style={styles.error}>{errors.country}</Text>}
          </View>

         
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Professional Information</Text>

            <Text style={styles.label}>Working Country</Text>
            <TouchableOpacity style={styles.input} onPress={() => openPickerModal("workingCountry", countries.map((c) => ({ label: c, value: c })), "Working Country")}>
              <Text>{formData.workingCountry || "Select country"}</Text>
            </TouchableOpacity>
            {errors.workingCountry && <Text style={styles.error}>{errors.workingCountry}</Text>}

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Employee ID</Text>
                <TextInput ref={employeeIdRef} style={styles.input} value={formData.employeeId} onChangeText={(t) => updateForm({ employeeId: t.toUpperCase() })} placeholder="MTL1010" returnKeyType="next" blurOnSubmit={false} />
                {errors.employeeId && <Text style={styles.error}>{errors.employeeId}</Text>}
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Date of Joining</Text>
                <TouchableOpacity style={styles.input} onPress={() => openDatePicker("dateOfJoining")}>
                  <Text>{formData.dateOfJoining || "Select date"}</Text>
                </TouchableOpacity>
                {errors.dateOfJoining && <Text style={styles.error}>{errors.dateOfJoining}</Text>}
              </View>
            </View>

            <Text style={styles.label}>Corporate Email</Text>
            <TextInput ref={corporateEmailRef} style={styles.input} value={formData.corporateEmail} onChangeText={(t) => updateForm({ corporateEmail: t })} placeholder="name@company.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" blurOnSubmit={false} />
            {errors.corporateEmail && <Text style={styles.error}>{errors.corporateEmail}</Text>}

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Job Role</Text>
                <TouchableOpacity style={styles.input} onPress={() => openPickerModal("jobRole", jobRoles.map((r) => ({ label: r.jobRole, value: r.jobRole })), "Job Role")}>
                  <Text>{formData.jobRole || "Select job role"}</Text>
                </TouchableOpacity>
                {errors.jobRole && <Text style={styles.error}>{errors.jobRole}</Text>}
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Employment Status</Text>
                <TouchableOpacity style={styles.input} onPress={() => openPickerModal("employmentStatus", [{ label: "Full-Time", value: "full-time" }, { label: "Part-Time", value: "part-time" }], "Employment Status")}>
                  <Text>{formData.employmentStatus || "Select status"}</Text>
                </TouchableOpacity>
                {errors.employmentStatus && <Text style={styles.error}>{errors.employmentStatus}</Text>}
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Reporting To</Text>
              <TouchableOpacity style={styles.input} onPress={() => openPickerModal("reportingTo", managers.map((m) => ({ label: `${m.firstName} ${m.lastName || ""}`, value: m.employeeId })), "Reporting To")}>
                <Text>{managers.find((m) => m.employeeId === formData.reportingTo) ? `${managers.find((m) => m.employeeId === formData.reportingTo).firstName}` : (formData.reportingTo ? formData.reportingTo : "Select manager")}</Text>
              </TouchableOpacity>
              {errors.reportingTo && <Text style={styles.error}>{errors.reportingTo}</Text>}
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>Role</Text>
          
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
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>{submitSuccess ? "Submitted" : "Submit"}</Text>}
            </TouchableOpacity>
          </View>
          <SearchablePickerModal />
          {datePickerVisible && (
            <DateTimePicker
              value={formData[datePickerTarget] ? new Date(formData[datePickerTarget]) : new Date()}
              mode="date"
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          </View>
         )}


          </ScrollView>
      </KeyboardAvoidingView>
    </LayoutWrapper>
  );
}

export default UpdateEmployee;

// ---- styles ----
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f6f7fb",
    paddingBottom: 80,
  },
  mainHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#19CF99",
    marginLeft:10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { fontWeight: "700", marginBottom: 8, color: "#19CF99" },
  row: { flexDirection: "row", gap: 12, marginBottom: 10 },
  col: { flex: 1 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  error: { color: "red", marginTop: 6, fontSize: 12 },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  roleBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e6e6e6" },
  roleBtnActive: { backgroundColor: "#19CF99", borderColor: "#19CF99" },
  roleText: {},
  roleTextActive: { color: "#fff", fontWeight: "700" },
  fileBtn: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, backgroundColor: "#fafafa" },
  submitBtn: { backgroundColor: "#19CF99", padding: 14, borderRadius: 12, alignItems: "center" },

  // modal styles
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalCard: { width: "92%", maxHeight: "80%", backgroundColor: "#fff", padding: 12, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  modalSearch: { borderWidth: 1, borderColor: "#eee", padding: 8, borderRadius: 8, marginBottom: 8 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#f1f1f1" },
  modalClose: { marginTop: 8, backgroundColor: "#19CF99", padding: 10, borderRadius: 8, alignItems: "center" },

  roleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 10,
},

roleBtn: {
  flex: 1,
  marginHorizontal: 5,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: "#F1F1F1",
  alignItems: "center",
},

roleBtnActive: {
  backgroundColor: "#19CF99",
},

roleText: {
  color: "#444",
  fontWeight: "500",
},

roleTextActive: {
  color: "white",
  fontWeight: "600",
},

accessHeading: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 10,
},

accessContainer: {
  backgroundColor: "#F8F8F8",
  padding: 10,
  borderRadius: 10,
},

accessRow: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 6,
},

checkbox: {
  width: 20,
  height: 20,
  borderColor: "#19CF99",
  borderWidth: 2,
  borderRadius: 4,
  marginRight: 10,
},

checkboxActive: {
  backgroundColor: "#19CF99",
},

accessLabel: {
  fontSize: 15,
},

modalCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1a8763",
  },

  modalMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },

  modalText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },

  okBtn: {
    marginTop: 20,
    backgroundColor: "#1a8763",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  copyRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#f5f6fa",
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginVertical: 5,
  borderRadius: 8,
},

copyLabel: {
  fontSize: 14,
  color: "#333",
  flex: 1,
  paddingRight: 10,
},

});
