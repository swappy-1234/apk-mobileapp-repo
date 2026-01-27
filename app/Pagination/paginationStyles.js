import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#EAFBF6",
    marginHorizontal: 5,
  },

  navText: {
    fontSize: 18,
    color: "#19CF99",
    fontWeight: "bold",
  },

  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#F2F2F2",
    marginHorizontal: 4,
  },

  pageText: {
    fontSize: 14,
    color: "#555",
  },

  activePage: {
    backgroundColor: "#19CF99",
  },

  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  disabled: {
    opacity: 0.4,
  },
});
