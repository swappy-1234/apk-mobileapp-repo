import React from "react";
import { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { MyContext } from "../Context/MyContext";

const Loader = () => {
  const {roleColor} = useContext(MyContext);
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default Loader;
