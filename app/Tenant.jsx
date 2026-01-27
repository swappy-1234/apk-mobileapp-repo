import React, {  useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from '../styles/Tenant';
import axios from "axios";
import Login from "./Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import talentflow from "../assets/Talentflow.png";
import { url } from "../universalApi/universalApi";
import CompanyLogo from "../assets/Navbar/CompanyLogo.png";
import Loader from "./Loader/Loader";


const Tenant = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filterCompanies, setFilterCompanies]=useState([]);
  const [showCompanies, setShowCompanies] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [data, setData] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [isLogin, setIsLogin]=useState(false);
  const [loading, setLoading] = useState(false);


  // const url = "http://10.0.2.2:8080";
  //const url = "http://localhost:8080";

  

  const fetchCompanies = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${url}/api/clientDetails/getClientDetails`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": "india_public",
        },
      }
    );

    const countries = new Set(res.data.map(each => each.country));
    setData([...countries]);
    setCompanyData(res.data);
    setFilterCompanies(res.data);

  } catch (err) {
    console.log("error : ", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCompanies();
  }, []);
  
  const handleFocus = () => {
  if (loading || !selectedCountry) return;

  const filtered = companyData.filter(
    item => item.country?.toLowerCase() === selectedCountry.toLowerCase()
  );

  setFilterCompanies(filtered);
  setShowCompanies(true);
};


  const handleChange = useCallback(
  (text) => {
    setSearchText(text);

    if (loading || !selectedCountry) return;

    const filteredCompanies = companyData.filter(
      (company) =>
        company.country?.toLowerCase() === selectedCountry.toLowerCase() &&
        company.companyName.toLowerCase().includes(text.toLowerCase())
    );

    setFilterCompanies(filteredCompanies);
    setShowCompanies(true);
  },
  [companyData, selectedCountry, loading]
);


  const handleSelectCompany = (company) => {
    setSearchText(company.companyName);
    setTenantId(company.schemaName)
    console.log(company.schemaName)
    setShowCompanies(false);

  }

  const handleSubmit = async() => {
    if(tenantId){
       await AsyncStorage.setItem("tenantId", JSON.stringify(tenantId));
        setIsLogin(true);

    }

  }

  const formattedCountry = (name) => {
    return name
         .split(" ")
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");

  }



  return (
    <>
        {isLogin ? <Login/>:<View style={styles.login}>
        <View style={styles.loginBlock1}>
        <View style={styles.formContent}>
           <Image source={CompanyLogo} style={styles.logo} />
      {loading ? (<Loader />) : (
        <>
        <View style={styles.inputField1}>
        
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(value) => setSelectedCountry(value)}
        
      >
        
        <Picker.Item label="Select Country" value=""  />
        {data.map((country) => (
        <Picker.Item key={country} label={formattedCountry(country)} value={country} />
       ))}
      </Picker>
      </View>

      <TextInput keyboardType="web-search" value={searchText} placeholder="Search Companies" onFocus={handleFocus} onChangeText={handleChange} style={[styles.inputField2, styles.inputMargin]} />
       
  <FlatList
    // data={filterCompanies} // array of companies
    data={
    // selectedCountry && searchText.length > 0
    //   ? filterCompanies
    //   : [] // only show data when both are valid
    showCompanies ? filterCompanies : []
  }
    // keyExtractor={(item, index) => index.toString()}
    keyExtractor={(item) => item.schemaName}

    // style={styles.countryCard}
    style={[
    styles.countryCard,
    {
      display:
        // selectedCountry && searchText.length > 0 && showCompanies
        //   ? "flex"
        //   : "none", // hide visually but don't unmount
        showCompanies ? 'flex' : 'none'
    },
  ]}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => handleSelectCompany(item)}
        style={styles.countryText}
      >
        <Text>{item.companyName}</Text>
      </TouchableOpacity>
    )}
  />
        </>
      )}

      


        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
    </View>
    </View>
    </View>}
    </>
    
  );
};

export default Tenant;
