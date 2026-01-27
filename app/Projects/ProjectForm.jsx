import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Modal from 'react-native-modal';
import styles from '../../styles/Projects/ProjectForm';
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from 'expo-checkbox';
import Loader from "../Loader/Loader";
import { MyContext } from "../Context/MyContext";
import LayoutWrapper from "../LayoutWrapper";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";


const ProjectForm = ({ setIsCreate, handleFormClose }) => {
     const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showCompleteDatePicker, setShowCompleteDatePicker] = useState(false);
  const [employees, setEmployees] = useState([]);
    const [filterEmployees, setFilterEmployees] = useState([]);
    const { role, employeeId, schemaName,roleColors} = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [projectData, setProjectData] = useState({
        projectId: "",
        projectName: "",
        clientName: "",
        projectDescription: "",
        managerId: "",
        startDate: "",
        deadLine: "",
        projectStatus: "ONGOING",
        projectMembers: []
    })
    const [searchText, setSearchText] = useState("");
    const [noOfPages, setNoOfPages] = useState([]);
    const [displayedPageNo, setDisplayedPageNo] = useState([]);
    const [goToPage, setGoToPage] = useState("");
    const [pageError, setPageError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [errors, setErrors] = useState(null);
    const navigation = useNavigation("");
    const [isCreated, setIsCreated] = useState(false);
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
    


    const handleChange = (name, value) => {
  // Validation
  if (
    (name === "projectName" || name === "clientName") &&
    value.length > 30
  ) {
    setErrors(prev => ({
      ...prev,
      [name]: "Maximum character limit exceeded."
    }));
    return;
  } else {
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  }

  // Update state
  setProjectData(prev => ({
    ...prev,
    [name]: value
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : value
  }));
};


    const checkIsAdded = (empId) => {
        const isExist = projectData.projectMembers.some((each) => each.employeeId === empId);
        console.log("isExist", isExist, empId);
        return isExist;
    }

    const handleAddEmployee = (newEmpId) => {
        let members = projectData.projectMembers;
        console.log("members", members, newEmpId)
        let isExist = members.some((each) => each.employeeId === newEmpId);


        if (!isExist) {
            let newMember = {
                employeeId: newEmpId,
                employeeStatus: "ACTIVE",
                memberRole: "MEMBER",
            }
            members.push(newMember)
            setProjectData((prev) => ({
                ...prev,
                projectMembers: members
            }))
        }
        else {
            let filterMembers = members.filter((each) => each.employeeId !== newEmpId);
            setProjectData((prev) => ({
                ...prev,
                projectMembers: filterMembers
            }))
        }
    }

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${url}/api/v1/employeeManager/projectEmployees/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-Tenant-ID": schemaName,
                }
            })
            let data = response.data;
            setEmployees(response.data);
            setFilterEmployees(response.data);
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
            setFilterEmployees(
                data.slice((currentPage - 1) * 5, currentPage * 5)
            );

            console.log("response", response.data);
        }
        catch (e) {
            console.log("e", e);
        }
        finally {
            setIsLoading(false);
        }
    }

    const changeRole = (employeeId, role) => {
        let index = projectData.projectMembers.findIndex(
            (member) => member.employeeId === employeeId
        );

        let members = projectData.projectMembers;
        members[index].memberRole = role

        setProjectData((prev) => ({
            ...prev,
            projectMembers: members
        }))

    }

    const changeStatus = (employeeId, status) => {
        let index = projectData.projectMembers.findIndex(
            (member) => member.employeeId === employeeId
        );

        let members = projectData.projectMembers;
        members[index].employeeStatus = status

        setProjectData((prev) => ({
            ...prev,
            projectMembers: members
        }))

    }

    const selectAll = () => {
        console.log("eeeee")

        if (projectData.projectMembers.length === employees.length && projectData.projectMembers.length > 0) {
            setProjectData((prev) => ({
                ...prev,
                projectMembers: []
            }))
        }
        else {
            let existingMembers = projectData.projectMembers;
            for (let m of employees) {
                const isExist = existingMembers.some((each) => each.employeeId === m.employeeId);
                if (!isExist) {
                    let newMember = {
                        employeeId: m.employeeId,
                        employeeStatus: "ACTIVE",
                        memberRole: "MEMBER",
                    }
                    existingMembers.push(newMember)
                }
            }
            setProjectData((prev) => ({
                ...prev,
                projectMembers: existingMembers
            }))
        }
    }

    useEffect(() => {
        if (schemaName, employeeId) {
            fetchEmployees();
            setProjectData((prev) => ({
                ...prev,
                managerId: employeeId
            }))
        }
    }, [schemaName, employeeId])

    const updateDisplayedPages = (page) => {
        const start = Math.floor((page - 1) / 10) * 10;
        setDisplayedPageNo(noOfPages.slice(start, start + 10));
    };

    const pagination = (nextPage) => {
        setFilterEmployees(employees.slice((nextPage - 1) * 5, nextPage * 5));
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

    const filterData = () => {
        let filterByName = employees.filter((each) => (each.firstName + " " + each.lastName).toLowerCase().includes(searchText.toLowerCase()));
        let filterByJobRole = employees.filter((each) => each.jobRole.toLowerCase().includes(searchText.toLowerCase()));
        let allData = [...filterByName, ...filterByJobRole];
        let filteredData = [];
        for (let r of allData) {
            let b = true;
            for (let d of filteredData) {
                if (r.employeeId === d.employeeId) {
                    b = false
                    break;
                }
            }
            if (b) {
                filteredData.push(r);
            }
        }
        let data = filteredData;


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
        setFilterEmployees(data.slice((1 - 1) * 5, 1 * 5));

    }

    useEffect(() => {

        filterData();

    }, [searchText])

    const validation = () => {
        let newErrors = {};
        if (projectData.projectName === "") {
            newErrors.projectName = "project name is required";
        }
        if (projectData.clientName === "") {
            newErrors.clientName = "client name is required";
        }
        if (projectData.startDate === "") {
            newErrors.startDate = "start date is required";
        }
        if (projectData.deadLine === "") {
            newErrors.deadLine = "dead line is required";
        }
        if (projectData.projectDescription === "") {
            newErrors.projectDescription = "project description is required";
        }
        return newErrors;
    }



    const handleSubmit = async () => {
        setErrors(null);
        console.log("projectData", projectData);
        const validate = validation();

        if (Object.keys(validate).length > 0) {
            setErrors(validate);
            return;
        }

        try {
            const response = await axios.post(`${url}/api/projects/with-members`, projectData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-Tenant-ID": schemaName,
                }
            })
            console.log(response.data);
            setIsCreated(true);
        }

        catch (e) {
            console.log(e);
        }
    }
    return (
      <LayoutWrapper>
      <ScrollView>
        {isLoading && <Loader />}
        
          <Modal transparent animationType="fade" isVisible={isCreated}>
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.message}>
                  Project Created Successfully!
                </Text>

                <TouchableOpacity
                  style={[
                    styles.okButton,
                    { backgroundColor: roleColors[role] },
                  ]}
                  onPress={() => navigation.navigate("Projects/Projects")}
                >
                  <Text style={styles.okText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
       
        <View style={styles.container}>
          <View style={styles.rowAlign}>
            <Text style={styles.heading}>Create New Project</Text>
            <AntDesign
              name="close-circle"
              size={24}
              onPress={() => navigation.navigate("Projects/Projects")}
            />
          </View>
          <Text style={styles.para}>Fill in the project details and assign team members</Text>
          <Text style={styles.head}>Project Information</Text>

          <View>
            {/* project name */}
            <View style={styles.inputColumn}>
              <Text style={styles.label}>
                Project Name <Text style={styles.required}>*</Text>
              </Text>

              <TextInput
                style={styles.input}
                value={projectData.projectName}
                placeholder="Enter project name"
                onChangeText={(text) =>
                  handleChange(  "projectName",  text )
                }
              />

              {errors?.projectName && (
                <Text style={styles.errorText}>{errors.projectName}</Text>
              )}
            </View>

            {/* client name */}
            <View style={styles.inputColumn}>
              <Text style={styles.label}>
                Client Name <Text style={styles.required}>*</Text>
              </Text>

              <TextInput
                style={styles.input}
                value={projectData.clientName}
                placeholder="Enter client name"
                onChangeText={(text) =>
                  handleChange( "clientName", text )
                }
              />

              {errors?.clientName && (
                <Text style={styles.errorText}>{errors.clientName}</Text>
              )}
            </View>
          </View>

          <View>
            {/* start date */}
            <View style={styles.inputColumn}>
              <Text style={styles.label}>
                Start Date <Text style={styles.required}>*</Text>
              </Text>

              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text
                  style={
                    projectData.startDate ? styles.dateText : styles.placeholder
                  }
                >
                  {projectData.startDate || "Select start date"}
                </Text>
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={
                    projectData.startDate
                      ? new Date(projectData.startDate)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      handleChange(
                        "startDate",
                         selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
                      );
                    }
                  }}
                />
              )}

              {errors?.startDate && (
                <Text style={styles.errorText}>{errors.startDate}</Text>
              )}
            </View>
            {/* deadline */}
            <View style={styles.inputColumn}>
  <Text style={styles.label}>
    Deadline <Text style={styles.required}>*</Text>
  </Text>

  <TouchableOpacity
    style={styles.dateInput}
    onPress={() => setShowDeadlinePicker(true)}
  >
    <Text
      style={
        projectData.deadLine
          ? styles.dateText
          : styles.placeholder
      }
    >
      {projectData.deadLine || "Select deadline"}
    </Text>
  </TouchableOpacity>

  {showDeadlinePicker && (
    <DateTimePicker
      value={
        projectData.deadLine
          ? new Date(projectData.deadLine)
          : projectData.startDate
          ? new Date(projectData.startDate)
          : new Date()
      }
      mode="date"
      minimumDate={
        projectData.startDate
          ? new Date(projectData.startDate)
          : undefined
      }
      onChange={(event, selectedDate) => {
        setShowDeadlinePicker(false);
        if (selectedDate) {
          handleChange(
           "deadLine",
             selectedDate.toISOString().split("T")[0],
          );
        }
      }}
    />
  )}

  {errors?.deadLine && (
    <Text style={styles.errorText}>{errors.deadLine}</Text>
  )}
</View>

          </View>

          {/* project description */}
          <View style={styles.inputColumn}>
            <Text style={styles.label}>
              Project Description <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              style={styles.textArea}
              value={projectData.projectDescription}
              placeholder="Enter project description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={(text) =>
                handleChange("projectDescription",text )
              }
            />

            {errors?.projectDescription && (
              <Text style={styles.errorText}>{errors.projectDescription}</Text>
            )}
          </View>


          {/* project members */}
          <Text style={styles.head}>Project Members</Text>
          <Text>
            Choose employees and set their roles and statuses for this project.
          </Text>
          {
            employees.length > 0 &&  <TextInput
            style={styles.searchInput}
            placeholder="Search by name or designation"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          }
          

          {/* table */}

          {filterEmployees.length > 0 ? (
  <>
    {/* Table Header */}
    <View style={styles.tableHeader}>
      <Checkbox
        value={projectData.projectMembers.length === employees.length}
        onValueChange={selectAll}
      />
      <Text style={styles.headerText}>Name</Text>
      <Text style={styles.headerText}>Designation</Text>
      <Text style={styles.headerText}>Role</Text>
      <Text style={styles.headerText}>Status</Text>
    </View>

    {/* Table Body */}
    <FlatList
      data={filterEmployees}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const isAdded = checkIsAdded(item.employeeId);

        return (
          <View style={styles.tableRow}>
            <Checkbox
              value={isAdded}
              onValueChange={() =>
                handleAddEmployee(item.employeeId)
              }
            />

            <Text style={styles.cellText}>
              {item.firstName} {item.lastName}
            </Text>

            <Text style={styles.cellText}>{item.jobRole}</Text>

            <View style={styles.pickerCell}>
              <Picker
                enabled={isAdded}
                onValueChange={(value) =>
                  changeRole(item.employeeId, value)
                }
              >
                <Picker.Item label="Team Member" value="MEMBER" />
                <Picker.Item label="Team Lead" value="TEAMLEAD" />
              </Picker>
            </View>

            <View style={styles.pickerCell}>
              <Picker
                enabled={isAdded}
                onValueChange={(value) =>
                  changeStatus(item.employeeId, value)
                }
              >
                <Picker.Item label="Active" value="ACTIVE" />
                <Picker.Item label="Inactive" value="INACTIVE" />
              </Picker>
            </View>
          </View>
        );
      }}
    />
  </>
) : (
  <Text style={styles.emptyText}>
    No employees available to assign to the project.
  </Text>
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
                  cursor: displayedPageNo[0] === 1 ? "not-allowed" : "pointer",
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
                    style={{ color: "black", fontWeight: "700", fontSize: 20 }}
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
                    currentPage >= noOfPages.length ? "not-allowed" : "pointer",
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
                    setDisplayedPageNo(noOfPages.slice(nextStart - 1, nextEnd));

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

          <TouchableOpacity onPress={handleSubmit} style={{alignItems : 'center'}}>
            <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Create Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LayoutWrapper>
        
      
    )
}

export default ProjectForm;