import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getTypeColor } from "../constants/typeColors";

export default function DetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [nickname, setNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPokemon();
  }, [id]);

  const animateEntry = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spinSprite = () => {
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      setPokemon({
        id: data.id,
        nome: data.name,
        imagem:
          data.sprites.other?.["official-artwork"]?.front_default ||
          data.sprites.front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
        altura: (data.height / 10).toFixed(1),
        peso: (data.weight / 10).toFixed(1),
      });
      animateEntry();
      checkFavorite(data.id);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar o Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  // READ - verifica se já é favorito
  const checkFavorite = async (pokeId) => {
    try {
      const ref = doc(db, "favoritos", String(pokeId));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setIsFavorite(true);
        setNickname(snap.data().apelido || "");
      } else {
        setIsFavorite(false);
        setNickname("");
      }
    } catch (e) {
      console.log("Erro ao checar favorito:", e);
    }
  };

  // CREATE - adiciona aos favoritos
  const addFavorite = async () => {
    try {
      await setDoc(doc(db, "favoritos", String(pokemon.id)), {
        pokemonId: pokemon.id,
        nome: pokemon.nome,
        imagem: pokemon.imagem,
        tipo: pokemon.tipo1,
        apelido: pokemon.nome,
        criadoEm: new Date().toISOString(),
      });
      setIsFavorite(true);
      setNickname(pokemon.nome);
      Alert.alert("✓", `${pokemon.nome.toUpperCase()} adicionado aos favoritos!`);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível favoritar. Verifique a configuração do Firebase.");
    }
  };

  // UPDATE - atualiza o apelido
  const updateNickname = async () => {
    try {
      await setDoc(
        doc(db, "favoritos", String(pokemon.id)),
        { apelido: nickname },
        { merge: true }
      );
      setEditingNickname(false);
      Alert.alert("✓", "Apelido atualizado!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível atualizar o apelido.");
    }
  };

  // DELETE - remove dos favoritos
  const removeFavorite = async () => {
    try {
      await deleteDoc(doc(db, "favoritos", String(pokemon.id)));
      setIsFavorite(false);
      setNickname("");
      Alert.alert("✓", "Removido dos favoritos.");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível remover.");
    }
  };

  if (loading || !pokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5252" />
      </View>
    );
  }

  const bgColor = getTypeColor(pokemon.tipo1);
  const tipo1Color = getTypeColor(pokemon.tipo1);
  const tipo2Color = getTypeColor(pokemon.tipo2);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bgColor + "22" }]}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>← Voltar</Text>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            borderColor: bgColor,
          },
        ]}
      >
        <View style={[styles.idBadge, { backgroundColor: bgColor }]}>
          <Text style={styles.idText}>
            #{String(pokemon.id).padStart(3, "0")}
          </Text>
        </View>

        <TouchableOpacity onPress={spinSprite} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.imageWrapper,
              { backgroundColor: bgColor + "33", transform: [{ rotate: spin }] },
            ]}
          >
            <Image
              source={{ uri: pokemon.imagem }}
              style={styles.imagemPoke}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        <Text style={[styles.nomePoke, { color: bgColor }]}>
          {pokemon.nome.toUpperCase()}
        </Text>

        <View style={styles.tiposRow}>
          <View style={[styles.tipoBadge, { backgroundColor: tipo1Color }]}>
            <Text style={styles.tipoText}>{pokemon.tipo1?.toUpperCase()}</Text>
          </View>
          {pokemon.tipo2 && (
            <View style={[styles.tipoBadge, { backgroundColor: tipo2Color }]}>
              <Text style={styles.tipoText}>
                {pokemon.tipo2?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Altura</Text>
            <Text style={[styles.statValue, { color: bgColor }]}>
              {pokemon.altura}m
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: bgColor + "44" }]}
          />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Peso</Text>
            <Text style={[styles.statValue, { color: bgColor }]}>
              {pokemon.peso}kg
            </Text>
          </View>
        </View>

        {/* Área de favoritos - CRUD Firebase */}
        <View style={styles.favoriteArea}>
          {!isFavorite ? (
            <TouchableOpacity
              style={[styles.favBtn, { backgroundColor: bgColor }]}
              onPress={addFavorite}
            >
              <Text style={styles.favBtnText}>⭐ Adicionar aos Favoritos</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.favEditArea}>
              {editingNickname ? (
                <View style={styles.nicknameEditRow}>
                  <TextInput
                    style={styles.nicknameInput}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="Apelido"
                  />
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: bgColor }]}
                    onPress={updateNickname}
                  >
                    <Text style={styles.smallBtnText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.nicknameDisplay}
                  onPress={() => setEditingNickname(true)}
                >
                  <Text style={[styles.nicknameText, { color: bgColor }]}>
                    ✏️ Apelido: {nickname}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.removeFavBtn}
                onPress={removeFavorite}
              >
                <Text style={styles.removeFavBtnText}>
                  🗑 Remover dos Favoritos
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { alignItems: "center", paddingBottom: 32, paddingTop: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: { alignSelf: "flex-start", marginLeft: 20, marginBottom: 12 },
  backBtnText: { fontSize: 16, fontWeight: "700", color: "#555" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 20,
    width: "88%",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  idBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  idText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  imageWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  imagemPoke: { width: 160, height: 160 },
  nomePoke: { fontSize: 28, fontWeight: "900", letterSpacing: 2, marginBottom: 12 },
  tiposRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  tipoBadge: { paddingHorizontal: 18, paddingVertical: 6, borderRadius: 20 },
  tipoText: { color: "#fff", fontWeight: "800", fontSize: 13, letterSpacing: 1.5 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: "center" },
  statDivider: { width: 1.5, height: 36, marginHorizontal: 12 },
  statLabel: { fontSize: 11, color: "#aaa", fontWeight: "600", letterSpacing: 1.5 },
  statValue: { fontSize: 20, fontWeight: "800" },
  favoriteArea: { width: "100%", alignItems: "center" },
  favBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 20, width: "100%", alignItems: "center" },
  favBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  favEditArea: { width: "100%", alignItems: "center" },
  nicknameDisplay: { paddingVertical: 10 },
  nicknameText: { fontSize: 15, fontWeight: "700" },
  nicknameEditRow: { flexDirection: "row", gap: 8, width: "100%", marginBottom: 8 },
  nicknameInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallBtn: { paddingHorizontal: 16, justifyContent: "center", borderRadius: 12 },
  smallBtnText: { color: "#fff", fontWeight: "700" },
  removeFavBtn: { marginTop: 8, paddingVertical: 8 },
  removeFavBtnText: { color: "#c0392b", fontWeight: "700", fontSize: 13 },
});
