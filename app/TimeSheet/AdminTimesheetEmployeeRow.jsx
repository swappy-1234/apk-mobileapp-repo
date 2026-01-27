import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import roleColors from "../Colors/Colors";
import styles from '../../styles/TimeSheet/AdminCard';



const AdminTimesheetEmployeeRow = ({
  emp,
  idx,
  statusData,
  getStatus,
  handleApproveOrReject,
  toggleEditMode,
  handleCancel,
  isResetBtnVisible,
  reset,
  isSubmitShow,
  handleSubmit,
}) => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
     const [storedData, setStoredData] = useState("");
  
    const fetchStoredData = async () => {
      const stored = await AsyncStorage.getItem("companies");
      setStoredData(JSON.parse(stored));
    };
  
    useEffect(() => {
      fetchStoredData();
    }, []);
  
    const role = storedData.role;

    const getMappedValues = (key) =>
    Object.fromEntries(
      Object.entries(emp.daysAndHours).map(([date, d]) => [
        new Date(date).toLocaleDateString("en-GB", {
          weekday: "short",
        }),
        key === "date" ? date : d[key] ?? "-",
      ])
    );

  const hoursMap = getMappedValues("hours");
  const updateDate = getMappedValues("date");
  const empHoursMap = getMappedValues("employeeHours");
  const statusMap = getMappedValues("status");
    return(
         <View key={idx} style={styles.row}>
      {/* NAME */}
      <View style={[styles.cell, styles.nameCell]}>
        <Text>{emp.employeeName}</Text>
      </View>

      {/* EMP ID */}
      <View style={[styles.cell, styles.idCell]}>
        <Text>{emp.employeeId}</Text>
      </View>

      {/* WEEK DAYS */}
      {weekDays.map((day) => {
        const status = statusMap[day];
        const hours = hoursMap[day];
        const empHours = empHoursMap[day];
        const date = updateDate[day];

        const color =
          {
            ACCEPTED: "#19cf99",
            REJECTED: "red",
            PENDING: "orange",
          }[status] || "black";

        return (
          <View key={day} style={styles.cell}>
            {/* HOURS */}
            <View style={styles.hoursBox}>
              <Text>Manager {hours}</Text>

              <Text>
                Employee{" "}
                <Text
                  style={{
                    fontWeight: empHours > 8 ? "bold" : "normal",
                  }}
                >
                  {empHours}
                </Text>
              </Text>
            </View>

            {/* STATUS */}
            <Text
              style={{
                color,
                fontWeight: "600",
                textAlign: "center",
                marginVertical: 4,
              }}
            >
              {status === "PENDING" ? "" : status}
            </Text>

            {/* ACTIONS */}
            {status === "PENDING" && empHours !== "-" && (
              <View style={styles.actionRow}>
                <ActionButton
                  label="Approve"
                  active={getStatus(emp.employeeId, date) === "ACCEPTED"}
                  onPress={() =>
                    handleApproveOrReject(emp.employeeId, date, "ACCEPTED")
                  }
                />
                <ActionButton
                  label="Reject"
                  danger
                  active={getStatus(emp.employeeId, date) === "REJECTED"}
                  onPress={() =>
                    handleApproveOrReject(emp.employeeId, date, "REJECTED")
                  }
                />
              </View>
            )}

            {(status === "ACCEPTED" || status === "REJECTED") &&
              (!emp.editMode?.[day] ? (
                
                <ActionButton
                  label="Update"
                  outline
                  color={roleColors[role]}
                  onPress={() =>
                    toggleEditMode(emp.employeeId, day)
                  }
                />
              ) : (
                <View style={styles.actionRow}>
                  {status === "ACCEPTED" && (
                    <ActionButton
                      label="Reject"
                      danger
                      onPress={() =>
                        handleApproveOrReject(
                          emp.employeeId,
                          date,
                          "REJECTED"
                        )
                      }
                    />
                  )}

                  {status === "REJECTED" && (
                    <ActionButton
                      label="Approve"
                      onPress={() =>
                        handleApproveOrReject(
                          emp.employeeId,
                          date,
                          "ACCEPTED"
                        )
                      }
                    />
                  )}

                  <ActionButton
                    label="Cancel"
                    onPress={() => {
                      toggleEditMode(emp.employeeId, day);
                      handleCancel(
                        emp.employeeId,
                        date,
                        status,
                        day
                      );
                    }}
                  />
                </View>
              ))}
          </View>
        );
      })}

      {/* LAST COLUMN */}
      <View style={[styles.cell, styles.actionCell]}>
        {isResetBtnVisible(emp.employeeId) && (
          <ActionButton
            label="Reset"
            outline
            onPress={() => reset(emp.employeeId)}
          />
        )}

        {isSubmitShow(emp.employeeId) && (
          <ActionButton
            label="Submit"
            outline
            color={roleColors[role]}
            onPress={() => handleSubmit(emp.employeeId)}
          />
        )}
      </View>
    </View>
    )
};


const ActionButton = ({
  label,
  onPress,
  active,
  danger,
  outline,
  color = "#2563eb",
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      outline && {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: color,
      },
      danger && { backgroundColor: "#fee2e2" },
      active && { opacity: 1 },
    ]}
  >
    <Text
      style={{
        color: outline ? color : danger ? "red" : "#fff",
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default AdminTimesheetEmployeeRow;