import { useState, useEffect, useContext } from "react";
import {Text, View, TextInput, Pressable, ScrollView} from 'react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../universalApi/universalApi";
import DocumentCard from "./DocumentCard";
import LayoutWrapper from "../LayoutWrapper";
import NextKin from "./NextKin";
import Loader from "../Loader/Loader";
import { Feather } from "@expo/vector-icons";
import { MyContext } from "../Context/MyContext";

const EmployeeCompliance = () => {
  const {roleColors,role} = useContext(MyContext);
    const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const[nextKin, setNextKin]=useState(null);
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

  const employeeId = storedData.employeeId;
  const token = storedData.token;



 

  
  console.log("Cppppp",employeeId);
  

  const getAllDocuments = async () => {
    setLoading(true);
    console.log("Cpppppsss",employeeId);
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
      console.log("nextkin",response.data.nextKin);
      setAllDocuments(response.data.complianceDtos);
      setNextKin(response.data.nextKin);
    } catch (e) {
      console.error("Error getting all documents", e);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    if(employeeId){
      getAllDocuments();
    }
  }, [employeeId]);


    return (
        
            <ScrollView>
              {
                loading ? (<Loader/>) : (
                  <View style={{justifyContent : 'center', alignItems : 'center'}}>
                     {/* <Pressable
                          onPress={() => navigation.goBack()}
                          style={{
                            padding: 10,
                            alignSelf : 'flex-end',
                          }}
                        >
                          <Feather name="arrow-left" size={24} color={roleColors[role]} />
                        </Pressable> */}
                    {/* document cards */}
                    <View>
                         <DocumentCard
              key={2}
              getAllDocuments={getAllDocuments}
              title="Passport"
              description="Valid passport for identification"
              status="Not Uploaded"
              allDocuments={allDocuments}
            />
            <DocumentCard
              key={1}
              title="Visa"
              description="Work visa or entry permit documentation"
              status="Not Uploaded"
              getAllDocuments={getAllDocuments}
              allDocuments={allDocuments}
            />
            <DocumentCard
              key={3}
              title="Identity Card"
              description="National ID card"
              status="Not Uploaded"
              getAllDocuments={getAllDocuments}
              allDocuments={allDocuments}
            />

            <DocumentCard
              key={4}
              title="Address Proof"
              description="Utility bill, Rental agreement, or Bank statement"
              status="Not Uploaded"
              getAllDocuments={getAllDocuments}
              allDocuments={allDocuments}
            />

                    </View>
                     <NextKin nextKin={nextKin} getAllDocuments={getAllDocuments}/>
                </View>
                )
              }
                
            </ScrollView>
       
    )
}

export default EmployeeCompliance;