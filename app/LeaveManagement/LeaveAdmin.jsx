import { ScrollView, View, Text, TouchableOpacity,TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import roleColors from "../Colors/Colors";
import { FontAwesome, MaterialIcons, EvilIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import LayoutWrapper from "../LayoutWrapper";
import styles from '../../styles/LeaveManagement/LeaveAdmin';
import DateTimePicker from "@react-native-community/datetimepicker";
import Loader from "../Loader/Loader";

const LeaveAdmin = () => {
     const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState(0);
  const [isLeaveSheet, setIsLeaveSheet] = useState(false);
  const [leaveCounts, setLeaveCounts] = useState({
    leaveCount: 0,
    pending: 0,
    approved: 0,
    reject: 0,
  });
  const [statusCount, setStatusCount] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isEditing, setIsEditing] = useState({}); //state to track editing
  const [showModal, setShowModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({leaveReason : ""});
  const [selectedStatus, setSelectedStatus] = useState("ALL");
   const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [pageError, setPageError] = useState(false);
  
  const [lopModal, setLopModal] = useState(false);
  const [lop, setLop] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [eachId, setEachId] = useState("");
 
  const [noOfPages, setNoOfPages] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [hover, setHover]=useState(null);
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
  const managerId = storedData.employeeId;
   const managerName = storedData.firstName + " " + storedData.lastName;
  console.log("token : ", token);


  // open modal and set selected leave ID
  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setShowModal(true);
  };

  // close the modal reset reason
  const closeModal = () => {
    setShowModal(false);
    setRejectionReason("");
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

  useEffect(() => {
    fetchData();
    fetchLeaveStatusForManager();
  }, [managerId]);

  const fetchLeaveStatusForManager = async () => {
    try {
      let api =
        role.toLowerCase() === "Admin".toLowerCase()
          ? `${url}/api/leaves/getStatusForAdmin/${managerId}`
          : `${url}/api/leaves/getStatusForManager/${managerId}`;
      const response = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
     
      setLeaveCounts(response.data);
     

    
    } catch (error) {
     
    }
  };

  const fetchData = async () => {
     if (!role || !managerId || !token) {
    return; // wait until data is ready
  }
    setLoading(true);
    try {
      let api =
        role.toLowerCase() === "Admin".toLowerCase()
          ? `${url}/api/leaves/admin/${managerId}`
          : `${url}/api/leaves/manager/${managerId}`;
      const response = await axios.get(api, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": id,
        },
      });

      const leaves = response.data.sort(
        (a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      );
      setData(
        leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id))
      ); // Assuming 'createdAt' is available
      setFilteredData(
        leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id))
      );

      const totalPages = Math.ceil(leaves.length / 5);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
     
      setPaginationData(leaves);
      setNoOfPages(pages);
      setDisplayedPageNo(pages.slice(0, 3));
      setFilteredRequests(leaves.slice(0, 5)); // Start with first page
      setCurrentPage(1);
      setFilteredRequests(leaves);
      const total = leaves.length;
      const pending = leaves.filter(
        (leave) => leave.leaveStatus === "PENDING"
      ).length;
      const approved = leaves.filter(
        (leave) => leave.leaveStatus === "APPROVED"
      ).length;
      const rejected = leaves.filter(
        (leave) => leave.leaveStatus === "REJECTED"
      ).length;
      setCount(total);
      setStatusCount({ pending, approved, rejected });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);

    try {
      let api =
        role.toLowerCase() === "Admin".toLowerCase()
          ? `${url}/api/leaves/admin/${managerId}`
          : `${url}/api/leaves/manager/${managerId}`;
      await axios.put(
        `${url}/api/leaves/approve/${id}?managerName=${encodeURIComponent(
          managerName
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error approving leave request:", error);
    } finally {
      setLoading(false);
      setLopModal(false);
    }
  };

  const approveLeave = (id) => {
   

    const leave = filteredData.find((item) => item.id === id);
   
    if (leave && leave.lopDays > 0) {
      setLopModal(true);
      setLop(leave?.lopDays);
      setEmployeeId(leave?.employeeId);
      setEachId(leave?.id);
      return;
    } else {
      handleApprove(id);
    }
  };

  // Handle rejection with backend integration
  const handleReject = async () => {
    
    
    if (!rejectionReason) {
      alert("Please provide a rejection reason.");
      return;
    }
closeModal();
    setLoading(true);

    try {
      let api =
        role.toLowerCase() === "Admin".toLowerCase()
          ? `${url}/api/leaves/admin/${managerId}`
          : `${url}/api/leaves/manager/${managerId}`;
     

      await axios.put(
        `${url}/api/leaves/reject/${selectedLeaveId}/${rejectionReason}?managerName=${encodeURIComponent(
          managerName
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );

      fetchData();
      
    } catch (error) {
      console.error("Error rejecting leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in date inputs
  const handleStartDateChange = (selectedDate) => {
    
    setShowStartPicker(false); // close picker after selecting
  if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = ( selectedDate) => {
     setShowEndPicker(false); // close picker after selecting
  if (selectedDate) setEndDate(selectedDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const applyFilters = useCallback(() => {
     if (!Array.isArray(Data)) return;
     console.log("leaves for filters", Data);
     let filtered = [...Data]; // always start from original data
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
   }, [startDate, endDate, selectedStatus, Data]);

 const filterByStatus = (status) => {
    setSelectedStatus(status);
    // applyFilters();
  };

  useEffect(() => {
    if (Data.length > 0) {
      applyFilters();
    }
  }, [applyFilters, Data]); // ✅ Runs when any filter changes

  const updateStatusCount = (filteredData) => {
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
    setCount(all);
    setStatusCount({ pending, approved, rejected });
  };

  const headers = [
    "Employee",
    "Employee ID",
    "Start Date",
    "End Date",
    "Leave Type",
    "Days",
    "LOP",
    "Status",
    "Action",
  ];
//   const renderRowData = (data) => {
//     const rowData = [
//       { key: "firstName", value: data.firstName },
//       { key: "employeeId", value: data.employeeId },
//       { key: "leaveStartDate", value: data.leaveStartDate },
//       { key: "leaveEndDate", value: data.leaveEndDate },
//       { key: "leaveType", value: data.leaveSheet.leaveType },
//       { key: "duration", value: data.duration },
//       { key: "lopDays", value: data.lopDays },
//     ];

//     return rowData.map((item) => <View key={item.key}>{item.value}</View>);

//   };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "admin-approved";
      case "PENDING":
        return "admin-pending";
      case "REJECTED":
        return "admin-rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FontAwesome name="check-circle" className="admin-approve-icon" />;
      case "PENDING":
        return <FontAwesome name="hourglass-half" className="admin-pending-icon" />;
      case "REJECTED":
        return <FontAwesome name="times-circle" className="admin-reject-icon" />;
      default:
        return null;
    }
  };

  const renderActions = (data) => {
    // Check if the request is being edited (edit mode is toggled)

    if (
      (data.leaveStatus === "APPROVED" || data.leaveStatus === "REJECTED") &&
      data.leaveType !== "SICK"
    ) {
      return (
        <View style={styles.adminStatus}>
          <MaterialIcons name="horizontal-rule" />
        </View>
      );
    } else if (
      (data.leaveStatus === "APPROVED" || data.leaveStatus === "REJECTED") &&
      data.leaveType === "SICK"
    ) {
      return (
        <View style={styles.adminStatus}>
          <MaterialIcons name="horizontal-rule" />
        </View>
      );
    }

    // Default actions for when the request is not in edit mode
    if (data.leaveStatus === "PENDING" && data.leaveType === "SICK") {
      return (
        <View style={styles.adminStatus}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => approveLeave(data.id)} // Approve the request
          >
            <Text style={styles.approveText}>Approve</Text>
            
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => openRejectModal(data.id)} // Open the rejection modal
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.adminStatus}>
          <TouchableOpacity
              style={styles.approveBtn}
            onPress={() => approveLeave(data.id)} // Approve the request
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => openRejectModal(data.id)} // Open the rejection modal
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

   const clearFilters = () => {
  setStartDate(null);
  setEndDate(null);
  setSelectedStatus("ALL");
   }

  const MAX_CHARS = 200;
  const reasonText = rejectionReason.leaveReason || "";
  const reasonLength = reasonText.length;
  const isOverLimit = reasonLength > MAX_CHARS;



    return (
        <>
        <LayoutWrapper>
            <ScrollView>
              {loading && <Loader />}
                <View style={styles.leaveContainer}>
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
                <View style={{flexDirection : 'row'}}>

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
<TouchableOpacity onPress={clearFilters}>
  <EvilIcons name="refresh" size={30} color="black" style={{fontWeight : 'bold'}} />
</TouchableOpacity>



                </View>
              </View>
            </View>

            {/* card */}

            <View>
                {
                    filteredRequests.length > 0 ? (
                        filteredRequests.map((each) => (
                            <View key={each.id} style={styles.cardContainer}>
                                <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                                    <View>
                                <Text>Employee Name : {each.firstName}</Text>
                                 <Text>Employee Id : {each.employeeId}</Text>
                                 </View>
                                  <Text style={
                        {
                          color : 
                          each.leaveStatus === "APPROVED" ? "green" :
                          each.leaveStatus === "REJECTED" ? "red" :
                          "orange",
                          fontWeight : 'bold'
                          
                        }
                      }>{getStatusIcon(each.leaveStatus)}
                            {each.leaveStatus}</Text>
                                </View>
                                <Text>Start Date : {each.leaveStartDate}</Text>
                                <Text>End Date : {each.leaveEndDate}</Text>
                               <Text>Leave Status : {each.leaveSheet.leaveType}</Text>
                                <Text>Duration : {each.duration}</Text>
                                <Text>Lop Days : {each.lopDays}</Text>
                               
                            <Text>{renderActions(each)}</Text>



                                </View>
                        ))
                    ) : (
                        <View>
                            </View>
                    )
                }
            </View>

            {/* lop modal */}

            {lopModal && (
  <Modal transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.modalBox}>

        {/* Close Icon */}
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setLopModal(false)}
        >
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>
          This {employeeId} has {lop} days
        </Text>

        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => handleApprove(eachId)}
        >
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>

      </View>
    </View>
  </Modal>
)}

{/* delete modal */}

{showModal && (
  <Modal transparent animationType="slide" >
    <View style={styles.overlay}>
      <View style={styles.rejectBox}>

        <Text style={styles.rejectTitle}>REJECT LEAVE REQUEST</Text>

        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Enter rejection reason..."
          value={reasonText}
          onChangeText={(text) =>
            setRejectionReason({
              ...rejectionReason,
              leaveReason: text,
            })
          }
          style={[
            styles.textArea,
            isOverLimit && { borderColor: "red" },
          ]}
        />

        <Text
          style={[
            styles.counter,
            isOverLimit && { color: "red", fontWeight: "bold" },
          ]}
        >
          {reasonLength}/{MAX_CHARS}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={closeModal}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isOverLimit || reasonLength === 0}
            style={[
              styles.rejectBtn,
              (isOverLimit || reasonLength === 0) && styles.disabledBtn,
            ]}
            onPress={handleReject}
          >
            <Text
              style={[
                styles.rejectText,
                (isOverLimit || reasonLength === 0) && { color: "#666" },
              ]}
            >
              Confirm Reject
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  </Modal>
)}

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
    )
}

export default LeaveAdmin;