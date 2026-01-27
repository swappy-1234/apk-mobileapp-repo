
import { Pressable, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import styles from '../../styles/Compliance/AdminNextKin';

const AdminNextKin = ({nextKin}) => {

  const handleDownload = async () => {
  try {
    const url = nextKin?.identityDocumentType;
    const fileName = url.split('/').pop();
    // eslint-disable-next-line import/namespace
    const downloadDest = `${FileSystem.documentDirectory}${fileName}`;

    const { uri } = await FileSystem.downloadAsync(url, downloadDest);
    Alert.alert('Download Success', `File saved to ${uri}`);
  } catch (error) {
    console.error(error);
    Alert.alert('Download Failed', 'Something went wrong');
  }
};
    return (
       <View style={styles.card}>
      <Text style={styles.heading}>Emergency Contact</Text>
      {/* first name */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>FIRST NAME</Text>
         <Text>{nextKin?.firstName}</Text>
      </View>

      {/* last name */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>LAST NAME</Text>
        <Text>{nextKin?.lastName}</Text>
      </View>

      {/* email */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>EMAIL</Text>
        <Text>{nextKin?.email}</Text>
      </View>

      {/* employee id */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>EMPLOYEE ID</Text>
         <Text>{nextKin?.employeeId}</Text>
      </View>

      {/* relation */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>RELATION</Text>
         <Text>{nextKin?.relation}</Text>
      </View>

      {/* gender */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>GENDER</Text>
          <Text>{nextKin?.gender}</Text>
      </View>

      {/* mobile number */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>MOBILE NUMBER</Text>
         <Text>{nextKin?.mobileNumber}</Text>
      </View>

      {/* DOB */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DATE OF BIRTH</Text>
           <Text>{nextKin?.dateOfBirth}</Text>
      </View>

      {/* DOCUMENT NUMBER */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DOCUMENT NUMBER</Text>
        <Text>{nextKin?.identityDocumentNumber}</Text>
      </View>

      {/* Doument Type */}
      <View style={styles.labelCard}>
        <Text style={styles.label}>DOCUMENT TYPE</Text>
         <View>
            <Text>{nextKin?.identityDocumentType.split("/")[4] || ""}</Text>
            {
                nextKin?.identityDocumentType && (
                   <Feather name="download" size={24} color="#000" onPress={handleDownload} />
                )
            }
         </View>
      </View>

     
    </View>
    )
};

export default AdminNextKin;