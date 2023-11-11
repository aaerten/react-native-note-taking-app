import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const NoteItem = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemBody}>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{props.data.client.label}</Text>
          <Text style={styles.subTitle}>{props.data.category.label}</Text>
          <Text style={styles.note}>Note: {props.data.text}</Text>
        </View>
        <View style={styles.actionContainer}>
          <Feather
            style={styles.editButton}
            name="edit-2"
            size={16}
            color="green"
            onPress={() => props.handleEditNote(props.data.id)}
          />
          <MaterialIcons
            style={styles.deleteButton}
            name="delete"
            size={16}
            color="#e00000"
            onPress={() => props.handleDeleteNote(props.data.id)}
          />
        </View>
      </View>
    </View>
  );
};

export default NoteItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 100,
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  itemBody: {
    width: "90%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5
  },
  subTitle: {
    color: "#979797",
    marginBottom: 20
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    padding: 5,
    overflow: "hidden",
    marginRight: 10,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#e00000",
    borderRadius: 5,
    padding: 5,
    overflow: "hidden",
  },
});
