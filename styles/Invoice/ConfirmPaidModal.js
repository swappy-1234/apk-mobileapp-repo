import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  infoBox: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  bold: {
    fontWeight: "600",
  },
  confirmText: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
    color: "#444",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  updateBtn: {
    backgroundColor: "#22c55e",
    marginLeft: 8,
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
  },
  updateText: {
    color: "#fff",
    fontWeight: "600",
  },
});
