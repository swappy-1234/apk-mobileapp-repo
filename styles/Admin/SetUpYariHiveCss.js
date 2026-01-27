import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({

    header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#19cf99",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    marginTop: 10,
  },
})