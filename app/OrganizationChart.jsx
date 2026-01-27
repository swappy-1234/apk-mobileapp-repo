import { useState, useRef, useEffect } from "react";
import { FlatList, Image, TextInput, View, Text, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "../universalApi/universalApi";
import Search from "../assets/OrganizationChart/search.png";
import profile from "../assets/Navbar/profilePhoto.png";
import countries from "../assets/Countries/countries.json";
import { Picker } from "@react-native-picker/picker";
import DotLoaderForCards from "../assets/Loader/DotLoaderForCards";
import DotLoader from "../assets/Loader/DotLoader";
import LayoutWrapper from "./LayoutWrapper";
import styles from "../styles/OrganizationChart";
import Loader from "./Loader/Loader";

const OrganizationChart = () => {
  const [loading, setLoading] = useState(false);
  const [originData, setOriginData] = useState([]);
  const [reportingEmployees, setReportingEmployees] = useState([]);
  const [workingWith, setWorkingWith] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");
  const ref = useRef();
  const [originLoading, setOriginLoading] = useState(false);
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [reportingLoading, setReportingLoading] = useState(false);
  const [alsoWorkingWithLoading, setAlsoWorkingWithLoading] = useState(false);
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [employeeId, setEmployeeId] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = await AsyncStorage.getItem("companies");
        const tenant = await AsyncStorage.getItem("tenantId");

        if (stored) setData(JSON.parse(stored));
        if (tenant) setId(JSON.parse(tenant));

        console.log("Stored response:", JSON.parse(stored));
      } catch (error) {
        console.error("Error fetching AsyncStorage:", error);
      }
    };

    fetchData();
  }, []);

  // const [employeeId, setEmployeeId] = useState(data.employeeId);
  // const employeeId = data.employeeId;
  const token = data?.token;

  console.log("employee id : ", employeeId);
  console.log("token : ",token);
  useEffect(() => {
  if (data?.employeeId) {
    setEmployeeId(data.employeeId);
  }
}, [data]);


  // useEffect(() => {
  //   const handleScroll = () => {
  //     setSuggestions([]);
  //     setSearch("");
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const fetchOrganizationChart = async () => {
    console.log("fetchData");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Tenant-ID": id,
    };
    const fetchOrigin = async () => {
      console.log("fetchData1");
      setOriginLoading(true);
      try {
        const originResponse = await axios.get(
          `${url}/api/v1/employeeManager/origin/${employeeId}`,
          {
            headers,
          }
        );
        console.log(originResponse);
        setOriginData(originResponse.data.reverse());
        setOriginLoading(false);
      } catch (e) {
        setOriginLoading(false);
        setOriginData([]);
      }
    };

    const fetchReportingTO = async () => {
      setReportingLoading(true);
      try {
        const reportingToResponse = await axios.get(
          `${url}/api/v1/employeeManager/reporting-to/${employeeId}/${filterCountry}`,
          { headers }
        );

        setReportingEmployees(reportingToResponse.data);
        setReportingLoading(false);
      } catch (e) {
        setReportingEmployees([]);
        setReportingLoading(false);
      }
    };

    const fetchAlsoWorkingWith = async () => {
      setAlsoWorkingWithLoading(true);
      try {
        const alsoWorkingWithResponse = await axios.get(
          `${url}/api/v1/employeeManager/alsoWorkingWith/${employeeId}/${filterCountry}`,
          { headers }
        );
        let data = alsoWorkingWithResponse.data.filter(
          (each) => each.employeeId !== employeeId
        );
        setWorkingWith(data);
        console.log("also working with : ", alsoWorkingWithResponse.data);
      } catch (e) {
        console.log(e);
        // setWorkingWith([]);
      }
      setAlsoWorkingWithLoading(false);
    };

    const fetchAllEmployees = async () => {
      try {
        const allEmployeesResult = await axios.get(
          `${url}/api/v1/employeeManager/employees`,
          { headers }
        );

        setAllEmployees(allEmployeesResult.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchOrigin();
    fetchReportingTO();
    fetchAlsoWorkingWith();
    fetchAllEmployees();
  };

  // useEffect(() => {
  //   fetchOrganizationChart();
  // }, [employeeId, filterCountry]);

//   useEffect(() => {
//     if (selectedEmployeeId) {
//         fetchOrganizationChart(selectedEmployeeId);
//     } else {
//         fetchOrganizationChart(employeeId); // default logged-in user
//     }
// }, [selectedEmployeeId, filterCountry]);

useEffect(() => {
  if (!employeeId) return;      // ❗ prevents early API calls
  fetchOrganizationChart(employeeId);
}, [employeeId, filterCountry]);


  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    console.log("123");
    const filtered = allEmployees
      .filter(
        (emp) =>
          (`${emp?.firstName ?? ""} ${emp?.lastName ?? ""}`)
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (emp?.employeeId?.toString().toLowerCase() || "").includes(search.toLowerCase())
      )
      .map((emp) => ({
        ...emp,
        fullName: `${emp.firstName ?? ""} ${emp.lastName ?? ""}`.trim(),
      }));
    console.log(filtered);
    setSuggestions(filtered);
  }, [search, allEmployees]);

  // const handleEmployeeId = (id) => setEmployeeId(id);

  const handleSelect = (employee) => {
    setSearch(`${employee.fullName} (${employee.employeeId})`);
    setSuggestions([]);
    
    setEmployeeId(employee.employeeId);
  };

  // useEffect(() => {
  //   function handleClickOutside(e) {
  //     if (ref.current && !ref.current.contains(e.target)) {
  //       setSuggestions([]);
  //       setSearch("");
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <>
      <LayoutWrapper>
        <ScrollView ishowsVerticalScrollIndicator={true}>
          <View style={styles.orgContent}>
            {/* Search and Filter */}
            <View style={styles.orgSearchFilters}>
              <View style={styles.filterContainer}>
                <View style={styles.searchBoxes} >
                  <TextInput
                    keyboardType="search"
                    placeholder="Search by name"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    style={styles.searchInput}
                  />
                  <Image source={Search} alt="search" style={styles.searchIcons} />
                  {suggestions.length > 0 && (
                    <View style={styles.orgSuggestionsBox}>
                      <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.employeeId.toString()}
                        scrollEnabled = {false}
                        renderItem={({ item }) => (
                          <Pressable
                            onPress={() => handleSelect(item)}
                            style={({ pressed }) => [
                              styles.orgSuggestionItem,
                              pressed && { backgroundColor: "#e0ecf4" },
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <Image
                                source={profile}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                }}
                              />
                              <Text style={styles.orgName}>
                                {item.fullName}
                              </Text>
                            </View>
                          </Pressable>
                        )}
                      />

                      {/* {suggestions.map((employee) => (
                      // <FlatList
                      //   key={employee.employeeId}
                      //   onPress={() => handleSelect(employee)}
                      //   ref={ref}
                      // >
                      //   <Image source={profile} />
                      //   <View>
                      //     <Text>{employee.fullName}</Text>
                      //   </View>
                      // </FlatList>
                       
                    ))} */}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.searchContainer}>
                <Picker style={styles.filterSelects} name="country" id="country" value={filterCountry} onValueChange={(text) => setFilterCountry(text)}>
                  <Picker.Item label="All Employees" value="all" />
                  {countries.map((each) => (
                    <Picker.Item key={each} value={each} label={each} />
                  ))}
                </Picker>
              </View>
            </View>
            {originLoading ? (
              <DotLoaderForCards />
            ) : (
              <View >
                {/* Origin */}
                <View style={styles.orgSection}>
                  {originData.map((each, index) => (
                    <View key={index} style={styles.orgBlock}>
                      <View 
                      // onPress={() => handleEmployeeId(each.employeeId)} 
                      style={styles.orgCard}>
                        <Image source={profile} />
                        <View>
                          <Text style={styles.orgNameLg}>
                            {each.firstName} {each.lastName}
                          </Text>
                          <Text style={styles.orgRole}>{each.jobRole}</Text>
                          <Text style={styles.orgCountry}>{each.workingCountry}</Text>
                        </View>
                      </View>
                      <View style={styles.orgLine}/>
                    </View>
                  ))}
                </View>
                {/* {reporting employees} */}
                <View style={styles.orgSectionBox}>
                  <Text style={styles.orgTitle}>Reporting Employees</Text>
                  <View>
                    {reportingEmployees.length > 0 ? (
                      <View style={styles.orgGrid}>
                        {reportingEmployees.map((each, index) => (
                          <View
                            key={index}
                            // onPress={() => handleEmployeeId(each.employeeId)}
                            style={styles.orgCards}
                          >
                            <Image source={profile} />
                            <View>
                              <Text style={styles.orgName}>
                                {each.firstName} {each.lastName}
                              </Text>
                              <Text style={styles.orgRole}>{each.jobRole}</Text>
                              <Text style={styles.orgCountry}>{each.workingCountry}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <>
                        {reportingLoading ? (
                          <View style={{display : 'flex', backgroundColor : '#ffffff', borderRadius : 10, padding  :6}}>
                            <DotLoader />
                          </View>
                        ) : (
                          <View style={{display : 'flex', backgroundColor : '#ffffff', borderRadius : 10, padding  :6}}>
                            <Text style={{color : '#ff0000', fontWeight : 'semibold', alignSelf : 'center'}}>
                              {errorMessage || filterCountry === "all"
                                ? "This employee has no direct reports."
                                : `This employee has no direct reports in ${filterCountry}.`}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
                <View style={styles.orgLineCenter} />
                  {/* {also working with } */}
                  <View style={styles.orgSectionBox}>
                    {alsoWorkingWithLoading ? (
                      <Text>Loading....</Text>
                    ) : (
                      <>
                        <Text style={styles.orgTitle}>Also Works With</Text>
                        <ScrollView ishowsVerticalScrollIndicator={true}>
                        <View style={styles.orgGrid}>
                          {workingWith.map((each, index) => (
                            <View
                              key={index}
                              // onPress={() => handleEmployeeId(each.employeeId)}
                              style={styles.orgCards}
                            >
                              <Image source={profile} />
                              <View>
                                <Text style={styles.orgName}>
                                  {each.firstName} {each.lastName}
                                </Text>
                                <Text style={styles.orgRole}>{each.jobRole}</Text>
                                <Text style={styles.orgCountry}>{each.workingCountry}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                        </ScrollView>
                      </>
                    )}
                  </View>
                  
                
              </View>
            )}
          </View>
        </ScrollView>
      </LayoutWrapper>
    </>
  );
};


export default OrganizationChart
