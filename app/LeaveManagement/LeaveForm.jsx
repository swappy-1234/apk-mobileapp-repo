import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { api } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LayoutWrapper from "../LayoutWrapper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import styles from "../../styles/LeaveManagement/LeaveForm";
import Loader from "../Loader/Loader";

const LeaveForm = ({ setIsLeaveRequest }) => {
  const navigation = useNavigation();
  // const today = new Date().toISOString().split("T")[0];
  const route = useRoute();
  const initialForm = {
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    managerId: "",
    managerEmail: "",
    leaveRequestFor: "Days",
    leaveType: "",
    leaveStartDate: "",
    leaveEndDate: "",
    duration: "",
    comments: "",
    LOP: false,
  };

  const [formData, setFormData] = useState(
    route.params?.formData || route.params || initialForm,
  );

  const [errors, setErrors] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [leaveError, setLeaveError] = useState(""); // To set leave balance error from backend
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remainingLeaveDays, setRemainingLeaveDays] = useState(null); // State for remaining leave days
  const [showLop, setShowLop] = useState(false);
  const [weekOffDuration, setWeekOffDuration] = useState("");
  const [lopLeaves, setLopLeaves] = useState("");
  const { role, schemaName, roleColors } = useContext(MyContext);
  const [isData, setIsData] = useState("");
  const [email, setIsEmail] = useState("");
  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const emailId = await AsyncStorage.getItem("email");
    console.log("stored response : ", JSON.parse(stored));
    setIsData(JSON.parse(stored));
    setIsEmail(JSON.parse(emailId));
  };

  useEffect(() => {
    fetchStoredData();
  }, []);
  const token = isData?.token;
  const employeeId = isData?.employeeId;

  const firstName = isData?.firstName;
  const lastName = isData?.lastName;

  console.log("t, s, e", token, schemaName, employeeId);
  console.log("em, f, l", email, firstName, lastName);
  useEffect(() => {
    if (firstName && lastName && email && employeeId) {
      //set the retrieved data in the form state
      setFormData((prevData) => ({
        ...prevData,
        firstName: prevData.firstName || firstName,
        lastName: prevData.lastName || lastName,
        email: prevData.email || email,
        employeeId: prevData.employeeId || employeeId,
      }));
    } else {
      // If the data is not found in localStorage, you can redirect or show an error
      // navigation.navigate("Login"); // Redirect to login if not found
    }
  }, [email, employeeId, firstName, lastName, navigation]); // this will run once wen the component mounts

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!employeeId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        const [originResponse] = await Promise.all([
          axios.get(`${api}/api/v1/employeeManager/origin/${employeeId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": schemaName,
            },
          }),
        ]);

        const responseData = originResponse.data;

        const currentEmployee = responseData.find(
          (emp) => emp.employeeId === employeeId,
        );

        if (currentEmployee) {
          const managerId = currentEmployee.reportingTo;
          const manager = responseData.find(
            (emp) => emp.employeeId === managerId,
          );

          setFormData((prevData) => ({
            ...prevData,
            // employeeId: prevData.employeeId,
            managerId: prevData.managerId || managerId,
            managerEmail: prevData.managerEmail || manager?.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employeeId, schemaName, token]); // Empty dependency array ensures the effect runs once on component mount

  useEffect(() => {
    const fetchRemainingLeaveDays = async (
      employeeId,
      leaveType,
      leaveStartDate,
      leaveEndDate,
    ) => {
      try {
        const response = await axios.get(`${api}/api/leaves/remaining-leaves`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
          params: { employeeId, leaveType, leaveStartDate, leaveEndDate },
        });

        // Ensure the response is a valid number

        const remainingDays = response.data;

        if (typeof remainingDays === "number" && !isNaN(remainingDays)) {
          const currentDuration = calculateDuration(
            leaveStartDate,
            leaveEndDate,
          );
          if (remainingDays >= currentDuration) {
            // const remain = remainingDays - formData.duration;
            setRemainingLeaveDays(remainingDays - currentDuration);
            showLop(false); // Set the remaining leave days in state
          } else {
            setShowLop(true);
            setRemainingLeaveDays(
              "You don't have enough remaining leave days.",
            );
            setErrors(true);
          }
        } else {
          setRemainingLeaveDays("Invalid data received from the server.");
          setErrors(true);
        }
      } catch (error) {
        console.error("Error fetching remaining leave days:", error);
        setRemainingLeaveDays("Error fetching leave data.");
        setErrors(true);
      }
    };
    if (route.params?.edit) {
      setIsEditing(true);
      const {
        employeeId,
        leaveType,
        leaveStartDate,
        leaveEndDate,
        //medicalDocument,
      } = route.params;

      // Initialize formData and selectedFile
      setFormData((prevData) => ({
        ...prevData,
        ...route.params,
        leaveStartDate: leaveStartDate || "",
        leaveEndDate: leaveEndDate || "",
        leaveType: leaveType || "",
      }));

      // Fetch remaining leave days initially
      console.log("leavess date");
      if (leaveEndDate && leaveStartDate) {
        fetchRemainingLeaveDays(
          employeeId,
          leaveType,
          leaveStartDate,
          leaveEndDate,
        );
      }
    }
  }, [
    showLop,
    formData.leaveStartDate,
    formData.leaveEndDate,
    token,
    schemaName,
    route.params,
  ]);

  const handleChange = (name, value) => {
    const updatedValue = name === "LOP" ? value : value;

    const updatedFormData = {
      ...formData,
      [name]: updatedValue,
    };

    setFormData(updatedFormData);

    // Clear leave errors
    if (["leaveType", "leaveStartDate", "leaveEndDate"].includes(name)) {
      setLeaveError("");
      setErrors(false);

      fetchRemainingLeaveDays(
        formData.employeeId,
        name === "leaveType" ? value : formData.leaveType,
        name === "leaveStartDate" ? value : formData.leaveStartDate,
        name === "leaveEndDate" ? value : formData.leaveEndDate,
      );
    }

    if (name === "leaveType") {
      setIsCommentsEnabled(value === "OTHERS");
    }

    // Clear field-specific error
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {}, [formData]);

  useEffect(() => {
    if (token && schemaName) {
      const fetchLeaveSheet = async () => {
        try {
          const res = await axios.get(`${api}/api/getSheets`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": schemaName,
            },
          });
          console.log("leave type : ", res.data);
          if (res.data.length > 0) {
            setLeaveTypes(res.data); // assuming backend gives a "leaveTypes" array
          }
        } catch (err) {
          console.error("Error fetching leave sheet:", err);
        }
      };
      fetchLeaveSheet();
    }
  }, [schemaName, token]);

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
      .trim();
  };

  //   const handleBlur = (e) => {
  //   const { name, value } = e.target;

  //   setTouched(prev => ({ ...prev, [name]: true }));

  //   if (!value) {
  //     setFieldErrors(prev => ({ ...prev, [name]: `${formatLabel(name)} is required` }));
  //   }
  // };

  const validate = () => {
    let newErrors = {};
    if (!formData.leaveStartDate) {
      newErrors.leaveStartDate = "Start date is required";
    }
    if (!formData.leaveEndDate) {
      newErrors.leaveEndDate = "End date is required";
    }
    if (!formData.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    setFieldErrors(newErrors);
    return newErrors;
  };

  // const handleSubmit = async () => {
  //   let newErrorss = validate();
  //   if (Object.keys(newErrorss).length > 0) {
  //     console.log("aaaa");
  //     return;
  //   }
  //   setLeaveError(""); // Reset error messages
  //   setErrors(false); // Reset error state
  //   // Validation: Check if all required fields are filled

  //   const requiredFields = ["leaveStartDate", "leaveEndDate", "leaveType"];

  //   const hasEmptyFields = requiredFields.some((field) => !formData[field]);

  //   if (hasEmptyFields) {
  //     setLeaveError("");
  //     setErrors(true);
  //     return;
  //   }

  //   // Check if Start Date is after End Date
  //   if (new Date(formData.leaveStartDate) > new Date(formData.leaveEndDate)) {
  //     setLeaveError(
  //       "Inappropriate dates: Start date cannot be after the End date."
  //     );
  //     setErrors(true);
  //     return;
  //   }

  //   // Prepare FormData for submission
  //   const data = new FormData();
  //   console.log("form data", formData);
  //   for (const key in formData) {
  //     if (formData[key]) {
  //       //Check if value exists before appending
  //       data.append(key, formData[key]);
  //     }
  //   }

  //   const newErrors = {};
  //   if (!formData.leaveStartDate)
  //     newErrors.leaveStartDate = "Start Date required";
  //   if (!formData.leaveEndDate) newErrors.leaveEndDate = "End Date required";
  //   if (!formData.leaveType) newErrors.leaveType = "Leave type required";

  //   setFieldErrors(newErrors);
  //   setTouched({
  //     leaveStartDate: true,
  //     leaveEndDate: true,
  //     leaveType: true,
  //   });

  //   if (Object.keys(newErrors).length > 0) return; // stop submit

  //   setLoading(true);

  //   try {
  //     const url = isEditing
  //       ? `${api}/api/leaves/update/${formData.id}`
  //       : `${api}/api/leaves/submit`;
  //     console.log("url : ", url);
  //     let response;

  //       response = await axios({
  //         method: "POST",
  //         url,
  //         data,
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "X-Tenant-ID": schemaName,
  //         },
  //       });

  //     console.log("submit : ", response.status);

  //     // Handle success
  //     if (response.status === 200) {
  //       if (isEditing) {
  //         navigation.navigate("LeaveManagement/LeaveEmployee");
  //       } else {
  //         setIsLeaveRequest(false);
  //       }
  //     } else {
  //       setLeaveError("Error processing the request. Please try again.");
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     console.log("error : ", error);
  //     if (error.response?.data?.leavesCompleted) {
  //       setShowLop(true);
  //     }

  //     if (
  //       error.response?.data ===
  //       "You have already applied for leave on one or more of these dates."
  //     ) {
  //       setLeaveError(
  //         "You have already applied for leave on one or more of these dates."
  //       );
  //       setErrors(true);
  //     }

  //     setErrors(true);
  //   } finally {
  //     setLoading(false); // Reset loading state
  //   }
  // };

  const handleSubmit = async () => {
    let newErrorss = validate();
    if (Object.keys(newErrorss).length > 0) {
      console.log("aaaa");
      return;
    }
    setLeaveError(""); // Reset error messages
    setErrors(false); // Reset error state
    // Validation: Check if all required fields are filled

    const requiredFields = ["leaveStartDate", "leaveEndDate", "leaveType"];

    const hasEmptyFields = requiredFields.some((field) => !formData[field]);

    if (hasEmptyFields) {
      setLeaveError("");
      setErrors(true);
      return;
    }

    // Check if Start Date is after End Date
    if (new Date(formData.leaveStartDate) > new Date(formData.leaveEndDate)) {
      setLeaveError(
        "Inappropriate dates: Start date cannot be after the End date.",
      );
      setErrors(true);
      return;
    }

    // Prepare FormData for submission
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        //Check if value exists before appending
        data.append(key, formData[key]);
      }
    }

    const newErrors = {};
    if (!formData.leaveStartDate)
      newErrors.leaveStartDate = "Start Date required";
    if (!formData.leaveEndDate) newErrors.leaveEndDate = "End Date required";
    if (!formData.leaveType) newErrors.leaveType = "Leave type required";

    setFieldErrors(newErrors);
    setTouched({
      leaveStartDate: true,
      leaveEndDate: true,
      leaveType: true,
    });

    if (Object.keys(newErrors).length > 0) return; // stop submit

    setLoading(true);

    try {
      const formData1 = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData1.append(key, String(value));
      });
      const url = isEditing
        ? `${api}/api/leaves/update/${formData.id}`
        : `${api}/api/leaves/submit`;

      let response;
      if (!isEditing) {
        console.log("post url2", url, data);
        // response = await axios({
        //   method: "POST",
        //   url,
        //   data,
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "X-Tenant-ID": schemaName,
        //   },
        // });
        response=await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": schemaName,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("res : ", response);
      } else {
        response = await axios({
          method: "PUT",
          url,
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": schemaName,
          },
        });
      }
        
      // Handle success
      if (response.status === 200) {
        if (isEditing) {
          navigation.navigate("LeaveManagement/LeaveEmployee");
        } else {
          setIsLeaveRequest(false);
        }
      } else {
        setLeaveError("Error processing the request. Please try again.");
      }
    } catch (error) {
      // Handle errors
      console.log("error : ", error);

      if (error.response?.data?.leavesCompleted) {
        setShowLop(true);
      }

      if (
        error.response?.data ===
        "You have already applied for leave on one or more of these dates."
      ) {
        setLeaveError(
          "You have already applied for leave on one or more of these dates.",
        );
        setErrors(true);
      }

      setErrors(true);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const fetchRemainingLeaveDays = async (
    employeeId,
    leaveType,
    leaveStartDate,
    leaveEndDate,
  ) => {
    try {
      const response = await axios.get(`${api}/api/leaves/remaining-leaves`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
        params: { employeeId, leaveType, leaveStartDate, leaveEndDate },
      });

      // Ensure the response is a valid number
      const remainingDays = response.data;

      setLopLeaves(remainingDays);
      if (typeof remainingDays === "number" && !isNaN(remainingDays)) {
        //const currentDuration = calculateDuration(leaveStartDate, leaveEndDate);
        if (remainingDays >= weekOffDuration) {
          // const remain = remainingDays - formData.duration;
          setRemainingLeaveDays(remainingDays - weekOffDuration); // Set the remaining leave days in state
        } else {
          setRemainingLeaveDays("You don't have enough remaining leave days.");
          setErrors(true);
        }
      } else {
        setRemainingLeaveDays("Invalid data received from the server.");
        setErrors(true);
      }
    } catch (error) {
      console.error("Error fetching remaining leave days:", error);
      setRemainingLeaveDays("fetching....");
      setErrors(true);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalDays = 0;

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDay();
      if (day !== 0 && day !== 6) {
        // Exclude weekends (0 is Sunday, 6 is Saturday)
        totalDays++;
      }
    }

    return totalDays;
  };

  console.log("calc", calculateDuration());

  // Disable weekends and holidays in the date picker
  const disableDate = (date) => {
    const day = date.getDay();
    return day === 0 && day === 6; // Disable weekends and holidays
  };

  const hasSelectedDates = Boolean(
    formData.leaveStartDate && formData.leaveEndDate,
  );

  // Update duration when both dates are set
  useEffect(() => {
    const calculateDuration = (startDate, endDate) => {
      if (!startDate || !endDate) return 0;

      const start = new Date(startDate);
      const end = new Date(endDate);
      let totalDays = 0;

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        // const day = date.getDay();
        // if (day !== 0 && day !== 6) {
        //     // Exclude weekends (0 is Sunday, 6 is Saturday)
        //     totalDays++;
        // }
        totalDays++;
      }

      return totalDays;
    };
    if (formData.leaveStartDate && formData.leaveEndDate) {
      const duration = calculateDuration(
        formData.leaveStartDate,
        formData.leaveEndDate,
      );
      setFormData((prevData) => ({
        ...prevData,
        duration,
      }));
    }
  }, [formData.leaveStartDate, formData.leaveEndDate]);

  const fetch = async () => {
    try {
      const employeeId = formData.employeeId;
      const startDate = formData.leaveStartDate;
      const endDate = formData.leaveEndDate;

      const week = await axios.get(`${api}/api/leaves/getDurationDays`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
        params: { employeeId, startDate, endDate },
      });

      setWeekOffDuration(week.data);
      console.log("dura : ", week.data);
    } catch (error) {
      console.error("week off error : ", error);
    }
  };

  useEffect(() => {
    fetch();
  }, [formData.employeeId, formData.leaveStartDate, formData.leaveEndDate]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      {loading && <Loader />}
      <View style={styles.formContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          New Leave Request
        </Text>
        <View style={{ flexDirection: "row" }}>
          {/* Leave Start Date */}
          <View style={styles.formGridCard}>
            <Text>Leave Start Date</Text>

            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <TextInput
                value={formData.leaveStartDate}
                placeholder="Select start date"
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={
                  formData.leaveStartDate
                    ? new Date(formData.leaveStartDate)
                    : new Date()
                }
                mode="date"
                display="default"
                minimumDate={today}
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    handleChange("leaveStartDate", formatted);
                  }
                }}
              />
            )}

            {fieldErrors.leaveStartDate && (
              <Text style={styles.error}>{fieldErrors.leaveStartDate}</Text>
            )}
          </View>

          {/* Leave End Date */}
          <View style={styles.formGridCard}>
            <Text>Leave End Date</Text>

            <TouchableOpacity
              onPress={() => formData.leaveStartDate && setShowEndPicker(true)}
            >
              <TextInput
                value={formData.leaveEndDate}
                placeholder="Select end date"
                editable={false}
                style={[
                  styles.input,
                  !formData.leaveStartDate && styles.disabledInput,
                ]}
              />
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={
                  formData.leaveEndDate
                    ? new Date(formData.leaveEndDate)
                    : new Date(formData.leaveStartDate)
                }
                mode="date"
                minimumDate={new Date(formData.leaveStartDate)}
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0];
                    handleChange("leaveEndDate", formatted);
                  }
                }}
              />
            )}

            {fieldErrors.leaveEndDate && (
              <Text style={styles.error}>{fieldErrors.leaveEndDate}</Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View>
            <Text>Duration</Text>
            <TextInput
              value={String(weekOffDuration)}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 8,
                width: 90,
                color: "blue",
              }}
              editable={false}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Leave Type</Text>

            <View
              style={[
                styles.pickerWrapper,
                hasSelectedDates &&
                  Number(weekOffDuration) === 0 &&
                  styles.disabledPicker,
              ]}
            >
              <Picker
                selectedValue={formData.leaveType}
                enabled={!(hasSelectedDates && Number(weekOffDuration) === 0)}
                onValueChange={(value) => handleChange("leaveType", value)}
              >
                <Picker.Item label="Select Leave Type" value="" />

                {leaveTypes.map((each, index) => (
                  <Picker.Item
                    key={index}
                    label={each.leaveType}
                    value={each.leaveType}
                  />
                ))}
              </Picker>
            </View>

            {fieldErrors.leaveType && (
              <Text style={styles.error}>{fieldErrors.leaveType}</Text>
            )}
          </View>
        </View>
        {hasSelectedDates && Number(weekOffDuration) === 0 && (
          <Text style={styles.error}>
            Duration must be greater than 0 to select a leave type. Leave cannot
            be applied on a holiday.
          </Text>
        )}
        <View>
          <TextInput
            value={String(remainingLeaveDays) || "N/A"}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 12,
              borderRadius: 8,
              width: 130,
              height: 40,
            }}
            editable={false}
          />
        </View>
        {leaveError && <Text>{leaveError}</Text>}
        {remainingLeaveDays ===
          "You don't have enough remaining leave days." && (
          <View>
            <Text>You have {weekOffDuration - lopLeaves} lop days</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleSubmit} style={styles.leaveButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default LeaveForm;
