import {useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../universalApi/universalApi';
import axios from 'axios';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import roleColors from '../Colors/Colors';
import LayoutWrapper from '../LayoutWrapper';
import styles from '../../styles/MyPlan/MyPlan';
import Loader from '../Loader/Loader';


const Plan = () => {
   const [isLoading, setIsLoading] = useState(true);
     const [clientDetails, setClientDetails] = useState("");
     const navigation = useNavigation();
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

  const role = storedData.role;
  const token = storedData.token;

   const handlePopUpCancel = () => {
    scrollToGetInTouchBlock("price");
    // setIsBuyNow(false);
  };

  const scrollViewRef = useRef(null);
const getInTouchRef = useRef(null);

  const scrollToGetInTouchBlock = () => {
  getInTouchRef.current?.measureLayout(
    scrollViewRef.current,
    (x, y) => {
      scrollViewRef.current.scrollTo({
        y: y,
        animated: true,
      });
    },
    () => {
      console.log("Scroll failed");
    }
  );
};

  
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
          if (res.data.duration === "Yearly" || (res.data.duration === "Monthly" && res.data.plan === "Pro" && res.data.task && res.data.timeSheet && res.data.invoice)) {
            // setIsMonthly(false);
          }
          setIsLoading(false);
        } catch (error) {
          console.log("Error fetching client details:", error);
        }
      };
      fetchClientDetails();

    }
  }, [id]);


    return(
        <LayoutWrapper>
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
              {isLoading && <Loader />}
                <View style={styles.container}>
                    <Text style={[styles.heading, {color : roleColors[role]}]}>Current Plan Details</Text>
                    <View style={styles.card}>
                        <View style={styles.cardAlign}>
                            <Text>Plan</Text>
                            <Text> {clientDetails.plan
                  ? clientDetails.plan.charAt(0).toUpperCase() + clientDetails.plan.slice(1)
                  : ""}</Text>
                        </View>
                         {
                            clientDetails.price > 0 && (
                                <View style={styles.cardAlign}>
                            <Text>Price</Text>
                            <Text>£{clientDetails.price}</Text>
                        </View>
                            )
                         }
                         <View style={styles.cardAlign}>
                            <Text>Employees Count</Text>
                            <Text>{clientDetails.noOfEmployees}</Text>
                        </View>
                         <View style={styles.cardAlign}>
                            <Text>Type of Plan</Text>
                            <Text> {clientDetails.duration}</Text>
                        </View>
                         <View style={styles.cardAlign}>
                            <Text>Start Date</Text>
                            <Text>  {clientDetails.starDate
                  ? new Date(clientDetails.starDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                  : ""}</Text>
                        </View>
                         <View style={styles.cardAlign}>
                            <Text>Next Billing</Text>
                            <Text> {clientDetails.endDate
                  ? new Date(clientDetails.endDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                  : ""}</Text>
                        </View>
                    </View>
                    <Text style={styles.para}>
                        Your trial is just the beginning. connect with us to unlock the full power of seamless workforce management.
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("ContactUs/ContactUs")} style={styles.button}>
                        <Text style={styles.buttonText}>
                                   Contact US
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </LayoutWrapper>
    )
};

export default Plan;