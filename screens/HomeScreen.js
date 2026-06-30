import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { getTypeColor } from "../constants/typeColors";

const PAGE_SIZE = 20;

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPokemons(0, true);
  }, []);

  const fetchDetails = async (basicList) => {
    const detailed = await Promise.all(
      basicList.map(async (p) => {
        const res = await fetch(p.url);
        const data = await res.json();
        return {
          id: data.id,
          name: data.name,
          image:
            data.sprites.front_default ||
            data.sprites.other?.["official-artwork"]?.front_default,
          type: data.types[0]?.type.name,
        };
      })
    );
    return detailed;
  };

  const loadPokemons = async (newOffset, initial = false) => {
    if (initial) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${newOffset}`
      );
      const data = await res.json();
      const detailed = await fetchDetails(data.results);
      setPokemons((prev) => (initial ? detailed : [...prev, ...detailed]));
      setOffset(newOffset + PAGE_SIZE);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      setError("Erro ao carregar Pokémons.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadPokemons(0, true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchText.toLowerCase().trim()}`
      );
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      setPokemons([
        {
          id: data.id,
          name: data.name,
          image:
            data.sprites.front_default ||
            data.sprites.other?.["official-artwork"]?.front_default,
          type: data.types[0]?.type.name,
        },
      ]);
    } catch (e) {
      setError("Pokémon não encontrado!");
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const color = getTypeColor(item.type);
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={() => navigation.navigate("Details", { id: item.id })}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardId, { color }]}>
          #{String(item.id).padStart(3, "0")}
        </Text>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardName}>{item.name.toUpperCase()}</Text>
        <View style={[styles.cardTypeBadge, { backgroundColor: color }]}>
          <Text style={styles.cardTypeText}>{item.type?.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>POKÉDEX</Text>
      </View>

      <View style={styles.searchArea}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou ID..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF5252" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={pokemons}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.list}
            onEndReached={() => {
              if (!searchText.trim()) loadPokemons(offset);
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  style={{ marginVertical: 16 }}
                  color="#FF5252"
                />
              ) : null
            }
          />
        </Animated.View>
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
    backgroundColor: "#FF5252",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 3,
  },
  searchArea: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  searchBtn: {
    backgroundColor: "#FF5252",
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { fontSize: 18 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 16, color: "#c0392b", fontWeight: "600" },
  list: { padding: 8 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardId: { fontSize: 12, fontWeight: "700", alignSelf: "flex-end" },
  cardImage: { width: 80, height: 80 },
  cardName: { fontSize: 13, fontWeight: "800", marginTop: 4 },
  cardTypeBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  cardTypeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
