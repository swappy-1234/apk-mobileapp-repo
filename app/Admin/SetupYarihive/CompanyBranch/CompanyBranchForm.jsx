import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import countries from "../../../../assets/Countries/countries.json";
import styles from "../../../../styles/Admin/CompanyBranch/CompanyBranchFormCss";

const CompanyBranchForm = ({ onClose, onSave, editData }) => {
  const [branchData, setBranchData] = useState({
    branchName: "",
    branchCode: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [pickerModal, setPickerModal] = useState({
    visible: false,
    items: [],
    key: "",
    title: "",
  });
  const [pickerSearch, setPickerSearch] = useState("");

  const limits = {
    branchName: 30,
    branchCode: 15,
    streetAddress: 100,
    city: 20,
    state: 30,
    postalCode: 10,
  };

  const letterOnlyFields = ["branchName", "city", "streetAddress", "state"];
  const [loading, setLoading]=useState(false);

  // useEffect(() => {
  //   if (editData) setBranchData(editData);
  // }, [editData]);
  useEffect(() => {
  if (editData) {
    setBranchData({
      ...editData,
      postalCode:
        editData.postalCode !== null &&
        editData.postalCode !== undefined
          ? String(editData.postalCode)
          : "",
    });
  }
}, [editData]);

const FORM_KEYS = [
  "branchName",
  "branchCode",
  "streetAddress",
  "city",
  "state",
  "postalCode",
  "country",
];
const normalize = (v) => String(v ?? "").trim();
const showUpdate = () => {
  if (!editData) return true; // create mode → always show submit

  return FORM_KEYS.some((key) => {
    return normalize(editData[key]) !== normalize(branchData[key]);
  });
};



  const onChange = (name, value) => {
    let cleanedValue = String(value ?? "").replace(/^\s+/, "");
    if (!["postalCode", "branchCode", "country"].includes(name)) {
      cleanedValue =
        cleanedValue.length > 0
          ? cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1)
          : "";
    }
    if (letterOnlyFields.includes(name) && cleanedValue && !/^[A-Za-z\s]*$/.test(cleanedValue)) return;

    setBranchData((prev) => ({ ...prev, [name]: cleanedValue }));

    // Validation
    if (limits[name] && cleanedValue.length > limits[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name.replace(/([A-Z])/g, " $1")} cannot exceed ${limits[name]} characters`.toLowerCase(),
      }));
    } else if (!cleanedValue) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name.replace(/([A-Z])/g, " $1")} is required`.toLowerCase(),
      }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // const handleSubmit = async () => {
  //   let newErrors = {};
  //   Object.keys(branchData).forEach((key) => {
  //     if (!branchData[key]) newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`.toLowerCase();
  //   });
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }
  //   const result = await onSave(branchData);
  //   if (result?.error) {
  //     setErrors({ submit: result.error });
  //     return;
  //   }
  //   onClose();
  // };
const handleSubmit = async () => {
  let newErrors = {};

  Object.keys(branchData).forEach((key) => {
    if (!branchData[key]) {
      newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`.toLowerCase();
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);        //  START LOADER
    const result = await onSave(branchData);

    if (result?.error) {
      setErrors({ submit: result.error });
      return;
    }

    onClose();
  } finally {
    setLoading(false);       // STOP LOADER (success or error)
  }
};

  const openPickerModal = (key, items, title = "Select") => {
    setPickerModal({ visible: true, items, key, title });
    setPickerSearch("");
  };

  const closePickerModal = () => {
    setPickerModal({ ...pickerModal, visible: false });
  };

 

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form */}
        <Text style={styles.cardHeader}>{editData ? "Update Branch" : "Add Branch"}</Text>

        {/* Branch Name & Code */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Branch Name<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.branchName}
              placeholder="Branch Name"
              onChangeText={(text) => onChange("branchName", text)}
            />
            {errors.branchName && <Text style={styles.error}>{errors.branchName}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Branch Code<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.branchCode}
              placeholder="Branch Code"
              onChangeText={(text) => onChange("branchCode", text)}
            />
            {errors.branchCode && <Text style={styles.error}>{errors.branchCode}</Text>}
          </View>
        </View>

        {/* Address */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Street Address<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.streetAddress}
              placeholder="Street Address"
              onChangeText={(text) => onChange("streetAddress", text)}
            />
             {errors.streetAddress && <Text style={styles.error}>{errors.streetAddress}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>City<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.city}
              placeholder="City"
              onChangeText={(text) => onChange("city", text)}
            />
            {errors.city && <Text style={styles.error}>{errors.city}</Text>}
          </View>
        </View>

        {loading && <ActivityIndicator size="large" color="#19CF99"/>}

        {/* State & Postal */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>State / County<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.state}
              placeholder="State"
              onChangeText={(text) => onChange("state", text)}
            />
            {errors.state && <Text style={styles.error}>{errors.state}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Postal Code<Text style={styles.star}> *</Text></Text>
            <TextInput
              style={styles.input}
              value={branchData.postalCode}
              placeholder="Postal Code"
              onChangeText={(text) => onChange("postalCode", text)}
            />
            {errors.postalCode && <Text style={styles.error}>{errors.postalCode}</Text>}
          </View>
        </View>

        {/* Country */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Country<Text style={styles.star}> *</Text></Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() =>
                openPickerModal(
                  "country",
                  countries.map((c) => ({ label: c, value: c })),
                  "Country"
                )
              }
            >
              <Text>{branchData.country || "Select Country"}</Text>
            </TouchableOpacity>
            {errors.country && <Text style={styles.error}>{errors.country}</Text>}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {showUpdate() && 
          <View style={styles.col}>
            {/* <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.actionText}>{editData ? "Update" : "Submit"}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
  style={[
    styles.submitBtn,
    (!showUpdate() || loading) && { opacity: 0.6 },
  ]}
  onPress={handleSubmit}
  disabled={!showUpdate() || loading}
>
  {loading ? (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ActivityIndicator size="small" color="#fff" />
      <Text style={[styles.actionText, { marginLeft: 8 }]}>
        {editData ? "Updating..." : "Submitting..."}
      </Text>
    </View>
  ) : (
    <Text style={styles.actionText}>
      {editData ? "Update" : "Submit"}
    </Text>
  )}
</TouchableOpacity>

          </View>}
        </View>
        {errors.submit && <Text style={styles.error}>{errors.submit}</Text>}
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={pickerModal.visible}
        transparent
        animationType="slide"
        onRequestClose={closePickerModal}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.modalTitle}>{pickerModal.title}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={pickerSearch}
              onChangeText={setPickerSearch}
            />
            <FlatList
              style={{ maxHeight: 300 }}
              data={pickerModal.items.filter((item) =>
                item.label.toLowerCase().includes(pickerSearch.toLowerCase())
              )}
              keyExtractor={(_, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(pickerModal.key, item.value);
                    closePickerModal();
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={closePickerModal} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default CompanyBranchForm;
