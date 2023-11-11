import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalSelector from "react-native-modal-selector";

import constants from "./src/utils/constants.json";
import NoteItem from "./src/components/NoteItem";
import NoData from "./src/components/NoData";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewNote" component={AddNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="add-circle-outline"
          size={24}
          style={styles.addNoteButton}
          onPress={() =>
            navigation.navigate("NewNote", { updateNotes: loadNotes })
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleEditNote = (id) => {
    navigation.navigate("NewNote", { noteId: id, updateNotes: loadNotes });
  };

  const handleDeleteNote = async (id) => {
    try {
      const existingNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = existingNotes ? JSON.parse(existingNotes) : [];

      const updatedNotes = parsedNotes.filter((note) => note.id !== id);

      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));

      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {notes.length === 0 ? (
        <NoData />
      ) : (
        <FlatList
          style={{ marginTop: 20, width: "100%", overflow: "visible" }}
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NoteItem
              data={item}
              handleEditNote={handleEditNote}
              handleDeleteNote={handleDeleteNote}
            />
          )}
        />
      )}
    </View>
  );
};

const AddNoteScreen = ({ route, navigation }) => {
  const { noteId, updateNotes } = route.params;
  const [client, setClient] = useState();
  const [category, setCategory] = useState();
  const [text, setText] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerTitle: noteId ? "Edit Note" : "New Note",
      headerLeft: () => (
        <Ionicons
          name="chevron-back-outline"
          size={24}
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (noteId) {
      loadExistingNoteData();
    }
  }, [noteId]);

  const loadExistingNoteData = async () => {
    try {
      const existingNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = existingNotes ? JSON.parse(existingNotes) : [];

      const existingNote = parsedNotes.find((note) => note.id === noteId);

      if (existingNote) {
        setClient(existingNote.client);
        setCategory(existingNote.category);
        setText(existingNote.text);
      }
    } catch (error) {
      console.error("Error loading existing note data:", error);
    }
  };

  const handleAddNote = async () => {
    if (client === undefined || category === undefined || !text.length) {
      return alert("Please fill all field");
    }

    try {
      const newNote = {
        id: noteId || new Date().getTime(),
        client,
        category,
        text,
      };

      const existingNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = existingNotes ? JSON.parse(existingNotes) : [];

      if (noteId) {
        const updatedNotes = parsedNotes.map((note) =>
          note.id === noteId ? newNote : note
        );
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      } else {
        const updatedNotes = [...parsedNotes, newNote];
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      }

      updateNotes();
      navigation.goBack();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <View style={styles.addNoteContainer}>
      <Text style={styles.subTitle}>
        Please select a client, choose a category, and enter the note text
      </Text>
      <ScrollView
        style={{ paddingBottom: 100 }}
        width="100%"
        keyboardShouldPersistTaps="handled"
      >
        <ModalSelector
          style={{ marginTop: 20, marginBottom: 20 }}
          data={constants.clients.map((option, idx) => {
            return { key: idx, label: option };
          })}
          initValueTextStyle={{ color: client ? "#000" : "#CCC" }}
          initValue={client ? client.label : "Select Client"}
          onChange={(value) => {
            setClient(value);
          }}
        />

        <ModalSelector
          style={{ marginBottom: 20 }}
          data={constants.categories.map((option, idx) => {
            return { key: idx, label: option };
          })}
          initValueTextStyle={{ color: category ? "#000" : "#CCC" }}
          initValue={category ? category.label : "Select Category"}
          onChange={(value) => setCategory(value)}
        />
        <TextInput
          multiline
          maxLength={1000}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
          style={styles.noteTextInput}
          placeholder="Please write your note here"
          value={text}
          onChangeText={(text) => setText(text)}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button color="white" title="Save" onPress={handleAddNote} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  addNoteButton: {
    marginRight: 20,
  },
  noDataContainer: {
    height: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
    marginRight: 20,
    letterSpacing: 1,
  },
  iconContainer: {
    backgroundColor: "#F5F5F5",
    padding: 5,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addNoteContainer: {
    flex: 1,
    margin: 20,
    alignItems: "center",
  },
  goBackButton: {
    marginLeft: 10,
  },
  subTitle: {
    textAlign: "center",
    color: "#979797",
  },
  noteTextInput: {
    width: "100%",
    height: 200,
    maxHeight: 200,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontWeight: "300",
    letterSpacing: 1,
  },
  buttonContainer: {
    borderRadius: 5,
    width: "100%",
    margin: 20,
    padding: 5,
    backgroundColor: "#0281F1",
  },
});
