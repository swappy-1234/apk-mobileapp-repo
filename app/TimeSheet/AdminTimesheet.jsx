import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import LayoutWrapper from "../LayoutWrapper";
import AdminCard from "./AdminCard";
import Loader from "../Loader/Loader";

const AdminTimesheet = () => {
  
    const [timesheetsData, setTimesheetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState({});
  const [jumpPage, setJumpPage] = useState({});
  const [errorMsg, setErrorMsg] = useState({});
  const navigation = useNavigation();
  const [weekOptions, setWeekOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [storedData, setStoredData] = useState(null);
    const [id, setId] = useState("");
  
    const fetchStoredData = async () => {
  try {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    if (stored && tenant) {
      const parsedStored = JSON.parse(stored);
      const parsedTenant = JSON.parse(tenant);

      setStoredData(parsedStored);
      setId(parsedTenant);
    }
  } catch (e) {
    console.error("AsyncStorage error", e);
  }
};

  
    useEffect(() => {
      fetchStoredData();
    }, []);
  
    const token = storedData?.token;
    const role = storedData?.role;
    const managerId = storedData?.employeeId;

    console.log("token role managerId : ", token, role, managerId);

 useEffect(() => {
    if (!timesheetsData || timesheetsData.length === 0) return;
    setClientOptions(extractClients(timesheetsData));
    setWeekOptions(extractWeeks(timesheetsData));
    setMonthOptions(extractMonths(timesheetsData));
  }, [timesheetsData]);

  useEffect(() => {
    applyFilters();

    const updatedMonths = extractMonths(timesheetsData, selectedClient);
    setMonthOptions(updatedMonths);

    if (selectedMonth && !updatedMonths.includes(selectedMonth)) {
      setSelectedMonth("");
      setSelectedWeek("");
    }

    const updatedWeeks = extractWeeks(
      timesheetsData,
      selectedMonth,
      selectedClient
    );
    setWeekOptions(updatedWeeks);
  }, [selectedClient, selectedMonth, selectedWeek, timesheetsData]);

  const extractClients = (data) => {
    const set = new Set();
    data.forEach((c) => set.add(c.clientName));
    return [...set];
  };

  const extractWeeks = (data, monthFilter = "", clientFilter = "") => {
    const set = new Set();
    const allDates = [];

    data.forEach((ts) => {
      if (clientFilter && ts.clientName !== clientFilter) return;

      ts.employees?.forEach((emp) => {
        Object.keys(emp.daysAndHours).forEach((date) => {
          const d = new Date(date);

          const monthLabel = d.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });

          if (monthFilter && monthLabel !== monthFilter) return;

          allDates.push(d);
        });
      });
    });

    // If no dates found (client has no data for selected month)
    if (allDates.length === 0) return [];

    allDates.sort((a, b) => a - b);

    allDates.forEach((date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);

      const mon = new Date(d.setDate(diff));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const fmt = (x) =>
        x.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

      set.add(`${fmt(mon)} - ${fmt(sun)}`);
    });

    return [...set];
  };

  const applyFilters = () => {
    if (!timesheetsData.length) return;

    let result = [...timesheetsData];

    if (selectedClient) {
      result = result.filter((ts) => ts.clientName === selectedClient);
    }

    result = result
      .map((ts) => ({
        ...ts,
        employees: ts.employees
          .map((emp) => {
            const filteredDays = Object.entries(emp.daysAndHours).filter(
              ([date]) => {
                const d = new Date(date);

                const monthLabel = d.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                });

                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(d.setDate(diff));
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);

                const format = (x) =>
                  x.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  });

                const weekLabel = `${format(monday)} - ${format(sunday)}`;

                // Apply month and week conditions
                if (selectedMonth && monthLabel !== selectedMonth) return false;
                if (selectedWeek && weekLabel !== selectedWeek) return false;

                return true;
              }
            );

            return { ...emp, daysAndHours: Object.fromEntries(filteredDays) };
          })
          .filter((emp) => Object.keys(emp.daysAndHours).length > 0),
      }))
      .filter((ts) => ts.employees.length > 0);

    setFilteredData(result);

    const updatedWeeks = extractWeeks(
      timesheetsData,
      selectedMonth,
      selectedClient
    );

    if (selectedMonth && updatedWeeks.length === 0) {
      setSelectedWeek("");
    }

    setWeekOptions(updatedWeeks);
  };

  const extractMonths = (data, clientFilter = "") => {
    const monthSet = new Set();

    data.forEach((timesheet) => {
      if (clientFilter && timesheet.clientName !== clientFilter) return;

      timesheet.employees?.forEach((emp) => {
        Object.keys(emp.daysAndHours ?? {}).forEach((date) => {
          const d = new Date(date);

          const monthLabel = d.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });

          monthSet.add(monthLabel);
        });
      });
    });

    return [...monthSet];
  };

  const resetFilters = () => {
    setSelectedWeek("");
    setSelectedClient("");
    setSelectedMonth("");
    setFilteredData([]);
  };

  const handleNext = (key, length) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [key]: Math.min((prev[key] || 0) + 1, length - 1),
    }));
  };

  const handlePrev = (key, length) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }));
  };

  const handlePageInput = (key, val, length) => {
    const pageNum = parseInt(val);
    setJumpPage((prev) => ({ ...prev, [key]: val }));
    if (isNaN(pageNum)) return;
    if (pageNum < 1 || pageNum > length) {
      setErrorMsg((prev) => ({
        ...prev,
        [key]: `No such page found. Available pages: 1 - ${length}`,
      }));
      setTimeout(() => {
        setErrorMsg((prev) => ({ ...prev, [key]: "" }));
      }, 2000);
      return;
    }
    setCurrentSlide((prev) => ({ ...prev, [key]: pageNum - 1 }));
    setErrorMsg((prev) => ({ ...prev, [key]: "" }));
  };

  const handleAction = (employeeId, day, newStatus) => {
    setTimesheetsData((prev) => {
      return prev.map((sheet) => ({
        ...sheet,
        employees: sheet.employees.map((emp) =>
          emp.employeeId !== employeeId
            ? emp
            : {
                ...emp,
                daysAndHours: {
                  ...emp.daysAndHours,
                  [day]: { ...emp.daysAndHours[day], status: newStatus },
                },
                editMode: {
                  ...emp.editMode,
                  [day]: false,
                },
              }
        ),
      }));
    });
  };

  const toggleEditMode = (employeeId, day) => {
    console.log("Toggling edit mode for", employeeId, day);
    setTimesheetsData((prev) => {
      return prev.map((sheet) => ({
        ...sheet,
        employees: sheet.employees.map((emp) =>
          emp.employeeId !== employeeId
            ? emp
            : {
                ...emp,
                editMode: {
                  ...emp.editMode,
                  [day]: !emp.editMode?.[day],
                },
              }
        ),
      }));
    });
  };

  useEffect(() => {
  if (storedData?.token && storedData?.employeeId && id) {
    fetchAllTimesheets();
  }
}, [storedData, id]);

  function getWeekKey(timesheet) {
    const dates = Object.keys(timesheet.employees[0].daysAndHours || {});
    const sorted = dates.map((d) => new Date(d)).sort((a, b) => a - b);

    const start = sorted[0];
    const end = sorted[sorted.length - 1];

    const fmt = (d) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

    return `${fmt(start)} - ${fmt(end)}`;
  }

  const groupedTimesheets = timesheetsData.reduce((acc, ts) => {
    const cardKey = `${ts.projectTitle}-${ts.clientName}`;
    const weekKey = getWeekKey(ts);

    if (!acc[cardKey]) {
      acc[cardKey] = {};
    }

    if (!acc[cardKey][weekKey]) {
      acc[cardKey][weekKey] = {
        projectTitle: ts.projectTitle,
        clientName: ts.clientName,
        yearMonth: ts.yearMonth,
        managerId: ts.managerId,
        employees: ts.employees.map((emp) => ({
          ...emp,
          timesheetId: ts.timesheetId, // ✅ employee owns it
        })),
      };
    } else {
      acc[cardKey][weekKey].employees.push(
        ...ts.employees.map((emp) => ({
          ...emp,
          timesheetId: ts.timesheetId, // ✅ preserved correctly
        }))
      );
    }

    return acc;
  }, {});

  const fetchAllTimesheets = async () => {
    console.log("1");
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${url}/api/timesheet-data/manager/${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );

      const data = response.data.reverse();
      console.log("All timesheet data: ", response.data.reverse());
      setTimesheetsData(data);
    } catch (error) {
      console.error("Error fetching all timesheets", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!storedData) {
  return (
    <LayoutWrapper>
      <Text>Loading...</Text>
    </LayoutWrapper>
  );
}

    return(
        <LayoutWrapper>
            <ScrollView>
              {isLoading && <Loader />}
                <View>
                    <Text style={{fontWeight : '600', fontSize : 22, textAlign : 'center', color : roleColors[role]}}>Timesheet Management</Text>
                    {
                        Object.entries(groupedTimesheets).length > 0 ? (
                            <View>
                                 {Object.entries(groupedTimesheets).map(([cardKey, weeksObj]) => {
              const sortGroup = Object.values(weeksObj).sort((a, b) => {
                const aDates = Object.keys(a.employees[0].daysAndHours);
                const bDates = Object.keys(b.employees[0].daysAndHours);
                return new Date(bDates[0]) - new Date(aDates[0]);
              });
              const currentIndex = currentSlide[cardKey] || 0;
              const currentTimesheet = sortGroup[currentIndex];
              currentTimesheet.employees.forEach((e) =>
                console.log(e.employeeId, e.timesheetId)
              );

              console.log("Admin Timesheeeeeee", currentTimesheet);

              return (
                <AdminCard
                  key={cardKey}
                  keyValue={cardKey}
                  sortGroup={sortGroup}
                  currentSlide={currentIndex}
                  currentIndex={currentIndex}
                  currentTimesheet={currentTimesheet}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handlePageInput={handlePageInput}
                  errorMsg={errorMsg}
                  jumpPage={jumpPage}
                  toggleEditMode={toggleEditMode}
                  handleAction={handleAction}
                  fetchAllTimesheets={fetchAllTimesheets}
                />
                
              );
            })}
                                </View>
                        ) : (
                            <View>
                                {/* not found image */}
                                </View>
                        )
                    }

                </View>
            </ScrollView>
        </LayoutWrapper>
    )
};

export default AdminTimesheet;