import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Pressable } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import LayoutWrapper from "../LayoutWrapper";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminDocumentCard from "./AdminDocumentCard";
import AdminNextKin from "./AdminNextKin";
import Loader from "../Loader/Loader";



const AdminCompliancePage = () => {
  const [allDocuments, setAllDocuments] = useState([]);
  const[nextKin, setNextKin]=useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const {employeeId} = route.params || {};
  const navigation = useNavigation();
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

  const token = data.token;
 
 
  const getAllDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/compliance/getByEmployeeId/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      
      setAllDocuments(response.data.complianceDtos);
      setNextKin(response.data.nextKin);
    } catch (e) {
     console.error("Error getting all documents",e);
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    if(employeeId && id && token){
      getAllDocuments();
    }
  }, [employeeId, id, token]);
    return (
        <LayoutWrapper>
            <ScrollView>
              {
                isLoading ? (<Loader/>) : (
                  <View style={{alignItems : 'center'}}>
                    <Pressable
      onPress={() => navigation.goBack()}
      style={{
        padding: 10,
        alignSelf : 'flex-end'
      }}
    >
      <Feather name="arrow-left" size={24} color="#000" />
    </Pressable>

    {/* documents */}
    <AdminDocumentCard
            title="Passport"
            description="Valid passport for identification"
            status="Not Uploaded"
            allDocuments={allDocuments}
          />
          <AdminDocumentCard
            title="Visa"
            description="Work visa or entry permit documentation"
            status="Not Uploaded"
            allDocuments={allDocuments}
          />
          <AdminDocumentCard
            title="Identity Card"
            description="National ID card"
            status="Not Uploaded"
            allDocuments={allDocuments}
          />

          <AdminDocumentCard
            title="Address Proof"
            description="Utility bill, Rental agreement, or Bank statement"
            status="Not Uploaded"
            allDocuments={allDocuments}
          />

           <AdminNextKin nextKin={nextKin} />
                </View>
                )
              }
                

            </ScrollView>
        </LayoutWrapper>
    )
};


export default AdminCompliancePage;