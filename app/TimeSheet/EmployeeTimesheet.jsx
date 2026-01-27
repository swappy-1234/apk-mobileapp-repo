import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  EvilIcons,
  Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LayoutWrapper from "../LayoutWrapper";
import styles from "../../styles/TimeSheet/EmployeeTimesheet";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import Loader from "../Loader/Loader";

const EmployeeTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [isTimesheetOpen, setIsTimesheetOpen] = useState(false);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState(null);
  const [selectedEmployeeData, setSelectEmployeeData] = useState("");
  const [statusData, setStatusData] = useState([]);
  const [selectedDateUpdate, setSelectedDateUpdate] = useState("");
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //  {pagination}
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

        // console.log("Stored response:", JSON.parse(stored));
      } catch (error) {
        console.error("Error fetching AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  const employeeId = data.employeeId;
  const token = data?.token;
  const role = data?.role;
  console.log("token : ", token);
  console.log("company : ", id);

  const fetchEmployeeData = async () => {
    setIsLoading(true);
    try {
      console.log("inside fetch employee");
      const response = await axios.get(
        `${url}/api/timesheet-data/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        },
      );

      console.log("Response Data", response.data);
      const data = response.data.reverse();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt || b.timesheetId) -
          new Date(a.createdAt || a.timeSheetId),
      );
      const pageSize = 5;
      const totalPages = Math.ceil(sortedData.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      setTimesheetData(sortedData);
      setPaginationData(sortedData);
      setNoOfPages(pages);
      setDisplayedPageNo(pages.slice(0, 3));
      setCurrentPage(1);
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          setSelectEmployeeData((prev) => ({
            ...prev,
            [item.timesheetId]: item,
          }));
        });
      }
      //   console.log("Employee Timesheet Data:", data);
    } catch (error) {
      console.error("Error fetching employee data", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (data && id) {
      fetchEmployeeData();
    }
  }, [data, id]);

  const handleAddExtraHours = (date, value) => {
    console.log("val : ", value);
    let updateList = [...statusData];
    let index = updateList.findIndex((each) => each.date === date);
    if (index !== -1) {
      updateList[index] = {
        date: date,
        employeeHours: value,
        status: "PENDING",
        comments: "",
      };
      console.log("upd : ", updateList[index]);
      setStatusData(updateList);
    } else {
      let newData = {
        date: date,
        status: "PENDING",
        employeeHours: value,
        comments: "",
      };
      updateList.push(newData);
      setStatusData(updateList);
    }
  };

  console.log("status : ", statusData);

  // const employeeHoursOnDate=(date)=>{
  //   let updateList = [...statusData];
  //   let index = updateList.findIndex((each) => each.date === date);
  //   return updateList[index].employeeHours;
  // }
  const employeeHoursOnDate = (date) => {
    const row = statusData?.find((each) => each.date === date);
    return row?.employeeHours ?? 0;
  };
  const handleGoToPage = (pageNum) => {
    const totalPages = noOfPages.length;
    // if (!pageNum || pageNum < 1 || pageNum > totalPages) {
    //   setPageError(
    //     `Please enter a valid page number between 1 and ${totalPages}`
    //   );
    //   return;
    // }
    pagination(pageNum);
    //  setPageError(false);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  const pagination = (page) => {
    setTimesheetData(paginationData.slice((page - 1) * 5, page * 5));
    setCurrentPage(page);
    updateDisplayedPages(page);
  };

  const btnStatusChange = (date) => {
    let selectedDate = statusData.filter((each) => each.date === date);

    if (selectedDate) {
      return selectedDate[0]?.status;
    } else {
      return "";
    }
  };

  const handleView = (timesheetId) => {
    setSelectedTimesheetId(timesheetId);
    setIsTimesheetOpen(true);
  };

  const handleSelectTimesheet = (id) => {
    let employeeData = selectedEmployeeData[id];
    resetStatusData(id);
    setCurrentData(employeeData || []);
    setSelectedTimesheetId(id);
    setIsTimesheetOpen(true);
  };

  const resetStatusData = (id) => {
    let timeSheetId;
    if (id) {
      timeSheetId = id;
    } else {
      timeSheetId = selectedTimesheetId;
    }
    let employeeData = selectedEmployeeData[timeSheetId];
    let updateList = [];
    Object.keys(employeeData.employees[0].daysAndHours).forEach((each) => {
      let newData = {
        date: each,
        employeeHours:
          employeeData.employees[0].daysAndHours[each].employeeHours,
        status: employeeData.employees[0].daysAndHours[each].status,
        comments: "",
      };
      updateList.push(newData);
    });

    console.log("updateList", updateList);
    setStatusData(updateList);
  };

  // const currentData = selectedEmployeeData[selectedTimesheetId] || [];
  // console.log("Current Data", currentData);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${url}/api/timesheet-data/${selectedTimesheetId}/employee/${employeeId}/status`,
        statusData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        },
      );

      //   console.log("Handle submit", response.data);
      setStatusData([]);
      setIsTimesheetOpen(false);
      setSelectedDateUpdate("");
      fetchEmployeeData();
    } catch (error) {
      console.error("Error submiting employee timesheet data", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   console.log("len", currentData?.employees);

  const weekStartDateAndEndDate = (each) => {
    console.log("each", each);
    const daysAndHours = each.employees[0].daysAndHours;

    const lastDate = Object.keys(daysAndHours)
      .sort((a, b) => new Date(a) - new Date(b)) // sort chronologically
      .at(-1);

    const startDate = Object.keys(each.employees[0].daysAndHours).sort(
      (a, b) => new Date(a) - new Date(b),
    )[0];
    return (
      <View>
        <Text>{startDate}</Text> <Text style={{ fontWeight: "bold" }}>-</Text>{" "}
        <Text>{lastDate}</Text>
      </View>
    );
  };

  // const startDateAndLastDate = () => {
  //   const daysAndHours = currentData.employees[0].daysAndHours;

  //   const lastDate = Object.keys(daysAndHours)
  //     .sort((a, b) => new Date(a) - new Date(b)) // sort chronologically
  //     .at(-1);

  //   const startDate = Object.keys(currentData.employees[0].daysAndHours).sort(
  //     (a, b) => new Date(a) - new Date(b)
  //   )[0];
  //   return (
  //     <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
  //       Week: <Text style = {{marginHorizontal : 10, fontSize : 15}}>{startDate}</Text>{" "}
  //       <Text style={{ fontWeight: "bold", fontSize : 30, }}>-</Text>
  //       <Text style = {{marginHorizontal : 10, fontSize : 15}}>{lastDate}</Text>
  //     </View>
  //   );
  // };
  const startDateAndLastDate = () => {
    if (
      !currentData ||
      !currentData.employees ||
      currentData.employees.length === 0 ||
      !currentData.employees[0].daysAndHours
    ) {
      return null; // or a placeholder view
    }

    const daysAndHours = currentData.employees[0].daysAndHours;

    const dates = Object.keys(daysAndHours).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    const startDate = dates[0];
    const lastDate = dates.at(-1);

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Week: </Text>
        <Text style={{ marginHorizontal: 10, fontSize: 15 }}>{startDate}</Text>
        <Text style={{ fontWeight: "bold", fontSize: 30 }}>-</Text>
        <Text style={{ marginHorizontal: 10, fontSize: 15 }}>{lastDate}</Text>
      </View>
    );
  };

  const getDay = (newDate) => {
    const date = new Date(newDate);

    // Get the day of the week (0 = Sunday, 6 = Saturday)
    const dayNumber = date.getDay();

    // Map the day number to a name
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the day name
    return days[dayNumber];
  };

  const isSubmitShow = () => {
    let hasPending;
    // console.log("statusData", statusData);
    if (statusData.length === 0) {
      hasPending = true;
    } else {
      hasPending = statusData.some(
        (each) => each.employeeHours === null || each.employeeHours === "",
      );
    }

    // return !hasPending;
    let isDifferent = false;
    statusData.forEach((each) => {
      if (
        each.employeeHours !==
        currentData.employees[0].daysAndHours[each.date].employeeHours
      ) {
        isDifferent = true;
      }
    });

    return !hasPending && isDifferent;
  };

  const isMsgShow = () => {
    const hasPending = statusData.some((each) => each.status === "PENDING");
    return hasPending;
  };

  const isResetShow = () => {
    const hasPending = statusData.some(
      (each) => each.status === "ACCEPTED" || each.status === "REJECTED",
    );
    return hasPending; // show button only if no pending entries
  };

  //   const isSubmittedOrPending = (each) => {
  //   const daysAndHours = each?.employees?.[0]?.daysAndHours;

  //   if (!daysAndHours || Object.keys(daysAndHours).length === 0) {
  //     return true; // Treat as pending
  //   }

  //   const firstKey = Object.keys(daysAndHours)[0];
  //   const employeeHours = daysAndHours[firstKey]?.employeeHours;

  //   const isPending = employeeHours === null || employeeHours === "";

  //   return isPending;
  // };

  const isSubmittedOrPending = (each) => {
    const hours =
      each?.employees?.[0]?.daysAndHours &&
      Object.values(each.employees[0].daysAndHours)?.[0]?.employeeHours;

    return hours === null || hours === "";
  };

  console.log("timesheet data : ", timesheetData);
  console.log("current data : ", currentData);
  return (
    <>
      <LayoutWrapper>
        <ScrollView>
          {isLoading && <Loader />}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: roleColors[role],
              }}
            >
              Employee Timesheet Dashboard
            </Text>
            <View style={styles.createButton}>
              <AntDesign name="plus-circle" size={18} color="black" />
              <Text
                onPress={() =>
                  navigation.navigate("TimeSheet/TimesheetProjects")
                }
              >
                Create Timesheet
              </Text>
            </View>
            <View>
              {timesheetData.length > 0 ? (
                timesheetData.map((each) => (
                  <View key={each.timesheetId} style={styles.cardContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{each.projectTitle}</Text>
                      <Text style={{ fontSize: 14 }}>{each.clientName}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleSelectTimesheet(each.timesheetId)}
                    >
                      <Text style={{ textAlign: "right" }}>
                        <AntDesign name="arrow-right" size={18} />
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: isSubmittedOrPending(each)
                            ? "#FFA500"
                            : "green",
                        }}
                      >
                        {isSubmittedOrPending(each) ? "PENDING" : "SUBMITTED"}
                      </Text>
                      <Text>{each.yearMonth}</Text>
                    </View>
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
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontSize: 20,
                        borderWidth: 1,
                      }}
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
                      currentPage >= noOfPages.length
                        ? "not-allowed"
                        : "pointer",
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
                        noOfPages.length,
                      );

                      // Update displayed pages
                      setDisplayedPageNo(
                        noOfPages.slice(nextStart - 1, nextEnd),
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

            <View></View>
          </View>

          <Modal
            isVisible={isTimesheetOpen}
            onBackdropPress={() => setIsTimesheetOpen(false)}
            style={{ justifyContent: "flex-end", margin: 0 }}
          >
            <ScrollView>
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  height: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsTimesheetOpen(false);
                    setStatusData([]);
                    setSelectedDateUpdate("");
                  }}
                >
                  <Entypo name="cross" size={18} />
                </TouchableOpacity>

                {startDateAndLastDate()}
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {currentData &&
                  currentData.employees &&
                  currentData.employees.length > 0 ? (
                    currentData.employees.map((each) => {
                      console.log("each data", selectedTimesheetId);
                      if (each.employeeId !== employeeId) return null;

                      const dayData = Object.entries(each.daysAndHours).sort(
                        ([keyA], [keyB]) => {
                          return new Date(keyA) - new Date(keyB);
                        },
                      );
                      console.log("dayData", dayData);
                      return dayData.map(([date, value]) => (
                        <View key={date} style={styles.bottomCard}>
                          <Text style={{ textAlign: "center" }}>
                            {getDay(date).toUpperCase()}
                          </Text>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#000",
                              marginVertical: 10,
                            }}
                          />
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{ marginHorizontal: 10, fontSize: 20 }}
                            >
                              {value.hours}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 30,
                                marginHorizontal: 10,
                              }}
                            >
                              -
                            </Text>
                            <TextInput
                              keyboardType="numeric"
                              value={String(employeeHoursOnDate(date) ?? "")}
                              editable={value.status !== "ACCEPTED"}
                              style={[
                                styles.input,
                                value.status !== "ACCEPTED"
                                  ? styles.enabledInput
                                  : styles.disabledInput,
                              ]}
                              onChangeText={(text) => {
                                let v = Number(text);
                                if (v > 12) v = 12;
                                if (v < 0) v = 0;
                                handleAddExtraHours(date, v);
                              }}
                            />

                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 30,
                                marginHorizontal: 10,
                              }}
                            >
                              :
                            </Text>
                            <Text
                              style={{ marginHorizontal: 10, fontSize: 20 }}
                            >
                              {employeeHoursOnDate(date) - value.hours === 0 ? (
                                <Text>
                                  {employeeHoursOnDate(date) - value.hours}
                                </Text>
                              ) : (
                                <Text style={{ fontWeight: "bold" }}>
                                  {employeeHoursOnDate(date) - value.hours}
                                </Text>
                              )}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color:
                                value.status === "PENDING"
                                  ? "orange"
                                  : value.status === "ACCEPTED"
                                    ? "green"
                                    : "red",
                            }}
                          >
                            {value.status ?? "N/A"}
                          </Text>
                        </View>
                      ));
                    })
                  ) : (
                    <Text>Data Not Found</Text>
                  )}
                </View>
                {isSubmitShow() && (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  >
                    <Text style={styles.buttonText}>Submit All</Text>
                  </TouchableOpacity>
                )}
                {isMsgShow() && (
                  <Text style={{ color: "red" }}>
                    Enter the actual hours for each day before submitting.
                  </Text>
                )}
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>
      </LayoutWrapper>
    </>
  );
};

export default EmployeeTimesheet;
