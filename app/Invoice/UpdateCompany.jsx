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
import Loader from "../Loader/Loader";

const UpdateCompany = ({updateId,setIsCompanyUpdate,fetchCompaniesAfterUpdate}) => {
    const  id  = updateId;
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const[isUpdate,setIsUpdate]=useState(false);
  const[isLoading,setIsLoading]=useState(false);
  

  const [updateCompany, setUpdateCompany] = useState({
    companyName: "",
    companyEmail: "",
    companyCode: "",
    gstNo: "",
    country: "",
    companyAddress: "",
  });
  const [storedData, setStoredData] = useState("");
    const [isId, setId] = useState("");
  
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

  if (name === "companyName") {
    if (value.startsWith(" ")) return;
    if (value.length > 50) return;
  }

  if (name === "companyAddress") {
    if (value.startsWith(" ")) return;
    if (value.length > 200) return;
  }

  setUpdateCompany((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "",
  }));
};


  const validateForm = () => {
    const newErrors = {};
    if (!updateCompany.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!updateCompany.companyName.trim().length > 50) {
      newErrors.companyName = "Company name cannot exceed 150 characters";
    }
    const emailPattern = /^[^@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(updateCompany.companyEmail)) {
      newErrors.companyEmail =
        "Please enter a valid email (e.g., example@domain.com)";
    }
    if (!updateCompany.companyCode.trim()) {
      newErrors.companyCode = "Company code is required";
    }

    if (!updateCompany.country.trim()) {
      newErrors.country = "Please select a country";
    }

    if (updateCompany.country === "India") {
      const gstRegexIndia =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegexIndia.test(updateCompany.gstNo)) {
        newErrors.gstNo = "Please enter a valid Indian GST Number";
      }
    }

    if (updateCompany.country === "UK") {
      const vatRegexUK = /^(GB\d{9}|GB\d{12}|\d{9}|\d{12})$/;
      if (!vatRegexUK.test(updateCompany.gstNo)) {
        newErrors.gstNo = "Please enter a valid UK VAT Number";
      }
    }

    if (updateCompany.country === "India") {
      const cinRegexIndia =
        /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

      if (!cinRegexIndia.test(updateCompany.companyCode)) {
        newErrors.companyCode = "Please enter a valid Indian CIN Number";
      }
    }
    if (updateCompany.country === "UK") {
      const crnRegexUK = /^(\d{8}|[A-Z]{2}\d{6})$/i;

      if (!crnRegexUK.test(updateCompany.companyCode)) {
        newErrors.companyCode =
          "Please enter a valid UK Company Registration Number";
      }
    }

    if (!updateCompany.companyAddress.trim()) {
      newErrors.companyAddress = "Company Address is required";
    }
    if (updateCompany.companyAddress.trim().length > 200) {
      newErrors.companyAddress = "Company Address is required";
    }
    return newErrors;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${url}/api/companyDetails/getData/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": isId,
            },
          }
        );
        setUpdateCompany(response.data);
      } catch (error) {
        console.error("Error fetching Company details by Id: ", error);
      }
    };
    fetchCompanies();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
     const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsLoading(true);
      await axios.put(
        `${url}/api/companyDetails/updateById/${id}`,
        updateCompany,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": isId,
          },
        }
      );
      // alert("Company updated successfully!");
      fetchCompaniesAfterUpdate();
      
    } catch (error) {
      console.error("Error updating company:", error);
    }
    setIsUpdate(false);
  };

    return (
        <View>
           {isLoading && <Loader />}
            <View>
              <TouchableOpacity onPress={() => setIsCompanyUpdate(false)}>
                <Text style={{color:roleColors[role], textAlign : 'right', }}>
                    &times;
                </Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Edit Company Details</Text>
            
            </View>
            <View>
                <View>
                    <Text>Company Name</Text>
                    <TextInput
                     maxLength={50}
  value={updateCompany.companyName}
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
      { color: updateCompany.companyName.length === 50 ? "red" : "#666" },
    ]}
  >
    {updateCompany.companyName.length}/50
  </Text>
                </View>
                <View style={styles.fieldContainer}>
  <Text style={styles.label}>Company Email</Text>

  <TextInput
    style={styles.input}
    value={updateCompany.companyEmail}
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
                   {updateCompany.country === "India"
                    ? "CIN (Company Identification Number)"
                    : "CRN (Company Registration Number)"}{" "}
                 
                </Text>
                <TextInput
    style={styles.input}
    value={updateCompany.companyCode}
    onChangeText={(text) =>
      handleChange("companyCode", text)
    }
    placeholder="CIN Number"
    autoCapitalize="characters"
  />

  {errors.companyCode ? (
    <Text style={styles.errorText}>{errors.companyCode}</Text>
  ) : null}
              </View>
              <View>
                <Text>GST NO</Text>
                <TextInput
    style={styles.input}
    value={updateCompany.gstNo}
    onChangeText={(text) =>
      handleChange("gstNo", text)
    }
    placeholder="GST NO"
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
      selectedValue={updateCompany.country}
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
    value={updateCompany.companyAddress}
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
          updateCompany.companyAddress.length === 200
            ? "red"
            : "#666",
      },
    ]}
  >
    {updateCompany.companyAddress.length}/200
  </Text>
</View>

{/* submit */}
<TouchableOpacity onPress={handleUpdate} style={styles.submitButton}>
  <Text style={[styles.buttonText,{backgroundColor : roleColors[role]}]}> 
    {isUpdate? "Updating":"Update"}
  </Text>
</TouchableOpacity>

        </View>
    )
};

export default UpdateCompany;