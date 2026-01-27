import { StyleSheet } from "react-native";

export default StyleSheet.create({
     taskForm: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  inputBox: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f2f2f2",
    color: "#666",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  buttonRow: {
    marginTop: 20,
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  pickerWrapper: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  overflow: "hidden",
},

rowSingle: {
  marginBottom: 16,
},

successBox: {
  padding: 16,
  borderRadius: 8,
  backgroundColor: "#eaf7ea",
  alignItems: "center",
  marginVertical: 20,
},

successText: {
  fontSize: 16,
  color: "#2e7d32",
  textAlign: "center",
  marginBottom: 12,
},

boldText: {
  fontWeight: "bold",
},

okButton: {
  paddingVertical: 10,
  paddingHorizontal: 24,
  borderRadius: 6,
},

okButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

})