import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  btnsBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  activeButton: {
    backgroundColor: "#3b82f6",
  },
  btnText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});
