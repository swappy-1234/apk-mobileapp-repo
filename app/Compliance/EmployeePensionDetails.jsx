import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Pressable} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  EvilIcons,
  Feather
} from "@expo/vector-icons";
import LayoutWrapper from "../LayoutWrapper";
import { router } from 'expo-router';
import styles from '../../styles/Compliance/EmployeePensionDetails';
import Loader from "../Loader/Loader";

const EmployeePensionDetails = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allBranches, setAllBranches] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [noOfPages, setNoOfPages] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState(false);
  const [filter, setFilter] = useState({ branch: "", status: "" });
  const [filterData, setFilterData] = useState([]);

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
  const role = data.role;
  const employeeId = data.employeeId;

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
    if (token && id) {
      fetchAllEmployees();
    }
  }, [token, id]);

  const fetchAllEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/pension/latest-pension`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
      console.log("All Employees Data:", response.data);
      const data = response.data.filter(
        (each) =>
          each.employeeId !== employeeId && each.employeeStatus !== "INACTIVE"
      );
      const pageSize = 5;
      const totalPages = Math.ceil(data.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      setPaginationData(data);
      setAllEmployees(data.slice(0, pageSize));
      setAllEmployees(data);
      setFilterData(data);
      setNoOfPages(pages);
      setDisplayedPageNo(pages.slice(0, 3));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching all employees data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchAllBranches();
    }
  }, [token, id]);

  const fetchAllBranches = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/branch`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
      console.log("All branches:", response.data);

      const data = response.data.filter(
        (each) =>
          each.employeeId !== employeeId && each.employeeStatus !== "INACTIVE"
      );
      setAllBranches(data);
    } catch (error) {
      console.error("Error fetching all employees data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBranchWithStatus = () => {
    let data = allEmployees;
    data = data.filter((each) => each.branch.includes(filter.branch));
    data = data.filter((each) => each.status.includes(filter.status));
    setFilterData(data);
  };
  useEffect(() => {
    filterBranchWithStatus();
  }, [filter]);

  return (
    <LayoutWrapper>
      <ScrollView>
        {isLoading && <Loader />}
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
          <Text style={styles.heading}>Employee Pension Details</Text>
          <View style={styles.alignStyling}>
            <View style={styles.searchContainer}>
              <Picker
                onValueChange={(text) =>
                  setFilter((prev) => ({ ...prev, branch: text }))
                }
                style={styles.filterSelects}
              >
                <Picker.Item value="" label="Select Branch" />
                {allBranches.map((branch) => (
                  <Picker.Item
                    key={branch.id}
                    value={branch.branchName}
                    label={branch.branchName}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.searchContainer}>
              <Picker
                onValueChange={(text) =>
                  setFilter((prev) => ({ ...prev, status: text }))
                }
                style={styles.filterSelects}
              >
                <Picker.Item value="" label="Select Pension Status" />
                <Picker.Item value="OPT_IN" label="OPT IN" />
                <Picker.Item value="OPT_OUT" label="OPT OUT" />
              </Picker>
            </View>
          </View>
         {
            filterData.length > 0 ? (
                filterData.map((each, index) => {
                   return (
                     <View key={index} style={styles.cardContainer}>
                        <Text>Employee Name : {each.firstName} {each.lastName}</Text>
                        <Text>Employee ID : {each.employeeId}</Text>
                        <Text>Branch : {each.branch}</Text>
                        <Text>Job Role : {each.jobRole}</Text>
                        <Text>Status : {each.status}</Text>
                        <Text>Date : {each.date}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Compliance/PensionDetailsView', {employeeId : each.employeeId})} style={styles.button}>
                            <Text style={styles.buttonText}>view</Text>
                        </TouchableOpacity>
                        
                        </View>

                   )
                })
            ) : (
                <>
                <Text>No Employees Found</Text>
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
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
};

export default EmployeePensionDetails;
