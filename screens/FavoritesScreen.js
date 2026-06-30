import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getTypeColor } from "../constants/typeColors";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // READ - busca todos os favoritos sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "favoritos"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => a.pokemonId - b.pokemonId);
      setFavorites(list);
    } catch (e) {
      console.log("Erro ao carregar favoritos:", e);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const saveNickname = async (favId) => {
    try {
      await setDoc(
        doc(db, "favoritos", favId),
        { apelido: editValue },
        { merge: true }
      );
      setEditingId(null);
      loadFavorites();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o apelido.");
    }
  };

  // DELETE
  const removeFavorite = (favId, nome) => {
    Alert.alert(
      "Remover favorito",
      `Deseja remover ${nome.toUpperCase()} dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "favoritos", favId));
            loadFavorites();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const color = getTypeColor(item.tipo);
    const isEditing = editingId === item.id;

    return (
      <View style={[styles.row, { borderLeftColor: color }]}>
        <TouchableOpacity
          style={styles.rowMain}
          onPress={() =>
            navigation.navigate("Details", { id: item.pokemonId })
          }
        >
          <Image source={{ uri: item.imagem }} style={styles.rowImage} />
          <View style={styles.rowInfo}>
            <Text style={styles.rowId}>
              #{String(item.pokemonId).padStart(3, "0")}
            </Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
              />
            ) : (
              <Text style={styles.rowNickname}>{item.apelido}</Text>
            )}
            <Text style={styles.rowName}>{item.nome.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.rowActions}>
          {isEditing ? (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: color }]}
              onPress={() => saveNickname(item.id)}
            >
              <Text style={styles.actionBtnText}>✓</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: color }]}
              onPress={() => {
                setEditingId(item.id);
                setEditValue(item.apelido);
              }}
            >
              <Text style={styles.actionBtnText}>✏️</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => removeFavorite(item.id, item.nome)}
          >
            <Text style={styles.actionBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⭐ FAVORITOS</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Nenhum Pokémon favoritado ainda.{"\n"}Vá até a Pokédex e
            adicione alguns! ⭐
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 2 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  emptyText: { textAlign: "center", color: "#999", fontSize: 15, lineHeight: 22 },
  list: { padding: 16 },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center" },
  rowImage: { width: 56, height: 56, marginRight: 12 },
  rowInfo: { flex: 1 },
  rowId: { fontSize: 11, color: "#aaa", fontWeight: "700" },
  rowNickname: { fontSize: 16, fontWeight: "800", color: "#333" },
  rowName: { fontSize: 12, color: "#999" },
  editInput: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 14,
  },
  rowActions: { flexDirection: "row", gap: 6 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: { backgroundColor: "#e74c3c" },
  actionBtnText: { fontSize: 14 },
});
