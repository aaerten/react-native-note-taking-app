import React from "react";
import { Text, View, StyleSheet } from "react-native";

const NoData = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>No notes available</Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginTop: 20,
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  bodyText: {
    fontWeight: "500",
    letterSpacing: 1,
  },
});
