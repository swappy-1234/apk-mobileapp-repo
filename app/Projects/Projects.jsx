import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Image
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Search from "../../assets/OrganizationChart/search.png";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../Context/MyContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../Loader/Loader";
import DateTimePicker from "@react-native-community/datetimepicker";
import LayoutWrapper from "../LayoutWrapper";
import Checkbox from "expo-checkbox"; // or react-native-paper checkbox
import  Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../styles/Projects/Projects";

import ProjectForm from "./ProjectForm";
import ProjectView from "./ProjectView";
import UpdateProjectForm from "./UpdateProjectForm";

const Projects = () => {
   const [isCreate, setIsCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateProject, setUpdateProject] = useState();
  const [projectFilters, setProjectFilters] = useState({
    status: "",
    title: "",
  });
  const [completedProject, setCompletedProject] = useState({
    projectTitle: "",
    projectId: "",
    isProjectCompletedModal: false,
    isUpdateProjectError: false
  });
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterProjects, setFilterProjects] = useState([]);
  const [managerId, setManagerId] = useState("employeeId");
  const { role, employeeId, schemaName,roleColors} = useContext(MyContext);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation("");
   const [data, setData] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        const stored = await AsyncStorage.getItem("companies");
        console.log("stored response : ", JSON.parse(stored));
        setData(JSON.parse(stored));
      };
      fetchData();
    }, []);
    const token = data.token;

  useEffect(() => {
    if (schemaName, token) {
      fetchProjects();
      getAllManager();
    }
  }, [schemaName, token]);

  const fetchProjects = async () => {
    setIsLoading(true);
    let api =
      role === "employee"
        ? `${url}/api/projects/all-projects/employee/${employeeId}`
        : `${url}/api/projects/all-projects/${employeeId}`;
    try {
      const response = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
      });
      console.log("all-projects", response.data);
      setProjects(response.data);
      setFilterProjects(response.data);
      let data = response.data;
            setEmployees(response.data);
            setFilterProjects(response.data);
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
    } catch (e) {
      console.error("error fetching project data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormClose = () => {
    setIsCreate(false);
    fetchProjects();
  };

  const handleUpdateFormClose = () => {
    setIsUpdate(false);
    fetchProjects();
  };

  const handleUpdate = (project) => {
    setUpdateProject(project);
    setIsUpdate(true);
  };

  const getProjectsByManagerId = async (managerId) => {
    if (!managerId) {
      setProjects([]);
      setFilterProjects([]);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${url}/api/projectManager/getProject/managerId/${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        }
      );
      setProjects(response.data);
      setFilterProjects(response.data);
    } catch (e) {
      setIsLoading(false);
      console.error("Error getting the project:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllManager = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${url}/api/v1/employeeManager/AdminsAndManagers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        }
      );
      setEmployees(response.data); // assuming response.data is an array
    } catch (e) {
      console.error("no employees found ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectAsCompleted = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${url}/api/projectManager/updateProjectAsCompleted/${completedProject.projectId}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        }
      );
      setCompletedProject({
        projectTitle: "",
        projectId: "",
        isProjectCompletedModal: false,
        isUpdateProjectError: false
      });
      setIsLoading(false);
      fetchProjects();
    } catch (e) {
      setIsLoading(false);

      if (e.status === 409) {
        console.log("status", e.status);
        setCompletedProject((prev) => ({
          ...prev,
          isProjectCompletedModal: false,
          isUpdateProjectError: true
        }))
      }
      console.error("Error updating project:", e);
    }
  };

  useEffect(() => {
    let afterFilterProjects = [...projects];

    afterFilterProjects = afterFilterProjects.filter((each) =>
      each.projectStatus.includes(projectFilters.status)
    );
    afterFilterProjects = afterFilterProjects.filter((each) =>
      each.projectName.toLowerCase().includes(projectFilters.title.toLowerCase())
    );

    let data = afterFilterProjects;
 
 
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

    
  }, [projectFilters, projects]);

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
        {/* project form */}
        <Modal
  visible={isCreate}
  transparent
  animationType="slide"
  onRequestClose={handleFormClose}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <ProjectForm
        setIsCreate={setIsCreate}
        handleFormClose={handleFormClose}
      />
    </View>
  </View>
</Modal>

{/* update form */}

 <Modal
  visible={isUpdate}
  transparent
  animationType="slide"
  onRequestClose={handleUpdateFormClose}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <UpdateProjectForm
       setIsUpdate={setIsUpdate}
            handleUpdateFormClose={handleUpdateFormClose}
            updateProject={updateProject}
      />
    </View>
  </View>
</Modal>

{/* update the project */}
<Modal
  visible={completedProject.isProjectCompletedModal}
  transparent
  animationType="fade"
  onRequestClose={() =>
    setCompletedProject({
      projectTitle: "",
      projectId: "",
      isProjectCompletedModal: false,
    })
  }
>
  <View style={styles.overlay}>
    <View style={styles.modalBox}>
      <Text style={styles.message}>
        Do you want update{" "}
        <Text style={styles.bold}>
          {completedProject.projectTitle}
        </Text>{" "}
        as completed?
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.yesBtn}
          onPress={updateProjectAsCompleted}
        >
          <Text style={styles.btnText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.noBtn}
          onPress={() =>
            setCompletedProject({
              projectTitle: "",
              projectId: "",
              isProjectCompletedModal: false,
            })
          }
        >
          <Text style={styles.btnText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* completed project */}
<Modal
  visible={completedProject.isUpdateProjectError}
  transparent
  animationType="fade"
  onRequestClose={() =>
    setCompletedProject({
      projectTitle: "",
      projectId: "",
      isProjectCompletedModal: false,
      isUpdateProjectError: false,
    })
  }
>
  <View style={styles.overlay}>
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>
        Cannot complete project{" "}
        <Text style={styles.bold}>
          {completedProject.projectTitle}
        </Text>
        . Pending tasks still exist.
      </Text>

      <TouchableOpacity
        style={styles.okBtn}
        onPress={() =>
          setCompletedProject({
            projectTitle: "",
            projectId: "",
            isProjectCompletedModal: false,
            isUpdateProjectError: false,
          })
        }
      >
        <Text style={styles.okText}>Ok</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

 {isLoading && <Loader />}
 <View style={styles.container}>
  <View style={styles.container}>
  {/* Status Filter */}
  <View style={styles.searchContainer}>
    <Picker
      selectedValue={projectFilters.status}
      onValueChange={(value) =>
        setProjectFilters((prev) => ({
          ...prev,
          status: value,
        }))
      }
      style={styles.filterSelects}
    >
      <Picker.Item label="All Projects" value="" />
      <Picker.Item label="On Going" value="ONGOING" />
      <Picker.Item label="Completed" value="COMPLETED" />
    </Picker>
  </View>

  {/* Search Bar */}
  <View style={styles.filterContainer}>
    <TextInput
      placeholder="Search by project title"
      value={projectFilters.title}
      onChangeText={(text) =>
        setProjectFilters((prev) => ({
          ...prev,
          title: text,
        }))
      }
      placeholderTextColor="#999"
    />
     <Image source={Search} alt="search" style={styles.searchIcons} />
  </View>
</View>

{/* create project button */}
{role !== "employee" && (
              <TouchableOpacity className="create-btn"
                style={{ alignSelf: "flex-start",  }}
                onPress={() => navigation.navigate("Projects/ProjectForm")}
              >
                <Text style={[styles.buttonText, {backgroundColor: roleColors[role]}]}>Create Project</Text>
              </TouchableOpacity>
            )}

            {
              filterProjects.length > 0 ? (
                filterProjects.map((each) => {
                  return (
                    <View key={each.id} style={[styles.cardContainer, {borderLeftColor : roleColors[role]}]}>
                      <View style={styles.rowAlign}>
                        {/* project name */}
                        <View>
                          <Text style={styles.nameStyling}>PROJECT NAME</Text>
                             <Text>{each.projectName}</Text>
                          </View>
                          {/* client name */}
                          <View>
                            <Text style={styles.nameStyling}>CLIENT NAME</Text>
                              <Text>{each.clientName}</Text>
                            </View>
                        </View>
                          <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
                     
                      <View style={styles.rowAlign}>
                        <Text>Start Date : </Text>
                         <Text>{each.startDate}</Text>
                        </View>

                         <View style={styles.rowAlign}>
                        <Text>Deadline : </Text>
                         <Text>{each.deadLine}</Text>
                        </View>
                         <View style={styles.rowAlign}>
                        <Text>Project Status : </Text>
                         <Text>{each.projectStatus}</Text>
                        </View>
                        
          
                          <View style={styles.rowAlign}>
                            <TouchableOpacity onPress={() => navigation.navigate("Projects/ProjectView", {id : each.id})}>
                              <Text style={styles.viewButtonText}>View</Text>
                            </TouchableOpacity>
                            {
                              role !== "employee" && 
                              <TouchableOpacity  onPress={() => navigation.navigate("Projects/UpdateProjectForm", {id : each.id})}>
                              <Text style={styles.updateButtonText}>Update</Text>
                            </TouchableOpacity>
                            }
                            
                            </View>
                      </View>
                  )
                })
              ) : (
                <>
                <Text>No Submissions Found</Text>
                </>
              )
            }
 </View>

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

      </ScrollView>
    </LayoutWrapper>
  )
};

export default Projects;




// import { useEffect, useState } from "react";
// import axios from "axios";
// import { url } from "../../universalApi/universalApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProjectCard from "./ProjectCard";
// import ProjectForm from "./ProjectForm";
// import UpdateProjectForm from "./UpdateProjectForm";
// import LayoutWrapper from "../LayoutWrapper";
// import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import styles from '../../styles/Projects/Projects';
// import  Modal  from  "react-native-modal";
// import Loader from "../Loader/Loader";

// const Projects = () => {
//   const [isCreate, setIsCreate] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [updateProject, setUpdateProject] = useState();
//   const [projectFilters, setProjectFilters] = useState({
//     status: "",
//     title: "",
//   });
//   const [completedProject, setCompletedProject] = useState({
//     projectTitle: "",
//     projectId: "",
//     isProjectCompletedModal: false,
//   });
//   const [employees, setEmployees] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [filterProjects, setFilterProjects] = useState([]);
//   const [data, setData] = useState("");
//   const [id, setId] = useState("");
//   const [managerId, setManagerId] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       const stored = await AsyncStorage.getItem("companies");
//       const tenant = await AsyncStorage.getItem("tenantId");
//       console.log("stored response : ", JSON.parse(stored));
//       const parsed = JSON.parse(stored);
//       setData(parsed);
//       setId(JSON.parse(tenant));
//       if (parsed?.employeeId) {
//         setManagerId(parsed.employeeId);

//       }
//     };
//     fetchData();
//   }, []);

//   const role = data.role;
//   const token = data.token;
//   const employeeId = data.employeeId;
// console.log("employee id: ", employeeId);


//   useEffect(() => {
//     fetchProjects();
//     getAllManager();
//   }, []);

//   const fetchProjects = async () => {
//     setIsLoading(true);
//     let api =
//       role === "employee"
//         ? `${url}/api/projectManager/getProjectsByEmployeeId/${employeeId}`
//         : `${url}/api/projectManager/getProject/managerId/${employeeId}`;
//     try {
//       const response = await axios.get(api, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "X-Tenant-ID": id,
//         },
//       });
//       console.log(response.data);
//       setProjects(response.data);
//       setFilterProjects(response.data);
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFormClose = () => {
//     setIsCreate(false);
//     fetchProjects();
//   };

//   const handleUpdateFormClose = () => {
//     setIsUpdate(false);
//     fetchProjects();
//   };

//   const handleUpdate = (project) => {
//     setUpdateProject(project);
//     setIsUpdate(true);
//   };

//   const getProjectsByManagerId = async (managerId) => {
//     console.log("managerrrrr : ", managerId);
//     if (!managerId) {
//       setProjects([]);
//       setFilterProjects([]);
//       return;
//     }
//      console.log("11");
//     try {
//       setIsLoading(true);
//       console.log("11");
//       const response = await axios.get(
//         `${url}/api/projectManager/getProject/managerId/${managerId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "X-Tenant-ID": id, 
//           },
//         }
//       );
//        console.log("22");
//       setProjects(response.data);
//       setFilterProjects(response.data);
//       console.log("Project : ", response.data);
//     } catch (e) {
//        console.log("33");
//       setIsLoading(false);
//       console.error("Error getting the project:", e);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const getAllManager = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${url}/api/v1/employeeManager/AdminsAndManagers`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "X-Tenant-ID": id,
//           },
//         }
//       );
//       setEmployees(response.data); // assuming response.data is an array
//       console.log("All Employees ", response.data);
//     } catch (e) {
//       console.log("no employees found ", e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateProjectAsCompleted = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.put(
//         `${url}/api/projectManager/updateProjectAsCompleted/${completedProject.projectId}`,
//         {}, // empty body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "X-Tenant-ID": id,
//           },
//         }
//       );
//       setCompletedProject({
//         projectTitle: "",
//         projectId: "",
//         isProjectCompletedModal: false,
//       });
//       setIsLoading(false);
//       fetchProjects();
//     } catch (e) {
//       setIsLoading(false);
//       console.error("Error updating project:", e);
//     }
//   };

//   useEffect(() => {
//     console.log("projectFilters", projectFilters);
//     let afterFilterProjects = [...projects];

//     afterFilterProjects = afterFilterProjects.filter((each) =>
//       each.projectStatus.includes(projectFilters.status)
//     );
//     afterFilterProjects = afterFilterProjects.filter((each) =>
//       each.projectName.includes(projectFilters.title)
//     );

//     setFilterProjects(afterFilterProjects);
//   }, [projectFilters]);

//   console.log("filter projects : ", filterProjects);
//   return (
//     <>
//       <LayoutWrapper>
//         <ScrollView>
//           {isLoading && <Loader />}
//           <View style={{justifyContent : 'center', alignItems : 'center'}}>
//         <Modal isVisible={isCreate} transparent={true}>
//           <ProjectForm
//             setIsCreate={setIsCreate}
//             handleFormClose={handleFormClose}
//           />
//         </Modal>
      
//       {isUpdate && (
//         <Modal>
//           <UpdateProjectForm
//             setIsUpdate={setIsUpdate}
//             handleUpdateFormClose={handleUpdateFormClose}
//             updateProject={updateProject}
//           />
//         </Modal>
//       )}
//       {completedProject.isProjectCompletedModal && (
//         <Modal>
//           <View
//             style={{ display: "flex", flexDirection: "column", gap: "10px" }}
//           >
//             <Text>
//               Do you want update{" "}
//               <Text style={{ fontWeight: "bold" }}>
//                 {completedProject.projectTitle}
//               </Text>{" "}
//               as completed?
//             </Text>
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "center",
//                 gap: "5px",
//               }}
//             >
//               <TouchableOpacity
//                 style={{ width: "50px" }}
//                 onClick={updateProjectAsCompleted}
//               >
//                 <Text>Yes</Text>
//               </TouchableOpacity>{" "}
//               <TouchableOpacity
//                 style={{ backgroundColor: "red", width: "50px" }}
//                 onClick={() =>
//                   setCompletedProject({
//                     projectTitle: "",
//                     projectId: "",
//                     isProjectCompletedModal: false,
//                   })
//                 }
//               >
//                 <Text>No</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//             <View style={styles.filtersBlock}>
//               {role !== "employee" && (
//                 <TouchableOpacity onPress={() => setIsCreate(true)} style={styles.submitButton}>
//                   <Text style={styles.buttonText}>Create Project</Text>
//                 </TouchableOpacity>
//               )}
//               {role === "admin" && (
//                 <View
//                   style={styles.dropdownContainer}
//                 >
//                   <Picker
//       selectedValue={managerId}
//       onValueChange={(selectedId) => {
//         setManagerId(selectedId);
//         getProjectsByManagerId(selectedId);
//       }}
//       style={styles.picker}
//     >
//       <Picker.Item label="-- Select Manager --" value="" />

//     {
//       Array.isArray(employees) ? (
//         employees.map((emp) => (
//           <Picker.Item
//             key={emp.employeeId}
//             label={`${emp.firstName} ${emp.lastName}`}
//             value={emp.employeeId}
//           />
//         ))
//       ) : (
//         <Picker.Item label="no employees found" />
//       )
//     }
//     </Picker>
//                 </View>
//               )}
//             </View>
//             <View style={styles.filtersBlock}>
//   {/* Dropdown */}
//   <View style={styles.dropdownContainer}>
//     <Picker
//       selectedValue={projectFilters.status}
//       onValueChange={(value) =>
//         setProjectFilters((prev) => ({
//           ...prev,
//           status: value,
//         }))
//       }
//       style={styles.picker}
//     >
//       <Picker.Item label="All Projects" value="" />
//       <Picker.Item label="On Going" value="ONGOING" />
//       <Picker.Item label="Completed" value="COMPLETED" />
//     </Picker>
//   </View>

//   {/* Search Bar */}
//   <TextInput
//     placeholder="Search by project title"
//     style={styles.searchInput}
//     onChangeText={(text) =>
//       setProjectFilters((prev) => ({
//         ...prev,
//         title: text,
//       }))
//     }
//   />
// </View>
// <View>
//   {
//     filterProjects.length > 0 && (
//       <>
//       {
//         filterProjects.map((each, index) => {
//           return (
//             <ProjectCard
//                         key={index}
//                         each={each}
//                         employees={employees}
//                         handleUpdate={handleUpdate}
//                         setCompletedProject={setCompletedProject}
//                       />
//           )
//         })
//       }
//       </>
//     )
//   }
// </View>
//           </View>
//         </ScrollView>
//       </LayoutWrapper>
//     </>
//   );
// };

// export default Projects;
