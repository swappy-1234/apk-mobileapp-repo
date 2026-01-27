import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LayoutWrapper from "../LayoutWrapper";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import styles from '../../styles/Compliance/PensionDetailsView';
import Loader from "../Loader/Loader";
import roleColors from "../Colors/Colors";


const PensionDetailsView = () => {
    const route = useRoute();
    const {employeeId} = route.params || {};
    const navigation = useNavigation();
    const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState("");
  const [id, setId] = useState("");
  console.log("id : ", employeeId);

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

  const token = data.token;
  const role = data.role;


   useEffect(() => {
    if (token && id && employeeId) {
      fetchPensionRecords(employeeId);
    }
  }, [token, id, employeeId]);

  const fetchPensionRecords = async (empId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/pension/employee/records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
          params: { employeeId: empId },
        }
      );
      setRecords(response.data);
      setFilterData(response.data);
      console.log("res : ", response.data);
    } catch (error) {
      console.error("Error fetching all records", error);
      console.log("11");
    } finally {
      setIsLoading(false);
    }
  };

 

  const filterStatus = () => {
    let data = records.filter((each) =>
      each.status.toUpperCase().includes(status.toUpperCase())
    );
    setFilterData(data);
  };

  useEffect(() => {
    filterStatus();
  }, [status]);


    return (
        <LayoutWrapper>
            <ScrollView>
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

                        <Text style={styles.heading}>Pension Details</Text>
{isLoading && <Loader />}
                          <View style={styles.searchContainer}>
              <Picker
                onValueChange={(text) =>
                  setStatus(text)
                }
                style={styles.filterSelects}
              >
                <Picker.Item value="" label="Select Pension Status" />
                <Picker.Item value="OPT_IN" label="OPT IN" />
                <Picker.Item value="OPT_OUT" label="OPT OUT" />
              </Picker>
            </View>

            <View style={styles.card}>
                <Text>Employee Name : {records[0]?.firstName} {records[0]?.lastName}</Text>
                <Text>Employee ID : {records[0]?.employeeId}</Text>
                <Text>Working Country : {records[0]?.workingCountry}</Text>
                <Text>Department : {records[0]?.department}</Text>
                <Text>Designation : {records[0]?.jobRole}</Text>
            </View>


            {
                filterData.length > 0 ? (
                    filterData.map((each,index) => {
                        return (
                            <View key={index} style={styles.cardContainer}>
                                <Text>{each.status}</Text>
                                <Text>{each.date}</Text>
                                </View>
                        )
                    })
                ) : (
                    <>
                    <Text>No Employees Found</Text>
                    </>
                )
            }

                    
                </View>
            </ScrollView>
        </LayoutWrapper>
    )
};

export default PensionDetailsView;