import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    backgroundColor: "#f8f9fb",
    padding: 14,
  },

  header: {
    flexDirection : 'row',
    justifyContent : 'space-around'
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 12,
  },

  monthText: {
    fontSize: 16,
    fontWeight: "600",
  },

  weekPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
  },

  weekText: {
    fontSize: 13,
    color: "#333",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },

  empName: {
    fontSize: 15,
    fontWeight: "600",
  },

  empId: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
  },

  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },

  dayLabel: {
    fontSize: 13,
  },

  input: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
  },

  disabledInput: {
    backgroundColor: "#f2f2f2",
    color: "#999",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  totalLabel: {
    fontWeight: "600",
  },

  totalValue: {
    fontWeight: "600",
  },

  submitBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },

   modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  okButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  okText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})