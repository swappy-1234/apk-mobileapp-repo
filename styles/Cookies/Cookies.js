import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  cookiesPolicy: {
    flex: 1,
    padding: height * 0.1, // 10vh
    width: "100%",
    
    alignItems: "flex-start",
  },

  cookiesPolicyInner: {
    flex: 1,
    maxWidth: 1300,
    width: "100%",
    alignItems: "flex-start",
  },

  h1: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
    alignSelf: "center",
  },

  h2: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
  },

  h3: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
    marginLeft: 15,
  },

  paragraph: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 15,
    textAlign: "justify",
  },

  listContainer: {
    marginTop: 10,
    marginLeft: 25,
  },

  listItem: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 8,
    textAlign: "justify",
  },
});


