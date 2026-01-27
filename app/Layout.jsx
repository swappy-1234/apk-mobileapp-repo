import React from "react";
import { View, StyleSheet } from "react-native";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

export default Layout;
