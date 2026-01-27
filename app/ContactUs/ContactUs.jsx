import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { url } from "../../universalApi/universalApi";
import axios from "axios";
import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, } from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import LayoutWrapper from "../LayoutWrapper";
import styles from "../../styles/ContactUs/ContactUs";
import { Picker } from "@react-native-picker/picker";
import Loader from "../Loader/Loader";



const ContactUs = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [clientDetails, setClientDetails] = useState("");
    const [isContactUsForm, setIsContactUsForm] = useState(false);
    const [error, setError] = useState({ errorForType: "", errorForMessage: "" });
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        schemaName: "",
        message: "",
        typeOfMessage: "",
    });
      const [storedData, setStoredData] = useState("");
  const [id, setId] = useState("");

  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    setStoredData(JSON.parse(stored));
    const parsed = JSON.parse(tenant)
    setId(parsed);
    if (parsed) {
        setFormData((prev) => ({
            ...prev,
            schemaName : id,
        }))
    }
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const role = storedData.role;
  const token = storedData.token;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Tenant-ID": id,
    };
    useEffect(() => {

        if (id != null) {
            const fetchClientDetails = async () => {
                try {
                    setIsLoading(true);
                    const res = await axios.get(
                        `${url}/api/clientDetails/getBySchema/${id}`,
                        {
                            headers,
                        }
                    );
                    setClientDetails(res.data);
                    console.log("res : ", res.data);

                } catch (error) {
                    console.error("Error fetching client details:", error);
                }
                finally {
                    setIsLoading(false);
                }
            };
            fetchClientDetails();

        }
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.typeOfMessage) {
            setError((prev) => ({
                ...prev,
                errorForType: "Type Required"
            }))
            return;
        }

        if (!formData.message.trim()) {
            setError((prev) => ({
                ...prev,
                errorForMessage: "Message Required"
            }))
            return;
        }

        if (formData.message.length > 200) {
            setError("Message cannot exceed 200 characters");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post(`${url}/api/contactus/add-contactusform`, {
                clientDetails: clientDetails,
                contactUs: formData
            },
                {
                    headers
                });
                

            setIsOpen(true);
        }
        catch (error) {
            console.error('Error submitting query:', error);
            alert('failed to submit query');
        }
        finally {
            setIsLoading(false);
        }
    };
   const handleChange = (name, value) => {
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  setError('');
};  
    return (
        <>
        <LayoutWrapper>
            <ScrollView>
                 {isLoading && <Loader />}
                <View>
                    {
                        isContactUsForm && (
                            <TouchableOpacity onPress={() => setIsContactUsForm(true)}>
                                <Text>
                                    Contact Us
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    {/* Thanks giving modal */}
                   <Modal isVisible={isOpen} transparent animationType="fade">
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>
        Thank you for reaching out!{"\n\n"}
        Your message has been received, and our team will be in touch with you shortly.
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          setIsOpen(false);
          setIsContactUsForm(false);
          setFormData(prev => ({ ...prev, message: "" }));
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

                    {/* Form */}
                    <View>
                        <Text style={styles.mainHeading}>Contact Us</Text>
                        <View style={styles.container}>
                            <View style={styles.inputCont}>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput 
                                value={clientDetails.firstName}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput 
                                value={clientDetails.lastName}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput 
                                value={clientDetails.email}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Country</Text>
                                <TextInput 
                                value={clientDetails.country}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Company Name</Text>
                                <TextInput 
                                value={clientDetails.companyName}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Total Employees</Text>
                                <TextInput 
                                value={clientDetails.noOfEmployees?.toString()}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Plan</Text>
                                <TextInput 
                                value={clientDetails.plan}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>

                            <View style={styles.inputCont}>
                                <Text style={styles.label}>Next Billing</Text>
                                <TextInput 
                                value={ clientDetails.endDate
                                                ? new Date(clientDetails.endDate)
                                                    .toLocaleDateString("en-GB")
                                                    .replace(/\//g, "-")
                                                : ""}
                                editable={false}
                                selectTextOnFocus={false}
                                style={styles.input}
                                />
                            </View>
                             
                             <View style={styles.inputCont}>
                              <Text style={styles.label}>Select Type</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker selectedValue={formData.typeOfMessage} onValueChange={(text) => handleChange( "typeOfMessage",text)} style={styles.picker} >
                                    <Picker.Item  label="Select Type" value=""/>
                                    <Picker.Item  label="Issue" value="Issue"/>
                                    <Picker.Item  label="Query" value="Query"/>
                                    <Picker.Item  label="Complaint" value="Complaint"/>
                                    <Picker.Item  label="Suggestion" value="Suggestion"/>
                                    <Picker.Item  label="Upgrade My Account" value="Upgrade My Account"/>
                                </Picker>
                                </View>
                                {error.errorForType && <View ><Text style={{color : 'red'}}>{error.errorForType}</Text></View>}
                           
                            </View>

                            {
                                formData.typeOfMessage !== "" && 
                                <View style={styles.inputCont}>
                                    <Text style={styles.label}>Message</Text>
                                     <TextInput
                                              multiline
                                              numberOfLines={4}
                                              placeholder="Enter Message..."
                                              value={formData.message}

                                              onChangeText={(text) =>
                                               handleChange("message",text)
                                              }
                                              style={[
                                                styles.input,
                                              ]}
                                            />
                                             {error.errorForMessage && <View style={{color : 'red'}}><Text>{error.errorForMessage}</Text></View>}
                                    </View>
                            }

                            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text style={styles.buttonText}>
                                    Submit
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </ScrollView>

        </LayoutWrapper>

        </>
    )
};

export default ContactUs;