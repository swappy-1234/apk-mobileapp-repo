import { useState, useEffect } from "react";
import { View, TouchableOpacity, TextInput, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from '../../styles/Compliance/NextKin';
import Loader from "../Loader/Loader";

const NextKin = ({ nextKin, getAllDocuments }) => {
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const today = new Date();

  const [formData, setFormData] = useState({
    firstName: nextKin?.firstName || "",
    lastName: nextKin?.lastName || "",
    email: nextKin?.email || "",
    relation: nextKin?.relation || "",
    gender: nextKin?.gender || "",
    employeeId: "",
    mobileNumber: nextKin?.mobileNumber || "",
    identityDocumentNumber: nextKin?.identityDocumentNumber || "",
    identityDocumentType: nextKin?.identityDocumentType || "",
    dateOfBirth: nextKin?.dateOfBirth || "",
  });
  const [errors, setErrors] = useState({});
  const [documentTitle, setDocumentTitle] = useState(
    nextKin?.identityDocumentType?.split("/")[4] || ""
  );
  const [storedData, setStoredData] = useState("");
  const [id, setId] = useState("");

  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    setId(JSON.parse(tenant));
    const parsed = JSON.parse(stored);
    setStoredData(parsed);
    if (parsed.employeeId) {
      setFormData((prev) => ({
        ...prev,
        employeeId: parsed.employeeId,
      }));
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const role = storedData.role;
  const token = storedData.token;
  console.log("employee id : ", storedData.employeeId);

  console.log("nextKin", nextKin);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFilePick = async (name) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
         type: [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file, // store full file object
      }));

      setDocumentTitle(file.name);

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (err) {
      console.error("File pick error:", err);
    }
  };

  const validateForm = () => {
    let errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\+?[0-9]{8,15}$/;

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.relation) {
      errors.relation = "Relation is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      errors.mobileNumber = "Invalid mobile number";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.identityDocumentType) {
      errors.identityDocumentType = "Identity document type is required";
    }

    // Identity Document Number
    if (!formData.identityDocumentNumber) {
      errors.identityDocumentNumber = "Identity document number is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("dddd", formData);
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid → submit API");
    } else {
      return;
    }
    setLoading(true);
    try {
      if (nextKin?.id) {
        const params = new FormData();
        for (let k of Object.keys(formData)) {
          params.append(k, formData[k]);
        }
        params.append("id", nextKin.id);
        const response = await axios.put(
          `${url}/api/nextkin/${nextKin.id}`,
          params,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
            },
          }
        );
        console.log("Emergency contact", response.data);
        getAllDocuments();
      } else {
        const params = new FormData();
        for (let k of Object.keys(formData)) {
          params.append(k, formData[k]);
        }
        const response = await axios.post(`${url}/api/nextkin/create`, params, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        });
        console.log("Emergency contact", response.data);
        getAllDocuments();
      }
    } catch (e) {
      console.error("Error submiting emergency compliance", e);
    } finally {
      setLoading(false);
    }
  };

 const isSubmitBtnShow = () => {
  // If no existing data, show submit
  if (!nextKin) return true;

  const formKeys = Object.keys(formData);

  for (const key of formKeys) {
    const newValue = formData[key];
    const oldValue = nextKin[key];

    if (
      newValue !== undefined &&
      newValue !== null &&
      newValue !== "" &&
      newValue !== oldValue
    ) {
      return true; // something changed
    }
  }

  return false; // no changes
};

   const formatDateForInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

  return (
    <>
    {loading && <Loader />}
     <View style={styles.card}>
      <Text style={styles.heading}>Emergency Contact</Text>
      {/* first name */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>FIRST NAME</Text>
        <TextInput
          value={formData.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          style={styles.input}
        />
        {errors.firstName && (
          <Text style={{ color: "red" }}>{errors.firstName}</Text>
        )}
      </View>

      {/* last name */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>LAST NAME</Text>
        <TextInput
          value={formData.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
            style={styles.input}
        />
        {errors.lastName && (
          <Text style={{ color: "red" }}>{errors.lastName}</Text>
        )}
      </View>

      {/* email */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
        />
        {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}
      </View>

      {/* employee id */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>EMPLOYEE ID</Text>
        <TextInput
          value={formData.employeeId}
          onChangeText={(text) => handleChange("employeeId", text)}
            style={styles.input}
        />
        {errors.employeeId && (
          <Text style={{ color: "red" }}>{errors.employeeId}</Text>
        )}
      </View>

      {/* relation */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>RELATION</Text>
        <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.relation}
          onValueChange={(text) => handleChange("relation", text)}
            
        >
          <Picker.Item label="Select Relation" value="" />
          <Picker.Item label="Father"  />
          <Picker.Item label="Mother"  />
          <Picker.Item label="Spouse"  />
          <Picker.Item label="Husband" />
          <Picker.Item label="Wife" />
          <Picker.Item label="Son" />
          <Picker.Item label="Daughter" />
          <Picker.Item label="Brother" />
          <Picker.Item label="Sister" />
          <Picker.Item label="GrandFather" />
          <Picker.Item label="GrandMother" />
          <Picker.Item label="Uncle" />
          <Picker.Item label="Aunt" />
          <Picker.Item label="Cousin" />
          <Picker.Item label="Friend" />
          <Picker.Item label="Guardian" />
          <Picker.Item label="Partner" />
          <Picker.Item label="Relative" />
          <Picker.Item label="Other" />
        </Picker>
        </View>
        {errors.relation && (
          <Text style={{ color: "red" }}>{errors.relation}</Text>
        )}
      </View>

      {/* gender */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>GENDER</Text>
         <View style={styles.pickerWrapper}>
        <Picker selectedValue={formData.gender} onValueChange={(text) => handleChange("gender", text)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" />
            <Picker.Item label="Female" />
            <Picker.Item label="Other" />
            <Picker.Item label="Prefer not to say" />
        </Picker>
        </View>
        {errors.gender && (
          <Text style={{ color: "red" }}>{errors.gender}</Text>
        )}
      </View>

      {/* mobile number */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>MOBILE NUMBER</Text>
        <TextInput
          value={formData.mobileNumber?.toString()}
          onChangeText={(text) => handleChange("mobileNumber", text)}
            style={styles.input}
        />
        {errors.mobileNumber && (
          <Text style={{ color: "red" }}>{errors.mobileNumber}</Text>
        )}
      </View>

      {/* DOB */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DATE OF BIRTH</Text>
          <TouchableOpacity
  onPress={() => setShowPicker(true)}
   style={styles.input}
>
  <Text style={{ color: "#000" }}>
    {formData.dateOfBirth
      ? formatDateForInput(formData.dateOfBirth)
      : "DD-MM-YYYY"}
  </Text>
</TouchableOpacity>

{showPicker && (
  <DateTimePicker
    value={
      formData.dateOfBirth
        ? new Date(formData.dateOfBirth)
        : today
    }
    mode="date"
    display="default"
    maximumDate={today}
    onChange={(event, selectedDate) => {
      setShowPicker(false);

      if (!selectedDate) return;
      handleChange("dateOfBirth", selectedDate)
    }}
  />
)}
        {errors.dateOfBirth && (
          <Text style={{ color: "red" }}>{errors.dateOfBirth}</Text>
        )}
      </View>

      {/* DOCUMENT NUMBER */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DOCUMENT NUMBER</Text>
        <TextInput
          value={formData.identityDocumentNumber?.toString()}
          onChangeText={(text) => handleChange("identityDocumentNumber", text)}
            style={styles.input}
        />
        {errors.identityDocumentNumber && (
          <Text style={{ color: "red" }}>{errors.identityDocumentNumber}</Text>
        )}
      </View>

      {/* Doument Type */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DOCUMENT TYPE</Text>
         <TouchableOpacity
    onPress={() => handleFilePick("identityDocumentType")}
     style={styles.input}
  >
    <Text>Select Document</Text>
  </TouchableOpacity>

  {documentTitle ? (
    <Text style={{ fontSize: 12, marginTop: 4 }}>
      {documentTitle}
    </Text>
  ) : null}
        {errors.firstName && (
          <Text style={{ color: "red" }}>{errors.firstName}</Text>
        )}
      </View>

      {
        isSubmitBtnShow() && (
            <TouchableOpacity onPress={handleSubmit}  style={styles.button}>
                <Text   style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        )
      }
    </View>
    </>
   
  );
};

export default NextKin;
