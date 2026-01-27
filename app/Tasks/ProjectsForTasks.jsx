import { useState, useEffect, useContext } from "react";
import {Text, View, TouchableOpacity, ScrollView, Pressable, TextInput} from 'react-native';
import styles from '../../styles/TaskManagement/ProjectsForTasks';
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../Loader/Loader";
import { MyContext } from "../Context/MyContext";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LayoutWrapper from "../LayoutWrapper";
import ReportingEmployees from "./ReportingEmployees";

const ProjectsForTasks = () => {
    const [projects, setProjects] = useState([]);
  const [filterProjects, setFilterProjects] = useState([]);
  const [filters, setFilters] = useState({ filterProjectTitle: "", filterClientName: "" });
  const [tab, setTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { role, employeeId, schemaName,roleColors} = useContext(MyContext);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation();
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
    if (schemaName, token, employeeId) {
      fetchAllProjectsByManagerId();
    }
  }, [schemaName, token, employeeId])

  useEffect(() => {
    filterFunction();
  }, [filters])

  const filterFunction = () => {
    let filterData = [...projects];
    filterData = filterData.filter((each) => each.projectName.toLowerCase().includes(filters.filterProjectTitle.toLowerCase()));
    filterData = filterData.filter((each) => each.clientName.toLowerCase().includes(filters.filterClientName.toLowerCase()));


    let data = filterData;


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
    setFilterProjects(data.slice((1 - 1) * 5, 1 * 5));
  }

  const fetchAllProjectsByManagerId = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/api/projects/all-projects/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
      });
      let data = response.data.filter((each) => each.projectStatus === "ONGOING");
      setProjects(data);
      setFilterProjects(data);

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
      setFilterProjects(
        data.slice((currentPage - 1) * 5, currentPage * 5)
      );
    }
    catch (e) {

      console.error("error fetching all projects", e)
    }
    finally {
      setIsLoading(false);
    }
  }

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 10) * 10;
    setDisplayedPageNo(noOfPages.slice(start, start + 10));
  };

  const pagination = (nextPage) => {
    setFilterProjects(projects.slice((nextPage - 1) * 5, nextPage * 5));
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


    return (
        <LayoutWrapper>
            <ScrollView>
                 {isLoading && <Loader />}
                 {
                    tab === "projects" ? (
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
                        <Text style={styles.heading}>Select Project</Text>
                        <Text style={styles.para}>Choose a project to assign task to an employee.</Text>
                        <View>
                            <View style={styles.filtersInnerBlock}>
  <TextInput
    value={filters.filterClientName}
    onChangeText={(text) =>
      setFilters((prev) => ({
        ...prev,
        filterClientName: text,
      }))
    }
    placeholder="Enter Client Name"
    style={styles.input}
  />

  <TextInput
    value={filters.filterProjectTitle}
    onChangeText={(text) =>
      setFilters((prev) => ({
        ...prev,
        filterProjectTitle: text,
      }))
    }
    placeholder="Enter Project Title"
    style={styles.input}
  />
</View>

{/* card data */}
{
   filterProjects.length > 0 ? (
    filterProjects.map((each) => (
        <View key={each.id} style={[styles.cardContainer,{borderLeftColor : roleColors[role]}]}>
            <Text style={styles.statusAlign}>{each.projectStatus}</Text>
            <View style={styles.rowAlign}>
                <View>
                {/* project */}
                <Text style={{color : 'grey'}}>PROJECT</Text>
                <Text>{each.projectName}</Text>
                </View>
                <View>
                {/* client */}
                <Text style={{color : 'grey'}}>CLIENT</Text>
                <Text>{each.clientName}</Text>
                </View>
                </View>
                 <View  style={{ height: 1, backgroundColor: "#000", marginVertical: 10 }} />
                <TouchableOpacity style={{alignItems : 'center'}} onPress={() => {
    setSelectedProject(each);   
    setTab("employees");        
  }}>
                    <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Select</Text>
                </TouchableOpacity>
            </View>
    ))
   ) : (
    <>
    <Text>No Submissions Found</Text>
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
                        </View>
                    ) : (
                        <ReportingEmployees selectedProject={selectedProject} setTab={setTab} />
                    )
                 }
                
            </ScrollView>
        </LayoutWrapper>
    )
};

export default ProjectsForTasks;