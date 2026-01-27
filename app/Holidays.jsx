import React, {useState, useEffect, useContext} from "react";
import { MyContext } from "./Context/MyContext";
import { View, Text, TouchableOpacity, TextInput, } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { all } from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from '../styles/Holidays';
import Modal from 'react-native-modal';
import { url } from "../universalApi/universalApi";
import Loader from "./Loader/Loader";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";

const Holidays = () => {
  const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [holiday, setHolidays] =  useState("");
    const [holidayDate, setHolidayDate]=useState("");
    const [allHolidays, setAllHolidays]=useState([]);
    const [postHolidays, setPostHolidays]=useState(false);
      const [holidaysIndex, setHolidaysIndex] = useState(0);
    // const [isHolidayDate, setIsHolidayDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
     const [isError, setIsError]=useState(false);
     const [wasEdit, setWasEdit] = useState(false);
  const [error,setError]=useState("");
   const { role, schemaName, roleColors } = useContext(MyContext);
     const [token, setToken] = useState(null);
     const [isEditMode, setIsEditMode] = useState(false);
      const [selectedEditId, setSelectedEditId] = useState(null);
      const [originalHolidayData, setOriginalHolidayData] = useState({
    holiday: "",
    holidayDate: "",
  });
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
   const [deleteModel, setDeleteModel] = useState(false);


useEffect(() => {
  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const parsed = JSON.parse(stored);
    setToken(parsed?.token);
  };

  fetchStoredData();
}, []);

         

    // This effect will run whenever the AllHolidays state changes
   
      
const fetchHolidays = async () => {
  setLoading(true);

  try {
    const response = await axios.get(
      `${url}/api/holiday/getAllHolidays`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Tenant-ID": schemaName,
        },
      }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingHolidays = response.data
      .filter((holiday) => {
        const holidayDate = new Date(
          holiday.date[0],        // year
          holiday.date[1] - 1,    // month (0-based)
          holiday.date[2]         // day
        );
        return holidayDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2]);
        const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2]);
        return dateA - dateB;
      });

    setAllHolidays(upcomingHolidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
  } finally {
    setLoading(false);
  }
};
    useEffect(() => {
  if (token && schemaName) {
    fetchHolidays();
  }
}, [token, schemaName]);


     const postHoliday = async () => {
        

        // Validate inputs
       if (!holiday.trim() || !holidayDate) {
  setIsError(true);
  setError("Please fill all mandatory fields");
  return;
}

         
         setLoading(true);
        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(holidayDate).toISOString().split('T')[0]; // "YYYY-MM-DD"

       if (isEditMode) {
      try {
        await axios.put(
          `${url}/api/holiday/updateholiday/${selectedEditId}`,
          {
            name: holiday,
            date: formattedDate,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              "X-Tenant-ID": schemaName,
            }
          }
        )
        setWasEdit(true);
        setPostHolidays(true);
        setIsView(false);
        setIsEditMode(false);
        setSelectedEditId(null);
        fetchHolidays();
      } catch (error) {
        console.error("Error updating news:", error);
        alert("Failed to update news.");
      } finally {
        setLoading(false);
      }
    }
    else {
      try {
        const response = await axios.post(
          `${url}/api/holiday/holiday`,
          {
            name: holiday,
            date: formattedDate,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              "X-Tenant-ID": schemaName,
            }
          }
        );
        setWasEdit(false);
        setPostHolidays(true);
        setIsView(false);
        setLoading(false);
        fetchHolidays();
        resetHolidayForm();
         setHolidaysIndex(0);
      } catch (error) {
        alert("Failed to post holiday");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    setHolidays("");
    setHolidayDate("");
    setIsError(false);
    setError("");
        
    };

    const handleDeleteHoliday = async () => {
    setLoading(true);
    try {
      await axios.delete(`${url}/api/holiday/deleteHolidayById/${selectedDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": schemaName,
        },
      });
      fetchHolidays();
      setDeleteModel(false);
    } catch (error) {
      console.error("Error Deleting holiday: ", error);
    } finally {
      setLoading(false);
    }
  }

  const isHolidayChanged = () => {
    return (
      holiday !== originalHolidayData.holiday ||
      holidayDate !== originalHolidayData.holidayDate
    )
  }


     useEffect(() => {
        let timer;
        if (postHolidays) {
           timer = setTimeout(() => {
            setPostHolidays(false);
          }, 5000);
        }
        
          return () => clearTimeout(timer);
        
      }, [postHolidays]);
    
      // if (!postNews) return null;
    
    //   const handleOutsidePress = () => {
    //     if (postHolidays) {
    //       setPostHolidays(false);
    //     }
    //   }
    
      // Set minimum date to tomorrow
  const minDate = new Date(Date.now() + 86400000);

 const onChange = (event, selectedDate) => {
  setShowPicker(false);

  if (selectedDate) {
    const formatted = selectedDate.toISOString().split("T")[0];
    setHolidayDate(formatted);

    setIsError(false);
    setError("");
  }
};
 const resetHolidayForm = () => {
    setHolidays("");
    setHolidayDate("");
    setIsEditMode(false);
    setSelectedEditId(null);
    setOriginalHolidayData({
      holiday: "",
      holidayDate: "",
    });
    setIsError(false);
    setError("");
  };


  console.log("all holidays :",allHolidays[holidaysIndex]);

  
    return(
        <>
         {loading && <Loader />}
        <View style={styles.container}>
            <View style={styles.textContainer}>
            <Text style={{ marginTop: 10 }}>Upcoming Holidays</Text>
            <Text  style={{ fontSize: 12, alignSelf: "center", textAlign: "center" }}>Stay updated on your upcoming holidays.</Text>
            </View>
{(role!=="employee" && role!=="manager") && 
<TouchableOpacity onPress={() => setIsView(!isView)}
      style={styles.viewButton}><Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>{isView?"View Holidays":"Post Holidays"}</Text></TouchableOpacity>}
      <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
      {
        isView ? <View>
            <TextInput value={holiday}   onChangeText={(text) => {
    setHolidays(text);
    if (text.trim()) {
      setIsError(false);
      setError("");
    }
  }} style={styles.holidaysInput} placeholder="Holiday Name" />
                             <View style={{ marginVertical: 10 }}>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  color: "#000",
                  width : 150,
                  marginHorizontal : 10,
                }}
                value={holidayDate}
                placeholder="Enter Date"
               
                editable={false} // disables typing, user must pick a date
              />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
               value={holidayDate ? new Date(holidayDate) : minDate}
                mode="date"
                display="default"
                minimumDate={minDate}
                onChange={onChange}
              />
            )}
           
          </View>
           {isError && (
  <Text style={{ color: "red", marginTop: 5 }}>
    {error}
  </Text>
)}

{!isEditMode && (
  <TouchableOpacity
    onPress={postHoliday}
   style={{alignItems : 'center'}}
  >
    <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Post Holiday</Text>
  </TouchableOpacity>
)}

{isEditMode && isHolidayChanged() && (
  <TouchableOpacity
    onPress={postHoliday}
     style={{alignItems : 'center'}}
  >
    <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Update Holiday</Text>
  </TouchableOpacity>
)}

                            

            </View> : <View style={{justifyContent : 'center', alignItems : 'center'}}>
                {allHolidays.length > 0  && 
                    //const bgColor = index % 2 === 0 ? '#D1FAE5' : '#FFFFFF';
                    
                         (
                            <View style={styles.holidaysCard}>
                                 {holidaysIndex !== 0 && (
                                                <View>
                                                  <TouchableOpacity onPress={() => setHolidaysIndex(holidaysIndex - 1)}>
                                                    <Text style={{fontSize:24}}>{'<'}</Text>
                                                  </TouchableOpacity>
                                                </View>
                                              )}

                             <View style={styles.holidayCard} >
                                <Text style={{fontSize : 18, fontWeight : 'bold'}}>{allHolidays[holidaysIndex].name}</Text>
                                <Text style={{fontSize : 15,}}>{allHolidays[holidaysIndex].date[2]}-{allHolidays[holidaysIndex]?.date[1]}-{allHolidays[holidaysIndex]?.date[0]}</Text>
                              

{role !== "employee" && role !== "manager" && (
  <View style={{flexDirection : 'row', justifyContent : 'around'}}>
    {/* Edit Button */}
    <TouchableOpacity
     
      onPress={() => {
        setSelectedEditId(allHolidays[holidaysIndex].id);
        setHolidays(allHolidays[holidaysIndex].name);

        const formattedDate = `${allHolidays[holidaysIndex].date[0]}-${String(
          allHolidays[holidaysIndex].date[1]
        ).padStart(2, "0")}-${String(allHolidays[holidaysIndex].date[2]).padStart(2, "0")}`;

        setHolidayDate(formattedDate);
        setOriginalHolidayData({
          holiday: allHolidays[holidaysIndex].name,
          holidayDate: formattedDate,
        });

        setIsView(true);
        setIsEditMode(true);
      }}
    >
      <Text>
                                  <AntDesign name="edit" size={24} color="black"  />
      
                              </Text>
    </TouchableOpacity>

    {/* Delete Button */}
    <TouchableOpacity

      onPress={() => {
        setSelectedDeleteId(allHolidays[holidaysIndex].id);
        setDeleteModel(true);
      }}
    >
       <Text>
                                  <AntDesign name="delete" size={24} color="red" />
      
                              </Text>
    </TouchableOpacity>
  </View>
)}

                                
                            </View>
                             {allHolidays.length - 1 !== holidaysIndex && (
                                            <View>
                                              <TouchableOpacity onPress={() => setHolidaysIndex(holidaysIndex + 1)}>
                                                <Text style={{fontSize : 24}}>{'>'}</Text>
                                              </TouchableOpacity>
                                            </View>
                                          )}
                            </View>
                        )
                        
                    }
                
                </View>
      } 
      </View>
       

                  {/* <TouchableWithoutFeedback onPress={handleOutsidePress}> */}
                    <Modal 
                    isVisible={postHolidays}
                    
                    >
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                  <Text style={{ fontSize: 18, color: '#19CF99', fontWeight: 'bold' }}>
                  Upcoming Holiday
                  </Text>
                  <Text style={{ fontSize: 14, color: '#333', marginTop: 10 }}>
                 Holiday posted Successfully
                  </Text>
                  </View>
                  </Modal>

                 
{deleteModel && (
  <Modal
    transparent
    animationType="fade"
    visible={deleteModel}
    onRequestClose={() => setDeleteModel(false)}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.message}>
          Are you sure you want to delete this holiday post?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDeleteHoliday(selectedDeleteId)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setDeleteModel(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}

                   {/* </TouchableWithoutFeedback> */}
                  
                  
          
        
        </>
    )
}

export default Holidays;