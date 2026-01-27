import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, TouchableOpacity, View} from 'react-native';
import { url } from "../../universalApi/universalApi";
import { useNavigation } from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import axios from "axios";
import { TextInput } from "react-native-paper";
import styles from '../../styles/Invoice/UpdateCompany';
import { Picker } from "@react-native-picker/picker";


const AddCompany = ({ setIsRegister }) => {
    const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyCode: "",
    gstNo: "",
    country: "India",
    companyAddress: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const COMPANY_NAME_MAX = 50;
  const [storedData, setStoredData] = useState("");
    const [id, setId] = useState("");
  
    const fetchStoredData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      const tenant = await AsyncStorage.getItem("tenantId");
  
      console.log("stored response : ", JSON.parse(stored));
      setStoredData(JSON.parse(stored));
      setId(JSON.parse(tenant));
    };
  
    useEffect(() => {
      fetchStoredData();
    }, []);
  
    const token = storedData.token;
    const role = storedData.role;

     const handleChange = (name, value) => {
  // Company Name rules
  if (name === "companyName") {
    if (value.startsWith(" ")) return;
    if (value.length > 50) return;
  }

  // Company Address rules
  if (name === "companyAddress") {
    if (value.startsWith(" ")) return;
    if (value.length > 200) return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};


  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.companyName.trim().length > 50) {
      newErrors.companyName = "Company name cannot exceed 150 characters";
    }
    const emailPattern = /^[^@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.companyEmail)) {
      newErrors.companyEmail =
        "Please enter a valid email (e.g., example@domain.com)";
    }
    if (!formData.companyCode.trim()) {
      newErrors.companyCode = "Company code is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Please select a country";
    }

    if (formData.country === "India") {
      const gstRegexIndia =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegexIndia.test(formData.gstNo)) {
        newErrors.gstNo = "Please enter a valid Indian GST Number";
      }
    }

    if (formData.country === "UK") {
      const vatRegexUK = /^(GB\d{9}|GB\d{12}|\d{9}|\d{12})$/;
      if (!vatRegexUK.test(formData.gstNo)) {
        newErrors.gstNo = "Please enter a valid UK VAT Number";
      }
    }

    if (formData.country === "India") {
      const cinRegexIndia =
        /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

      if (!cinRegexIndia.test(formData.companyCode)) {
        newErrors.companyCode = "Please enter a valid Indian CIN Number";
      }
    }
    if (formData.country === "UK") {
      const crnRegexUK = /^(\d{8}|[A-Z]{2}\d{6})$/i;

      if (!crnRegexUK.test(formData.companyCode)) {
        newErrors.companyCode =
          "Please enter a valid UK Company Registration Number";
      }
    }

    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "Company Address is required";
    }
    if (formData.companyAddress.trim().length > 200) {
      newErrors.companyAddress = "Company Address is required";
    }
    return newErrors;
  };

  const validateFields = (formData) => {
    const errors = {};
    if (formData.country === "India") {
      const gstRegexIndia =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegexIndia.test(formData.gstNo)) {
        errors.gstNo = "Please enter a valid Indian GST Number";
      }
    }

    if (formData.country === "UK") {
      const vatRegexUK = /^(GB\d{9}|GB\d{12}|\d{9}|\d{12})$/;
      if (!vatRegexUK.test(formData.gstNo)) {
        errors.gstNo = "Please enter a valid UK VAT Number";
      }
    }
    if (formData.country === "India") {
      const cinRegexIndia =
        /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

      if (!cinRegexIndia.test(formData.companyCode)) {
        errors.companyCode = "Please enter a valid Indian CIN Number";
      }
    }
    if (formData.country === "UK") {
      const crnRegexUK = /^(\d{8}|[A-Z]{2}\d{6})$/i;

      if (!crnRegexUK.test(formData.companyCode)) {
        errors.companyCode =
          "Please enter a valid UK Company Registration Number";
      }
    }
    return errors;
  };

  const handleSubmit = async () => {
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.post(
      `${url}/api/companyDetails`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      }
    );

    // Reset form
    setFormData({
      companyName: "",
      companyEmail: "",
      companyCode: "",
      gstNo: "",
      country: "",
      companyAddress: "",
    });

    setSubmitted(true);
    setIsRegister(false);

  } catch (error) {
    let newErrors = {};

    const message = error?.response?.data?.message;

    if (message === "Company Email already exists.") {
      newErrors.companyEmail = message;
    }

    if (message === "Company Name already exists.") {
      newErrors.companyName = message;
    }

    if (
      message === "CRN already exists in the UK" ||
      message === "CIN already exists in India"
    ) {
      newErrors.companyCode = message;
    }

    if (
      message === "VAT No already exists in the UK" ||
      message === "GST No already exists in India"
    ) {
      newErrors.gstNo = message;
    }

    setErrors(newErrors);
    console.error("Error submitting company:", error);
  } finally {
    setIsSubmitting(false);
  }
};

    return(
        <View>
            <View>
                <TouchableOpacity onPress={() => setIsRegister(false)}>
                <Text style={{color:roleColors[role], textAlign : 'right', }}>
                    &times;
                </Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Company Details</Text>
            
            </View>
            {
                submitted ? (
                    <>
                    <Text>
                         Your company details have been submitted successfully.
                    </Text>
                    </>
                ) : (
                    <>
                    <View>
                <View>
                    <Text>Company Name</Text>
                    <TextInput
                     maxLength={50}
  value={formData.companyName}
  onChangeText={(text) => handleChange("companyName", text.replace(/^\s+/, ""))}
  placeholder="Enter Company Name"
  style={styles.input}
/>
{errors.companyName ? (
    <Text style={styles.errorText}>{errors.companyName}</Text>
  ) : null}

  <Text
    style={[
      styles.counterText,
      { color: formData.companyName.length === 50 ? "red" : "#666" },
    ]}
  >
    {formData.companyName.length}/50
  </Text>
                </View>
                <View style={styles.fieldContainer}>
  <Text style={styles.label}>Company Email</Text>

  <TextInput
    style={styles.input}
    onChangeText={(text) =>
      handleChange("companyEmail", text)
    }
    placeholder="Company Email"
    keyboardType="email-address"
    autoCapitalize="none"
  />

  {errors.companyEmail ? (
    <Text style={styles.errorText}>{errors.companyEmail}</Text>
  ) : null}
</View>
            </View>

            {/* company code & gst no. */}
            <View>
              <View>
                <Text>
                     {formData.country === "India"
                    ? "CIN (Company Identification Number)"
                    : "CRN (Company Registration Number)"}{" "}
                  <Text style={{ color: "red" }}> *</Text>
                </Text>
                <TextInput
    style={styles.input}
    value={formData.companyCode}
    onChangeText={(text) =>
      handleChange("companyCode", text)
    }
    placeholder={formData.country === "India" ? "CIN Number" : "CRN Number"}
    autoCapitalize="characters"
  />

  {errors.companyCode ? (
    <Text style={styles.errorText}>{errors.companyCode}</Text>
  ) : null}
              </View>
              <View>
                <Text>
                    {formData.country === "India" ? "GST NO" : "VAT NO"}{" "}
                    <Text style={{ color: "red" }}> *</Text>
                </Text>
                <TextInput
    style={styles.input}
    value={formData.gstNo}
    onChangeText={(text) =>
      handleChange("gstNo", text)
    }
    placeholder={
                      formData.country === "India" ? "GST NO" : "VAT NO"
                    }
    autoCapitalize="characters"
  />

  {errors.gstNo ? (
    <Text style={styles.errorText}>{errors.gstNo}</Text>
  ) : null}
              </View>
            </View>

            {/* country */}
            <View>
              <Text>
                Country
              </Text>
              <View style={styles.inputPicker}>
    <Picker
      selectedValue={formData.country}
      onValueChange={(value) =>
        handleChange("country", value)
      }
    >
      <Picker.Item label="Select Country" value="" />
      <Picker.Item label="India" value="India" />
      <Picker.Item label="UK" value="UK" />
    </Picker>
  </View>

  {errors.country ? (
    <Text style={styles.errorText}>{errors.country}</Text>
  ) : null}

            </View>

            {/* company address */}

            <View style={styles.fieldContainer}>
  <Text style={styles.label}>Company Address</Text>

  <TextInput
    style={styles.textArea}
    value={formData.companyAddress}
    onChangeText={(text) =>
      handleChange("companyAddress", text)
    }
    placeholder="Enter Company Address"
    multiline
    numberOfLines={4}
    textAlignVertical="top"
    maxLength={200}
  />

  {errors.companyAddress ? (
    <Text style={styles.errorText}>{errors.companyAddress}</Text>
  ) : null}

  <Text
    style={[
      styles.counterText,
      {
        color:
          formData.companyAddress.length === 200
            ? "red"
            : "#666",
      },
    ]}
  >
    {formData.companyAddress.length}/200
  </Text>
</View>

{/* submit */}
<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
  <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}> 
    {isSubmitting ? "Submitting..." : "Submit"}
  </Text>
</TouchableOpacity>

                    </>
                )
            }
        </View>
    )
};

export default AddCompany;