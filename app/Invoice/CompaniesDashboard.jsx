import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import LayoutWrapper from "../LayoutWrapper";
import { useNavigation } from "@react-navigation/native";
import AddCompany from "./AddCompany";
import UpdateCompany from "./UpdateCompany";
import Modal from 'react-native-modal';
import styles from '../../styles/Invoice/CompaniesDashboard';
import Loader from "../Loader/Loader";

const CompaniesDashboard = () => {
    const [companies, setCompanies] = useState([]);
  const [hover, setHover] = useState(null);

  const navigation = useNavigation();
  const [isRegister, setIsRegister] = useState(false);
  const [isUpdateCompany, setIsCompanyUpdate] = useState(false);
  const [updateId, setIsUpdateId] = useState(null);
  const [companyDelete, setCompanyDelete] = useState({
    isDelete: false,
    companyId: "",
    companyName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [noOfPages, setNoOfPages] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const role = storedData.role;

     useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/companyDetails/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        });

        let data = response.data.reverse();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPaginationData(sortedData);
        const pageSize = 5;
        const totalPages = Math.ceil(sortedData.length / pageSize);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        setCompanies(sortedData.slice(0, pageSize));
        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isUpdateCompany || !isRegister || id || token) {
      fetchCompanies();
    }
  }, [ isRegister, id, token]);

  const fetchCompaniesAfterUpdate = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/companyDetails/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        });

        let data = response.data.reverse();
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPaginationData(sortedData);
        let pageSize = 5;
        const totalPages = Math.ceil(sortedData.length / pageSize);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        pageSize=currentPage*5;
        setCompanies(sortedData.slice(pageSize-5, pageSize));
        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setCurrentPage(currentPage);
        setIsCompanyUpdate(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${url}/api/companyDetails/deleteById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setIsLoading(false);
      setCompanyDelete({
        isDelete: false,
        companyId: "",
        companyName: "",
      });
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const pagination = (nextPage) => {
    setCompanies(paginationData.slice((nextPage - 1) * 5, nextPage * 5));
    setCurrentPage(nextPage);
    updateDisplayedPages(nextPage);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  
    return (
        <LayoutWrapper>
            <ScrollView>
               {isLoading && <Loader />}
                <View style={styles.container}>
                   <Modal
  visible={isRegister}
  transparent
  animationType="slide"
  onRequestClose={() => setIsRegister(false)}
>
  <View style={styles.overlay}>
    <View style={styles.modalBox}>
      <AddCompany setIsRegister={setIsRegister} />
    </View>
  </View>
</Modal>

       <Modal
      visible={companyDelete.isDelete}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>

          {/* Close Button */}
          <View style={styles.closeContainer}>
            <TouchableOpacity
              onPress={() =>
                setCompanyDelete({
                  isDelete: false,
                  companyId: "",
                  companyName: "",
                })
              }
            >
              <Text style={[styles.closeText, { color: roleColors[role] }]}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Message */}
          <Text style={styles.text}>
            Are you sure you want to delete the company{" "}
            <Text style={styles.bold}>
              {companyDelete.companyName}
            </Text>
            ?
          </Text>

          <Text style={styles.text}>
            This action will permanently remove all company data.{" "}
            <Text style={styles.bold}>
              This information cannot be recovered.
            </Text>
          </Text>

          <Text style={styles.text}>
            If you are sure, click <Text style={styles.bold}>Delete</Text> to continue.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.deleteBtn]}
              onPress={() => handleDelete(companyDelete.companyId)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={() =>
                setCompanyDelete({
                  isDelete: false,
                  companyId: "",
                  companyName: "",
                })
              }
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>

<Pressable
              onPress={() => navigation.goBack()}
              style={{
                padding: 10,
                alignSelf: "flex-end",
              }}
            >
              <Feather name="arrow-left" size={24} color={roleColors[role]} />
            </Pressable>
    <Text style={[styles.heading, {color : roleColors[role]}]}>Companies Dashboard</Text>
    <TouchableOpacity onPress={() => setIsRegister(true)} style={styles.navigateButton}>
        <Text style={[styles.navigateButtonText, {backgroundColor : roleColors[role]}]}>
            Register Company
        </Text>
    </TouchableOpacity>

   {
    companies.length > 0 ? (
        companies.map((company) => (
            <View key={company.id} style={styles.cardContainer}>
              <View style={styles.rowStyling}>
                <View>
                  
                    <Text style={styles.headingText}>{company.companyName}</Text>
                    <Text style={styles.emailText}>{company.companyEmail}</Text>
                    </View>
                       <Text style={styles.countryText}>{company.country}</Text>
                       </View>
                        <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
                    <View>
                      <View style={styles.styling}>
                      <Text>Company Code : </Text>
                         <Text>{company.companyCode}</Text>
                         </View>
                         <View style={styles.styling}>
                         <Text>GST NO : </Text>
                    <Text>{company.gstNo}</Text>
                    </View>
                        </View>
                        <View style={styles.styling}>
                          <Text>Company Address : </Text>
                    <Text>{company.companyAddress}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <TouchableOpacity onPress={() => {
                        setIsUpdateId(company.id);
                                  setIsCompanyUpdate(true);
                    }}  style={[styles.buttonStatus, styles.approve]}>
                        <Text style={[styles.buttonTextStatus, styles.approveText]}>
                            Update
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCompanyDelete({
                                    isDelete: true,
                                    companyId: company.id,
                                    companyName: company.companyName,
                                  })} style={[styles.buttonStatus, styles.reject]}>
                        <Text style={[styles.buttonTextStatus, styles.rejectText]}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                        </View>
                    
                </View>
        ))
    ) : (
        <>
        <Text>No Company Data Found</Text>
        </>
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

                                                     
        <Modal visible={isUpdateCompany}
  transparent
  animationType="slide"
  onRequestClose={() => setIsCompanyUpdate(false)}>
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
 <UpdateCompany
            updateId={updateId}
            setIsCompanyUpdate={setIsCompanyUpdate}
            fetchCompaniesAfterUpdate={fetchCompaniesAfterUpdate}
          />
      </View>
    </View>
         
        </Modal>
      

                </View>
            </ScrollView>
        </LayoutWrapper>
    )
};

export default CompaniesDashboard;