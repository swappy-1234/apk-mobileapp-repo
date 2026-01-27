import { useCallback, useContext, useEffect, useState } from "react";
import { url } from "../../universalApi/universalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import profile from "../../assets/Navbar/profilePhoto.png";
import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import { getCroppedImg } from "../../utils/getCroppedImg";
import LayoutWrapper from "../LayoutWrapper";
import { ScrollView, View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import styles from '../../styles/Employee/MyProfile';
import roleColors from "../Colors/Colors";
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Loader from "../Loader/Loader";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Pension from "./Pension";

const MyProfile = () => {
  
  const [employee, setEmployee] = useState();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImgSelected, setNewImgSelected] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isUpdateEmployee, setIsUpdateEmployee] = useState(false);
  const [updateEmployee, setUpdateEmployee] = useState({});
  const [loading, setLoading] = useState(false);

  const [hover, setHover] = useState(false);
   const [isUpdatePension, setIsUpdatePension]=useState(false);
  const [pensionData, setPensionData]=useState({});
  const [data, setData] = useState("");
  const [id, setId] = useState("");

  const fetchData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const tenant = await AsyncStorage.getItem("tenantId");

    console.log("stored response : ", JSON.parse(stored));
    setData(JSON.parse(stored));
    setId(JSON.parse(tenant));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const role = data.role;
  const token = data.token;
  const employeeId = data.employeeId;
  console.log("token : ", token);

  const updateEmployeeState = (updated) => {
    setEmployee((prev) => ({ ...prev, ...updated }));
  };

  const fetchPensionData=async()=>{
    setIsLoading(true);
    try{
      const response=await axios.get(`${url}/api/pension/employee/${employeeId}`, {
          
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        })

        setPensionData(response.data);

        console.log("response", response);
    }
    catch(e){
      console.log(e)
    }
    finally{
      setIsLoading(false);
    }
  }


  const fetchEmployee = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/v1/employeeManager/getEmployee/${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Tenant-ID": id,
          },
        }
      );

      let data = response.data;
      data.email = data.corporateEmail.toLowerCase();

      setEmployee(data);
      console.log("employee data", response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
    try {
      const response = await axios.get(
        `${url}/apis/employees/contacts/contactsBy/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, [employeeId, id, token]);

  useEffect(() => {
  if (employeeId && token && id) {
    fetchEmployee();
    fetchPensionData();
  }
}, [employeeId, token, id]);

 


  const handleIconClick = () => {
    setIsModalOpen(true);
  };

  const handleLoadings = () => {
    setLoading((prevData) => !prevData);
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // file type check
  //   const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  //   if (!allowedTypes.includes(file.type)) {
  //     alert("only jpeg, png, webp images are allowed.");
  //     return;
  //   }

  //   // file size limit
  //   const max_size = 1;
  //   const max_size_bytes = max_size * 1024 * 1024;
  //   if (file.size > max_size_bytes) {
  //     alert(`file size must not exceed ${max_size} KB`);
  //     return;
  //   }

  //   setImageSrc(null); // ❗ Reset previous image first

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImageSrc(reader.result); // ✅ fresh base64 image
  //     setIsModalOpen(true);
  //     setNewImgSelected(true);
  //   };
  //   reader.readAsDataURL(file);
  // };

//  const handleFileChange = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ['images'],
//     allowsEditing: true,
//     aspect: [1, 1],
//     quality: 1,
//     base64: true,
//   });

//   if (result.canceled) return;

//   const image = result.assets[0];

//   // File type check
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
//   if (!allowedTypes.includes(image.mimeType)) {
//     alert('Only jpeg, png, webp images are allowed');
//     return;
//   }

//   // File size limit (1 MB)
//   if (image.fileSize > 1 * 1024 * 1024) {
//     alert('File size must not exceed 1 MB');
//     return;
//   }

//   // setImageSrc(`data:${image.mimeType};base64,${image.base64}`);
//   setImageSrc(image.uri); // ✅ FILE URI
//   setIsModalOpen(true);
//   setNewImgSelected(true);
// };

const handleFileChange = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,   // native crop UI
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return;

  const image = result.assets[0];

  setImageSrc(image.uri); // ✅ FILE URI
  setIsModalOpen(true);
  setNewImgSelected(true);
};

  const durationCalculation = (dateOfHired) => {
    if (!dateOfHired) {
      return null;
    }

    const startDate = new Date(dateOfHired);
    const endDate = new Date();

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust days if negative
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust months if negative
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return (
      <Text>
        {years > 0 && `${years} Year${years > 1 ? "s" : ""} `}
        {months > 0 && `${months} Month${months > 1 ? "s" : ""} `}
        {days > 0 && `${days} Day${days > 1 ? "s" : ""}`}
      </Text>
    );
  };

  // const handleSubmit = async () => {
  //   if (!imageSrc || !croppedAreaPixels) return;
  //   try {
  //     const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
  //     const formData = new FormData();
  //     formData.append("employeeId", employeeId);
  //     formData.append("profilePhoto", croppedBlob);

  //     const res = await axios.put(
  //       `${url}/api/v1/employeeManager/ProfilePhotoUpdate`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //           "X-Tenant-ID": id,
  //         },
  //       }
  //     );

  //     fetchEmployee();

  //     setIsModalOpen(false);
  //     setNewImgSelected(false);
  //     setImageSrc(null);
  //     setCrop({ x: 0, y: 0 }); //  ❗  Reset crop
  //     setZoom(1);
  //     setCroppedAreaPixels(null);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //   }
  // };
  const handleSubmit = async () => {
  if (!imageSrc) return;

  try {
    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('profilePhoto', {
      uri: imageSrc,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    await axios.put(
      `${url}/api/v1/employeeManager/ProfilePhotoUpdate`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-ID': id,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    await fetchEmployee();

    // reset
    setIsModalOpen(false);
    setNewImgSelected(false);
    setImageSrc(null);

  } catch (error) {
    console.log('Upload failed:', error?.response || error);
  }
};


//   const handleSubmit = async () => {
//   if (!imageSrc) return;

//   try {
//     // 🔹 Crop image natively
//     const manipulatedImage = await ImageManipulator.manipulateAsync(
//       imageSrc,
//       [
//         {
//           crop: {
//             originX: croppedAreaPixels.x,
//             originY: croppedAreaPixels.y,
//             width: croppedAreaPixels.width,
//             height: croppedAreaPixels.height,
//           },
//         },
//       ],
//       {
//         compress: 1,
//         format: ImageManipulator.SaveFormat.JPEG,
//       }
//     );

//     // 🔹 Create FormData (RN WAY)
//     const formData = new FormData();
//     formData.append('employeeId', employeeId);
//     formData.append('profilePhoto', {
//       uri: manipulatedImage.uri,
//       name: 'profile.jpg',
//       type: 'image/jpeg',
//     });

//     // 🔹 API CALL
//     await axios.put(
//       `${url}/api/v1/employeeManager/ProfilePhotoUpdate`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'X-Tenant-ID': id,
//         },
//       }
//     );

//     // 🔹 Refresh UI
//     await fetchEmployee();

//     // 🔹 Reset state
//     setIsModalOpen(false);
//     setNewImgSelected(false);
//     setImageSrc(null);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//     setCroppedAreaPixels(null);

//   } catch (error) {
//     console.error('Upload failed:', error?.response || error);
//   }
// };

  // const handleDelete = async () => {
  //   try {
  //     const delResponse = await axios.delete(
  //       `${url}/api/v1/employeeManager/ProfilePhotoDelete`,
  //       {
  //         params: {
  //           employeeId: employee.employeeId,
  //         },

  //         headers: {
  //           // 'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //           "X-Tenant-ID": id,
  //         },
  //       }
  //     );

  //     if (delResponse.status === 200) {
  //       //alert("Profile photo deleted successfully!");

  //       setNewImgSelected(false);
  //       //       setEmployee(prev => ({
  //       //   ...prev,
  //       //   profilePhoto: null,
  //       // }));

  //       //    setImageSrc(null);
  //       setIsModalOpen(false);
  //       setShowDeleteModal(true);
  //       window.location.reload();
  //       // Refresh employee data (optional but recommended)
  //       fetchEmployee();
  //     } else {
  //       alert("Failed to delete profile photo");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting profile photo:", error);
  //     alert("An error occurred while deleting the profile photo.");
  //   }
  // };

  const handleDelete = async () => {
  try {
    const response = await axios.delete(
      `${url}/api/v1/employeeManager/ProfilePhotoDelete`,
      {
        params: { employeeId: employee.employeeId }, // confirm backend
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      }
    );

    if (response.status === 200) {

      // ✅ CLEAR UI STATE
      setEmployee(prev => ({
        ...prev,
        profilePhoto: null,
      }));

      setImageSrc(null);
      setNewImgSelected(false);
      setIsModalOpen(false);
      setShowDeleteModal(false);

      // ✅ OPTIONAL: refetch to sync backend
      await fetchEmployee();
    }

  } catch (error) {
    console.error("Error deleting profile photo:", error?.response || error);
    alert("Failed to delete profile photo");
  }
};

  console.log("emp: ", employee);

  
if (isLoading || !employee) {
  return (
    <LayoutWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader/>
      </View>
    </LayoutWrapper>
  );
}

function formatToDayMonthYear(dateStr) {
  if (typeof dateStr !== "string") return dateStr;

  // Matches YYYY-MM-DD (e.g., 2025-12-18)
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

  // Matches DD-MM-YYYY (e.g., 18-12-2025)
  const dmyPattern = /^(\d{2})-(\d{2})-(\d{4})$/;

  if (dmyPattern.test(dateStr)) {
    // Already in desired format
    return dateStr;
  }

  const isoMatch = dateStr.match(isoPattern);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;

    // Sanity check
    if (
      Number(mm) >= 1 &&
      Number(mm) <= 12 &&
      Number(dd) >= 1 &&
      Number(dd) <= 31
    ) {
      return `${dd}-${mm}-${yyyy}`;
    }
  }

  // Fallback
  return dateStr;
}


  return (
    <>
    {
      isLoading ? (<Loader/>) : (
        <LayoutWrapper>
        <ScrollView>
          <View>
            <View style={styles.employeeMainInner}>
              <Text style={[styles.employeeProfile, {color: roleColors[role]}]}>Profile</Text>
              <View>
               
                <View style={styles.profileContainer}>
                  {/* {image} */}
                  <Pressable
  onPress={handleIconClick}
  style={({ pressed }) => [
    styles.profilePhotoContainer,
    {
      borderColor: roleColors[role],
      borderWidth: pressed ? 4 : 1, // hover → press
    },
  ]}
>
  {employee?.profilePhoto && employee.profilePhoto !== "" ? (
    <Image
      source={{
        uri: `${employee.profilePhoto}?t=${Date.now()}`,
      }}
      style={styles.profileImage}
      resizeMode="cover"
      onError={() => {
        console.log('Image failed to load');
      }}
    />
  ) : (
    <FontAwesome
      name="user"
      size={40}
      color={roleColors[role]}
    />
  )}
</Pressable>
{/* {modal} */}

<Modal
  visible={isModalOpen}
  transparent
  animationType="fade"
>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>

     
      <View style={styles.closeWrapper}>
        <TouchableOpacity onPress={() => setIsModalOpen(false)}>
          <Ionicons
            name="close"
            size={26}
            color={roleColors[role]}
          />
        </TouchableOpacity>
      </View>

     
      {!newImgSelected ? (
        <View style={styles.photoContainer}>

         
          {employee?.profilePhoto && employee.profilePhoto !== "" ? (
    <Image
      source={{
        uri: `${employee.profilePhoto}?t=${Date.now()}`,
      }}
      style={styles.profileImage}
      resizeMode="cover"
      onError={() => {
        console.log('Image failed to load');
      }}
    />
  ) : (
    <FontAwesome
      name="user"
      size={40}
      color={roleColors[role]}
    />
  )}
        
          <View style={styles.photoCard}>

          
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleFileChange}
            >
              <Ionicons name="cloud-upload-outline" size={22} />
              <Text style={styles.actionText}>Add a photo</Text>
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                setShowDeleteModal(true);
                setIsModalOpen(false);
              }}
              disabled={!employee.profilePhoto}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={employee.profilePhoto ? 'red' : '#aaa'}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: employee.profilePhoto ? 'red' : '#aaa' },
                ]}
              >
                Delete photo
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      ) : (
        <View style={styles.cropContainer}>

          
          <View style={styles.cropBox}>
            
          </View>

          <View style={styles.photoChangeActions}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleFileChange}
            >
              <Ionicons name="cloud-upload-outline" size={22} />
              <Text style={styles.actionText}>Change photo</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  { backgroundColor: roleColors[role] },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  setNewImgSelected(false);
                  setImageSrc(null);
                  setIsModalOpen(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      )}
    </View>
  </View>
</Modal>
<Modal
  visible={showDeleteModal}
  transparent
  animationType="fade"
>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>

      <Text style={styles.deleteTitle}>Remove photo</Text>

      <Image
        source={{
          uri: `${employee.profilePhoto}?t=${Date.now()}`,
        }}
        style={styles.photoImg}
      />

      <Text style={styles.confirmText}>
        Are you sure you want to delete the photo?
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: 'red' }]}
          onPress={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setShowDeleteModal(false)}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>



                  <View>
                    <Text style={[styles.employeeProfile, {color: roleColors[role]}]}>{`${employee?.firstName || ""} ${
                      employee?.lastName || ""
                    }`}</Text>
                    <Text style={{ fontWeight : '600'}}>{employee?.role[0].toUpperCase()+employee?.role.slice(1,employee?.role.length).toLowerCase() || ""}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.button, {backgroundColor: roleColors[role] }]} onPress={() => {
                setIsUpdateEmployee(true); setUpdateEmployee(employee);
              }}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

              </View>
              {/* {employee id} */}
              <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>EmployeeId</Text>
                <View style={styles.employeeBox}>
                    <Feather name="user" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.employeeId || " "}</Text>
                </View>
              </View>

              {/* {doj} */}
               <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Date Of Joining</Text>
                <View style={styles.employeeBox}>
                    <Feather name="calendar" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.dateOfJoining || " "}</Text>
                </View>
              </View>

              {/* {department} */}
               <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Department</Text>
                <View style={styles.employeeBox}>
                    <FontAwesome name="file-text-o" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.department || " "}</Text>
                </View>
              </View>

              {/* {employee status} */}
               <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Employee Status</Text>
                <View style={styles.employeeBox}>
                    <Feather name="user" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.employeeStatus[0].toUpperCase()+employee?.employeeStatus.slice(1,employee.employeeStatus.length).toLowerCase() || ""}</Text>
                </View>
              </View>

               {/* {corporate email} */}
                <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Corporate Email</Text>
                <View style={[styles.employeeBox, {width : 300}]}>
                    <Entypo name="email" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.corporateEmail.toLowerCase() || " "}</Text>
                </View>
              </View>

               {/* {employment status} */}
                <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Employment Status</Text>
                <View style={styles.employeeBox}>
                    <Feather name="user" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.employmentStatus || " "}</Text>
                </View>
              </View>

               {/* {designation} */}
                <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Job Role</Text>
                <View style={styles.employeeBox}>
                    <Entypo name="location-pin" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.jobRole || " "}</Text>
                </View>
              </View>

               {/* {working country} */}
                <View style={styles.employeeInside}>
                <Text style={styles.employeeText}>Working Country</Text>
                <View style={styles.employeeBox}>
                  <Entypo name="location-pin" size={18} style={{marginRight : 10, color: roleColors[role]}} />
                    <Text>{employee?.workingCountry || " "}</Text>
                </View>
              </View>

            </View>
            <View style={styles.cardContainer}>
              {/* pension */}
              <View style={styles.card}>
                <Text style={[styles.employeeProfile, {color: roleColors[role]}]}>Pension</Text>
                {
                  Object.keys(pensionData).length === 0  && (
                    <View>
                      <Text>
                         Please update your pension plan by clicking the Update button.
                      </Text>
                      <TouchableOpacity onPress={()=>setIsUpdatePension(true)} style={styles.button}>
                        <Text style={styles.buttonText}>
                          Update
                        </Text>
                      </TouchableOpacity>
                      </View>
                  )
                }

                {
                  Object.keys(pensionData).length > 0 && (
                    <View>
                     <View style={styles.cardAlign}>
                       <Text>Pension Status : </Text>
                      <Text>{pensionData.status==="OPT_IN" ? "OPT IN":"OPT OUT"}</Text>
                      </View>
                      <View style={styles.cardAlign}>
                        <Text>
                          {pensionData.status==="OPT_IN" ? "OPT IN":"OPT OUT"} Date:
                        </Text>
                        <Text>
                          {formatToDayMonthYear(pensionData.date)}
                        </Text>
                        </View>
                        <View style={{alignItems : 'center'}}>
                         <TouchableOpacity onPress={()=>setIsUpdatePension(true)} style={[styles.button1, {backgroundColor : roleColors[role]}]}>
                        <Text style={styles.buttonText}>
                          Update
                        </Text>
                      </TouchableOpacity>
                      </View>
                      </View>
                  )
                }

              </View>
              <Modal isVisible={isUpdatePension} transparent>
                  <Pension setIsUpdatePension={setIsUpdatePension} fetchPensionData={fetchPensionData} pensionData={pensionData}/>
              </Modal>
            {/* {address} */}
            <View style={styles.card}>
                <Text style={[styles.employeeProfile, {color: roleColors[role]}]}>Address</Text>
                <Text>{[employee?.streetAddress, employee?.city, employee?.region]
                .filter(Boolean)
                .join(", ")}
              {employee?.postalCode ? ` - ${employee?.postalCode}` : ""}</Text>

            </View>
            {/* {Duration of Employment} */}
            <View style={styles.card}>
                <Text style={[styles.employeeProfile, {color: roleColors[role]}]}>Duration Of Employment</Text>
                 {durationCalculation(employee?.dateOfJoining)}
            </View>
            </View>
          </View>
        </ScrollView>
      </LayoutWrapper>

      )
    }
      
    </>
  );
};

export default MyProfile;
