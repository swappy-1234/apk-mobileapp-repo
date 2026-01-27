import React,{ useState, useEffect, useCallback, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import { AntDesign , FontAwesome6 , MaterialIcons, EvilIcons } from "@expo/vector-icons";
import axios from "axios";
import  close  from "../../assets/close.png";
import LeaveForm from './LeaveForm';
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../Loader/Loader";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Pressable,
} from "react-native"; 
import { Picker } from "@react-native-picker/picker";
import LayoutWrapper from "../LayoutWrapper";
import styles from "../../styles/LeaveManagement/LeaveEmployee";
import DateTimePicker from "@react-native-community/datetimepicker";


const LeaveEmployee = () => {
  const {role, roleColors} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leavesheetData, setLeaveSheetData] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState({
    leaveCount: 0,
    pending: 0,
    approved: 0,
    reject: 0,
  });
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering
  //   {modal}
  const [isLeaveRequest, setIsLeaveRequest] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  //   {pagination}
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [noOfPages, setNoOfPages] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = await AsyncStorage.getItem("companies");
        const tenant = await AsyncStorage.getItem("tenantId");

        if (stored) setData(JSON.parse(stored));
        if (tenant) setId(JSON.parse(tenant));

        console.log("Stored response:", JSON.parse(stored));
      } catch (error) {
        console.error("Error fetching AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // const [employeeId, setEmployeeId] = useState(data.employeeId);
  const employeeId = data.employeeId;
  const token = data?.token;

  const fetchLeaveRequests = async () => {
    console.log("Employee ID:", employeeId); // Add this to check
    if (!employeeId) {
      console.log("Employee ID is missing");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/leaves/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      const leaves = response.data.sort(
        (a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      );
      const totalPages = Math.ceil(leaves.length / 5);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      console.log("leaves", leaves);
      setLeaveRequests(response.data);
      setPaginationData(leaves);
      setNoOfPages(pages);
      setDisplayedPageNo(pages.slice(0, 3));
      setFilteredRequests(leaves.slice(0, 5)); // Start with first page
      setCurrentPage(1);
      const pending = leaves.filter(
        (leave) => leave.leaveStatus === "PENDING"
      ).length;
      const approved = leaves.filter(
        (leave) => leave.leaveStatus === "APPROVED"
      ).length;
      const rejected = leaves.filter(
        (leave) => leave.leaveStatus === "REJECTED"
      ).length;
      // setLeaveRequests(data);
      //   setStatusCount({ pending, approved, rejected });
      //   setCount(leaves.length);
    } catch (error) {
      console.log("Error fetching in leave requests", error);
    } finally {
        setLoading(false);
    }
  };

//   useFocusEffect(
//   React.useCallback(() => {
//     fetchLeaveRequests();
//   }, [])
// );

useEffect(() => {
  if (data?.employeeId && data?.token) {
    fetchLeaveRequests();
    fetchLeaveStatus();
    fetchLeaveSheetData();
  }
}, [data]);


  const handleGoToPage = (pageNum) => {
    const totalPages = noOfPages.length;
    if (!pageNum || pageNum < 1 || pageNum > totalPages) {
      //   setPageError(
      //     `Please enter a valid page number between 1 and ${totalPages}`
      //   );
      return;
    }
    pagination(pageNum);
    // setPageError(false);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  const pagination = (page) => {
    setFilteredRequests(paginationData.slice((page - 1) * 5, page * 5));
    setCurrentPage(page);
    updateDisplayedPages(page);
  };

  const fetchLeaveSheetData = async () => {
    try {
      const response = await axios.get(`${url}/api/getSheets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
      setLeaveSheetData(response.data);
      console.log("Leave sheet Data", leavesheetData);
    } catch (error) {
      console.log("Error fetching in leave sheet data", error);
      setLeaveSheetData([]);
    }
  };

  const fetchLeaveStatus = async () => {
    try {
      const response = await axios.get(
        `${url}/api/leaves/getStatus/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      console.log("Response", response.data);
      setLeaveCounts(response.data);
      console.log("Leave Data", leaveCounts);
    } catch (error) {
      console.log("Error fetching in leave status", error);
    }
  };

  const handleLeaveRequestClick = () => {
    if (leavesheetData.length > 0) {
      setIsLeaveRequest(true);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveStatus();
    fetchLeaveSheetData();
  }, [isLeaveRequest]);

  const applyFilters = useCallback(() => {
    if (!Array.isArray(leaveRequests)) return;
    console.log("leaves for filters", leaveRequests);
    let filtered = [...leaveRequests]; // always start from original data
    console.log("filtered start", filtered);

    console.log("Filtering with Start Date:", startDate);

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((request) => {
        const leaveStart = new Date(request.leaveStartDate);
        const leaveEnd = new Date(request.leaveEndDate);

        // ✅ Check for any overlap between the two date ranges
        return leaveStart <= end && leaveEnd >= start;
      });
    } else if (startDate) {
      // If only start date is selected
      filtered = filtered.filter(
        (request) => new Date(request.leaveEndDate) >= new Date(startDate)
      );
    } else if (endDate) {
      // If only end date is selected
      filtered = filtered.filter(
        (request) => new Date(request.leaveStartDate) <= new Date(endDate)
      );
    }
    // Apply status filters
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(
        (request) => request.leaveStatus === selectedStatus
      );
    }
    console.log("leavefilters", filtered);

    updateStatusCount(filtered);
    const totalPages = Math.ceil(filtered.length / 5);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    setPaginationData(filtered);
    setNoOfPages(pages);
    setDisplayedPageNo(pages.slice(0, 3));
    // Always reset to page 1 after filter change
    setCurrentPage(1);
    setFilteredRequests(filtered.slice(0, 5));
  }, [startDate, endDate, selectedStatus, leaveRequests]);

  // call applyFilters() whenever filter is changed
  const filterByStatus = (status) => {
    setSelectedStatus(status);
    // applyFilters();
  };

  useEffect(() => {
    applyFilters();
  }, [selectedStatus, startDate, endDate, leaveRequests, applyFilters]);

  const updateStatusCount = (filteredData) => {
    console.log("filteredData : ", filteredData);
    const all = filteredData.length;
    const pending = filteredData.filter(
      (leave) => leave.leaveStatus === "PENDING"
    ).length;
    const approved = filteredData.filter(
      (leave) => leave.leaveStatus === "APPROVED"
    ).length;
    const rejected = filteredData.filter(
      (leave) => leave.leaveStatus === "REJECTED"
    ).length;
    // setCount(all);
    // setStatusCount({ pending, approved, rejected });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <AntDesign name="check-circle" size={15} />;
      case "REJECTED":
        return <FontAwesome6 name="times-circle" size={15} />;
      default:
        return <FontAwesome6 name="hourglass-half" size={15} color="orange" />;
    }
  };

  const handleOpenModal = (type, id) => {
    setModalType(type); // Set modal type (leave request or delete confirmation)
    if (type === "delete") {
      setDeleteRequestId(id); // Store the request ID for deletion
    }

    setIsModalOpen(true); // Open modal
  };

  const closeModal = async () => {
    setIsModalOpen(false); // Close modal
    setDeleteRequestId(null); // Reset request ID
    setModalType(null); // Reset modal type

    try {
      const response = await axios.get(
        `${url}/api/leaves/employee/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );
      console.log("Employee", employeeId);
      console.log("API Response Data:", response.data); // Log the response
      // Sort leave requests to put the most recent requests on top
      const leaves = response.data;
      setLeaveRequests(
        leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id))
      );
      setFilteredRequests(leaves); // Initially set all requests to filtered requests
      console.log("Manager Data: ", response.data);
    } catch (error) {
      console.log("Error fetching in leave requests", error);
    } finally {
        setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    // setLoading(true);
    try {
      await axios.delete(`${url}/api/leaves/delete/${deleteRequestId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": id,
        },
      });
      try {
        const response = await axios.get(
          `${url}/api/leaves/employee/${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": id,
            },
          }
        );
        console.log("Employee", employeeId);
        console.log("API Response Data:", response.data); // Log the response
        // Sort leave requests to put the most recent requests on top
        const leaves = response.data;
        setLeaveRequests(
          leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id))
        );
        setFilteredRequests(leaves); // Initially set all requests to filtered requests
        console.log("Manager Data: ", response.data);
      } catch (error) {
        console.log("Error fetching in leave requests", error);
      } finally {
        setLoading(false);
      }
      setIsModalOpen(false); // Close modal after delete
      setModalType(null);
    } catch (error) {
      console.error("Error deleting leave request:", error);
    } finally {
        setLoading(false);
    }
  };

  // Handle changes in date inputs
  const handleStartDateChange = (e, selectedDate) => {
    // const value = e.target.value;
    // console.log("Selected Start Date: ", value);
    // setStartDate(value);
    setShowStartPicker(false); // close picker after selecting
  if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (e, selectedDate) => {
    // const value = e.target.value;
    // console.log("Selected End Date: ", value);
    // setEndDate(value);
     setShowEndPicker(false); // close picker after selecting
  if (selectedDate) setEndDate(selectedDate);
  };


  const clearFilters = () => {
  setStartDate(null);
  setEndDate(null);
  setSelectedStatus("ALL");

  // Restore full original list
  const leaves = [...leaveRequests];
  const totalPages = Math.ceil(leaves.length / 5);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  setPaginationData(leaves);
  setNoOfPages(pages);
  setDisplayedPageNo(pages.slice(0, 3));
  setCurrentPage(1);
  setFilteredRequests(leaves.slice(0, 5));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      console.log("Filtering with Leave Start Date:", startDate);
      console.log("Filtering with Leave End Date:", endDate);
    } else {
      console.log("Please select both leave start and end dates.");
    }
  };

  const renderActions = (request) => {
    if (
      request.leaveStatus === "APPROVED" ||
      request.leaveStatus === "REJECTED"
    ) {
      return (
        <View>
          <MaterialIcons name="horizontal-rule" size={24} />
        </View>
      );
    }

    if (request.leaveStatus === "PENDING") {
      return (
        <View >
          <TouchableOpacity
            onPress={() => handleOpenModal("delete", request.id)}
          >
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  return (
    <>
      <LayoutWrapper>
        <ScrollView>
          {loading && <Loader />}
          <View style={styles.leaveContainer}>
            <View style={{flexDirection : 'row'}}>
            <TouchableOpacity
              onPress={handleLeaveRequestClick}
              disabled={leavesheetData.length === 0}
              style={`leaveButton ${leavesheetData.length === 0 ? "disabled" : ""}`}
            >
              <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Leave Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("LeaveManagement/EmployeeRemainingLeaves")}>
              <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>
                Leave Balance
              </Text>
            </TouchableOpacity>
            </View>
            {/* {filter by status} */}
            <View style = {styles.searchContainer}>
              <Picker
               name = 'status'
               id = "status"        
                onValueChange={(text) => filterByStatus(text)}
                style={styles.filterSelects}
              >
                <Picker.Item value="ALL" label="Select Option" />
                <Picker.Item value="PENDING" label="Pending" disabled={leaveCounts.pending <= 0} />
                <Picker.Item value="APPROVED" label="Approved" disabled={leaveCounts.approved <= 0} />
                <Picker.Item value="REJECTED" label="Rejected" disabled={leaveCounts.reject <= 0} />
              </Picker>

            </View>
            {/* {filter by date range} */}
            <View onSubmit={handleSubmit}>
              <View style={styles.dateFilter}>
                <Text style={{textAlign : 'center', margin : 10,}}>Filter by Date Range</Text>
                <View style={styles.datesAlign}>
                  {/* <TextInput
                    keyboardType="date"
                    value={leaveRequests.leaveStartDate} // Convert to yyyy-MM-dd
                    onChangeText={handleStartDateChange}
                    placeholder="Select start date"
                  /> */}
                   {/* <DateTimePicker
                // value={leaveRequests.leaveStartDate}
                  value={leaveRequests.leaveStartDate ? new Date(leaveRequests.leaveStartDate) : new Date()}

                mode="date"
                onChange={handleStartDateChange}
                 placeholder="Select start date"
              /> */}
                  {/* <TextInput
                    keyboardType="date"
                    value={leaveRequests.leaveEndDate} // Convert to yyyy-MM-dd
                    onChangeText={handleEndDateChange}
                    placeholder="Select end date"
                  /> */}

                  <View>
  <TouchableOpacity onPress={() => setShowStartPicker(true)}>
    <Text  style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  width : 150,
                  marginHorizontal : 10,}}>{startDate ? startDate.toISOString().split('T')[0] : "Select Start Date"}</Text>
  </TouchableOpacity>

  {showStartPicker && (
    <DateTimePicker
      // value={startDate || new Date()}
       value={startDate ? new Date(startDate) : new Date()}
      mode="date"
      
      onChange={handleStartDateChange}
    />
  )}
</View>
 <View>
  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
    <Text  style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  width : 150,
                  marginHorizontal : 10,}}>{endDate ? endDate.toISOString().split('T')[0] : "Select End Date"}</Text>
  </TouchableOpacity>

  {showEndPicker && (
    <DateTimePicker
      // value={startDate || new Date()}
       value={endDate ? new Date(endDate) : new Date()}
      mode="date"
     
      onChange={handleEndDateChange}
    />
  )}
</View>
{/* <TouchableOpacity onPress={clearFilters} style={styles.leaveButton}>
   <Text style={styles.buttonText}>Clear</Text>
</TouchableOpacity> */}
<TouchableOpacity onPress={clearFilters}>
  <EvilIcons name="refresh" size={30} color="black" style={{fontWeight : 'bold'}} />
</TouchableOpacity>



                </View>
              </View>
            </View>

            {/* {leave form} */}
            {isLeaveRequest && (
            <Modal transparent={true} animationType="fade" isVisible={isLeaveRequest}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                <Pressable  onPress={() => setIsLeaveRequest(false)}>
              <Image
                source={close}
                  accessibilityLabel="Close icon"   // ✅ Use a string here
               
              />
              </Pressable>
              <LeaveForm setIsLeaveRequest={setIsLeaveRequest} />
              </View>
              </View>
            </Modal>
            )}
            {/* {delete} */}
            {modalType === "delete" && (
              <Modal isVisible={isModalOpen} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    Are you sure you want to delete this leave?
                  </Text>
                  <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10}}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.buttonCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={handleConfirmDelete}
                    >
                      <Text style={styles.buttonDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
              </Modal>
            )}
            <View>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <View style={[styles.cardContainer, {borderLeftColor : roleColors[role]}]} key={request.id}>
                    <View style={styles.typeStatus}>
                        <Text style={{fontSize : 15,}}>{request.leaveSheet.leaveType}</Text>
                      <Text style={
                        {
                          color : 
                          request.leaveStatus === "APPROVED" ? "green" :
                          request.leaveStatus === "REJECTED" ? "red" :
                          "orange",
                          fontWeight : 'bold'
                          
                        }
                      }>
                        {getStatusIcon(request.leaveStatus)}{" "}
                        {request.leaveStatus}
                      </Text>
                      
                    </View>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#000",
                        marginVertical: 10,
                      }}
                    />
                    <Text>
                      Manager Id: {request.managerId ? request.managerId : "-"}
                    </Text>
                    <Text>
                      Approved / Rejected By :{" "}
                      {request.leaveApprovedManagerName
                        ? request.leaveApprovedManagerName
                        : "-"}
                    </Text>
                    <Text>
                        Start Date : {request.leaveStartDate}
                    </Text>
                     <Text>
                        End Date : {request.leaveEndDate}
                    </Text>
                    <Text>{renderActions(request)}</Text>

                    
                  </View>
                ))
              ) : (
                <View>
                  <Text>No Submissions Found</Text>
                </View>
              )}
            </View>


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
    </>
  );
};

export default LeaveEmployee;
