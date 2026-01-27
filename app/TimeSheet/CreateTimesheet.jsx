import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Loader from "../Loader/Loader";
import {
  startOfWeek,
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
} from "date-fns";
import LayoutWrapper from "../LayoutWrapper";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/TimeSheet/CreateTimesheet";
import Modal from "react-native-modal";
import { MyContext } from "../Context/MyContext";

const CreateTimesheet = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [weeksInMonth, setWeeksInMonth] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    startDate: "",
    endDate: "",
  });
  const context = useContext(MyContext);
  const [showMonthPicker, setShowMonthPicker] = useState(false);


  if (!context) {
    throw new Error("MyContext must be used inside MyProvider");
  }

  const { state, setState, setRole, role, employeeId } = context;

  const [currentWeek, setCurrentWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timesheetExitOrNot, setTimesheetExistOrNot] = useState([]);
  const [timesheetCreated, setTimesheetCreated] = useState({
    projectTitle: "",
    yearMonth: "",
    isTimesheetCreated: false,
  });

  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();
  const [projectData, setProjectData] = useState(null);
  const isEmp = true;
  const [employeeName, setEmployeeName] = useState("");
  const [timesheetProjectData, setTimesheetProjectData] = useState({
    projectId: "",
    projectTitle: "",
    clientName: "",
    yearMonth: new Date().toISOString().slice(0, 7),
    employees: [
      {
        employeeName,
        employeeId: "",
        daysAndHours: {},
      },
    ],
  });
  const [storedData, setStoredData] = useState("");
  const [isId, setId] = useState("");

  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response cretae : ", JSON.parse(stored));
    setStoredData(JSON.parse(stored));
    setId(JSON.parse(tenant));
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const token = storedData?.token;

  console.log("role : ", role, employeeId, state);

  useEffect(() => {
    console.log("State in Create Timesheet:", state);
    if (state?.firstName && state?.lastName) {
      console.log("State in Create Timesheet:", state);
      setEmployeeName(`${state.firstName} ${state.lastName}`);
    }
  }, [state]);

  const isTimeSheetCreatedForEmployee = (employeeId) => {
    let isTimeSheetExist = false;
    for (let timesheet of timesheetExitOrNot) {
      for (let emp of timesheet.employees) {
        if (
          Object.keys(emp.daysAndHours).length > 0 &&
          emp.employeeId === employeeId
        ) {
          isTimeSheetExist = true;

          break;
        }
      }
      if (isTimeSheetExist) {
        break;
      }
    }

    return isTimeSheetExist;
  };

  useEffect(() => {
    let startDate;
    let endDate;
    if (selectedWeek.length === 0) {
      return;
    }
    for (let week of selectedWeek) {
      const notInMonth = week.getMonth() !== selectedMonth.getMonth();
      if (selectedWeek[0] === week) {
        setSelectedDates((prev) => ({
          ...prev,
          startDate: week,
        }));
      }
      if (!notInMonth) {
        let formattedDate = format(week, "yyyy-MM-dd");
        if (selectedWeek[0] === week) {
          setSelectedDates((prev) => ({
            ...prev,
            startDate: formattedDate,
          }));
          startDate = formattedDate;
        } else if (selectedWeek[selectedWeek.length - 1] === week) {
          setSelectedDates((prev) => ({
            ...prev,
            endDate: formattedDate,
          }));
          endDate = formattedDate;
        }
      }
    }
    checkTimesheetCreatedOrNot(startDate, endDate);
  }, [selectedWeek]);

  useEffect(() => {
    const fetchProjectsById = async () => {
 setIsLoading(true);
      console.log("fetch projects", employeeId)
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": isId,
          },
        });
        setProjectData(response.data);

        let empList = [];
        let member = response.data.projectMembers.filter(
          (each) => each.employeeId === employeeId
        );

        let employee = {
          employeeName: employeeName,
          employeeId: member.employeeId,
          daysAndHours: {},
        };
        empList.push(employee);
        setTimesheetProjectData((prev) => ({
          ...prev,
          projectId: response.data.id,
          clientName: response.data.clientName,
          managerId: response.data.managerId,
          projectTitle: response.data.projectName,
          employees: empList,
        }));
      } catch (error) {
        console.error("Error fetching project data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if(employeeId){
      fetchProjectsById();
    }
  }, [employeeName, employeeId, id, token, isId]);

  const checkTimesheetCreatedOrNot = async (startDate, endDate) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/timesheet-data/projectId/${id}/startWeek/${startDate}/endWeek/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": isId,
          },
        }
      );
      const data = response.data;
      setTimesheetExistOrNot(data);
    } catch (error) {
      console.error("Error fetching timesheet created or not", error);
      setTimesheetExistOrNot([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWeek.length > 0 && projectData !== null) {
      let empList = [];

      for (let member of projectData.projectMembers) {
        if (member.employeeId !== employeeId) {
          continue;
        }
        let newWeekHours = {};
        let isTimeSheetExist = false;
        for (let timesheet of timesheetExitOrNot) {
          for (let emp of timesheet.employees) {
            if (
              Object.keys(emp.daysAndHours).length > 0 &&
              emp.employeeId === member.employeeId
            ) {
              isTimeSheetExist = true;
              newWeekHours = emp.daysAndHours;
              break;
            }
          }
          if (isTimeSheetExist) {
            break;
          }
        }
        if (!isTimeSheetExist) {
          for (let week of selectedWeek) {
            const notInMonth = week.getMonth() !== selectedMonth.getMonth();
            if (selectedWeek[0] === week) {
              setSelectedDates((prev) => ({
                ...prev,
                startDate: week,
              }));
            }
            if (!notInMonth) {
              let formattedDate = format(week, "yyyy-MM-dd");
              if (selectedWeek[0] === week) {
                setSelectedDates((prev) => ({
                  ...prev,
                  startDate: formattedDate,
                }));
              } else if (selectedWeek[selectedWeek.length - 1] === week) {
                setSelectedDates((prev) => ({
                  ...prev,
                  endDate: formattedDate,
                }));
              }
              newWeekHours[formattedDate] = {
                hours: hoursValue(formattedDate),
                employeeHours: hoursValue(formattedDate),
                status: "PENDING",
                comment: "",
              };
            }
          }
        }

        let employee = {
          employeeName: employeeName,
          employeeId: member.employeeId,
          daysAndHours: newWeekHours,
        };
        empList.push(employee);
      }

      setTimesheetProjectData((prev) => ({
        ...prev,
        projectId: projectData.id,
        clientName: projectData.clientName,
        managerId: projectData.managerId,
        projectTitle: projectData.projectName,
        employees: empList,
      }));
    }
  }, [selectedWeek, projectData, timesheetExitOrNot, employeeName,employeeId]);

  const convertDate = (newDate) => {
    const date = new Date(newDate);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const firstDayOfMonth = `${year}-${month}-01`;
    return firstDayOfMonth;
  };

  const convertTodayDate = (newDate) => {
    const date = new Date(newDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because months are 0–11
    const year = date.getFullYear();

    const formatted = `${year}-${month}-${day}`;
    return formatted;
  };

  useEffect(() => {
    if (!projectData?.startDate) return;
    let projectStartDate;
    if (projectData.startDate >= convertDate(selectedMonth)) {
      projectStartDate = projectData.startDate;
    } else {
      projectStartDate = new Date(selectedMonth);
    }

    const firstWeekStart = startOfWeek(projectStartDate, { weekStartsOn: 1 });
    const monthEnd = endOfMonth(selectedMonth);
    const weeks = [];
    let currentWeekStart = firstWeekStart;
    while (currentWeekStart <= monthEnd) {
      const week = Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeekStart, i)
      );

      weeks.push(week);
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    setWeeksInMonth(weeks);
    const today = new Date();
    let activeWeekIndex = 0;
    if (convertTodayDate(today) >= projectStartDate) {
      const foundWeek = weeks.findIndex((week) =>
        week.some(
          (d) =>
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        )
      );
      activeWeekIndex = foundWeek !== -1 ? foundWeek : 0;
    }
    setCurrentWeek(activeWeekIndex);
    setSelectedWeek(weeks[activeWeekIndex]);

    if (timesheetCreated.isTimesheetCreated) {
      const timer = setTimeout(() => {
        setTimesheetCreated({
          isTimesheetCreated: false,
        });
      }, 5000);
      const handleClick = () => {
        clearTimeout(timer);
        setTimesheetCreated({
          isTimesheetCreated: false,
        });
      };
      // document.addEventListener('click', handleClick);

      return () => {
        clearTimeout(timer);
        // document.removeEventListener('click', handleClick);
        navigation.navigate("TimeSheet/EmployeeTimesheet");
      };
    }
  }, [selectedMonth, projectData, timesheetCreated.isTimesheetCreated, navigation]);

  const handleMonthChange = (event, date) => {
  setShowMonthPicker(false);

  if (!date) return;

  setSelectedMonth(date);

  setTimesheetProjectData((prev) => ({
    ...prev,
    yearMonth: format(date, "yyyy-MM"),
  }));
};


  const handleWeekChange = (index) => {
    if (selectedWeek === weeksInMonth[index]) {
      return;
    }
    setCurrentWeek(index);
    setSelectedWeek(weeksInMonth[index]);
    let emplList = [...timesheetProjectData.employees];
    let newEmpList = [];
    for (let emp of emplList) {
      let empDetails = {
        employeeName: employeeName,
        employeeId: emp.employeeId,
        daysAndHours: {},
      };
      newEmpList.push(empDetails);
    }

    setTimesheetProjectData((prev) => ({
      ...prev,
      employees: newEmpList,
    }));
  };

  const handleHourChange = (empId, date, value) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    setTimesheetProjectData((prevData) => {
      const updatedEmployees = prevData.employees.map((emp) => {
        if (emp.employeeId === empId) {
          const daysAndHours = { ...emp.daysAndHours };
          daysAndHours[formattedDate] = {
            hours: hoursValue(formattedDate),
            employeeHours: Number(value),
            status: daysAndHours[formattedDate]?.status || "PENDING",
            comment: daysAndHours[formattedDate]?.comment || "",
          };
          return { ...emp, daysAndHours };
        }
        return emp;
      });

      return { ...prevData, employees: updatedEmployees };
    });
  }; 

  const hoursValueDisplay = (empId, date) => {
    const emp = timesheetProjectData.employees.find(
      (each) => each.employeeId === empId
    );
    const dateKey = format(date, "yyyy-MM-dd");
    const val = emp?.daysAndHours?.[dateKey]?.employeeHours ?? 0;
    return val;
  };

  const hoursValue = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6 ? 0 : 8;
  };

  const getWeeklyTotal = (employeeId) => {
    const emp = timesheetProjectData.employees.find(
      (each) => each.employeeId === employeeId
    );

    if (!emp || !emp.daysAndHours) return 0;
    const total = selectedWeek.reduce((sum, date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const sortHours = emp.daysAndHours?.[dateKey]?.employeeHours;
      let hrs;
      if (date.getMonth() !== selectedMonth.getMonth()) {
        hrs = 0;
      } else if (sortHours !== undefined && sortHours !== null) {
        hrs = parseFloat(sortHours);
      } else {
        const day = date.getDay();
        hrs = day === 0 || day === 6 ? 0 : 8;
      }
      return sum + hrs;
    }, 0);

    return total;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        projectId: timesheetProjectData.projectId,
        projectTitle: timesheetProjectData.projectTitle,
        clientName: timesheetProjectData.clientName,
        managerId: timesheetProjectData.managerId,
        yearMonth: format(selectedMonth, "yyyy-MMM").toUpperCase(),
        employees: timesheetProjectData.employees,
      };

      // Send POST request
      // if (timesheetExitOrNot.length === 0) {
      await axios.post(`${url}/api/timesheet-data`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": isId,
        },
      });

      setTimesheetCreated({
        projectTitle: timesheetProjectData.projectTitle,
        yearMonth: timesheetProjectData.yearMonth,
        isTimesheetCreated: true,
      });

      // navigate('/admin-timesheet')
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Error submitting timesheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmployeeExist = (employeeId) => {
    return timesheetProjectData.employees.some(
      (member) => member.employeeId === employeeId
    );
  };

  const handleSelectEmployees = (empId, employeeName) => {
    const isExist = timesheetProjectData.employees.some(
      (member) => member.employeeId === empId
    );

    if (isExist) {
      const employessList = timesheetProjectData.employees.filter(
        (each) => each.employeeId !== empId
      );

      setTimesheetProjectData((prev) => ({
        ...prev,
        employees: employessList,
      }));
    } else {
      const employessList = [...timesheetProjectData.employees];
      let newWeekHours = {};
      for (let week of selectedWeek) {
        const notInMonth = week.getMonth() !== selectedMonth.getMonth();
        if (!notInMonth) {
          let formattedDate = format(week, "yyyy-MM-dd");
          newWeekHours[formattedDate] = {
            hours: hoursValue(formattedDate),
            status: "PENDING",
            comment: "",
          };
        }
      }
      let employee = {
        employeeName: employeeName,
        employeeId: empId,
        daysAndHours: newWeekHours,
      };
      employessList.push(employee);
      setTimesheetProjectData((prev) => ({
        ...prev,
        employees: employessList,
      }));
    }
  };

  return (
    
      
      <LayoutWrapper>
        <ScrollView style={styles.container}>
           {isLoading && <Loader />}
      {/* ===== Project Header ===== */}
      <View style={styles.header}>
       
       <View>
         <Text style={styles.label}>Project</Text>
        <Text style={[styles.value, { color: roleColors[role] }]}>
          {projectData?.projectName}
        </Text>
       </View>

       <View>
         <Text style={styles.label}>Client</Text>
        <Text style={[styles.value, { color: roleColors[role] }]}>
          {projectData?.clientName}
        </Text>
       </View>
      </View>

      {/* ===== Month Selector ===== */}
      <View style={styles.monthRow}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={22} />
        </TouchableOpacity>

        {/* <Text style={styles.monthText}>
          {format(selectedMonth, "MMMM yyyy")}
        </Text> */}

        <TouchableOpacity
  onPress={() => setShowMonthPicker(true)}
  style={styles.monthPicker}
>
 <Text style={styles.monthText}>
  {format(selectedMonth, "MMMM yyyy")}
</Text>

</TouchableOpacity>
{showMonthPicker && (
  <DateTimePicker
    value={selectedMonth}
    mode="date"
    display="spinner"
    minimumDate={new Date()}
    onChange={handleMonthChange}
  />
)}



        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={22} />
        </TouchableOpacity>
      </View>

      {/* ===== Week Selector ===== */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weeksInMonth.map((week, index) => {
          const label = `${format(week[0], "d MMM")} - ${format(
            week[6],
            "d MMM"
          )}`;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleWeekChange(index)}
              style={[
                styles.weekPill,
                currentWeek === index && {
                  backgroundColor: roleColors[role],
                },
              ]}
            >
              <Text
                style={[
                  styles.weekText,
                  currentWeek === index && { color: "#fff" },
                ]}
              > 
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ===== Employee Card ===== */}
      {projectData?.projectMembers.map(
        (emp) =>
          emp.employeeId === employeeId && (
            <View key={emp.employeeId} style={styles.card}>
             <Text style={styles.empName}>
  {state?.firstName || ""} {state?.lastName || ""}
</Text>

              <Text style={styles.empId}>{emp.employeeId}</Text>

              {/* ===== Daily Hours ===== */}
              {selectedWeek.map((date, i) => {
                const disabled =
                  date.getMonth() !== selectedMonth.getMonth() ||
                  isTimeSheetCreatedForEmployee(emp.employeeId);

                return (
                  <View key={i} style={styles.dayRow}>
                    <Text style={styles.dayLabel}>
                      {format(date, "EEE, d MMM")}
                    </Text>

                    <TextInput
                      style={[
                        styles.input,
                        disabled && styles.disabledInput,
                      ]}
                      keyboardType="numeric"
                      placeholder="hrs"
                      value={String(
                        hoursValueDisplay(emp.employeeId, date) || ""
                      )}
                      editable={!disabled}
                      onChangeText={(val) => {
                        let value = Number(val);
                        if (value > 12) value = 12;
                        if (value < 0) value = 0;
                        handleHourChange(emp.employeeId, date, value);
                      }}
                    />
                  </View>
                );
              })}

              {/* ===== Total ===== */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {getWeeklyTotal(emp.employeeId)} hrs
                </Text>
              </View>
            </View>
          )
      )}

      {/* ===== Submit ===== */}
      {!isTimeSheetCreatedForEmployee(employeeId) && (
        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: roleColors[role] },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit Timesheet</Text>
        </TouchableOpacity>
      )}

     <Modal isVisible={timesheetCreated.isTimesheetCreated}>
  <View style={styles.modalContainer}>
    <Text style={styles.modalText}>
      Timesheet for{" "}
      <Text style={styles.boldText}>
        {timesheetCreated.projectTitle}
      </Text>{" "}
      has been successfully created
      {/* <Text style={styles.boldText}>
        {format(weeksInMonth[currentWeek][0], "d MMM")} -{" "}
        {format(weeksInMonth[currentWeek][6], "d MMM")}
      </Text> */}
      .
    </Text>


    <TouchableOpacity
      style={[
        styles.okButton,
        { backgroundColor: roleColors[role] },
      ]}
      onPress={() => {
        setTimesheetCreated({
          projectTitle: "",
          yearMonth: "",
         
        });
        navigation.navigate("TimeSheet/EmployeeTimesheet");
      }}
    >
      <Text style={styles.okText}>OK</Text>
    </TouchableOpacity>
  </View> 
</Modal>
 
    </ScrollView>
      </LayoutWrapper>
    
  );
};

export default CreateTimesheet;
