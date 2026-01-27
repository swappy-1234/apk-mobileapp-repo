import { useState, useEffect } from "react";
import { Text, View,ScrollView, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation} from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import { AntDesign , FontAwesome6 , MaterialIcons, EvilIcons } from "@expo/vector-icons";
import LayoutWrapper from "../LayoutWrapper";
import styles from '../../styles/Compliance/AdminCompliance';
import Loader from "../Loader/Loader";


const AdminCompliance = () => {
    const [allEmployees, setAllEmployees] = useState([]);
 
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [noOfPages, setNoOfPages] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState(false);


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
  console.log("token : ", token);

  const handleGoToPage = (pageNum) => {
    const totalPages = noOfPages.length;
    if (!pageNum || pageNum < 1 || pageNum > totalPages) {
      setPageError(
        `Please enter a valid page number between 1 and ${totalPages}`
      );
      return;
    }
    pagination(pageNum);
    setPageError(false);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  const pagination = (page) => {
    setAllEmployees(paginationData.slice((page - 1) * 5, page * 5));
    setCurrentPage(page);
    updateDisplayedPages(page);
  };

  useEffect(() => {
    if(token && id){
      fetchAllEmployees();
    }
  }, [token,id]);


  const fetchAllEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/v1/employeeManager/complianceEmployees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );

      
      
      const data = response.data.filter(
        (each) => each.employeeId !== employeeId && each.employeeStatus!=='INACTIVE'
      );
      const pageSize = 5;
    const totalPages = Math.ceil(data.length / pageSize);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPaginationData(data);
    setAllEmployees(data.slice(0, pageSize));
    setNoOfPages(pages);
    setDisplayedPageNo(pages.slice(0, 3));
    setCurrentPage(1)
  
    
    } catch (error) {
      console.error("Error fetching all employees data", error);
    } finally {
      setIsLoading(false);
    }
  };

    return (
        
            <ScrollView>
              
                <View style={styles.container}>
                    <Text style={{fontWeight : 600, fontSize : 20}}>Employee Compliance Review</Text>
                    <Text>Review and manage employee compliance documents.</Text>
                   {
                    allEmployees.length > 0 ? (
                        allEmployees.map((each, index) => {
                            return (
                                <View key={index} style={styles.cardContainer}>
                                    <View style={{flexDirection : 'row', justifyContent : 'space-around'}}>
                                      <Text>{each.firstName} {each.lastName}</Text>
                                      <Text>{each.employeeId}</Text>
                                      </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('Compliance/AdminCompliancePage', {employeeId : each.employeeId})} style={styles.button}>
                                        <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>view</Text>
                                    </TouchableOpacity>
                                  
                                    </View>
                            )
                        })
                    ) : (
                        <View>
                            <Text>No Employees Found</Text>
                            </View>
                    )
                   }

                    {/* {pagination} */}
                                {noOfPages.length > 0 && (
                                 <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                   <TouchableOpacity
                                     
                                     disabled={displayedPageNo[0] === 1}
                                     onPress={() => {
                                       const start = Math.max(displayedPageNo[0] - 10, 1);
                                       const end = start + 10;
                                       setDisplayedPageNo(noOfPages.slice(start - 1, end - 1));
                                       setCurrentPage(start);
                                       pagination(start);
                                       // setPageError(false);
                                       setGoToPage("");
                                     }}
                                     style={{
                                      
                                       color: displayedPageNo[0] === 1 ? "#888" : "black",
                                       borderColor: displayedPageNo[0] === 1 ? "#bbb" : "#ccc",
                                       cursor:
                                         displayedPageNo[0] === 1 ? "not-allowed" : "pointer",
                                     }}
                                   >
                                       <Text>
                                     <AntDesign name="double-left" size={18} />
                                     </Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity
                                     
                                     disabled={currentPage <= 1}
                                     onPress={() => {
                                       if (currentPage > 1) {
                                         const prevPage = currentPage - 1;
                                         pagination(prevPage);
                                       //   setPageError(false);
                                         setGoToPage("");
                                         setCurrentPage(prevPage);
                                       }
                                     }}
                                     style={{
                                       
                                       color: currentPage <= 1 ? "#888" : "black",
                                       borderColor: currentPage <= 1 ? "#bbb" : "#ccc",
                                       cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                                     }}
                                   >
                                       <Text><AntDesign name="left" size={18} /></Text>
                                       
                                   </TouchableOpacity>
                   
                                   {/* Page Numbers */}
                                   {displayedPageNo.map((each) => (
                                     <TouchableOpacity
                                       key={each}
                                       onPress={() => {
                                         pagination(each);
                                       //   setPageError(false);
                                         setGoToPage("");
                                         setCurrentPage(each);
                                       }}
                                       
                                     >
                                       <Text style={{ color: "black", fontWeight: "700", fontSize : 20 }}> {each}</Text>
                                     </TouchableOpacity>
                                   ))}
                                   <TouchableOpacity
                                     
                                     disabled={currentPage >= noOfPages.length}
                                     onPress={() => {
                                       if (currentPage < noOfPages.length) {
                                         const nextPage = currentPage + 1;
                                         pagination(nextPage);
                                       //   setPageError(false);
                                         setGoToPage("");
                                         setCurrentPage(nextPage);
                                       }
                                     }}
                                     style={{
                                       
                                       color: currentPage >= noOfPages.length ? "#888" : "black",
                                       borderColor:
                                         currentPage >= noOfPages.length ? "#bbb" : "#ccc",
                                       cursor:
                                         currentPage >= noOfPages.length
                                           ? "not-allowed"
                                           : "pointer",
                                     }}
                                   >
                                    <Text><AntDesign name="right" size={18} /></Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity
                                     
                                     disabled={
                                       displayedPageNo[displayedPageNo.length - 1] >=
                                       noOfPages.length
                                     }
                                     onPress={() => {
                                       const visibleCount = displayedPageNo.length;
                                       const nextStart = displayedPageNo[0] + visibleCount;
                   
                                       // Clamp to total pages
                                       if (nextStart <= noOfPages.length) {
                                         const nextEnd = Math.min(
                                           nextStart + visibleCount - 1,
                                           noOfPages.length
                                         );
                   
                                         // Update displayed pages
                                         setDisplayedPageNo(
                                           noOfPages.slice(nextStart - 1, nextEnd)
                                         );
                   
                                         // Jump to the first page of the new batch
                                         setCurrentPage(nextStart);
                                         pagination(nextStart);
                                       //   setPageError(false);
                                         setGoToPage("");
                                       }
                                     }}
                                     style={{
                                       // backgroundColor:
                                       //   displayedPageNo[displayedPageNo.length - 1] >=
                                       //   noOfPages.length
                                       //     ? "#e0e0e0"
                                       //     : "white",
                                       color:
                                         displayedPageNo[displayedPageNo.length - 1] >=
                                         noOfPages.length
                                           ? "#888"
                                           : "black",
                                       borderColor:
                                         displayedPageNo[displayedPageNo.length - 1] >=
                                         noOfPages.length
                                           ? "#bbb"
                                           : "#ccc",
                                       cursor:
                                         displayedPageNo[displayedPageNo.length - 1] >=
                                         noOfPages.length
                                           ? "not-allowed"
                                           : "pointer",
                                     }}
                                   >
                                    <Text>
                                       <AntDesign name="double-right" size={18} />
                                    </Text>
                                   </TouchableOpacity>
                   
                                   <View>
                                     <View style={{ display: "flex", flexDirection: "column" }}>
                                       <TextInput
                                         type="text"
                                         placeholder={`(1–${noOfPages.length || 1})`}
                                         title="Type a page number to jump automatically"
                                        
                                         value={goToPage}
                                         onChangeText={(e) => {
                                           // const newSize = parseInt(e.target.value) || "";
                   
                                           const value = parseInt(e.target.value.trim()) || "";
                                           setGoToPage(value);
                   
                                           // Only trigger when it's a valid number
                                           const pageNum = parseInt(value);
                                           if (!isNaN(pageNum)) {
                                             handleGoToPage(pageNum);
                                           } else if (value !== "") {
                                           //   setPageError(
                                           //     "Please enter a numeric value for the page"
                                           //   );
                                           } else {
                                           //   setPageError(false);
                                           }
                                         }}
                                         style={{
                                           // border: pageError ? "1px solid red" : "1px solid #ccc",
                                           outline: "none",
                                           textAlign: "center",
                                         }}
                                       />
                   
                                       {/* {pageError && (
                                         <span
                                           style={{
                                             color: "red",
                                             fontSize: "12px",
                                             marginTop: "2px",
                                           }}
                                         >
                                           {pageError}
                                         </span>
                                       )} */}
                                     </View>
                                   </View>
                                 </View>
                               )}
                   
                </View>
            </ScrollView>
       
    )
};

export default AdminCompliance;