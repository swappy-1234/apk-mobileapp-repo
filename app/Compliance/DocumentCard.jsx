import { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../universalApi/universalApi";
import roleColors from "../Colors/Colors";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
// import DocumentPicker from "react-native-document-picker";
import * as DocumentPicker from "expo-document-picker";
import styles from '../../styles/Compliance/DocumentCard';
import DateTimePicker from "@react-native-community/datetimepicker"; 
import Upload from '../../assets/Upload.png';
import Loader from "../Loader/Loader";

const DocumentCard = ({
  title,
  description,
  status,
  allDocuments,
  getAllDocuments,
}) => {
  const [error, setError] = useState(null);
  const [existingDOcument, setExistingDocument] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    documentType: "",
    manualDocumentNumber: "",
    createdAt: "",
    manualExpiryDate: "",
    validationStatus: "PENDING",
    storedFilePath: null,
  });

  const [documentDetails, setDocumentDetails] = useState({
    employeeId: "",
    employeeName: "",
    email:"",
    documentType: type,
    manualDocumentNumber: "",
    createdAt: "",
    manualExpiryDate: "",
    validationStatus: "PENDING",
    storedFilePath: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showIssuePicker, setShowIssuePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [storedData, setStoredData] = useState("");
  const [id, setId] = useState("");
  const [isEmail, setIsEmail] = useState("");


  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");
    const emailId = await AsyncStorage.getItem("email");

    console.log("stored response : ", JSON.parse(stored));
    const data = JSON.parse(stored);
    setStoredData(data);
    const parsed = JSON.parse(tenant);
    setId(parsed);
    const parsedEmail = JSON.parse(emailId);
    setIsEmail(parsedEmail);
    if (
      parsed &&
      parsedEmail &&
      data.employeeId &&
      data.firstName &&
      data.lastName
    ) {
      setExistingDocument((prev) => ({
        ...prev,
        employeeId: data.employeeId,
        employeeName: data.firstName + " " + data.lastName,
        email: parsedEmail,
      }));
    };

    if (
      parsed &&
      parsedEmail &&
      data.employeeId &&
      data.firstName &&
      data.lastName
    ) {
      setDocumentDetails((prev) => ({
        ...prev,
        employeeId: data.employeeId,
        employeeName: data.firstName + " " + data.lastName,
        email: parsedEmail,
      }));
    }
  };

   
  

  useEffect(() => {
    fetchStoredData();
  }, []);

  const role = storedData.role;
  const token = storedData.token;

  const icons = {
    Visa: (
      <Feather name="file-text" size={24} style={{ color: roleColors[role] }} />
    ),
    Passport: (
      <FontAwesome6
        name="passport"
        size={24}
        style={{ color: roleColors[role] }}
      />
    ),
    "Identity Card": (
      <FontAwesome
        name="address-card-o"
        size={24}
        style={{ color: roleColors[role] }}
      />
    ),
    "Address Proof": (
      <FontAwesome name="home" size={24} style={{ color: roleColors[role] }} />
    ),
  };

   const patterns = {
    GLOBAL: {
      PASSPORT: /^[A-Za-z0-9]{6,9}$/,
      VISA: /^[A-Za-z0-9]{6,30}$/,
      IDENTITY_CARD: /^[A-Za-z0-9]{4,20}$/,
    },

    // India
    INDIA: {
      PASSPORT: /^[A-Z][1-9]\d\s?\d{4}[1-9]$/,
      IDENTITY_CARD: [
        /^[2-9]{1}[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
        /^[2-9][0-9]{11}$/,
      ],
      VISA: /^[A-Z0-9]{11}$/,
    },

    UK: {
      PASSPORT: /^[A-Za-z0-9]{6,9}$/,
      IDENTITY_CARD: /^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]$/i,
      VISA: /^[0-9]{9}$/,
    },
  };

  const validateDocumentNumber = (docType, value) => {
    if (docType === "ADDRESS_PROOF") {
      if (value) {
        return { valid: true };
      }
      return { valid: false, msg: "Document number is required." };
    }
    let country =
      id.split("_")[0].toUpperCase() || "GLOBAL";
    if (!value || value.trim() === "") {
      return { valid: false, msg: "Document number is required." };
    }
    const countryPatterns = patterns[country]?.[docType] || null;
    const globalPattern = patterns.GLOBAL[docType];

    if (Array.isArray(countryPatterns)) {
      const isValid = countryPatterns.some((rx) => rx.test(value));
      return isValid
        ? { valid: true }
        : { valid: false, msg: `Invalid ${docType.replace("_", " ")} for ${country}.` };
    }

    const regex = countryPatterns || globalPattern;

    return regex.test(value)
      ? { valid: true }
      : { valid: false, msg: `Invalid ${docType.replace("_", " ")} for ${country}.` };
  };

  const validateFile = (file) => {

    if (!file) {
      return { valid: false, msg: "Document file is required." };
    }
    if (existingDOcument) {
      return { valid: true };
    }
    let filePath = file.name;

    if (!filePath) return { valid: false, msg: "Document file is required." };
    const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];
    const ext = filePath.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return {
        valid: false,
        msg: "Unsupported file type. Allowed: PDF, PNG, JPG.",
      };
    }
    return { valid: true };
  };

  const validateDate = (dateValue, fieldName) => {
    if (!dateValue) {
      return { valid: false, msg: `${fieldName} date is required.` };
    }
    const date = new Date(dateValue);
    // if (isNaN(date.getTime())) {
    //   return { valid: false, msg: `${fieldName} is not a valid date.` };
    // }

    return { valid: true };
  };

  const safeISODate = (dateStr) => {
        let newDate=dateStr;
        if (!dateStr) return "";

        const [dd, mm, yyyy] = dateStr.split("-");
        const iso = `${yyyy}-${mm}-${dd}`;

        const dt = new Date(iso);
        const returnDate= isNaN(dt) ? newDate : dt.toISOString().split("T")[0];
        return returnDate;
      };

      const safeISOCCDate = (dateStr) => {
        // let newDate=dateStr;
        // if (!dateStr) return "";

        // const [dd, mm, yyyy] = dateStr.split("-");
        // const iso = `${yyyy}-${mm}-${dd}`;

        const dt = new Date(dateStr);
        const returnDate= isNaN(dt) ? dateStr : dt.toISOString().split("T")[0];
        return returnDate;
      };

  const validateExpiryDate = (createdAt, expiryDate) => {
    if (!expiryDate) return { valid: false, msg: "Expiry date is required." };

    if(existingDOcument.id){
      createdAt=safeISOCCDate(createdAt)
    }

    const created = new Date(createdAt);
    const expiry = new Date(expiryDate);
    const today = new Date();

    if (expiry < today) {
      return { valid: false, msg: "Expiry date cannot be in the past." };
    }

    if (createdAt && expiry < created) {
      return {
        valid: false,
        msg: "Expiry date cannot be earlier than created date.",
      };
    }

    return { valid: true };
  };

  // Convert title to backend documentType string
  const getTypeFromTitle = (title) => {
    switch (title) {
      case "Visa":
        return "VISA";
      case "Passport":
        return "PASSPORT";
      case "Identity Card":
        return "IDENTITY_CARD";
      case "Address Proof":
        return "ADDRESS_PROOF";
      default:
        return "";
    }
  };

  const type = getTypeFromTitle(title);

  

  

  // Sync existing document details from allDocuments
  useEffect(() => {
    const existingDoc = allDocuments?.find((doc) => doc.documentType === type);
    if (existingDoc) {
      setExistingDocument(existingDoc);
      setDocumentDetails({
        employeeId: storedData.employeeId,
        employeeName: storedData.firstName + " " + storedData.lastName,
        email: isEmail,
        documentType: type,
        manualDocumentNumber: existingDoc.manualDocumentNumber || "",
        createdAt: existingDoc.createdAt || "",
        manualExpiryDate: existingDoc.manualExpiryDate || "",
        validationStatus: existingDoc.validationStatus || "PENDING",
        storedFilePath: existingDoc.storedFilePath, // file inputs can't be set programmatically; leave null
      });
      setFileName(
        existingDoc.storedFilePath
          ? extractFileName(existingDoc.storedFilePath)
          : ""
      );
    } else {
      // Reset if no existing document
      setDocumentDetails((prev) => ({
        ...prev,
        manualDocumentNumber: "",
        createdAt: "",
        manualExpiryDate: "",
        validationStatus: "PENDING",
        storedFilePath: null,
      }));
      setFileName("");
    }
  }, [allDocuments, type]);

  console.log("existingDOcument",existingDOcument);
  

  const isEditable = () => {
  // 1. No document uploaded yet → editable
  if (!existingDOcument?.id) {
    return true;
  }

  // 2. Document rejected → editable
  if (existingDOcument.validationStatus === "REJECTED") {
    return true;
  }


  if(existingDOcument.manualExpiryDate){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(
      formatDateForInput(existingDOcument.manualExpiryDate)
    );
    expiryDate.setHours(0, 0, 0, 0);
    if (today >= expiryDate) {
      return true;
    }
  }
  // 3. Approved or Pending → NOT editable
  return false;
};





  // Helper to extract file name from URL or path (adjust if your storedFilePath is a URL)
  const extractFileName = (pathOrUrl) => {
    if (!pathOrUrl) return "";
    return pathOrUrl.split("/").pop();
  };


  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    console.log("formdata",documentDetails);
    let newErrors = {};
    try {
      const docType = getTypeFromTitle(title);

      const isValidNumber = validateDocumentNumber(
        docType,
        documentDetails.manualDocumentNumber
      );
      if (!isValidNumber.valid) {
        newErrors.manualDocumentNumber = isValidNumber.msg;
        setError(
          newErrors
        );
        setIsLoading(false);

      }
      const fileCheck = validateFile(documentDetails.storedFilePath);
      if (!fileCheck.valid) {
        newErrors.storedFilePath = fileCheck.msg;
        setError(newErrors);
        setIsLoading(false);

      }

      const createdCheck = validateDate(documentDetails.createdAt, "Created");
      if (!createdCheck.valid) {
        newErrors.createdAt = createdCheck.msg;
        setError(newErrors);
        setIsLoading(false);

      }

      const expiryCheck = validateExpiryDate(documentDetails.createdAt, documentDetails.manualExpiryDate);
      if (!expiryCheck.valid) {
        newErrors.manualExpiryDate = expiryCheck.msg;
        setError(newErrors);
        setIsLoading(false);

      }
      if (Object.keys(newErrors).length>0) {
        return;
      }



      const formData = new FormData();


      formData.append("employeeId", documentDetails.employeeId);
      formData.append("employeeName", documentDetails.employeeName);
      formData.append("email",documentDetails.email);
      formData.append("documentType", documentDetails.documentType);
      formData.append(
        "manualDocumentNumber",
        documentDetails.manualDocumentNumber || ""
      );
      
      if(existingDOcument.id && existingDOcument.createdAt!==documentDetails.createdAt){
        formData.append(
        "createdAt",
        safeISOCCDate(documentDetails.createdAt)
      );
      }
      else if(existingDOcument.id){
        formData.append(
        "createdAt",
        safeISODate(documentDetails.createdAt)
      );
      }
      else{
        formData.append(
        "createdAt",
        documentDetails.createdAt
      );
      }
      
      formData.append("manualExpiryDate", safeISODate(documentDetails.manualExpiryDate));
      
        
      
      formData.append("validationStatus", documentDetails.validationStatus);

      if (documentDetails.storedFilePath) {
        formData.append("storedFilePath", documentDetails.storedFilePath);
      }
      let response;
      if (!existingDOcument.id) {
        response = await axios.post(
          `${url}/api/compliance/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getAllDocuments();
      } else {
        response = await axios.put(
          `${url}/api/compliance/update/${existingDOcument.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setIsSubmitted(true);
      setIsEdit(false);
      getAllDocuments();
      // Optionally refresh or update UI after upload
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      
    }
  };

  const formatDateForInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


  // const formatDateForInput = (dateString) => {
  //   if (!dateString) return "";

  //   // If already in YYYY-MM-DD → return directly
  //   if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
  //     return dateString;
  //   }

  //   // If DD-MM-YYYY → convert
  //   if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
  //     const [day, month, year] = dateString.split("-");
  //     return `${year}-${month}-${day}`;
  //   }

  //   // If DD/MM/YYYY → convert
  //   if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
  //     const [day, month, year] = dateString.split("/");
  //     return `${year}-${month}-${day}`;
  //   }

  //   // If it's a date object
  //   if (dateString instanceof Date && !isNaN(dateString)) {
  //     const d = dateString;
  //     const month = String(d.getMonth() + 1).padStart(2, "0");
  //     const day = String(d.getDate()).padStart(2, "0");
  //     const year = d.getFullYear();
  //     return `${day}-${month}-${year}`;
  //   }

  //   // Try fallback parsing
  //   const d = new Date(dateString);
  //   if (isNaN(d.getTime())) return ""; // cannot parse

  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const year = d.getFullYear();

  //   return `${day}-${month}-${year}`;
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "#19CF99";
      case "PENDING":
        return "orange";
      case "REJECTED":
        return "red";
      default:
        return "#555";
    }
  };


  const isSubmitBtn = () => {
    if (existingDOcument.manualDocumentNumber !== documentDetails.manualDocumentNumber) {
      return true;
    }
    if (existingDOcument.storedFilePath !== documentDetails.storedFilePath) {
      return true;
    }
    if (existingDOcument.createdAt !== documentDetails.createdAt) {
      return true;
    }
    if (existingDOcument.manualExpiryDate !== documentDetails.manualExpiryDate) {
      return true;
    }
    return false;
  }

  // native document picker
//   const pickDocument = async () => {
//   if (!isEditable()) return;

//   try {
//     const res = await DocumentPicker.pickSingle({
//       type: [DocumentPicker.types.allFiles],
//     });

//     setDocumentDetails((prev) => ({
//       ...prev,
//       storedFilePath: res, // store full file object
//     }));

//     setFileName(res.name);
//     setError("");
//   } catch (err) {
//     if (DocumentPicker.isCancel(err)) {
//       console.log("User cancelled");
//     } else {
//       console.error(err);
//     }
//   }
// };


// expo document picker
const pickDocument = async () => {
  if (!isEditable()) return;

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // all files
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      console.log("User cancelled");
      return;
    }

    const file = result.assets[0]; // Expo returns assets array

    setDocumentDetails((prev) => ({
      ...prev,
      storedFilePath: file, // store full file object
    }));

    setFileName(file.name);
    setError("");
  } catch (err) {
    console.error("Document pick error:", err);
  }
};


  return (
    <View style={styles.card}>
       {isLoading && <Loader />}
        <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
          
            {/* icon, title, description */}
            <View style={{flexDirection : 'row',}}>
                   <Text>{icons[title]}</Text>
                   <View>
                    <Text style={{fontWeight : 'bold', fontSize : 18, marginHorizontal : 10}}>{title}</Text>
                     <Text>{description}</Text>

                    </View>
                   
            
            </View>
            {/* status */}
             {documentDetails.storedFilePath ? <Text
          style={{
            color: getStatusColor(documentDetails.validationStatus),
            fontWeight: "600",
          }}
        >
          {formatStatus(documentDetails.validationStatus)}
        </Text> :""}
        </View>

        {/* document  */}
        <View style={styles.labelCard}>  
            <Text style={styles.label}>DOCUMENT NUMBER</Text>
            <TextInput
             value={documentDetails.manualDocumentNumber}
             editable={isEditable()}
             style={styles.input}
             onChangeText={(value) => {
                setDocumentDetails((prev) => ({
                    ...prev,
                    manualDocumentNumber : value,
                }));
                setError('');
             }} 
            />
             {error && <Text style={{ color: "red", fontSize: 12 }}>{error.manualDocumentNumber}</Text>}
        </View>

        {/* file */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>FILE</Text>
            <TouchableOpacity
  onPress={pickDocument}
  disabled={!isEditable()}
  style={styles.input}
>
  <Image
    source={Upload} // require("./upload.png") or { uri }
    style={{ width: 24, height: 24, marginRight: 8 }}
  />

  {fileName && (
    <Text style={{ color: "#000" }}>{fileName}</Text>
  )}
</TouchableOpacity>

        </View>

        {/* Issue date */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>ISSUE DATE</Text>
             
            <TouchableOpacity
  disabled={!isEditable()}
  onPress={() => setShowIssuePicker(true)}
   style={styles.input}
>
  <Text style={{ color: "#000" }}>
    {documentDetails.createdAt
      ? formatDateForInput(documentDetails.createdAt)
      : "DD-MM-YYYY"}
  </Text>
</TouchableOpacity>

{showIssuePicker && (
  <DateTimePicker
    value={
      documentDetails.createdAt
        ? new Date(documentDetails.createdAt)
        : new Date()
    }
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowIssuePicker(false);

      if (!selectedDate) return;

      setDocumentDetails((prev) => ({
        ...prev,
        createdAt: selectedDate.toISOString().split("T")[0],
      }));

      setError((prev) => ({
        ...prev,
        createdAt: "",
      }));
    }}
  />
)}

             {error && <Text style={{ color: "red", fontSize: 12 }}>{error.createdAt}</Text>}

        </View>

        {/* Expiry Date */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>EXPIRY DATE</Text>

             <TouchableOpacity
  disabled={!isEditable()}
  onPress={() => setShowExpiryPicker(true)}
   style={styles.input}
>
  <Text style={{ color: "#000" }}>
    {documentDetails.manualExpiryDate
      ? formatDateForInput(documentDetails.manualExpiryDate)
      : "DD-MM-YYYY"}
  </Text>
</TouchableOpacity>

{showExpiryPicker && (
  <DateTimePicker
    value={
      documentDetails.manualExpiryDate
        ? new Date(documentDetails.manualExpiryDate)
        : new Date()
    }
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowExpiryPicker(false);

      if (!selectedDate) return;

      setDocumentDetails((prev) => ({
        ...prev,
        manualExpiryDate: selectedDate.toISOString().split("T")[0],
      }));

      setError((prev) => ({
        ...prev,
        manualExpiryDate: "",
      }));
    }}
  />
)}
             {error && <Text style={{ color: "red", fontSize: 12 }}>{error.manualExpiryDate}</Text>}
            
        </View>

        {
            isEditable() && isSubmitBtn() && <TouchableOpacity onPress={handleSubmit} style={styles.button} >
                <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Submit</Text>
            </TouchableOpacity>
        }

    </View>
  );
};

export default DocumentCard;
