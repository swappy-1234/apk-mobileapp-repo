import { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../Loader/Loader";
import { MyContext } from "../Context/MyContext";
import Modal from 'react-native-modal';
import LayoutWrapper from "../LayoutWrapper";
import styles from '../../styles/TaskManagement/RecievedTasks';
import Search from "../../assets/OrganizationChart/search.png";
import { AntDesign } from "@expo/vector-icons";
import ReportingEmployees from "./ReportingEmployees";

const RecievedTasks = () => {
  const [tab, setTab] = useState("assigned tasks");
  const [taskType, setTaskType] = useState("allTasks");
  const [tasks, setTasks] = useState([]);
  const [isTaskDisplay, setIsTaskDisplay]=useState(false);
  const [taskToDisplay, setTaskToDisplay]=useState();
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTasks, setSearchTasks] = useState([]);
  const [isLoading, setIsLoading]=useState(false);
  const {role,employeeId,schemaName,roleColors}=useContext(MyContext);
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
  if (token && employeeId) {
    fetchData();
  }
}, [token, taskType, employeeId]);


  const fetchData = async () => {
      setIsLoading(true);
      setCurrentPage(1);

      let api;

      if (taskType === "allTasks") {
        api = `${url}/apis/employees/tasksAssignedTo/${employeeId}`;
      } else if (taskType === "overdueTasks") {
        api = `${url}/apis/employees/OverdueTasks/PersonId/${employeeId}`;
      }
      else if (taskType === "pendingTasks") {
        api = `${url}/apis/employees/PendingTasks/PersonId/${employeeId}`;
      }
      else if (taskType === "completedTasks") {
        api = `${url}/apis/employees/CompletedTasks/PersonId/${employeeId}`;
      }

      try {
        // Retrieve the token from localStorage

        const response = await axios.get(api, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'X-Tenant-ID': schemaName,
          }
        });
       setSearchTasks(response.data);
        let data = response.data.filter(each => each.taskName.toLowerCase().includes(search.toLowerCase()));
        setTasks(data);  // Handle the response data
        
        
        setFilteredTasks(data);
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
        setFilteredTasks(
          data.slice((1 - 1) * 5, 1 * 5)
        );
        console.log("con : ",  response.data);
      } catch (error) {
        console.error('Error fetching data:', error);  // Log any error that occurs
        // setLoading(false);  // Stop the loading state
      }

      setIsLoading(false);

    };

  //  useEffect(()=>{
  //   const filteredData=tasks.filter(each=>each.taskName.toLowerCase().includes(search.toLowerCase()));
  //   setFilteredTasks(filteredData);

  //  },[search])

  const handleSearch = (v) => {
    setTasks(searchTasks);
    
    if (search === "") {
      setSearchTasks(tasks);
    }
    setCurrentPage(1);
    const filteredData = searchTasks.filter(each => each.taskName.toLowerCase().includes(v.toLowerCase()));
    let data = filteredData
  
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
    setFilteredTasks(
      data.slice((1 - 1) * 5, 1 * 5)
    );
    setSearch(v);
  }

 

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
  const updateTask=async(taskDetails,updateStatus)=>{
    taskDetails.employeeWorkStatus=updateStatus
    setIsLoading(true);
    try {
                const response = await axios.put(`${url}/apis/employees/tasks/${taskDetails.taskId}`, taskDetails, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "X-Tenant-ID": schemaName,
                    }
                });
        
                fetchData();
            }
            catch (e) {
                alert(e.message);
            }
            finally{
              setIsLoading(false);
            }
  }

  const TaskActionButton = ({ each, role, updateTask }) => {
  if (each.taskStatus) {
    return <Text style={styles.dash}>-</Text>;
  }

  if (!each.employeeWrokStatus) {
    return (
      <TouchableOpacity
        style={[
          styles.completedBtn,
          {
            borderColor: roleColors[role],
          },
        ]}
        onPress={() => updateTask(each, true)}
      >
        <Text style={[styles.completedText, { color: roleColors[role] }]}>
          Mark as Completed
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.revertBtn}
      onPress={() => updateTask(each, false)}
    >
      <Text style={styles.revertText}>Revert to Pending</Text>
    </TouchableOpacity>
  );
};
  return(
    <LayoutWrapper>
      <ScrollView>
         {isLoading && <Loader/>}
          {tab === "assigned tasks" && 
          <View style={styles.container}>
            {/* {filter} */}
            <View style={styles.searchContainer}>
              <Picker
               name = ''
               id = ""
                value={taskType}
                onValueChange={(text) => setTaskType(text)}
                style={styles.filterSelects}
              >
                <Picker.Item value="allTasks" label="All Tasks" />
                <Picker.Item value="pendingTasks" label="Pending Tasks" />
                <Picker.Item value="overdueTasks" label="Overdue Tasks" />
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

            {filteredTasks.length > 0 ? (
                  filteredTasks.map((each,index) => (
                    <View key={index} style={styles.cardContainer}>
                      <View style={styles.nameStatus}>
                        <Text style={{fontSize : 15,}}>{each.taskName}</Text>
                        <Text style={{fontSize : 15,}}>{status(each.dueDate, each.taskStatus)}</Text>
                        </View> 
                        <Text style={{fontSize : 15,}}>{each.taskDetails}</Text>
                        <View  style={{ height: 1, backgroundColor: "#000", marginVertical: 10 }} />
                        <Text style={{fontSize : 15,}}>Project Name : {each.projectName}</Text>
                        <Text style={{fontSize : 15,}}>Assigned By : {each.taskAssignedByName}</Text>
                        <Text style={{fontSize : 15,}}>Email : {each.taskAssignedByEmail}</Text>
                        <Text style={{fontSize : 15,}}>Effective Date : {each.effectiveDate}</Text>
                        <Text style={{fontSize : 15,}}>Due Date : {each.dueDate}</Text>
                        <View>
  <TaskActionButton
    each={each}
    role={role}
    updateTask={updateTask}
  />
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

      {/* Page numbers */}
      {displayedPageNo.map((each) => (
        <TouchableOpacity
          key={each}
          style={[
            styles.pageBtn,
            currentPage === each && {
              backgroundColor: roleColors[role],
              borderColor: roleColors[role],
            },
          ]}
          onPress={() => {
            setCurrentPage(each);
            pagination(each);
          }}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === each && styles.selectedText,
            ]}
          >
            {each}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next */}
      <TouchableOpacity
        style={styles.pageBtn}
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
          
          }

           {tab === "reporting employees" && <ReportingEmployees setTab={setTab} />}

      </ScrollView>
    </LayoutWrapper>
  )
};

export default RecievedTasks;
