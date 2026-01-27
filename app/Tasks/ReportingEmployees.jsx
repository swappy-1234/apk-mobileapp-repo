import { useState, useEffect, useContext } from "react";
import { Text, View, ScrollView, Pressable, TextInput, TouchableOpacity } from "react-native";
import { MyContext } from "../Context/MyContext";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import Loader from "../Loader/Loader";
import styles from '../../styles/TaskManagement/ReportingEmployees';
import Modal from 'react-native-modal';
import TaskForm from "./TaskForm";

const ReportingEmployees = ({ setTab, selectedProject }) => {
    const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { role, employeeId, schemaName,roleColors} = useContext(MyContext);
  const [noOfPages, setNoOfPages] = useState([]);
      const [displayedPageNo, setDisplayedPageNo] = useState([]);
      const [goToPage, setGoToPage] = useState("");
      const [pageError, setPageError] = useState();
      const [currentPage, setCurrentPage] = useState(1);
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
    if (token && selectedProject && setTab){
        fetchEmployees();
    }

}, [ selectedProject, setTab, token])
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${url}/api/v1/employeeManager/reporting-to/${employeeId}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": schemaName,
            },
          }
        );
        let data = response.data.filter(
          (each) => isEmployeeExistInProject(each.employeeId) && each.task
        );
        setEmployees(data);
        setSearchFilter(data);
        setFilteredEmployees(data);
        
      
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
            setFilteredEmployees(
                data.slice((currentPage - 1) * 5, currentPage * 5)
            );
        
      } catch (e) {
        console.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    

 const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 10) * 10;
    setDisplayedPageNo(noOfPages.slice(start, start + 10));
  };

  const pagination = (nextPage) => {
    setFilteredEmployees(employees.slice((nextPage - 1) * 5, nextPage * 5));
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

  const searchedEmployees = (name) => {
    console.group(name);
    const filteredData = employees.filter((each) => {
      return each.firstName.toLowerCase().includes(name.toLowerCase());
    });

    setFilteredEmployees(filteredData);
    setSearch(name);
  };

  const addTask = (firstName, lastName, email, employeeId) => {
    setSelectedEmployee(firstName + " " + lastName);
    setSelectedEmployeeId(employeeId);
    setSelectedEmployeeEmail(email);
    setIsModalOpen(true);
  };

  const handleSearch = (v) => {
    setEmployees(searchFilter);

    if (search === "") {
      setSearchFilter(employees);
    }
    setCurrentPage(1);
    const filteredData = searchFilter.filter(
      (each) =>
        each.firstName.toLowerCase().includes(v.toLowerCase()) ||
        each.lastName.toLowerCase().includes(v.toLowerCase())
    );
    let data = filteredData;

    setEmployees(data);

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
    setFilteredEmployees(data.slice((1 - 1) * 5, 1 * 5));

    

    setSearch(v);
  };

  const isEmployeeExistInProject = (employeeId) => {
    const isExist = selectedProject.projectMembers.some(
      (each) => each.employeeId === employeeId && each.employeeStatus==="ACTIVE"
    );
    return isExist;
  };


  console.log("tab : ", setTab);
    return (
        
            <ScrollView>
                <View style={styles.container}>
                     {isLoading && <Loader />}
                     <View></View>
                      <Modal
        isVisible={isModalOpen}
       
       
        onRequestClose={() => setIsModalOpen(false)}
      >

                        <View style={styles.overlay}>
                            <View style={styles.modalContainer}>
                                 <TaskForm
            setIsModalOpen={setIsModalOpen}
            selectedEmployee={selectedEmployee}
            selectedEmployeeId={selectedEmployeeId}
            selectedEmployeeEmail={selectedEmployeeEmail}
            projectName={selectedProject.projectName}
            clientName={selectedProject.clientName}
            projectId={selectedProject.id}
            projectStartDate={selectedProject.startDate}
          />
                                </View>
                        </View>

                     </Modal>
                      <Pressable
                          onPress={() => setTab("projects")}
                          style={{
                            padding: 10,
                            alignSelf : 'flex-end',
                          }}
                        >
                          <Feather name="arrow-left" size={24} color={roleColors[role]} />
                        </Pressable>

                        
<View style={styles.reportingFilter}>
  {/* Total Employees */}
  <View style={styles.totalEmployeesContainer}>
    <Text style={styles.label}>Total Employees</Text>
    <Text style={styles.count}>{employees.length}</Text>
  </View>
 
  {/* Search */}
  <View style={styles.totalEmployeesContainer}>
    <TextInput
      value={search}
      onChangeText={(text) => handleSearch(text)}
      placeholder="Search by name"
      style={styles.searchInput}
      clearButtonMode="while-editing" // iOS
    />
  </View>
</View>

{/* card data */}
{
    filteredEmployees.length > 0 ? (
        filteredEmployees.map((each) => (
            <View key={each.id} style={[styles.cardContainer, {borderLeftColor : roleColors[role]}]}>
                <Text style={{fontSize: 15}}>{each.firstName} {each.lastName}</Text>
                <Text style={{textAlign : 'right'}}>{each.jobRole}</Text>
                <Text style={{color : 'grey'}}>{each.email}</Text>
                <View  style={{ height: 1, backgroundColor: "#000", marginVertical: 10 }} />
                <TouchableOpacity style={{alignItems : 'center'}} onPress={() =>  addTask(
                              each.firstName,
                              each.lastName,
                              each.email,
                              each.employeeId
                            )}>
                    <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>
                        Add Task
                    </Text>
                </TouchableOpacity>
                </View>
        ))
    ) : (
        <>
        <Text>
            No Submissions Found
        </Text>
        </>

    )
}

{/* {pagination} */}
                                                      {noOfPages.length > 0 && (
                                                       <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
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
export default ReportingEmployees;