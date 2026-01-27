import { useEffect, useState, useContext } from "react";
import { MyContext } from "../Context/MyContext";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import LayoutWrapper from "../LayoutWrapper";
import { url } from "../../universalApi/universalApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import roleColors from "../Colors/Colors";
import { Modal } from "react-native-modal";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import styles from "../../styles/Invoice/AddInvoice";
import Item from './Item';
import Loader from "../Loader/Loader";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddInvoice = () => {
  const [country, setCountry] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [companyDetails, setCompanyDetails] = useState([]);
  const [isInvoice, setIsInvoice] = useState(false);
  // const [hover,setHover]=React.useState(false);
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting]=useState(null);
  const navigation = useNavigation("");
  const [tab, setTab] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const[isInvoiceSubmitted,setIsInvoiceSubmitted]=useState(false);
  const {role, schemaName,roleColors}=useContext(MyContext);
  const [token, setToken] = useState(null);
   const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);


useEffect(() => {
  const fetchStoredData = async () => {
    const stored = await AsyncStorage.getItem("companies");
    const parsed = JSON.parse(stored);
    setToken(parsed?.token);
  };

  fetchStoredData();
}, []);

const formatCompanyName = (companyName) => {
    if (!companyName) return "";
    let clean = companyName.replace(/^india_|^uk_/, "");
    clean = clean
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return clean;
  };

const formattedCompanyName = formatCompanyName(schemaName);

  const [formData, setFormData] = useState({
    invoiceType: "",
    invoiceNumber: "",
    country: "",
    issueDate: "",
    dueDate: "",
    companyName: formattedCompanyName || "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    cgst: 9,
    sgst: 9,
    vat: 20,
    tax: 0,
    totalAmount: 0,
    invoiceItems: [
      { description: "", quantity: "", unitPrice: "", totalPrice: 0 },
    ],
  });

  const changeCountry = (text) => {
    const selectedCountry = text;
    setCountry(selectedCountry);
    setFormData({
      invoiceType: "",
      invoiceNumber: "",
      country: selectedCountry,
      issueDate: "",
      dueDate: "",
      companyName: formattedCompanyName || "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      cgst: 9,
      sgst: 9,
      vat: 20,
      tax: 0,
      totalAmount: 0,
      invoiceItems: [
        { description: "", quantity: "", unitPrice: "", totalPrice: 0 },
      ],
    });
  };

   const validate = () => {
    const newErrors = {};
    setErrors(newErrors);
    let isError = false;
    if (!country) {
      newErrors.country = "Please select country";
      isError = true;
    }
    if (!formData.invoiceType) {
      newErrors.invoiceType = "Invoice Type is required";
      isError = true;
    }
    if (!formData.invoiceNumber) {
      newErrors.invoiceNumber = "Client is required";
      isError = true;
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required";
      isError = true;
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
      isError = true;
    } else if (
      formData.issueDate &&
      new Date(formData.dueDate) < new Date(formData.issueDate)
    ) {
      newErrors.dueDate = "Invoice end date cannot be before the start date.";
      isError = true;
    }

    if (country === "India") {
      if (formData.cgst === "" || formData.cgst < 0) {
        newErrors.cgst = "CGST is required";
        isError = true;
      }
      if (formData.sgst === "" || formData.sgst < 0) {
        newErrors.sgst = "SGST is required";
        isError = true;
      }
    } else if (country === "UK") {
      if (formData.vat === "" || formData.vat < 0) {
        newErrors.vat = "VAT is required";
        isError = true;
      }
    }

    if (!formData.invoiceItems || formData.invoiceItems.length === 0) {
      newErrors.invoiceItems = "Add at least 1 invoice item";
      isError = true;
    } else {
      formData.invoiceItems.forEach((item, index) => {
        if (!item.description || item.description.trim() === "") {
          const key =
  formData.invoiceType === "Invoice for Candidate"
    ? `candidate-${index}`
    : `description-${index}`;

newErrors[key] = 
  formData.invoiceType === "Invoice for Candidate"
    ? "Candidate name is required"
    : "Description is required";

          isError = true;
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`quantity-${index}`] = "Hours must be greater than 0";
          isError = true;
        }
        if (!item.unitPrice || item.unitPrice <= 0) {
          newErrors[`unitPrice-${index}`] = "Price must be greater than 0";
          isError = true;
        }
        if (!item.totalPrice || item.totalPrice <= 0) {
          newErrors[`totalPrice-${index}`] = "Amount must be more than 0";
          isError = true;
        }
      });
    }
    setErrors(() => newErrors);

    if (!isError) {
      setTab(() => false);
    }
  };

   useEffect(() => {
    const fetchCompinies = async () => {
      setIsLoading(true);
      const response = await axios.get(
        `${url}/api/companyDetails/getByCountry/${country}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": schemaName,
          },
        }
      );
      let data = response.data;
      data.unshift({
        companyName: "Select Client",
        // companyEmail: "",
        // companyCode: "",
        // gstNo: "",
        // companyAddress: "",
        id: "",
      });

      setCompanyDetails(data);
      console.log("comp : ", data);

    };
    fetchCompinies();
    setIsLoading(false);
  }, [country, schemaName, token]);

   const handleSubmit = async () => {
    setTab(false);
    setIsSubmitting(true);
    try {
    setIsLoading(true);
       await axios.post(
        `${url}/api/invoices/submit`,
        {
          invoiceNumber: formData.invoiceNumber,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          country,
          companyName: formData.companyName,
          client: {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            // clientPhone: formData.clientPhone,
            clientAddress: formData.clientAddress,
          },
          invoiceItems: formData.invoiceItems,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          totalAmount: calculateTotal(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": schemaName,
          },
        }
      );
      setIsInvoiceSubmitted(true);

      // downloadFile();
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }finally{
      setIsLoading(false);
    }
    setIsSubmitting(false);
  };

   const filterCompany = (selectedValue) => {

    // const filtered = companyDetails.filter(
    //   (each) => each.id.toString() === selectedValue
    // );

    const filtered=selectedValue;
  
    setFormData((prevData) => ({
      ...prevData,
      clientName: filtered.companyName,
    }));
    setFormData((prevData) => ({
      ...prevData,
      clientEmail: filtered.companyEmail,
    }));

    setFormData((prevData) => ({
      ...prevData,
      clientAddress: filtered.companyAddress,
    }));

    let date = new Date().toLocaleDateString().split("/");
    

    setFormData((prevData) => ({
      ...prevData,
      invoiceNumber: filtered.companyCode + "-" + date[2] + date[0],
    }));

   
  };

   const changeErrors = (name, value) => {
  const newErrors = { ...errors };

  if (name === "cgst") {
    if (value === "") {
      newErrors.cgst = "CGST is required";
    } else if (value < 0 || value > 30) {
      newErrors.cgst = "Value must be between 0 and 30";
    } else {
      delete newErrors.cgst;
    }
  }
  if (name === "sgst") {
    if (value === "") {
      newErrors.sgst = "SGST is required";
    } else if (value < 0 || value > 30) {
      newErrors.sgst = "Value must be between 0 and 30";
    } else {
      delete newErrors.sgst;
    }
  }

  if (name === "vat") {
    if (value === "") {
      newErrors.vat = "VAT is required";
    } else if (value < 0 || value > 30) {
      newErrors.vat = "Value must be between 0 and 30";
    } else {
      delete newErrors.vat;
    }
  }
  setErrors(newErrors);
};
 
 const changeSelected = (selectedValue) => {
  setClientName(selectedValue);
  console.log("val : ", selectedValue);
  filterCompany(selectedValue);
  // same logic you had
  // setTimeout(() => {
  //   filterCompany(selectedValue);
  // }, 0);

  // If your changeErrors expects value instead of event
  changeErrors({
    name: "invoiceNumber",
    value: selectedValue,
  });
};


  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    changeErrors(name, value);
  };

   const handleItemChange = (index, name, value) => {
    
    const updatedItems = [...formData.invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    if (name === "quantity" || name === "unitPrice") {
      updatedItems[index].totalPrice =
        Number(updatedItems[index].quantity) *
        Number(updatedItems[index].unitPrice);
    }
    setFormData({
      ...formData,
      invoiceItems: updatedItems,
    });
    
    setErrors((prev) => {
  const newErrors = { ...prev };

  const errorKey =
    formData.invoiceType === "Invoice for Candidate"
      ? `candidate-${index}`
      : `description-${index}`;

  delete newErrors[errorKey];

  if (name === "quantity" || name === "unitPrice") {
    delete newErrors[`totalPrice-${index}`];
    delete newErrors[`quantity-${index}`];
    delete newErrors[`unitPrice-${index}`];
  }

  return newErrors;
});

  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      invoiceItems: [
        ...formData.invoiceItems,
        { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    if (formData.invoiceItems.length === 1) {
      return;
    }
    const updatedItems = formData.invoiceItems.filter((_, i) => i !== index);
    setFormData({ ...formData, invoiceItems: updatedItems });
  };

   const calculateSubtotal = () => {
    return formData.invoiceItems
      .reduce(
        (total, invoiceItems) =>
          total +
          Number(invoiceItems.quantity) * Number(invoiceItems.unitPrice),
        0
      )
      .toFixed(2);
  };

  const calculateTax = () => {
    if (country === "India") {
      const subtotal = Number.parseFloat(calculateSubtotal());
      const cgstPer = subtotal * ((parseFloat(formData.cgst) || 0) / 100);
      const sgstPer = subtotal * ((parseFloat(formData.sgst) || 0) / 100);
      return cgstPer + sgstPer;
    } else if (country === "UK") {
      const subtotal = Number.parseFloat(calculateSubtotal());
      const vatPer = subtotal * ((parseFloat(formData.vat) || 0) / 100);
      return vatPer;
    }
  };

   const calculateTotal = () => {
    const subtotal = Number.parseFloat(calculateSubtotal()) || 0;
    const tax = Number(calculateTax()) || 0;
    return subtotal + tax;
  };

   const generateInvoiceHTML = () => {
  return `
  <html>
    <head>
      <style>
        body { font-family: Helvetica; padding: 20px; }
        h1 { text-align: left; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 12px;
        }
        th {
          background-color: #3d3d3d;
          color: white;
        }
        .right { text-align: right; }
      </style>
    </head>
    <body>
      <h1>INVOICE</h1>

      <p><b>Invoice:</b> ${formData.invoiceNumber}</p>
      <p><b>Date:</b> ${formData.issueDate}</p>
      <p><b>Due Date:</b> ${formData.dueDate}</p>

      <h3>From</h3>
      <p>${formData.companyName}</p>

      <h3>Bill To</h3>
      <p>${formData.clientName}</p>
      <p>${formData.clientEmail}</p>
      <p>${formData.clientAddress}</p>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Hours</th>
            <th>Price/Hr</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${formData.invoiceItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="right">${item.quantity}</td>
              <td class="right">${Number(item.unitPrice).toFixed(2)}</td>
              <td class="right">${Number(item.totalPrice).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <p class="right"><b>Subtotal:</b> ${calculateSubtotal().toFixed(2)}</p>
      <p class="right"><b>Tax:</b> ${calculateTax().toFixed(2)}</p>
      <p class="right" style="font-size:16px">
        <b>Total:</b> ${calculateTotal().toFixed(2)}
      </p>

    </body>
  </html>
  `;
};
  const downloadFile = async () => {
    const html = generateInvoiceHTML();

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri);

    // Reset form
    setFormData({
      invoiceType: "",
      invoiceNumber: "",
      issueDate: "",
      country: "",
      dueDate: "",
      companyName: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      tax: 0,
      totalAmount: 0,
      invoiceItems: [
        { description: "", quantity: "", unitPrice: "", totalPrice: 0 },
      ],
    });

    navigation.navigate("Invoice/AddInvoice");
  };

   useEffect(() => {
    if (formData.invoiceType === "Invoice for Product") {
      setIsInvoice(true);
      setFormData((prevData) => ({
        ...prevData,
        invoiceItems: [
          { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
        ],
      }));
    } else if (formData.invoiceType === "Invoice for Candidate") {
      setIsInvoice(false);
      setFormData((prevData) => ({
        ...prevData,
        invoiceItems: [
          { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
        ],
      }));
    }
    // if(isInvoiceSubmitted){
    //   const timer=setTimeout(()=>{
    //     setIsInvoiceSubmitted(false);
    //     downloadFile();
    //   },5000);
    //   const handleClick=()=>{
    //     clearTimeout(timer);
    //     setIsInvoiceSubmitted(false);
    //     downloadFile();
    //   }
    //   document.addEventListener('click', handleClick);
    //   return()=>{
    //     clearTimeout(timer);
    //     document.removeEventListener('click', handleClick);
    //   }
    // }
  }, [formData.invoiceType, isInvoiceSubmitted]);


console.log("formData : ", formData);
  const renderHeader = () => (
  <View style={styles.header}>
    <Text style={styles.invoiceTitle}>TAX INVOICE</Text>

    <View style={styles.dateBox}>
      <Text>Issue Date: {formData.issueDate}</Text>
      <Text>Due Date: {formData.dueDate}</Text>
      <Text>Invoice: {formData.invoiceNumber}</Text>
    </View>
  </View>
);

const renderFromTo = () => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>From</Text>
    <Text style={styles.bold}>{formData.companyName}</Text>

    <View style={{ marginTop: 12 }}>
      <Text style={styles.sectionTitle}>To</Text>
      <Text><Text style={styles.bold}>Company:</Text> {formData.clientName}</Text>
      <Text><Text style={styles.bold}>Email:</Text> {formData.clientEmail}</Text>
      <Text><Text style={styles.bold}>Address:</Text> {formData.clientAddress}</Text>
    </View>
  </View>
);

const renderItems = () => (
  <View>
    <Text style={styles.sectionHeading}>Invoice Items</Text>

    {formData.invoiceItems.map((item, index) => (
      <View key={index} style={styles.itemCard}>
        <Text style={styles.itemTitle}>
          {item.description || item.candidate}
        </Text>

        <View style={styles.row}>
          <Text>Hours</Text>
          <Text>{item.quantity}</Text>
        </View>

        <View style={styles.row}>
          <Text>Price / Hour</Text>
          <Text>{item.unitPrice}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.bold}>Amount</Text>
          <Text style={styles.bold}>
            {item.totalPrice}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const renderTotals = () => (
  <View style={styles.totalCard}>
    {/* product */}
    {
      formData.invoiceType === "Invoice for Product" &&   (
        <View>
          {/* Table Header */}
  <View style={[styles.row, styles.header, { backgroundColor: roleColors[role] }]}>
    <Text style={[styles.cell, styles.desc]}>Item Description</Text>
    <Text style={styles.cell}>Hours</Text>
    <Text style={styles.cell}>Price/Per Hour</Text>
    <Text style={styles.cell}>Amount</Text>
  </View>

  {/* Table Body */}
  {formData.invoiceItems.map((each,index) => {
    return <Item key={index} each={each} />
})}
          </View>
      )
    }

    {/* candidate */}
    {
      formData.invoiceType === "Invoice for Candidate" &&   (
        <View>
          {/* Table Header */}
  <View style={[styles.row, styles.header, { backgroundColor: roleColors[role] }]}>
    <Text style={[styles.cell, styles.desc]}>Candidate Name</Text>
    <Text style={styles.cell}>Hours</Text>
    <Text style={styles.cell}>Price/Per Hour</Text>
    <Text style={styles.cell}>Amount</Text>
  </View>

  {/* Table Body */}
  {formData.invoiceItems.map((each,index) => {
    return <Item key={index} each={each} />
})}
          </View>
      )
    }
    {/* <View style={styles.row}>
      <Text>Sub Total</Text>
      <Text> {country === "UK" ? "£" : "₹"}
                    {calculateSubtotal()}</Text>
    </View>

    <View style={styles.row}>
      <Text>Tax</Text>
      <Text>  {country === "UK" ? "£" : "₹"}
                    {calculateTax()}</Text>
    </View>

    <View style={[styles.row, styles.totalRow]}>
      <Text style={styles.totalText}>TOTAL</Text>
      <Text style={styles.totalText}>
        {country === "UK" ? "£" : "₹"}
                    {calculateTotal()}
      </Text>
    </View> */}
  </View>
);

const renderSubmit = () => (
  <TouchableOpacity
    style={[styles.submitBtn, { backgroundColor: roleColors[role] }]}
    onPress={handleSubmit}
    disabled={isSubmitting}
  >
    <Text style={styles.submitText}>
      {isSubmitting ? "Submitting..." : "Submit Invoice"}
    </Text>
  </TouchableOpacity>
);

 function form() {
    return (
      <>
       <ScrollView>
           {isLoading && <Loader />}
          <View style={styles.formContainer}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                padding: 10,
                alignSelf: "flex-end",
              }}
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </Pressable>

            <Text style={styles.heading}>Invoice Form</Text>

            {/* country */}

            <View style={styles.cardContainer}>
              <View style={styles.rowAlign}>
                <Ionicons name="globe" size={22} color="#0284c7" />
                <Text>Country</Text>
              </View>
              <Text>
                Country <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={country}
                  onValueChange={(value) => changeCountry(value)}
                >
                  <Picker.Item label="Select Country" value="" />
                  <Picker.Item label="India" value="India" />
                  <Picker.Item label="UK" value="UK" />
                </Picker>

                {errors.country && (
                  <Text style={styles.errorText}>{errors.country}</Text>
                )}
              </View>
            </View>

            {/* invoice details */}
            <View style={styles.cardContainer}>
                <View style={styles.rowAlign}>
                    <Ionicons name="document-text" size={22} color="#2563eb" />
                    <Text>Invoice Details</Text>
                </View>
                {/* invoice type */}
                <View>
                  <Text>Invoice Type <Text style={{color : 'red'}}>*</Text></Text>
                <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={formData.invoiceType}
                  onValueChange={(value) => handleChange("invoiceType",value)}
                >
                  <Picker.Item label="Select Type" value="" />
                  <Picker.Item label="Invoice for Candidate" value="Invoice for Candidate" />
                  <Picker.Item label="Invoice for Product" value="Invoice for Product" />
                </Picker>

                {errors.country && (
                  <Text style={styles.errorText}>{errors.invoiceType}</Text>
                )}
              </View>

                </View>

                {/* client */}
                <View>
                  <Text>Client <Text style={{color : 'red'}}>*</Text></Text>
                  {
                    companyDetails.length > 0 && (
                      <View  style={styles.pickerStyle}>
                       <Picker
  selectedValue={clientName}
  onValueChange={(value) => changeSelected(value)}
  style={styles.picker}
>
  {companyDetails.map((each) => (
    <Picker.Item
   
      key={each.id} 
      label={each.companyName}
      value={each}
    />
  ))}
</Picker>
                        </View>
                    )
                  }
 {errors.country && (
                  <Text style={styles.errorText}>{errors.invoiceNumber}</Text>
                )} 
                </View>
<View style={styles.rowDate}>          
  {/* issue date */}

                <View>
  {/* Label */}
  <Text >
    Issue Date <Text style={{ color: "red" }}>*</Text>
  </Text>

  {/* Input-like button */}
  <TouchableOpacity
    onPress={() => setShowDatePicker(true)}
    style={styles.dateInput}
  >
    <Text>
      {formData.issueDate
        ? formData.issueDate
        : "Select Issue Date"}
    </Text>
  </TouchableOpacity>

  {/* Date Picker */}
  {showDatePicker && (
    <DateTimePicker
      value={
        formData.issueDate
          ? new Date(formData.issueDate)
          : new Date()
      }
      mode="date"
      display="default"
//       onChange={(event, selectedDate) => {
//         setShowDatePicker(false);
//        if (selectedDate) {
//   handleChange(
//     "issueDate",
//     selectedDate.toISOString().split("T")[0]
//   );
// }

//       }
    
//     }

 onDateChange = {(event, selectedDate) => {
  if (selectedDate) {
    const formattedDate = selectedDate
      .toISOString()
      .split("T")[0];

    handleChange("issueDate", formattedDate);
  }
}
 }

    />
  )}

  {/* Error */}
  {errors.issueDate && (
    <Text style={styles.errorText}>{errors.issueDate}</Text>
  )}
</View>

{/* due date */}

<View>
  {/* Label */}
  <Text>
    Due Date <Text style={{ color: "red" }}>*</Text>
  </Text>

  {/* Input-like button */}
  <TouchableOpacity
    onPress={() => setShowDuePicker(true)}
    style={styles.dateInput}
  >
    <Text>
      {formData.dueDate ? formData.dueDate : "Select Due Date"}
    </Text>
  </TouchableOpacity>

  {/* Date Picker */}
  {showDuePicker && (
    <DateTimePicker
      value={
        formData.dueDate
          ? new Date(formData.dueDate)
          : formData.issueDate
          ? new Date(formData.issueDate)
          : new Date()
      }
      mode="date"
      display="default"
      minimumDate={
        formData.issueDate ? new Date(formData.issueDate) : undefined
      }
      onChange={(event, selectedDate) => {
        setShowDuePicker(false);
        if (selectedDate) {
          handleChange({
            target: {
              name: "dueDate",
              value: selectedDate.toISOString().split("T")[0],
            },
          });
        }
      }}
    />
  )}

  {/* Error */}
  {errors.dueDate && (
    <Text style={styles.errorText}>{errors.dueDate}</Text>
  )}
</View>
</View>
              
            </View>

            {/* your company details */}
            <View style={styles.cardContainer}>
              <View style={styles.rowAlign}>
                <MaterialIcons name="apartment" size={22} color="#374151" />
                <Text>Your Company Details</Text>

              </View>
              <View>
                <Text>
                  From Company Name <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
  value={formData.companyName}
  editable={false}   // same as readOnly
  style={styles.pickerStyle}
/>
              </View>
            </View>

            {/* client details */}
            <View style={styles.cardContainer}>
              <View style={styles.rowAlign}>
                <Ionicons name="person" size={22} color="#111827" />
                <Text>Client Details</Text>
              </View>
              {/* to company name */}
              <View>
              <Text>
                To Company Name
              </Text>
              <TextInput
  value={formData.clientName}
  editable={false}   // same as readOnly
  style={styles.pickerStyle}
/>
</View>

{/* to company email */}

 <View>
              <Text>
                To Company Email
              </Text>
              <TextInput
  value={formData.clientEmail}
  editable={false}   // same as readOnly
  style={styles.pickerStyle}
/>
</View>

{/* to company address */}

 <View>
              <Text>
                To Company Address
              </Text>
              <TextInput
  value={formData.clientAddress}
  multiline
  numberOfLines={4} // replaces row={4}
  editable={false}   // same as readOnly
  textAlignVertical="top"
  
   style={styles.textArea}
/>
</View>
            </View>

            {country === "India" && (
  <View style={styles.cardContainer}>
    {/* Card Title */}
    <View style={styles.rowAlign}>
      <FontAwesome5 name="rupee-sign" size={20} color="#16a34a" />

      <Text>Tax</Text>
    </View>

    {/* Two-column layout */}
    <View style={styles.grid2}>
      {/* CGST */}
      <View style={styles.field}>
        <Text style={styles.label}>
          CGST % <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
  value={String(formData.cgst)}
  keyboardType="numeric"
  onChangeText={(value) => {
    // Allow empty
    if (value === "") {
      handleChange({ target: { name: "cgst", value } });
      return;
    }

    const number = Number(value);

    // Enforce min & max
    if (number >= 0 && number <= 30) {
      handleChange({
        target: { name: "cgst", value },
      });
    }
  }}
  onBlur={() => changeErrors("cgst")}
  style={styles.input}
/>

        {errors.cgst && (
          <Text style={styles.error}>{errors.cgst}</Text>
        )}
      </View>

      {/* SGST */}
      <View style={styles.field}>
        <Text style={styles.label}>
          SGST % <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
  value={String(formData.sgst)}
  keyboardType="numeric"
  onChangeText={(value) => {
    // Allow empty
    if (value === "") {
      handleChange({ target: { name: "sgst", value } });
      return;
    }

    const number = Number(value);

    // Enforce min & max
    if (number >= 0 && number <= 30) {
      handleChange({
        target: { name: "sgst", value },
      });
    }
  }}
  onBlur={() => changeErrors("sgst")}
  style={styles.input}
/>


        {errors.sgst && (
          <Text style={styles.error}>{errors.sgst}</Text>
        )}
      </View>
    </View>
  </View>
)}

 {country === "UK" && (
  <View style={styles.cardContainer}>
    {/* Card Title */}
    <View style={styles.cardHeader}>
      <FontAwesome5 name="rupee-sign" size={20} color="#16a34a" />

      <Text style={styles.cardTitle}>Tax</Text>
    </View>

      {/* CGST */}
      <View >
        <Text >
          VAT % <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
  value={String(formData.vat)}
  keyboardType="numeric"
  onChangeText={(value) => {
    // Allow empty
    if (value === "") {
      handleChange({ target: { name: "vat", value } });
      return;
    }

    const number = Number(value);

    // Enforce min & max
    if (number >= 0 && number <= 30) {
      handleChange({
        target: { name: "vat", value },
      });
    }
  }}
  onBlur={() => changeErrors("vat")}
 style={styles.dateInput}
/>

        {errors.vat && (
          <Text style={styles.error}>{errors.vat}</Text>
        )}
      </View>

      
    </View>
  
)}

{formData.invoiceType === "Invoice for Product" && (
  <View style={styles.cardContainer}>
    {/* Card Header */}
    <View style={styles.rowAlign}>
     <FontAwesome5 name="rupee-sign" size={20} color="#16a34a" />

      <Text style={styles.cardTitle}>Invoice Items</Text>
    </View>

    {/* Items */}
    {formData.invoiceItems.map((item, index) => {
      const fieldName =
        formData.invoiceType === "Invoice for Product"
          ? "description"
          : "candidate";

      return (
        <View key={index} style={styles.itemRow}>
          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={item.description}
              onChangeText={(value) =>
                handleItemChange(index, {
                  target: { name: "description", value },
                })
              }
              style={styles.input}
            />
            {errors[`${fieldName}-${index}`] && (
              <Text style={styles.error}>
                {errors[`${fieldName}-${index}`]}
              </Text>
            )}
          </View>

          {/* Hours */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Hours <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={item.quantity}
              keyboardType="numeric"
              onChangeText={(value) => {
                if (value === "" || Number(value) >= 0) {
                  handleItemChange(index, {
                    target: { name: "quantity", value },
                  });
                }
              }}
              style={styles.input}
            />
            {errors[`quantity-${index}`] && (
              <Text style={styles.error}>
                {errors[`quantity-${index}`]}
              </Text>
            )}
          </View>

          {/* Unit Price */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Price / Hour <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={item.unitPrice}
              keyboardType="numeric"
              onChangeText={(value) => {
                if (value === "" || Number(value) >= 0) {
                  handleItemChange(index, {
                    target: { name: "unitPrice", value },
                  });
                }
              }}
              style={styles.input}
            />
            {errors[`unitPrice-${index}`] && (
              <Text style={styles.error}>
                {errors[`unitPrice-${index}`]}
              </Text>
            )}
          </View>

          {/* Total (Read-only) */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={String(item.totalPrice)}
              editable={false}
              style={[styles.input, styles.readOnly]}
            />
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => handleRemoveItem(index)}
            style={styles.removeBtn}
          >
           <Ionicons name="trash" size={22} color="#ef4444" />

          </TouchableOpacity>
        </View>
      );
    })}

    {/* Add Item */}
    <TouchableOpacity
      onPress={handleAddItem}
      style={styles.addButton}
    >
      <Text style={styles.addButtonText}>+ Add Item</Text>
    </TouchableOpacity>
  </View>
)}


{formData.invoiceType === "Invoice for Candidate" && (
  <View style={styles.cardContainer}>
    {/* Card Header */}
    <View style={styles.cardHeader}>
     <FontAwesome5 name="rupee-sign" size={20} color="#16a34a" />

      <Text style={styles.cardTitle}>Invoice Items</Text>
    </View>

    {/* Items */}
    {formData.invoiceItems.map((item, index) => {
      const fieldName =
        formData.invoiceType === "Invoice for Candidate"
          ? "candidate"
          : "description";

      return (
        <View key={index} style={styles.itemRow}>
          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Candidate Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={item.description}
              onChangeText={(value) =>
                handleItemChange(index, 
                   "description", value 
                )
              }
              style={styles.input}
            />
            {errors[`${fieldName}-${index}`] && (
              <Text style={styles.error}>
                {errors[`${fieldName}-${index}`]}
              </Text>
            )}
          </View>

          {/* Hours */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Hours <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={String(item.quantity)}
              keyboardType="numeric"
              onChangeText={(value) => {
                if (value === "" || Number(value) >= 0) {
                  handleItemChange(index, 
                    "quantity", value
                  );
                }
              }}
              style={styles.input}
            />
            {errors[`quantity-${index}`] && (
              <Text style={styles.error}>
                {errors[`quantity-${index}`]}
              </Text>
            )}
          </View>

          {/* Unit Price */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Price / Hour <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={String(item.unitPrice)}
              keyboardType="numeric"
              onChangeText={(value) => {
                if (value === "" || Number(value) >= 0) {
                  handleItemChange(index, 
                   "unitPrice" , value
                  );
                }
              }}
              style={styles.input}
            />
            {errors[`unitPrice-${index}`] && (
              <Text style={styles.error}>
                {errors[`unitPrice-${index}`]}
              </Text>
            )}
          </View>

          {/* Total (Read-only) */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={String(item.totalPrice)}
              editable={false}
              style={[styles.input, styles.readOnly]}
            />
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => handleRemoveItem(index)}
            style={styles.removeBtn}
          >
           <Ionicons name="trash" size={22} color="#ef4444" />

          </TouchableOpacity>
        </View>
      );
    })}

    {/* Add Item */}
    <TouchableOpacity
      onPress={handleAddItem}
      style={styles.addButton}
    >
      <Text style={styles.addButtonText}>+ Add Item</Text>
    </TouchableOpacity>
  </View>
)}

{/* Summary */}

<View style={styles.cardContainer}>
  <View style={styles.rowAlign}>
    <FontAwesome5 name="rupee-sign" size={20} color="#16a34a" />
    <Text style={styles.cardTitle}>Summary</Text>
  </View>
  {/* Sub total */}
  <View style={styles.rowDate}>
    <Text>Subtotal : </Text>
    <Text>
      {country === "UK" ? "£" : "₹"}
                  {calculateSubtotal()}
    </Text>
  </View>

   {/* Tax */}
  <View style={styles.rowDate}>
    <Text>Tax : </Text>
    <Text>
       {country === "UK" ? "£" : "₹"}
                  {calculateTax()}
    </Text>
  </View>

   {/* total */}
  <View style={styles.rowDate}>
    <Text style={styles.cardTitle}>Total : </Text>
    <Text style={styles.cardTitle}>
       {country === "UK" ? "£" : "₹"}
                  {calculateTotal()}
    </Text>
  </View>
</View>

<TouchableOpacity onPress={validate}>
  <Text style={[styles.buttonText, {backgroundColor : roleColors[role]}]}>
    Next
  </Text>
</TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }

  function displayDetails() {
    return(
      <>
        <ScrollView style={styles.container}>
           <Pressable
                          onPress={() => navigation.goBack()}
                          style={{
                            padding: 10,
                            alignSelf : 'flex-end',
                          }}
                        >
                          <Feather name="arrow-left" size={24} color="#000" />
                        </Pressable>
      {renderHeader()}
      {renderFromTo()}
      {renderItems()}
      {renderTotals()}
      {renderSubmit()}
    </ScrollView>
      </>
    )
  }

  return <>
  <View>
    {tab ? form() : displayDetails()}
    
    </View></>;
};

export default AddInvoice;
