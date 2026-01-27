import {useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { MyContext } from '../Context/MyContext';
import { url } from '../../universalApi/universalApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader/Loader';
import LayoutWrapper from '../LayoutWrapper';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/LeaveManagement/EmployeeRemainingLeaves';

const EmployeeRemainingLeaves = () => {
    const { schemaName, role, employeeId,roleColors } = useContext(MyContext);

    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [noOfPages, setNoOfPages] = useState([]);
    const [displayedPageNo, setDisplayedPageNo] = useState([]);
    const [goToPage, setGoToPage] = useState("");
    const [pageError, setPageError] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const navigation=useNavigation("");

    const PAGE_SIZE = 5;
    const [token, setToken] = useState(null);


useEffect(() => {
  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const parsed = JSON.parse(stored);
    setToken(parsed?.token);
  };

  fetchStoredData();
}, []);


    useEffect(() => {
        if (schemaName && token) {
            fetchRemainingLeaves();
        }
        
    }, [schemaName, token]);

    useEffect(() => {
        applySearchAndPagination(1);
    }, [searchTerm, leaves]);

    const fetchRemainingLeaves = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${url}/api/leaves/remaining/employee/leaves/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-Tenant-ID": schemaName,
                    },
                }
            );
            setLeaves(res.data || []);
            let data = res.data;
            // setLeaves(response.data);
            // setFilteredLeaves(response.data);
            let pages = Array.from(
                {
                    length:
                        data.length % 5 === 0
                            ? data.length / 5
                            : Math.floor(data.length / 5) + 1,
                },
                (_, i) => i + 1
            );

            setNoOfPages(pages);
            setDisplayedPageNo(pages.slice(0, 10));
            setFilteredLeaves(
                data.slice((currentPage - 1) * 5, currentPage * 5)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const applySearchAndPagination = () => {
        const filtered = leaves.filter((item) =>
            item.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let data = filtered;

        let pages = Array.from(
            {
                length:
                    data.length % 5 === 0
                        ? data.length / 5
                        : Math.floor(data.length / 5) + 1,
            },
            (_, i) => i + 1
        );

        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setFilteredLeaves(data.slice((1 - 1) * 5, 1 * 5));
    };

    const updateDisplayedPages = (page) => {
        const start = Math.floor((page - 1) / 10) * 10;
        setDisplayedPageNo(noOfPages.slice(start, start + 10));
    };

    const pagination = (nextPage) => {
        setFilteredLeaves(leaves.slice((nextPage - 1) * 5, nextPage * 5));
        updateDisplayedPages(nextPage);
    };

    const handleGoToPage = (pageNum) => {
        const totalPages = noOfPages.length;
        setPageError(false);

        // validate number range
        if (!pageNum || pageNum < 1 || pageNum > totalPages) {
            setPageError(
                `Please enter a valid page number between 1 and ${totalPages}`
            );
            return;
        }

        // jump to that page
        setCurrentPage(pageNum);
        pagination(pageNum);

        // adjust displayed pages dynamically
        const start = Math.floor((pageNum - 1) / 10) * 10;
        const end = Math.min(start + 10, totalPages);
        setDisplayedPageNo(noOfPages.slice(start, end));
        // setGoToPage("");
    };
    return(
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
                        <Text style={{fontSize : 20}}>Employee Remaining Leaves</Text>
                        {leaves.length > 0 && ( <View>
                             <TextInput 
                        placeholder='Search by Leave Type'
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                        style={styles.search}
                        />

                        {/* card details */} 
                        {
                            filteredLeaves.length > 0 ? (

                                filteredLeaves.map((item,index) => ( 
                                    <View key={index} style={[styles.cardContainer, {borderLeftColor : roleColors[role]}]}>
                                        <Text style={{alignSelf : 'flex-end', marginVertical : 10}}>{item.leaveType}</Text>
                                        <View style={styles.rowAlign}>
                                            <Text style={{color : 'grey'}}>TOTAL</Text>
                                            <Text style={{color : 'grey'}}>USED</Text>
                                            <Text style={{color : 'grey'}}>REMAINING</Text>
                                            </View>
                                            <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
                                            <View style={styles.rowAlign}>
                                                <Text>{item.noOfDays}</Text>
                                                <Text>{item.usedDays}</Text>
                                                <Text>{item.remainingDays}</Text>
                                                </View>
                                        </View> 
                                ))
                            ) : (
                                <>
                                </>
                            )
                        }
                            </View>
                        )}

                         {/* {pagination} */}
            {noOfPages.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  <Text>
                    <AntDesign name="left" size={18} />
                  </Text>
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
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: 20,
                        borderWidth : 1,
                        

                      }}
                    >
                      {" "}
                      {each}
                    </Text>
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
                  <Text>
                    <AntDesign name="right" size={18} />
                  </Text>
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
    )
};

export default EmployeeRemainingLeaves;