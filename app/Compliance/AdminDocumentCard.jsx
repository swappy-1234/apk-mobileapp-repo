import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, TextInput, Pressable, Image, Platform, Alert } from "react-native";
import Modal from 'react-native-modal';
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import roleColors from "../Colors/Colors";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import styles from '../../styles/Compliance/AdminDocumentCard';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import Loader from "../Loader/Loader";

const AdminDocumentCard = ({ title, description, status, allDocuments }) => {
     const [isLoading, setIsLoading] = useState(false);
  const [viewDocument, setViewDocument] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  
   const [uploadDocumentDetails, setUploadDocumentDetails] = useState({
    manualDocumentNumber: "",
    createdAt: "",
    manualExpiryDate: "",
    validationStatus: "PENDING",
    storedFilePath: null,
  });

    const [data, setData] = useState("");
  const [id, setId] = useState("");

  const fetchData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    setData(JSON.parse(stored));
    setId(JSON.parse(tenant));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const role = data.role;
  const token = data.token;
  const employeeId = data.employeeId;   

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
const documentType = getTypeFromTitle(title);
  
  console.log("GGG", documentType);

  useEffect(() => {
    let type = getTypeFromTitle(title);
    console.log("All documets", allDocuments);

    let document = allDocuments.filter((each) => each.documentType === type);

    if (document.length > 0) {
      setUploadDocumentDetails({
        employeeId: document[0].employeeId,
        manualDocumentNumber: document[0].manualDocumentNumber,
        createdAt: document[0].createdAt,
        manualExpiryDate: document[0].manualExpiryDate,
        validationStatus: document[0].validationStatus,
        storedFilePath: document[0].storedFilePath,
      });
      // setReviewed(document[0].validationStatus !== "PENDING");
      setReviewed(document[0].validationStatus !== "PENDING");


      // if (
      //   document[0].validationStatus === "APPROVED" ||
      //   document[0].validationStatus === "REJECTED"
      // ) {
      //   setReviewed(true);
      // } else {
      //   setReviewed(false);
      // }
    } else {
      // If no document exists, reset
      setUploadDocumentDetails({
        employeeId: "",
        manualDocumentNumber: "",
        createdAt: "",
        manualExpiryDate: "",
        validationStatus: "PENDING",
        storedFilePath: null,
      });
      setReviewed(true);
    }
  }, [allDocuments, title]);

  console.log("UUUUUUU", uploadDocumentDetails.employeeId);

 const handleDownload = async () => {
  try {
    const url = uploadDocumentDetails?.storedFilePath;
    if (!url) return;

    const fileName = title || url.split('/').pop();
    const fileUri = FileSystem.documentDirectory + fileName;

    const { uri } = await FileSystem.downloadAsync(url, fileUri);

    Alert.alert(
      'Download Complete',
      `File saved successfully`
    );

    console.log('Saved at:', uri);
  } catch (error) {
    console.error(error);
    Alert.alert('Download Failed', 'Unable to download file');
  }
};

console.log(FileSystem.documentDirectory); 

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/compliance/${uploadDocumentDetails.employeeId}/${documentType}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadDocumentDetails((prev) => ({
          ...prev,
          validationStatus: "ACCEPTED",
        }));
        setReviewed(true);
      }
    } catch (error) {
      console.error("Error approving document", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        `${url}/api/compliance/${uploadDocumentDetails.employeeId}/${documentType}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setUploadDocumentDetails((prev) => ({
          ...prev,
          validationStatus: "REJECTED",
        }));
        setReviewed(true);
      }
    } catch (error) {
      console.error("Error rejecting document", error);
    }
  };

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

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };


    
    return (
        <View style={styles.card}>
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
             {uploadDocumentDetails.storedFilePath ? <Text
          style={{
            color: getStatusColor(uploadDocumentDetails.validationStatus),
            fontWeight: "600",
          }}
        >
          {formatStatus(uploadDocumentDetails.validationStatus)}
        </Text> :""}
        </View>

        {/* document  */}
        <View style={styles.labelCard}>  
            <Text style={styles.label}>DOCUMENT NUMBER</Text>
            <Text>{uploadDocumentDetails.manualDocumentNumber}</Text>
            
        </View>

        {/* file */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>FILE</Text>
           {
            uploadDocumentDetails.storedFilePath && (
                <View >
                  <Text>{title}</Text>
                  <View style={{flexDirection : 'row', justifyContent : 'space-around'}}>
                     
                    <Pressable onPress={() => setViewDocument(true)} >
                        <Text style={{color : roleColors[role],}}>view</Text>
                         
                    </Pressable>
                    <Feather name="download" size={24} style={{color : roleColors[role]}} onPress={handleDownload} />
                   </View>
                   

                    </View>
            )
           }
        </View>

        {/* Issue date */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>ISSUE DATE</Text>
            <Text>{uploadDocumentDetails.createdAt}</Text>
             
         

        </View>

        {/* Expiry Date */}
        <View style={styles.labelCard}>
            <Text style={styles.label}>EXPIRY DATE</Text>
            <Text>{uploadDocumentDetails.manualExpiryDate}</Text>
            
        </View>

        {
            uploadDocumentDetails.storedFilePath && 
            uploadDocumentDetails.validationStatus === 'PENDING' && (
                <View style={styles.statusContainer}>
                    <TouchableOpacity onPress={handleApprove} style={[styles.buttonStatus, styles.approve]}>
                        <Text style={[styles.buttonTextStatus, styles.approveText]}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReject} style={[styles.buttonStatus, styles.reject]}>
                        <Text style={[styles.buttonTextStatus, styles.rejectText]}>Reject</Text>
                    </TouchableOpacity>
                    </View>
            )
        }

       {viewDocument && (
  <Modal
    transparent
    animationType="fade"
    visible={viewDocument}
    onRequestClose={() => setViewDocument(false)}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>

          <Pressable onPress={() => setViewDocument(false)}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {uploadDocumentDetails?.storedFilePath
            ?.toLowerCase()
            ?.endsWith('.pdf') ? (
            
            /* PDF Preview */
            <WebView
              source={{ uri: uploadDocumentDetails.storedFilePath }}
              style={styles.preview}
            />

          ) : (
            /* Image Preview */
            <Image
              source={{ uri: uploadDocumentDetails.storedFilePath }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

      </View>
    </View>
  </Modal>
)}


    </View>
    )
};

export default AdminDocumentCard;