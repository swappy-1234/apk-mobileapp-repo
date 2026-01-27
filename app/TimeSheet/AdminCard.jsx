import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import LayoutWrapper from "../LayoutWrapper";
import axios from "axios";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewShot from "react-native-view-shot";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import styles from "../../styles/TimeSheet/AdminCard";
import AdminTimesheetEmployeeRow from "./AdminTimesheetEmployeeRow";

const AdminCard = ({
  keyValue,
  sortGroup,
  currentSlide,
  handlePrev,
  handleNext,
  handlePageInput,
  errorMsg,
  jumpPage,
  currentIndex,
  currentTimesheet,
  toggleEditMode,
  handleAction,
  fetchAllTimesheets,
}) => {
  const [statusData, setStatusData] = useState(null);
  const [projectTitle, clientName] = keyValue.split("-");
  useEffect(() => {
    addStatusData();
  }, [currentIndex]);

  const [storedData, setStoredData] = useState("");
  const [id, setId] = useState("");

  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    setStoredData(JSON.parse(stored));
    setId(JSON.parse(tenant));
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  const token = storedData.token;
  const role = storedData.role;

  const handleApproveOrReject = (employeeId, date, action) => {
    const updateEmployee = [...statusData[employeeId]];

    const index = updateEmployee.findIndex((d) => d.date === date);

    if (index === -1) return; // Safety

    updateEmployee[index].status =
      updateEmployee[index].status === action ? "PENDING" : action;

    setStatusData((prev) => ({
      ...prev,
      [employeeId]: updateEmployee,
    }));
  };

  const handleCancel = (employeeId, date, action, day) => {
    const updateEmployee = [...statusData[employeeId]];
    console.log("timesheet", currentTimesheet);
    const selectedEmpHrs = currentTimesheet.employees.find(
      (e) => e.employeeId === employeeId
    ).daysAndHours;
    let status = action;
    for (let d of Object.keys(selectedEmpHrs)) {
      if (d === date) {
        status = selectedEmpHrs[date].status;
        break;
      }
    }

    console.log("status", status);

    const index = updateEmployee.findIndex((d) => d.date === date);

    if (index === -1) return; // Safety

    updateEmployee[index].status = status;

    setStatusData((prev) => ({
      ...prev,
      [employeeId]: updateEmployee,
    }));
  };

  const getStatus = (employeeId, date) => {
    const updateEmployee = statusData[employeeId];
    if (!updateEmployee) {
      return null;
    }
    let index;
    for (let i = 0; i < updateEmployee.length; i++) {
      if (updateEmployee[i].date === date) {
        index = i;
        break;
      }
    }
    if (!updateEmployee || !updateEmployee[index]) {
      return null;
    }
    return updateEmployee[index].status;
  };

  const reset = (employeeId) => {
    let emp = currentTimesheet.employees.filter(
      (each) => each.employeeId === employeeId
    )[0];
    let newData = [];
    for (let d of Object.keys(emp.daysAndHours)) {
      let data = {
        date: d,
        status: emp.daysAndHours[d].status,
        hours: emp.daysAndHours[d].hours,
        employeeHours: emp.daysAndHours[d].employeeHours,
        comments: "Ntg",
      };
      newData.push(data);
    }
    setStatusData((prev) => ({
      ...prev,
      [employeeId]: newData,
    }));
  };

  // const addStatusData = () => {
  //   for (let emp of currentTimesheet.employees) {
  //     let newEmployeeId = emp.employeeId;
  //     let newData = [];
  //     for (let d of Object.keys(emp.daysAndHours)) {
  //       let data = {
  //         date: d,
  //         status: emp.daysAndHours[d].status,
  //         hours: emp.daysAndHours[d].hours,
  //         employeeHours: emp.daysAndHours[d].employeeHours,
  //         comments: "Ntg",
  //       };
  //       newData.push(data);
  //     }
  //     setStatusData((prev) => ({
  //       ...prev,
  //       [newEmployeeId]: newData,
  //     }));
  //   }
  // };

  const addStatusData = () => {
  const temp = {};

  for (let emp of currentTimesheet.employees) {
    temp[emp.employeeId] = Object.keys(emp.daysAndHours).map((d) => ({
      date: d,
      status: emp.daysAndHours[d].status,
      hours: emp.daysAndHours[d].hours,
      employeeHours: emp.daysAndHours[d].employeeHours,
      comments: "Ntg",
    }));
  }

  setStatusData(temp);
};


  const weekDates = Object.keys(currentTimesheet.employees[0].daysAndHours)
    .map((d) => new Date(d))
    .sort((a, b) => a - b);

  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  const isSubmitShow = (employeeId) => {
    const empData = statusData[employeeId];
    if (!empData) return false;
    const isNull = Object.values(empData).some(
      (each) => each.employeeHours === null || each.employeeHours === ""
    );
    return !isNull;
  };

  const handleSubmit = async (employeeId) => {
    const isNull = statusData[employeeId].some(
      (each) => each.employeeHours === null || each.employeeHours === ""
    );
    if (isNull) {
      return;
    }
    try {
      const updatedData = statusData[employeeId].map((day) => {
        if (day.status === "PENDING") {
          return { ...day, status: "ACCEPTED" };
        }
        return day;
      });

      console.log(currentTimesheet.employees);

      const emp = currentTimesheet.employees.find(
        (e) => e.employeeId === employeeId
      );

      console.log(emp.timesheetId);

      setStatusData((prev) => ({
        ...prev,
        [employeeId]: updatedData,
      }));
      const response = await axios.put(
        `${url}/api/timesheet-data/${emp.timesheetId}/employee/${employeeId}/status`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      fetchAllTimesheets();
    } catch (error) {
      console.error("Error submitting the status", error);
    }
  };

  const isResetBtnVisible = (employeeId) => {
    let emp = currentTimesheet.employees.find(
      (e) => e.employeeId === employeeId
    );
    const empData = statusData[employeeId];
    if (!emp || !empData) return false;
    let show = false;
    for (let [date, d] of Object.entries(empData)) {
      if (!d.status || !emp.daysAndHours[date]?.status) {
        break;
      }
      if (d.status !== emp.daysAndHours[date].status) {
        show = true;
        break;
      }
    }

    return show;
  };

  const printRef = useRef(null);

  const downloadPDF = async () => {
    try {
      // 1️⃣ Capture the View as BASE64 image
      const base64Image = await printRef.current.capture();

      // 2️⃣ Create HTML for PDF
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #ffffff;
              }

              img {
                width: 100%;
                height: auto;
              }

              .page {
                width: 210mm;
                min-height: 297mm;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <img src="data:image/png;base64,${base64Image}" />
            </div>
          </body>
        </html>
      `;

      // 3️⃣ Generate PDF file
      const { uri } = await Print.printToFileAsync({
        html,
        width: 595, // A4 width in points
        height: 842, // A4 height in points
        base64: false,
      });

      // 4️⃣ Open Share / Save dialog
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Download PDF",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.log("PDF ERROR:", error);
    }
  };

  console.log("status data : ", statusData);

  return (
    <>
      {statusData !== null && (
        
           <View style={styles.container}>
          <View style={styles.rowAlign}>
            {/* project */}
            <View>
              <Text>PROJECT</Text>
              <Text>{currentTimesheet.projectTitle}</Text>
            </View>
            {/* client */}
            <View>
              <Text>CLIENT</Text>
              <Text>{currentTimesheet.clientName}</Text>
            </View>
            {/* week */}
            <View>
              <Text>WEEK</Text>
              <Text>{`${formatDate(startDate)} - ${formatDate(
                endDate
              )}, ${startDate?.getFullYear()}`}</Text>
            </View>
          </View>

          {/* table */}
          <View style={{ flex: 1, minHeight: 300 }}>
         <ScrollView horizontal showsHorizontalScrollIndicator>

            <View style={styles.table}>
              {/* ===== HEADER ===== */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell, styles.nameCell]}>Name</Text>
                <Text style={[styles.cell, styles.idCell]}>Employee ID</Text>
                <Text style={styles.cell}>MON</Text>
                <Text style={styles.cell}>TUE</Text>
                <Text style={styles.cell}>WED</Text>
                <Text style={styles.cell}>THU</Text>
                <Text style={styles.cell}>FRI</Text>
                <Text style={styles.cell}>SAT</Text>
                <Text style={styles.cell}>SUN</Text>
                <Text style={[styles.cell, styles.actionCell]}>Action</Text>
              </View>

              {/* ===== BODY ===== */}
              {statusData &&
              currentTimesheet.employees.map((emp, idx) => (
                <AdminTimesheetEmployeeRow
                  key={idx}
                  emp={emp}
                  idx={idx}
                  statusData={statusData}
                  getStatus={getStatus}
                  handleApproveOrReject={handleApproveOrReject}
                  toggleEditMode={toggleEditMode}
                  handleCancel={handleCancel}
                  isResetBtnVisible={isResetBtnVisible}
                  reset={reset}
                  isSubmitShow={isSubmitShow}
                  handleSubmit={handleSubmit}
                />
              ))}
            
            </View>
          </ScrollView>
          </View>
          {/* buttons */}
          {sortGroup.length > 1 && (
            <View style={styles.rowAlign}>
              <TouchableOpacity
                disabled={currentSlide === 0}
                onPress={() => handlePrev(keyValue, sortGroup.length)}
                style={[
                  styles.button,
                  currentSlide === 0 && styles.disabledButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    currentSlide === 0 && styles.disabledText,
                  ]}
                >
                  Prev
                </Text>
              </TouchableOpacity>
              <Text style={{marginTop : 10}}>
                Week {currentSlide + 1} / {sortGroup.length}
              </Text>
              <TextInput
                placeholder="Page"
                keyboardType="numeric"
                value={jumpPage[keyValue]?.toString() || ""}
                onChangeText={(text) =>
                  handlePageInput(keyValue, text, sortGroup.length)
                }
                style={styles.gotoPage}
              />

              <TouchableOpacity
                disabled={currentSlide === sortGroup.length - 1}
                onPress={() => handleNext(keyValue, sortGroup.length)}
                style={[
                  styles.button,
                  currentSlide === sortGroup.length - 1 &&
                    styles.disabledButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    currentSlide === sortGroup.length - 1 &&
                      styles.disabledText,
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default AdminCard;
