import { useState, useEffect } from "react";
import {Text, View, TextInput,ScrollView, Pressable } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { url } from "../../universalApi/universalApi";
import axios from "axios";
import LayoutWrapper from "../LayoutWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from '../../styles/Invoice/InvoiceDetails';
import Loader from "../Loader/Loader";


const InvoiceDetails = () => {
    const route = useRoute();
    const {id} = route.params || {};
    const navigation = useNavigation();
    const [invoiceData, setInvoiceData] = useState(null);
  const[isLoading,setIsLoading]=useState(false);
  const [hover,setHover]=useState(false);
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
console.log("id", id);

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${url}/api/invoices/${id}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": isId,
          },
        }
        );
        setInvoiceData(response.data);
      } catch (error) {
        console.error("Error fetching Invoice Details:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [id, isId, token]);

    return (
        <LayoutWrapper>
            <ScrollView>
               {isLoading && <Loader />}
              {
                invoiceData !== null && (
 <View style={styles.container}>
                    <Pressable
                          onPress={() => navigation.goBack()}
                          style={{
                            padding: 10,
                            alignSelf : 'flex-end',
                          }}
                        >
                          <Feather name="arrow-left" size={24} color={roleColors[role]} />
                        </Pressable>
                        <Text style={[styles.heading, {color : roleColors[role]}]}>Invoice Details</Text>
                        <View style={styles.cardContainer}>
                            <Text style={[styles.sideHeading, {color : roleColors[role]}]}>Invoice</Text>
                            <View style={styles.alignStyling}> 
                                <Text>Invoice Number : </Text>
                                <Text>{invoiceData?.invoiceNumber}</Text>
                            </View>
                             <View style={styles.alignStyling}>
                                <Text>From Company : </Text>
                                <Text>{invoiceData?.companyName}</Text>
                            </View>
                             <View style={styles.alignStyling}>
                                <Text>Issue Date : </Text>
                                <Text>{invoiceData?.issueDate}</Text>
                            </View>
                             <View style={styles.alignStyling}>
                                <Text>Due Date : </Text>
                                <Text>{invoiceData?.dueDate}</Text>
                            </View>
                             <View style={styles.alignStyling}>
                                <Text>Tax Amount : </Text>
                                <Text>{invoiceData?.tax?.toFixed(2)}</Text>
                            </View>
                             <View style={styles.alignStyling}>
                                <Text>Total Amount : </Text>
                                <Text style={{color : roleColors[role], fontWeight : '600', fontSize : 15}}>{invoiceData?.country === "UK" ? "£" : "₹"}
                    {invoiceData?.totalAmount?.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* client details */}
                        <View style={styles.cardContainer}>
                            <Text style={[styles.sideHeading, {color : roleColors[role]}]}>Client Details</Text>
                            <View style={styles.alignStyling}>
                                <Text>To Company : </Text>
                                <Text>{invoiceData?.client?.clientName}</Text>
                            </View>
                            <View style={styles.alignStyling}>
                                <Text>Email : </Text>
                                <Text>{invoiceData?.client?.clientEmail}</Text>
                            </View>
                            <View style={styles.alignStyling}>
                                <Text>Address : </Text>
                                <Text>{invoiceData?.client?.clientAddress}</Text>
                            </View>
                        </View>

                        {/* Invoice Items */}
                        <View style={styles.cardContainer}>
                            <Text style={[styles.sideHeading, {color : roleColors[role]}]}>Invoice Items</Text>
                            {
                                invoiceData?.invoiceItems?.length > 0 ? (
                                    
                                invoiceData.invoiceItems.map((item, index) => (
                                    <View key={index}>
                                        <View style={styles.alignStyling}> 
                                <Text>Description : </Text>
                                <Text>{item.description}</Text>
                            </View>
                            <View style={styles.alignStyling}>
                                <Text>Qunatity : </Text>
                                <Text>{item.quantity}</Text>
                            </View>
                            <View style={styles.alignStyling}>
                                <Text>Unit Price : </Text>
                                <Text> {invoiceData?.country === "UK" ? "£" : "₹"}
                            {item.unitPrice.toFixed(2)}</Text>
                            </View>
                            <View style={styles.alignStyling}>
                                <Text>Total Price : </Text>
                                <Text>{invoiceData?.country === "UK" ? "£" : "₹"}
                            {(item.quantity * item.unitPrice).toFixed(2)}</Text>
                            </View>
                                        </View>

                                ))
                            
                                ) : (
                                    <>
                                    <Text>No Invoice Items Available</Text>
                                    </>
                                )
                            }
                        </View>
                </View>
                )
              }
               
            </ScrollView>

        </LayoutWrapper>
    )
};

export default InvoiceDetails;