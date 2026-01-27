import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { url } from "../../universalApi/universalApi";
import axios from "axios";
import { Modal } from "react-native";
import roleColors from "../Colors/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import LayoutWrapper from "../LayoutWrapper";
import styles from '../../styles/Invoice/InvoiceDashboard';
import ShowErrorMsg from "./ShowErrorMsg";
import ConfirmPaidModal from "./ConfirmPaidModal";
import Loader from "../Loader/Loader";

const InvoiceDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState([]);
  const [status, setStatus] = useState("all");
  const [updateInvoice, setUpdateInvoice] = useState(null);
  const [createdDate, setCreatedDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [isUpdateModelOpen, setIsUpdateModel] = useState(false);
  const [noOfPages, setNoOfPages] = useState([]);
  const [displayedPageNo, setDisplayedPageNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState([]);
  const [emptyInvoice, setEmptyInvoice] = useState(false);
  const [hover, setHover] = useState(null);
  const [goToPage, setGoToPage] = useState("");
  const navigation = useNavigation();
  const [pageError, setPageError] = useState(false);

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

  const employeeId = storedData.employeeId;
  const token = storedData.token;
  const role = storedData.role;

  const fetchAllCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/api/companyDetails/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-ID": id,
        },
      });
      setAllCompanies(response.data);
      if (response.data.length > 0) {
        navigation.navigate("Invoice/AddInvoice");
      } else {
        setEmptyInvoice(true);
        // setCloseIsRegister(true);
      }
    } catch (error) {
      console.error("Error fetching all companies data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filterDatesRange = async () => {
      try {
        const response = await axios.get(
          `${url}/api/invoices/fetchByDate/${createdDate}/${dueDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": id,
            },
          }
        );
        setTotalInvoices(response.data);
        setInvoices(response.data);
        let data = response.data;
        let pages = Array.from(
          {
            length:
              data.length % 6 === 0
                ? data.length / 6
                : Math.floor(data.length / 6) + 1,
          },
          (_, i) => i + 1
        );

        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setPaginationData(data);
        setInvoices(data.slice((currentPage - 1) * 6, currentPage * 6));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching invoice data: ", error);
      }
    };
    if (createdDate && dueDate) {
      filterDatesRange();
    }
  }, [createdDate, dueDate]);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      let urlData = `${url}/api/invoices`;

      if (status === "PENDING") {
        urlData = `${url}/api/invoices/pendingInvoices`;
      } else if (status === "OVERDUE") {
        urlData = `${url}/api/invoices/overDueInvoices`;
      } else if (status === "PAID") {
        urlData = `${url}/api/invoices/paidInvoices`;
      }
      try {
        const response = await axios.get(urlData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        });
        const invoices = response.data.reverse();
        const totalPages = Math.ceil(invoices.length / 6);

        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPaginationData(invoices);
        setNoOfPages(pages);
        setDisplayedPageNo(pages.slice(0, 3));
        setCurrentPage(1);
        setInvoices(invoices.slice(0, 6));
        setTotalInvoices(invoices);
      } catch (error) {
        console.error("Error fetching invoices", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isUpdateModelOpen && id && token) {
      fetchInvoices();
    }
  }, [status, isUpdateModelOpen, id, token]);

  const paymentUpdate = (invoice) => {
    setUpdateInvoice(invoice);
    setIsUpdateModel(true);
  };

  const handleGoToPage = (pageNum) => {
    const totalPages = noOfPages.length;
    if (!pageNum || pageNum < 1 || pageNum > totalPages) {
      setPageError(
        `Please enter a valid page number between 1 and ${totalPages}`
      );
      return;
    }
    pagination(pageNum);
    setPageError(false);
  };

  const updateDisplayedPages = (page) => {
    const start = Math.floor((page - 1) / 3) * 3;
    setDisplayedPageNo(noOfPages.slice(start, start + 3));
  };

  const pagination = (page) => {
    setInvoices(paginationData.slice((page - 1) * 6, page * 6));
    setCurrentPage(page);
    updateDisplayedPages(page);
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `${url}/api/invoices/fetchByDate`,
        {
          params: {
            issueDate: createdDate,
            dueDate: dueDate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching filter dates", error);
    }
  };

  const handleSearchFilter = (name) => {
    const filtered = totalInvoices.filter((each) =>
      each.invoiceNumber.toLowerCase().includes(name.toLowerCase())
    );
    setInvoices(filtered);

    let data = filtered;
    let pages = Array.from(
      {
        length:
          data.length % 6 === 0
            ? data.length / 6
            : Math.floor(data.length / 6) + 1,
      },
      (_, i) => i + 1
    );

    setNoOfPages(pages);
    setDisplayedPageNo(pages.slice(0, 3));
    setPaginationData(data);
    setInvoices(data.slice((currentPage - 1) * 6, currentPage * 6));
    setCurrentPage(1);
    setSearchData(name);
  };

  const fetchByInvoiceId = async (updateId) => {
    try {
      const response = await axios.put(
        `${url}/api/invoices/paid/${updateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": id,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching By Id: ", error);
    }

    setIsUpdateModel(false);
  };

  const dateFormat = (date) => {
    const formattedDate =
      String(date.getDate()).padStart(2, "0") +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      date.getFullYear();

    return formattedDate;
  };

  function toDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  }

  const returnStatus = (status, dueDate) => {
    const today = dateFormat(new Date());
    const due = dateFormat(new Date(dueDate));
    if (status === "PENDING" && toDate(due) < toDate(today)) {
      return <Text style={{ color: "red" }}>OVERDUE</Text>;
    } else if (status === "PENDING") {
      return <Text style={{ color: "orange" }}>{status}</Text>;
    } else if (status === "PAID") {
      return <Text style={{ color: "green" }}>{status}</Text>;
    } else {
      return <Text style={{ color: "red" }}>{status}</Text>;
    }
  };

  return (
    <LayoutWrapper>
      <ScrollView>
         {isLoading && <Loader />}
        <View style={styles.container}>
          <View style={styles.con}>
            <TouchableOpacity onPress={() => navigation.navigate("Invoice/AddInvoice")} style={styles.navigateButton}>
              <Text style={[styles.navigateButtonText, {backgroundColor : roleColors[role]}]}>Create Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Invoice/CompaniesDashboard")}
              style={styles.navigateButton}
            >
              <Text style={[styles.navigateButtonText, {backgroundColor : roleColors[role]}]}>Company Dashboard</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
<Picker onPress={(value) => setStatus(value)} style={styles.filterSelects}>
            <Picker.Item label="Select Status" value="" />
            <Picker.Item label="PENDING" value="Pending" />
            <Picker.Item label="PAID" value="Paid" />
            <Picker.Item label="OVERDUE" value="Overdue" />
          </Picker>
          </View>
          
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <View key={invoice.id} style={styles.cardContainer}>
                <View style={styles.alignStyling}>
                  <View>
                    <Text>{invoice.invoiceNumber}</Text>
                    <Text>{invoice.country}</Text>
                  </View>
                  <View>
                    <Text>
                      
                      {returnStatus(invoice.invoiceStatus, invoice.dueDate)}
                    </Text>
                    <Text>
                      {invoice.country === "UK" ? "£" : "₹"}{" "}
                      {invoice.totalAmount?.toFixed(2)}
                    </Text>
                  </View>
                </View>
               <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
                <View style={styles.textStyling}>
                    <Text>Company Name : </Text>
                    <Text>{invoice.companyName}</Text>
                    </View>
                    <View style={styles.textStyling}>
                        <Text>Client Name : </Text>
                    <Text>{invoice.client?.clientName || "-"}</Text>
                        </View>
                        <View style={styles.textStyling}>
                        <Text>Issue Date : </Text>
                    <Text>{invoice.issueDate}</Text>
                        </View>
                        <View style={styles.textStyling}>
                        <Text>Due Date : </Text>
                    <Text>{invoice.dueDate}</Text>
                        </View>
                        <View style={styles.textStyling1}>
                             {
                                invoice.invoiceStatus !== 'PAID' ? (
                                    <View>
                                        <TouchableOpacity onPress={() => paymentUpdate(invoice)}>
                                            <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>Paid</Text>
                                        </TouchableOpacity>
                                        </View>
                                    
                                ) : (
                                    <>
                                    
                                    </>
                                )
                            }

                            <TouchableOpacity onPress={() => navigation.navigate('Invoice/InvoiceDetails', {id : invoice.id}) }>
                                <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>View</Text>
                            </TouchableOpacity>
                        
                            </View>

              </View>
            ))
          ) : (
            <>
              <Text>Not Found</Text>
            </>
          )}

           {/* {pagination} */}
                                                   {noOfPages.length > 0 && (
                                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                                      <TouchableOpacity
                                                        
                                                        disabled={displayedPageNo[0] === 1}
                                                        onPress={() => {
                                                          const start = Math.max(displayedPageNo[0] - 10, 1);
                                                          const end = start + 10;
                                                          setDisplayedPageNo(noOfPages.slice(start - 1, end - 1));
                                                          setCurrentPage(start);
                                                          pagination(start);
                                                          // setPageError(false);
                                                          setGoToPage("");
                                                        }}
                                                        style={{
                                                         
                                                          color: displayedPageNo[0] === 1 ? "#888" : "black",
                                                          borderColor: displayedPageNo[0] === 1 ? "#bbb" : "#ccc",
                                                          cursor:
                                                            displayedPageNo[0] === 1 ? "not-allowed" : "pointer",
                                                        }}
                                                      >
                                                          <Text>
                                                        <AntDesign name="double-left" size={18} />
                                                        </Text>
                                                      </TouchableOpacity>
                                                      <TouchableOpacity
                                                        
                                                        disabled={currentPage <= 1}
                                                        onPress={() => {
                                                          if (currentPage > 1) {
                                                            const prevPage = currentPage - 1;
                                                            pagination(prevPage);
                                                          //   setPageError(false);
                                                            setGoToPage("");
                                                            setCurrentPage(prevPage);
                                                          }
                                                        }}
                                                        style={{
                                                          
                                                          color: currentPage <= 1 ? "#888" : "black",
                                                          borderColor: currentPage <= 1 ? "#bbb" : "#ccc",
                                                          cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                                                        }}
                                                      >
                                                          <Text><AntDesign name="left" size={18} /></Text>
                                                          
                                                      </TouchableOpacity>
                                      
                                                      {/* Page Numbers */}
                                                      {displayedPageNo.map((each) => (
                                                        <TouchableOpacity
                                                          key={each}
                                                          onPress={() => {
                                                            pagination(each);
                                                          //   setPageError(false);
                                                            setGoToPage("");
                                                            setCurrentPage(each);
                                                          }}
                                                          
                                                        >
                                                          <Text style={{ color: "black", fontWeight: "700", fontSize : 20 }}> {each}</Text>
                                                        </TouchableOpacity>
                                                      ))}
                                                      <TouchableOpacity
                                                        
                                                        disabled={currentPage >= noOfPages.length}
                                                        onPress={() => {
                                                          if (currentPage < noOfPages.length) {
                                                            const nextPage = currentPage + 1;
                                                            pagination(nextPage);
                                                          //   setPageError(false);
                                                            setGoToPage("");
                                                            setCurrentPage(nextPage);
                                                          }
                                                        }}
                                                        style={{
                                                          
                                                          color: currentPage >= noOfPages.length ? "#888" : "black",
                                                          borderColor:
                                                            currentPage >= noOfPages.length ? "#bbb" : "#ccc",
                                                          cursor:
                                                            currentPage >= noOfPages.length
                                                              ? "not-allowed"
                                                              : "pointer",
                                                        }}
                                                      >
                                                       <Text><AntDesign name="right" size={18} /></Text>
                                                      </TouchableOpacity>
                                                      <TouchableOpacity
                                                        
                                                        disabled={
                                                          displayedPageNo[displayedPageNo.length - 1] >=
                                                          noOfPages.length
                                                        }
                                                        onPress={() => {
                                                          const visibleCount = displayedPageNo.length;
                                                          const nextStart = displayedPageNo[0] + visibleCount;
                                      
                                                          // Clamp to total pages
                                                          if (nextStart <= noOfPages.length) {
                                                            const nextEnd = Math.min(
                                                              nextStart + visibleCount - 1,
                                                              noOfPages.length
                                                            );
                                      
                                                            // Update displayed pages
                                                            setDisplayedPageNo(
                                                              noOfPages.slice(nextStart - 1, nextEnd)
                                                            );
                                      
                                                            // Jump to the first page of the new batch
                                                            setCurrentPage(nextStart);
                                                            pagination(nextStart);
                                                          //   setPageError(false);
                                                            setGoToPage("");
                                                          }
                                                        }}
                                                        style={{
                                                          // backgroundColor:
                                                          //   displayedPageNo[displayedPageNo.length - 1] >=
                                                          //   noOfPages.length
                                                          //     ? "#e0e0e0"
                                                          //     : "white",
                                                          color:
                                                            displayedPageNo[displayedPageNo.length - 1] >=
                                                            noOfPages.length
                                                              ? "#888"
                                                              : "black",
                                                          borderColor:
                                                            displayedPageNo[displayedPageNo.length - 1] >=
                                                            noOfPages.length
                                                              ? "#bbb"
                                                              : "#ccc",
                                                          cursor:
                                                            displayedPageNo[displayedPageNo.length - 1] >=
                                                            noOfPages.length
                                                              ? "not-allowed"
                                                              : "pointer",
                                                        }}
                                                      >
                                                       <Text>
                                                          <AntDesign name="double-right" size={18} />
                                                       </Text>
                                                      </TouchableOpacity>
                                      
                                                      <View>
                                                        <View style={{ display: "flex", flexDirection: "column" }}>
                                                          <TextInput
                                                            type="text"
                                                            placeholder={`(1–${noOfPages.length || 1})`}
                                                            title="Type a page number to jump automatically"
                                                           
                                                            value={goToPage}
                                                            onChangeText={(e) => {
                                                              // const newSize = parseInt(e.target.value) || "";
                                      
                                                              const value = parseInt(e.target.value.trim()) || "";
                                                              setGoToPage(value);
                                      
                                                              // Only trigger when it's a valid number
                                                              const pageNum = parseInt(value);
                                                              if (!isNaN(pageNum)) {
                                                                handleGoToPage(pageNum);
                                                              } else if (value !== "") {
                                                              //   setPageError(
                                                              //     "Please enter a numeric value for the page"
                                                              //   );
                                                              } else {
                                                              //   setPageError(false);
                                                              }
                                                            }}
                                                            style={{
                                                              // border: pageError ? "1px solid red" : "1px solid #ccc",
                                                              outline: "none",
                                                              textAlign: "center",
                                                            }}
                                                          />
                                      
                                                          {/* {pageError && (
                                                            <span
                                                              style={{
                                                                color: "red",
                                                                fontSize: "12px",
                                                                marginTop: "2px",
                                                              }}
                                                            >
                                                              {pageError}
                                                            </span>
                                                          )} */}
                                                        </View>
                                                      </View>
                                                    </View>
                                                  )}

                                                  
         <Modal visible={isUpdateModelOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsUpdateModel(false)}>
          <ConfirmPaidModal
            fetchByInvoiceId={fetchByInvoiceId}
            updateInvoice={updateInvoice}
            setIsUpdateModel={setIsUpdateModel}
          />
        </Modal>

        <Modal visible={emptyInvoice}
          transparent
          animationType="slide"
          onRequestClose={() => setEmptyInvoice(false)}>
          <ShowErrorMsg setEmptyInvoice={setEmptyInvoice} />
        </Modal>
    
        </View>
      </ScrollView>
    </LayoutWrapper>
  );
};

export default InvoiceDashboard;
