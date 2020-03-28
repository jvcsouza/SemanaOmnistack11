import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import logoImg from "../../assets/logo.png";
import styles from "./styles";
import api from "../../services/api";
import Spinner from "react-native-loading-spinner-overlay";

export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [primaryLoad, setPrimaryLoad] = useState(true);

  function navigateToDetail(incident) {
    navigation.navigate("detail", { incident });
  }
  async function loadIncidents() {
    if (loading) return;
    if (total > 0 && incidents.length === total) return;

    setLoading(true);

    const response = await api.get("incidents", {
      params: { page }
    });
    setIncidents([...incidents, ...response.data]);
    setPage(page + 1);
    setTotal(response.headers["x-total-count"]);

    setLoading(false);
  }

  useEffect(() => {
    loadIncidents();
    setPrimaryLoad(false);
  }, []);

  return (
    <View style={styles.container}>
      <Spinner visible={primaryLoad && loading} />

      <View style={styles.header}>
        <Image source={logoImg}></Image>
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>
      <Text style={styles.title}>Bem vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>
      <FlatList
        onEndReached={() => loadIncidents()}
        onEndReachedThreshold={0.2}
        data={incidents}
        style={styles.incidentsList}
        showsVerticalScrollIndicator={true}
        keyExtractor={incident => String(incident.id)}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041"></Feather>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
