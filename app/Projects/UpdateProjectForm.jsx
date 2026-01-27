import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../Context/MyContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../Loader/Loader";
import DateTimePicker from "@react-native-community/datetimepicker";
import LayoutWrapper from "../LayoutWrapper";
import Checkbox from "expo-checkbox"; // or react-native-paper checkbox
import  Modal  from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import styles from "../../styles/Projects/UpdateProjectForm";

const UpdateProjectForm = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showCompleteDatePicker, setShowCompleteDatePicker] = useState(false);

  const [projectData, setProjectData] = useState({
    projectId: "",
    projectName: "",
    clientName: "",
    projectDescription: "",
    managerId: "",
    startDate: "",
    deadLine: "",
    projectStatus: "ONGOING",
    projectMembers: [],
  });
  const route = useRoute();
  const { id } = route.params || {};
  const { role, schemaName, employeeId, roleColors } = useContext(MyContext);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [goToPage, setGoToPage] = useState("");
  const [pageError, setPageError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filterEmployees, setFilterEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allFilterEmployees, setAllFilterEmployees] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigation = useNavigation();
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

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
      });
      console.log("response", response);
      setProjectData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const response = await axios.get(`${url}/api/projects/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
      });
      console.log("responses", response);
      setProjectMembers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/v1/employeeManager/projectEmployees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        }
      );
      let data = response.data;
      console.log("data", data);
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
      setFilterEmployees(data.slice((currentPage - 1) * 5, currentPage * 5));

      console.log("response", response.data);
    } catch (e) {
      console.log("e", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((schemaName, token, id)) {
      fetchProject();
      fetchProjectMembers();
      fetchEmployees();
    }
  }, [schemaName, token, id]);

  const allMembers = () => {
    let allMembers = [...projectMembers, ...employees];
    console.log("all members", allMembers);
    let data = [];
    for (let k of allMembers) {
      let isExist = data.some((each) => each.employeeId === k.employeeId);
      if (!isExist) {
        data.push(k);
      }
    }

    console.log("datas", data);

    setAllEmployees(data);
    setAllFilterEmployees(data);
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
    setAllFilterEmployees(data.slice((currentPage - 1) * 5, currentPage * 5));
  };

  useEffect(() => {
    allMembers();
  }, [employees, projectMembers]);

  const handleChange = ({ name, value }) => {
    // 1️⃣ Reset completed date if status is not COMPLETED
    if (name === "projectStatus" && value !== "COMPLETED") {
      setProjectData((prev) => ({
        ...prev,
        projectStatus: value,
        completeDate: "",
      }));
      return;
    }

    // 2️⃣ Max length validation
    if (
      (name === "projectName" || name === "clientName") &&
      value.length > 30
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Maximum character limit exceeded.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // 3️⃣ Capitalize first letter
    setProjectData((prev) => ({
      ...prev,
      [name]: value ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };

  const checkIsAdded = (empId) => {
    const isExist = projectData.projectMembers.some(
      (each) => each.employeeId === empId
    );
    console.log("isExist", isExist, empId);
    return isExist;
  };

  const handleAddEmployee = (newEmpId) => {
    let members = projectData.projectMembers;
    console.log("members", members, newEmpId);
    let isExist = members.some((each) => each.employeeId === newEmpId);

    if (!isExist) {
      let newMember = projectMembers.filter(
        (each) => each.employeeId === newEmpId
      )[0];
      if (!newMember) {
        newMember = {
          employeeId: newEmpId,
          employeeStatus: "ACTIVE",
          memberRole: "MEMBER",
        };
      }
      members.push(newMember);
      setProjectData((prev) => ({
        ...prev,
        projectMembers: members,
      }));
    } else {
      let filterMembers = members.filter(
        (each) => each.employeeId !== newEmpId
      );
      setProjectData((prev) => ({
        ...prev,
        projectMembers: filterMembers,
      }));
    }
  };

  const changeRole = (employeeId, role) => {
    let index = projectData.projectMembers.findIndex(
      (member) => member.employeeId === employeeId
    );
    let index1 = allEmployees.findIndex(
      (member) => member.employeeId === employeeId
    );

    let index2 = allFilterEmployees.findIndex(
      (member) => member.employeeId === employeeId
    );

    let members = projectData.projectMembers;
    members[index].memberRole = role;
    let allEmps = allEmployees;
    allEmps[index1].memberRole = role;

    let filterEmps = allFilterEmployees;
    filterEmps[index2].memberRole = role;

    setAllEmployees(allEmps);
    setAllFilterEmployees(filterEmps);

    setProjectData((prev) => ({
      ...prev,
      projectMembers: members,
    }));
  };

  const changeStatus = (employeeId, status) => {
    let index = projectData.projectMembers.findIndex(
      (member) => member.employeeId === employeeId
    );

    let index1 = allEmployees.findIndex(
      (member) => member.employeeId === employeeId
    );

    let index2 = allFilterEmployees.findIndex(
      (member) => member.employeeId === employeeId
    );

    let members = projectData.projectMembers;
    members[index].employeeStatus = status;

    let allEmps = allEmployees;
    allEmps[index1].employeeStatus = status;

    let filterEmps = allFilterEmployees;
    filterEmps[index2].employeeStatus = status;

    setAllEmployees(allEmps);
    setAllFilterEmployees(filterEmps);

    setProjectData((prev) => ({
      ...prev,
      projectMembers: members,
    }));
  };

  const selectAll = () => {
    console.log("eeeee");

    if (
      projectData.projectMembers.length === allEmployees.length &&
      projectData.projectMembers.length > 0
    ) {
      setProjectData((prev) => ({
        ...prev,
        projectMembers: [],
      }));
    } else {
      let existingMembers = projectData.projectMembers;
      for (let m of allEmployees) {
        const isExist = existingMembers.some(
          (each) => each.employeeId === m.employeeId
        );
        if (!isExist) {
          let newMember = {
            employeeId: m.employeeId,
            employeeStatus: "ACTIVE",
            memberRole: "MEMBER",
          };
          existingMembers.push(newMember);
        }
      }
      setProjectData((prev) => ({
        ...prev,
        projectMembers: existingMembers,
      }));
    }
  };
  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 10) * 10;
    setDisplayedPageNo(noOfPages.slice(start, start + 10));
  };

  const pagination = (nextPage) => {
    setAllFilterEmployees(allEmployees.slice((nextPage - 1) * 5, nextPage * 5));
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
    let filterByName = allEmployees.filter((each) =>
      (each.firstName + " " + each.lastName)
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    let filterByJobRole = allEmployees.filter((each) =>
      each.jobRole.toLowerCase().includes(searchText.toLowerCase())
    );
    let allData = [...filterByName, ...filterByJobRole];
    let filteredData = [];
    for (let r of allData) {
      let b = true;
      for (let d of filteredData) {
        if (r.employeeId === d.employeeId) {
          b = false;
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
    setAllFilterEmployees(data.slice((1 - 1) * 5, 1 * 5));
  };

  useEffect(() => {
    filterData();
  }, [searchText]);

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
    if (
      projectData.projectStatus === "COMPLETED" &&
      projectData.completeDate === null
    ) {
      newErrors.completeDate = "completed date is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors(null);
    console.log("projectData", projectData);
    const validate = validation();

    if (Object.keys(validate).length > 0) {
      setErrors(validate);
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/projects/${id}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        }
      );
      console.log(response.data);

      setIsUpdate(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <LayoutWrapper>
      <ScrollView>
        {isLoading && <Loader />}
        {isUpdate && (
          <Modal transparent animationType="fade" isVisible={isUpdate}>
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.message}>
                  Project Updated Successfully!
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
        )}
        <View style={styles.container}>
          <View style={styles.rowAlign}>
            <Text style={styles.heading}>Update Project</Text>
            <AntDesign
              name="close-circle"
              size={24}
              onPress={() => navigation.navigate("Projects/Projects")}
            />
          </View>
          <Text style={styles.para}>You can update project details and edit team members</Text>
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
                  handleChange({ name: "projectName", value: text })
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
                  handleChange({ name: "clientName", value: text })
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
                      handleChange({
                        name: "startDate",
                        value: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD
                      });
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
          handleChange({
            name: "deadLine",
            value: selectedDate.toISOString().split("T")[0],
          });
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
                handleChange({ name: "projectDescription", value: text })
              }
            />

            {errors?.projectDescription && (
              <Text style={styles.errorText}>{errors.projectDescription}</Text>
            )}
          </View>

          <View>
            {/* project status */}
            <View style={styles.inputColumn}>
              <Text style={styles.label}>Project Status</Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={projectData.projectStatus}
                  onValueChange={(value) =>
                    handleChange({ name: "projectStatus", value })
                  }
                >
                  <Picker.Item label="Ongoing" value="ONGOING" />
                  <Picker.Item label="Completed" value="COMPLETED" />
                  <Picker.Item label="On Hold" value="ONHOLD" />
                </Picker>
              </View>
            </View>
            {/* completed date */}
            <View style={styles.inputColumn}>
              <Text style={styles.label}>Completed Date</Text>

              <TouchableOpacity
                style={[
                  styles.dateInput,
                  projectData.projectStatus !== "COMPLETED" &&
                    styles.disabledInput,
                ]}
                disabled={projectData.projectStatus !== "COMPLETED"}
                onPress={() => setShowCompleteDatePicker(true)}
              >
                <Text
                  style={
                    projectData.completeDate
                      ? styles.dateText
                      : styles.placeholder
                  }
                >
                  {projectData.completeDate || "Select completed date"}
                </Text>
              </TouchableOpacity>

              {showCompleteDatePicker && (
                <DateTimePicker
                  value={
                    projectData.completeDate
                      ? new Date(projectData.completeDate)
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
                    setShowCompleteDatePicker(false);
                    if (selectedDate) {
                      handleChange({
                        name: "completeDate",
                        value: selectedDate.toISOString().split("T")[0],
                      });
                    }
                  }}
                />
              )}

              {errors?.completeDate && (
                <Text style={styles.errorText}>{errors.completeDate}</Text>
              )}
            </View>
          </View>

          {/* project members */}
          <Text style={styles.head}>Project Members</Text>
          <Text>
            Choose employees and set their roles and statuses for this project.
          </Text>
          <TextInput
             style={[styles.input, styles.disabledInput]}
            placeholder="Search by name or designation"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />

          {/* table */}

          <View style={styles.tableContainer}>
            <ScrollView  showsHorizontalScrollIndicator>
  {/* TABLE HEADER */}
  <View style={[styles.row, styles.headerRow]}>
    <View style={[styles.cell, styles.checkboxCol]}>
      <Checkbox
        value={projectData.projectMembers.length === allEmployees.length}
        onValueChange={selectAll}
      />
    </View>

    <Text style={[styles.cell, styles.nameCol]}>Name</Text>
    <Text style={[styles.cell, styles.designationCol]}>Designation</Text>
    <Text style={[styles.cell, styles.roleCol]}>Project Role</Text>
    <Text style={[styles.cell, styles.statusCol]}>Status</Text>
  </View>

  {/* TABLE BODY */}
  <View>
    {allFilterEmployees.length > 0 ? (
      allFilterEmployees.map((each, index) => (
        <View key={each.id ?? index} style={styles.row}>
          {/* Checkbox */}
          <View style={[styles.cell, styles.checkboxCol]}>
            <Checkbox
              value={checkIsAdded(each.employeeId)}
              onValueChange={() => handleAddEmployee(each.employeeId)}
            />
          </View>

          {/* Name */}
          <Text style={[styles.cell, styles.nameCol]}>
            {each.firstName} {each.lastName}
          </Text>

          {/* Designation */}
          <Text style={[styles.cell, styles.designationCol]}>
            {each.jobRole}
          </Text>

          {/* Project Role */}
          <View style={[ styles.roleStyle]}>
            <Picker
              enabled={checkIsAdded(each.employeeId)}
              selectedValue={each.memberRole || "MEMBER"}
            
              onValueChange={(value) =>
                changeRole(each.employeeId, value)
              }
            >
              <Picker.Item label="Team Member" value="MEMBER"   style={styles.roleName} />
              <Picker.Item label="Team Lead" value="TEAMLEAD"   style={styles.roleName} />
            </Picker>
          </View>

          {/* Status */}
          <View style={[ styles.roleStyle]}>
            <Picker
              enabled={checkIsAdded(each.employeeId)}
              selectedValue={each.employeeStatus || "ACTIVE"}
              onValueChange={(value) =>
                changeStatus(each.employeeId, value)
              }
            >
              <Picker.Item label="Active" value="ACTIVE" style={styles.roleName} />
              <Picker.Item label="Inactive" value="INACTIVE" style={styles.roleName} />
            </Picker>
          </View>
        </View>
      ))
    ) : (
      <Text style={styles.noData}>
        No employees available to assign to the project.
      </Text>
    )}
  </View>
  </ScrollView>
</View>


          {/* {pagination} */}
          {noOfPages.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent :'center' }}>
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

          <TouchableOpacity onPress={handleSubmit} style={{alignItems :'center'}}>
            <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Update Project</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
};

export default UpdateProjectForm;
