import { useState, useEffect,} from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { url } from "../universalApi/universalApi";
import styles from "../styles/MyColleagues";
import { DataTable } from "react-native-paper";
import LayoutWrapper from "./LayoutWrapper";

const MyColleagues = () => {
  // const { state, tenantId, companyDetails } = useContext(MyContext);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [data, setData] = useState({});
  const [id, setId] = useState("");
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
    const [filterCountry, setFilterCountry] = useState("all");

  // ✅ Validate context
  // if (!state) {
  //   console.error("❌ MyContext is undefined — provider not wrapping this screen");
  //   return (
  //     <View>
  //       <Text style={{ color: "red" }}>
  //         Context not initialized — please check MyProvider placement.
  //       </Text>
  //     </View>
  //   );
  // }

  // const managerId = state?.reportingTo;
  // console.log("Manager ID: ", managerId);

  // ✅ Load stored data once
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

  const employeeId = data?.employeeId;
  const token = data?.token;
 
  console.log("employee id : ", employeeId);

  // ✅ Fetch employees from backend
  useEffect(() => {
    if (!token || !id) return; // wait until data is loaded

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/employeeManager/alsoWorkingWith/${employeeId}/${filterCountry}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Tenant-ID": id,
            },
          }
        );

        let result = response.data.filter(
          (each) => each.employeeId !== employeeId
        );

        console.log("Employees:", result);

        setEmployees(result);
        setSearchFilter(result);
        setFilteredEmployees(result);

        let pages = Array.from(
          {
            length:
              result.length % 5 === 0
                ? result.length / 5
                : Math.floor(result.length / 5) + 1,
          },
          (_, i) => i + 1
        );

        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setFilteredEmployees(result.slice(0, 5));
      } catch (e) {
        console.error("Error fetching employees:", e.message);
      }
    };

    fetchEmployees();
  }, [token, id, employeeId]);

  // ✅ Handle search
  const handleSearch = (v) => {
    setSearch(v);
    const filteredData = searchFilter.filter(
      (each) =>
        each.firstName?.toLowerCase().includes(v.toLowerCase()) ||
        each.lastName?.toLowerCase().includes(v.toLowerCase())
    );

    let result = filteredData;
    setEmployees(result);

    let pages = Array.from(
      {
        length:
          result.length % 5 === 0
            ? result.length / 5
            : Math.floor(result.length / 5) + 1,
      },
      (_, i) => i + 1
    );

    setNoOfPages(pages);
    setDisplayedPageNo(pages.slice(0, 3));
    setFilteredEmployees(result.slice(0, 5));
    setCurrentPage(1);
  };

  // ✅ Update displayed pagination range
  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  // ✅ Handle pagination
  const pagination = (nextPage) => {
    setFilteredEmployees(employees.slice((nextPage - 1) * 5, nextPage * 5));
    updateDisplayedPages(nextPage);
  };

  return (
    <>
    <LayoutWrapper>
    <View style={styles.myTeam}>
      <View style={styles.myTeamInner}>
        {/* 🔍 Search */}
        <View>
          <TextInput
            value={search}
            keyboardType="web-search"
            onChangeText={handleSearch}
            placeholder="Search by name"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 8,
              marginBottom: 10,
            }}
          />
        </View>

        {/* 🧑‍💼 Table Header */}
        <DataTable style={{padding : 15}}>
          <DataTable.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <DataTable.Title>NAME</DataTable.Title>
            <DataTable.Title>EMAIL</DataTable.Title>
            <DataTable.Title>ROLE</DataTable.Title>
            <DataTable.Title>JOB ROLE</DataTable.Title>
            <DataTable.Title>WORKING COUNTRY</DataTable.Title>
            
          </DataTable.Header>

          {/* 📋 Employee List */}
          <View>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((each) => (
                <DataTable.Row
                  key={each.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    paddingVertical: 6,
                  }}
                >
                  <DataTable.Cell>
                    {each.firstName} {each.lastName}
                  </DataTable.Cell>
                  <DataTable.Cell>{each.email}</DataTable.Cell>
                  <DataTable.Cell>{each.role}</DataTable.Cell>
                  <DataTable.Cell>{each.jobRole}</DataTable.Cell>
                  <DataTable.Cell>{each.workingCountry}</DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell>No employees found</DataTable.Cell>
              </DataTable.Row>
            )}
          </View>
        </DataTable>

        {/* 📄 Pagination */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (currentPage !== 1) {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                pagination(prevPage);
              }
            }}
          >
            <Text style={{ fontSize: 24 }}>{"<"}</Text>
          </TouchableOpacity>

          {displayedPageNo.map((each) => (
            <TouchableOpacity
              key={each}
              onPress={() => {
                setCurrentPage(each);
                pagination(each);
              }}
            >
              <Text
                style={{
                  fontWeight: currentPage === each ? "bold" : "normal",
                  fontSize: 16,
                }}
              >
                {each}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => {
              if (currentPage !== noOfPages.length) {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                pagination(nextPage);
              }
            }}
          >
            <Text style={{ fontSize: 24 }}>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </LayoutWrapper>
    </>
  );
};

export default MyColleagues;
