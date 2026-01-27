import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "./Context/MyContext";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import styles from "../styles/CompanyNews";
import Modal from 'react-native-modal';
import { url } from "../universalApi/universalApi";
import Loader from "./Loader/Loader";


const CompanyNews = () => {
  const [isView, setIsView] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [newsHeading, setNewsHeading] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);
 const [showPicker, setShowPicker] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const { role, schemaName, employeeId,roleColors } = useContext(MyContext);
  const [postNews, setPostNews] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wasEdit, setWasEdit] = useState(false);
  const [dateError, setDateError] = useState("");
  const [isDateError, setIsDateError] = useState(false);
  const [isPastDateError, setIsPastDateError] = useState(false);
  const [pastDateError, setPastDateError] = useState("")
  const [isNewsContentError, setIsNewsContentError] = useState(false);
  const [newsContentError, setNewsContentError] = useState("");
  const [originalNews, setOriginalNews]=useState({
    newsHeading:"",
    newsContent:"",
    expiryDate:"",
  });
  const [data, setData] = useState("");
    const [id, setId] = useState("");
  const [email, setEmailId] = useState("");
  const MAX_CHARS = 30;



  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");
    const isEmail = await AsyncStorage.getItem("email");
    console.log("stored response : ", JSON.parse(stored));
    setData(JSON.parse(stored));
    setId(JSON.parse(tenant));
    setEmailId(JSON.parse(isEmail));
    
  };

  useEffect(() => {
    fetchStoredData();
  }, []);

  
  const token = data.token;




  const isValidDateFormat = (date) => {
    if (!date) return false

    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(date)) return false

    const [year, month, day] = date.split("-").map(Number)

    const selectedDate = new Date(year, month - 1, day)
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month - 1 &&
      selectedDate.getDate() === day
    )
  }

  const isPastDate = (date) => {
    const selectedDate = new Date(date)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    selectedDate.setHours(0, 0, 0, 0)

    return selectedDate < today
  }


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/apis/employees/companyNews/getAllNews`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'X-Tenant-ID': schemaName,
        }
      });

      setNewsData(response.data.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schemaName && token) {
      fetchData();
    }
  }, [schemaName, token
  ]);


  const handleSubmitNews = async () => {

    if (!newsHeading || newsHeading.trim() === "") {
      setIsError(true);
      setError("Please enter a valid news heading")
      return;
    }

    if (!newsContent || newsContent.trim() === "") {
      setIsNewsContentError(true);
      setNewsContentError("Please enter a valid news content");
      return;
    }

    //  Invalid format or empty
    if (!isValidDateFormat(expiryDate)) {
      setIsDateError(true)
      setDateError("Please select a valid holiday date")
      return
    }

    //  Past date
    if (isPastDate(expiryDate)) {
      setIsPastDateError(true)
      setPastDateError("You cannot select a past date")
      return
    }

    setIsError(false)
    setIsDateError(false)
    setIsPastDateError(false)

    const formattedDate = new Date(expiryDate).toISOString().split("T")[0];
    const fullName = data.firstName + " " + data.lastName;

    setLoading(true);
    if (isEditMode) {
      try {
        await axios.put(
          `${url}/apis/employees/companyNews/updatedNews/${selectedEditId}`,
          {
            userName: fullName,
            userId: employeeId,
            // userEmail: Cookies.get("email"),
            newsHeading,
            news: newsContent,
            expiryDate: formattedDate,
            // createdAt: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": schemaName,
            },
          }
        );
        setWasEdit(true);
        setPostNews(true);
        setIsView(false);
        setIsEditMode(false);
        setSelectedEditId(null);
        fetchData();
        setNewsIndex(0);
      } catch (error) {
        console.error("Error updating news:", error);
        alert("Failed to update news.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${url}/apis/employees/companyNews/addNews`,
          {
            userName: fullName,
            userId: employeeId,
            userEmail: email,
            newsHeading,
            news: newsContent,
            expiryDate: formattedDate,
            // createdAt: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": schemaName,
            },
          }
        );
        setWasEdit(false);
        setPostNews(true);
        setIsView(false);
        setNewsIndex(0);
        fetchData();
      } catch (error) {
        console.error("Error posting news:", error);
        alert("Failed to post news.");
      } finally {
        setLoading(false);
      }
    }
    setNewsHeading("");
    setNewsContent("");
    setExpiryDate("");
    setIsError(false);
    setError("");
    resetNewsForm();
  };

  useEffect(() => {
     let timer;
    if (postNews) {
       timer = setTimeout(() => {
        setPostNews(false);
        setWasEdit(false);
      }, 5000);
    }
     return () => clearTimeout(timer);
  }, [postNews])
  const handleDeletenews = async () => {
    setLoading(true);
    try {
      await axios.delete(`${url}/apis/employees/companyNews/deleteNewsById/${selectedDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": schemaName,
        },
      });
      fetchData();
      setDeleteModel(false);
    } catch (error) {
      console.error("Error Deleting Company News: ", error);
    } finally {
      setLoading(false);
    }
  }

  const isNewsChanged=()=>{
    return(
      newsHeading !== originalNews.newsHeading ||
      newsContent !== originalNews.newsContent ||
      expiryDate !== originalNews.expiryDate
    )
  }

  const resetNewsForm = () => {
  setNewsHeading("");
  setNewsContent("");
  setExpiryDate("");
  setIsEditMode(false);
  setSelectedEditId(null);
  setOriginalNews({
    newsHeading: "",
    newsContent: "",
    expiryDate: "",
  });
  setIsError(false);
  setError("");
  setIsNewsContentError(false);
  setNewsContentError("");
  setIsDateError(false);
  setDateError("");
  setIsPastDateError(false);
  setPastDateError("");
};

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setExpiryDate(formatted);
       setIsDateError(false);
    setDateError("");
    setIsPastDateError(false);
    setPastDateError("");
    }
  };

//   const [isView, setIsView] = useState(false);
//   const [newsData, setNewsData] = useState([]);
//   const [newsHeading, setNewsHeading] = useState("");
//   const [newsContent, setNewsContent] = useState("");
//   const [newsIndex, setNewsIndex] = useState(0);
//   const [postNews, setPostNews] = useState(false);
//   const [expiryDate, setExpiryDate] = useState("");
//   const [showPicker, setShowPicker] = useState(false);
//   const [deleteModel, setDeleteModel] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState(null);
//   const [selectedEditId, setSelectedEditId] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [wasEdit, setWasEdit] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState("");
//  const [loading, setLoading] = useState(false);
//   const [data, setData] = useState("");
//   const [id, setId] = useState("");
//   const [email, setEmail] = useState("");
//    const [isNewsContentError, setIsNewsContentError] = useState(false);

//   // const url = "http://10.0.2.2:8080";
//   //const url = "http://localhost:8080";
  

//   const fetchData = async () => {
//     const stored = await AsyncStorage.getItem("companies");
//     const tenant = await AsyncStorage.getItem("tenantId");
//     const email = await AsyncStorage.getItem("email");
//     console.log("stored response : ", JSON.parse(stored));
//     setData(JSON.parse(stored));
//     setId(JSON.parse(tenant));
//     setEmail(JSON.parse(email));
    
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const role = data.role;
//   const token = data.token;
//   console.log("token : ", token);
//   console.log("companyemail : ", email);

 
//   useEffect(() => {
//      const fetchNewsData = async () => {
//       setLoading(true);
//     try {
//       console.log(1);
//       const response = await axios.get(
//         `${url}/apis/employees/companyNews/getAllNews`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": id, // Add the token to the Authorization header
//           },
//         }
//       );
//       console.log(2);
//       console.log(response.data);
//       setNewsData(response.data.reverse());
//     } catch (error) {
//       console.log(3);
//       console.error("Error fetching data:", error);
//     } finally {
//        setLoading(false);
//     }
//   };

//     fetchNewsData();
//   }, [id, token]);
//   console.log("data : ", data);

//   const handleSubmitNews = async () => {
//     if (!newsHeading || newsHeading.trim() === "") {
//       setIsError(true);
//       setError("Please enter a valid news heading")
//       return;
//     }

//     // if (!newsContent || newsContent.trim() === "") {
//     //   setIsNewsContentError(true);
//     //   setNewsContentError("Please enter a valid news content");
//     //   return;
//     // }

//     // //  Invalid format or empty
//     // if (!isValidDateFormat(expiryDate)) {
//     //   setIsDateError(true)
//     //   setDateError("Please select a valid holiday date")
//     //   return
//     // }

//     // //  Past date
//     // if (isPastDate(expiryDate)) {
//     //   setIsPastDateError(true)
//     //   setPastDateError("You cannot select a past date")
//     //   return
//     // }

//     // setIsError(false)
//     // setIsDateError(false)
//     // setIsPastDateError(false)
//     const formattedDate = new Date(expiryDate).toISOString().split("T")[0];
//     const fullName = data.firstName + " " + data.lastName;
  
//     setLoading(true);
//     if (isEditMode) {
//       try {
//         await axios.put(
//           `${url}/apis/employees/companyNews/updatedNews/${selectedEditId}`,
//           {
//             userName: fullName,
//             userId: data.employeeId,
//             userEmail: email,
//             newsHeading,
//             news: newsContent,
//             expiryDate: formattedDate,
//             // createdAt: formattedDate,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Tenant-ID": id,
//             },
//           }
//         );
//         setWasEdit(true);
//         setPostNews(true);
//         setIsView(false);
//         setIsEditMode(false);
//         setSelectedEditId(null);
//         fetchData();
//         setNewsIndex(0);
//       } catch (error) {
//         console.error("Error updating news:", error);
//         alert("Failed to update news.");
//       } finally {
//          setLoading(false);
//       }
//     } else {
//       try {
//         const response = await axios.post(
//           `${url}/apis/employees/companyNews/addNews`,
//           {
//             userName: fullName,
//             userId: data.employeeId,
//             userEmail: email,
//             newsHeading,
//             news: newsContent,
//             expiryDate: formattedDate,
//             // createdAt: formattedDate,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Tenant-ID": id,
//             },
//           }
//         );
//         setWasEdit(false);
//         setPostNews(true);
//         setIsView(false);
//         setNewsIndex(0);
//         fetchData();
//       } catch (error) {
//         console.error("Error posting news:", error);
//         alert("Failed to post news.");
//       } finally {
//          setLoading(false);
//       }
//     }
//     setNewsHeading("");
//     setNewsContent("");
//     setExpiryDate("");
//     setIsError(false);
//     setError("");
//   };

//   useEffect(() => {
//     let timer;
//     if (postNews) {
//        timer = setTimeout(() => {
//         setPostNews(false);
//         setWasEdit(false);
//       }, 5000);
//     }
//     //setPostNews(false);
//     //setWasEdit(false);

//       // const handleClick = () => {
//       //   clearTimeout(timer);
//       //   setPostNews(false);
//       //   setWasEdit(false);
//       // };

//       // document.addEventListener("click", handleClick);

//       // return () => {
//       //   clearTimeout(timer);
//       //   document.removeEventListener("click", handleClick);
//       // };
//       return () => clearTimeout(timer);
    
//   }, [postNews]);

//   // if (!postNews) return null;

//   // const handleOutsidePress = () => {
//   //   if (postNews) {
//   //     setPostNews(false);
//   //     setWasEdit(false);
//   //   }
//   // }

//   const handleDeletenews = async () => {
//      setLoading(true);
//     try {
//        await axios.delete(
//         `${url}/apis/employees/companyNews/deleteNewsById/${selectedDeleteId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": id,
//           },
//         }
//       );
//       fetchData();
//       setDeleteModel(false);
     
//     } catch (error) {
//       console.error("Error Deleting Company News: ", error);
//     } finally {
//        setLoading(false);
//     }
//   };

//   // minimum date tomorrow
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const handleDateChange = (event, selectedDate) => {
//     setShowPicker(false);
//     if (selectedDate) {
//       const formatted = selectedDate.toISOString().split("T")[0];
//       setExpiryDate(formatted);
//     }
//   };
//   console.log("length : ", newsData.length);
//   console.log("index : ", newsIndex);

  return (
    <>
    {loading && <Loader />}
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={{ marginTop: 10 }}>Company News</Text>
        <Text
          style={{ fontSize: 12, alignSelf: "center", textAlign: "center" }}
        >
          Stay updated with the latest company news and updates.
        </Text>
      </View>
      {role !== "employee" && role !== "manager" && (
        <TouchableOpacity onPress={() => setIsView(!isView)} style={styles.viewButton}>
          <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}> {isView ? "View News" : "Post News"}</Text>
        </TouchableOpacity>
      )}

      <View
        style={{ height: 1, backgroundColor: "#000", marginVertical: 10 }}
      />
      

      {isView ? (
        <View style={styles.companyNewsInner}>
          <TextInput
            placeholder="Heading"
            value={newsHeading}
            onChangeText={(text) => setNewsHeading(text)}
            style={styles.newsInput}
          />
          <TextInput
            placeholder="News"
            multiline={true}
            numberOfLines={5}
            value={newsContent}
             maxLength={MAX_CHARS}
            onChangeText={(text) => setNewsContent(text)}
            style = {styles.newsTextarea}
          />
            <Text style={{ alignSelf: "flex-start", marginTop: 4, marginHorizontal : 10, color: "#888" }}>
    {newsContent.length}/{MAX_CHARS}
  </Text>
           {isNewsContentError && <Text style={{ color: "red" }}>{newsContentError}</Text>}
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
                placeholder="Expiry Date"
                value={expiryDate}
                editable={false} // disables typing, user must pick a date
              />
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={expiryDate ? new Date(expiryDate) : tomorrow}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={tomorrow}
                onChange={handleDateChange}
              />
            )}
          </View>
          {isDateError && <Text style={{ color: "red" }}>{dateError}</Text>}
          {isPastDateError && <Text style={{ color: "red" }}>{pastDateError}</Text>}
          <TouchableOpacity onPress={handleSubmitNews} style={styles.viewButton}>
            <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>{isEditMode ? "Update News" : "Post News"}</Text>
          </TouchableOpacity>
          {isError && <View style={{ color: "red" }}>{error}</View>}
        </View>
      ) : (
        <View style={{justifyContent : 'center', alignItems : 'center'}} >
          {newsData.length > 0 && (
            <View style={styles.newsCard}>
              {newsIndex !== 0 && (
                <View>
                  <TouchableOpacity onPress={() => setNewsIndex(newsIndex - 1)}>
                    <Text style={{fontSize:24}}>{'<'}</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.newsView}>
                <Text style={styles.newsViewText1}>
                  {newsData[newsIndex].newsHeading}
                </Text>
                <Text style={styles.newsViewText2}>
                  {newsData[newsIndex].news}
                </Text>
                <Text style={styles.newsViewText2}>
                  {(() => {
                    const date = new Date(newsData[newsIndex].expiryDate);
                    const day = date.getDate().toString().padStart(2, "0");
                    const month = (date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                  })()}
                </Text>
                {(role !== "employee" && role!=="manager") && 
                <View style={{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10,}}>
                    <TouchableOpacity 
                    onPress={() => {
                         const newsItem = newsData[newsIndex];
                    setSelectedEditId(newsItem.newsId);
                    setNewsHeading(newsItem.newsHeading);
                    setNewsContent(newsItem.news);
                    setExpiryDate(newsItem.expiryDate);
                    setIsView(true);
                    setIsEditMode(true);

                    }}>
                        <Text>
                            <AntDesign name="edit" size={24} color="black" />

                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        setSelectedDeleteId(newsData[newsIndex].newsId);
                    setDeleteModel(true);
                    }}
                    >
                        <Text>
                            <AntDesign name="delete" size={24} color="red" />

                        </Text>
                    </TouchableOpacity>
                    </View>
                
                }
              </View>
              {newsData.length - 1 !== newsIndex && (
                <View>
                  <TouchableOpacity onPress={() => setNewsIndex(newsIndex + 1)}>
                    <Text style={{fontSize : 24}}>{'>'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
    
   
            <Modal isVisible={postNews}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, color: '#19CF99', fontWeight: 'bold' }}>
            Company News
            </Text>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 10 }}>
            {wasEdit ? "News updated Successfully" : "News posted Successfully"}
            </Text>
            </View>
            </Modal>
      
    
    <Modal isVisible={deleteModel}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    Are you sure you want to delete this Comapny News?
                </Text>
                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10}}>
                    <TouchableOpacity  style={styles.viewButton}   
                onPress={() => setDeleteModel(false)}>
                        <Text style={styles.newsButtonCancel}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewButton}
                onPress={() => handleDeletenews(selectedDeleteId)}
                >
                <Text style={styles.newsButtonDelete}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
</Modal>
    </>
  );
};

export default CompanyNews;