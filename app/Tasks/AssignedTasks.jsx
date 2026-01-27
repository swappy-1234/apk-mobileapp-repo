import { useState, useEffect, useContext } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, } from "@react-navigation/native";
import Loader from "../Loader/Loader";
import { MyContext } from "../Context/MyContext";
import LayoutWrapper from "../LayoutWrapper";
import styles from '../../styles/TaskManagement/AssignedTasks';
import TaskUpdate from "./TaskUpdate";
import Search from "../../assets/OrganizationChart/search.png";

const AssignedTasks = () => {
    const [tab, setTab] = useState("assigned tasks");
  const [taskType, setTaskType] = useState("allTasks");
  const [tasks, setTasks] = useState([]);
  const [isTaskView, setIsTaskView] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({});
  const [taskToEdit, setTaskToEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTasks, setSearchTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { role, employeeId, schemaName,roleColors} = useContext(MyContext);
  const [hover, setHover] = useState(false);
  const [viewDescription, setViewDescription] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState("");
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
  if (token && employeeId && !isEdit && !isDelete) {
    fetchData();
  }
}, [token,taskType,  employeeId, isEdit, isDelete]);

console.log("t, e, : ", token, employeeId);
 
    const fetchData = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      let api;
      if (taskType === "allTasks") {
        api = `${url}/apis/employees/tasksAssignedBy/${employeeId}`;
      } else if (taskType === "overDueTasks") {
        api = `${url}/apis/employees/OverdueTasks/AssignedFrom/${employeeId}`;
      } else if (taskType === "pendingTasks") {
        api = `${url}/apis/employees/PendingTasks/AssignedFrom/${employeeId}`;
      } else if (taskType === "completedTasks") {
        api = `${url}/apis/employees/CompletedTasks/AssignedFrom/${employeeId}`;
      }
 
      try {
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": schemaName,
          },
        });
         console.log("response : ", response.data)
        setSearchTasks(response.data);
        let data = response.data
          .filter((each) =>
            each.personName.toLowerCase().includes(search.toLowerCase())
          )
          .reverse();
        setTasks(data);
        setFilteredTasks(data);
        console.log("data : ", data);
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
        setFilteredTasks(data.slice((1 - 1) * 5, 1 * 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        // setLoading(false);  // Stop the loading state
      }

      setIsLoading(false);
    };

   

    // if (!isDelete && !isEdit && employeeId) {
    //   fetchData();
    // }
 

  // useEffect(() => {
  //   if (!viewDescription) return;

  //   const timer = setTimeout(() => {
  //     setViewDescription(false);
  //   }, 5000);

  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       setViewDescription(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     clearTimeout(timer);
  //     document.removeEventListener("mouseenter", handleClickOutside);
  //   };
  // }, [viewDescription]);


  const handleSearch = (v) => {
    setTasks(searchTasks);

    if (search === "") {
      setSearchTasks(tasks);
    }
    setCurrentPage(1);
    const filteredData = searchTasks.filter((each) =>
      each.personName.toLowerCase().includes(v.toLowerCase())
    );
    let data = filteredData;

    setTasks(data);

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
    setFilteredTasks(data.slice((1 - 1) * 5, 1 * 5));

    setSearch(v);
  };

  const handleSelectTask = (each) => {
    setSelectedTask(each);
    setIsTaskView(true);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  const pagination = (nextPage) => {
    setFilteredTasks(tasks.slice((nextPage - 1) * 5, nextPage * 5));

    updateDisplayedPages(nextPage);
  };

const status = (dueDate, taskStatus) => {
  const today = new Date();
  const anotherDate = dueDate ? new Date(dueDate) : null;

  if (taskStatus) {
    return <Text style={styles.completed}>Completed</Text>;
  }

  if (!anotherDate || today < anotherDate) {
    return <Text style={styles.pending}>Pending</Text>;
  }

  if (today.toDateString() === anotherDate.toDateString()) {
    return <Text style={styles.lastDay}>Last day</Text>;
  }

  if (today > anotherDate) {
    return <Text style={styles.overdue}>Overdue</Text>;
  }

  return <Text style={styles.pending}>Pending</Text>;
};

  const confirmDelete = async () => {
    setIsLoading(true);

    await axios.delete(`${url}/apis/employees/tasks/${taskToDelete.taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant-ID": schemaName,
      },
    });
    setIsDelete(false);
    setTaskToDelete({});
    setIsLoading(false);
  };

  console.log("token empI : ", token, employeeId);
    return (
        <LayoutWrapper>
          <ScrollView>
             {isLoading && <Loader />}
              <Modal
      transparent
      isVisible={isDelete}
      
      animationType="fade"
      onRequestClose={() => setIsDelete(false)}
    >
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Close button */}
          <View style={styles.closeWrapper}>
            <TouchableOpacity onPress={() => setIsDelete(false)}>
              <Text
                style={[
                  styles.closeText,
                  { color: roleColors[role] },
                ]}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.text}>
              Are you sure you want to delete the{" "}
              <Text style={styles.boldText}>
                {taskToDelete?.taskName}
              </Text>{" "}
              task assigned to{" "}
              <Text style={styles.boldText}>
                {taskToDelete?.personName}
              </Text>
              ?
            </Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsDelete(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </Modal>

    <Modal
      transparent
      visible={viewDescription}
      animationType="fade"
      onRequestClose={() => setViewDescription(false)}
    >
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Close button */}
          <View style={styles.closeWrapper}>
            <TouchableOpacity onPress={() => setViewDescription(false)}>
              <Text
                style={[
                  styles.closeText,
                  { color: roleColors[role] },
                ]}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <ScrollView>
            <Text style={styles.descriptionText}>
              {selectedTaskDetails}
            </Text>
          </ScrollView>

        </View>
      </View>
    </Modal>

    {isEdit && (
  <Modal
    transparent
    visible={isEdit}
    animationType="slide"
    onRequestClose={() => setIsEdit(false)}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <TaskUpdate
          setIsEdit={setIsEdit}
          taskToEdit={taskToEdit}
          setIsLoading={setIsLoading}
        />
      </View>
    </View>
  </Modal>
)}


{
  tab === 'assigned tasks' && (
    <View style={styles.container}>
        {/* {filter} */}
            <View style={styles.searchContainer}>
              <Picker
                value={taskType}
                onValueChange={(text) => setTaskType(text)}
                style={styles.filterSelects}
              >
                <Picker.Item value="allTasks" label="All Tasks" />
                <Picker.Item value="pendingTasks" label="Pending Tasks" />
                <Picker.Item value="overDueTasks" label="Overdue Tasks" />
                <Picker.Item value="completedTasks" label="Completed Tasks" />
              </Picker>
            </View>
            {/* {search} */}
            <View style={styles.filterContainer}>
              <TextInput
                keyboardType="search"
                placeholder="Search by name"
                value={search}
                onChangeText={(text) => handleSearch(text)}
                style={styles.searchInput}
              />
              <Image source={Search} alt="search" style={styles.searchIcons} />
            </View>
            <TouchableOpacity style={{alignSelf : 'flex-start'}} onPress={() => navigation.navigate('Tasks/ProjectsForTasks')}>
              <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Create Task</Text>
            </TouchableOpacity>
 
             {filteredTasks.length > 0 ? (
                              filteredTasks.map((each,index) => (
                                <View key={index} style={[styles.cardContainer, {borderLeftColor : roleColors[role]}]}>
                                  <View style={styles.nameStatus}>
                                     
                                   
                                      <Text style={{textAlign : 'right'}}>{status(each.dueDate, each.taskStatus)}</Text>
                                      <Text style={{fontSize : 15,}}>{each.personName}</Text>
                                   
                                        <Text style={[styles.viewButtonText,]}  onPress={() =>  {
                                setSelectedTaskDetails(each.taskDetails);
                                setViewDescription(true);
                              }}>View</Text>
                                      
                                     
                                    </View>
                                    <View  style={{ height: 1, backgroundColor: "#000", marginVertical: 10 }} />
                                    <View style={styles.rowAlign}>
                                      {/* project */}
                                      <View>
                                        <Text style={{color : 'grey'}}>PROJECT</Text>
                                        <Text style={{fontSize : 15,}}>{each.projectName}</Text>
                                        </View>
                                        {/* task */}
                                        <View>
                                           <Text style={{color : 'grey'}}>TASK</Text>
                                        <Text style={{fontSize : 15,}}>{each.taskName}</Text>
                                          </View>
                                      </View>
                                       <View style={styles.rowAlign}>
                                      {/* effective date */}
                                      <View>
                                         <Text style={{color : 'grey'}}>EFFECTIVE DATE</Text>
                                        <Text style={{fontSize : 15,}}>{each.effectiveDate}</Text>
                                        </View>
                                        {/* due date */}
                                        <View>
                                           <Text style={{color : 'grey'}}>DUE DATE</Text>
                                        <Text style={{fontSize : 15,}}>{each.dueDate}</Text>
                                          </View>
                                      </View>
                                      {/* update and delete */}
                                   {!each.taskStatus ? (
  <View style={styles.actionRow}>
    <TouchableOpacity
      
      onPress={() => {
        setIsEdit(true);
        setTaskToEdit(each);
      }}
    >
      <Text style={styles.updateButtonText}>Update</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setIsDelete(true);
        setTaskToDelete(each);
      }}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.actionRow} />
)}
                                    <View>
             
            </View>
            
                                  </View>
                              ))
                            ) : (
                              <View  style = {{marginVertical : 15}}>
                              <Text>
                              No Submissions Found
                              </Text>
                              </View>
                            )}

                            <View style={styles.pageContainer}>
      {/* Previous */}
      <TouchableOpacity
        style={styles.pageBtn}
        disabled={currentPage === 1}
        onPress={() => {
                    if (currentPage !== 1) {
                      const prevPage = currentPage - 1;
                      setCurrentPage(prevPage);
                      pagination(prevPage);
                    }
                  }}
      >
        <Text style={styles.arrow}>&lt;</Text>
      </TouchableOpacity>

      {/* Page Numbers */}
      {displayedPageNo.map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => {
                      setCurrentPage(page);
                      pagination(page);
                    }}
          style={[
            styles.pageBtn,
            {
              backgroundColor:
                currentPage === page
                  ? roleColors[role]
                  : "#fff",
              borderColor: roleColors[role],
            },
          ]}
        >
          <Text
            style={{
              color:
                currentPage === page ? "#fff" : "#000",
              fontWeight: "600",
            }}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next */}
      <TouchableOpacity
        style={styles.pageBtn}
        // disabled={currentPage === totalPages}
        onPress={() => {
                    if (currentPage !== noOfPages.length) {
                      const nextPage = currentPage + 1;
                      setCurrentPage(nextPage);
                      pagination(nextPage);
                    }
                  }}
      >
        <Text style={styles.arrow}>&gt;</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

          </ScrollView>
        </LayoutWrapper>
    )
};

export default AssignedTasks;