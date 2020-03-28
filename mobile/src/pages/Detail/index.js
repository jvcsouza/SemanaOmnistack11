import React, { useState } from "react";
import styles from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import logoImg from "../../assets/logo.png";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { View, Image, TouchableOpacity, Text, Linking } from "react-native";
import * as MailComposer from "expo-mail-composer";

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();
  const incident = route.params.incident;

  const message = `Olá ${
    incident.name
  }, estou entrando em contato pois gostaria de ajudar no caso ${
    incident.title
  }, com o valor de ${Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL"
  }).format(incident.value)}.`;

  function navigateToIncidents() {
    navigation.goBack();
  }

  function sendMail() {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}.`,
      recipients: ["joao.souza@appsistemas.com.br"],
      body: message
    });
  }

  function sendWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${incident.whatsapp}&text=${message}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg}></Image>

        <TouchableOpacity onPress={navigateToIncidents}>
          <Feather name="arrow-left" size={28} color="#e82041"></Feather>
        </TouchableOpacity>
      </View>
      <View style={styles.incident}>
        <Text style={[styles.incidentProperty, { marginTop: 0 }]}>ONG:</Text>
        <Text style={styles.incidentValue}>
          {incident.name.toUpperCase()} de {incident.city}/{incident.uf}
        </Text>

        <Text style={styles.incidentProperty}>CASO:</Text>
        <Text style={styles.incidentValue}>{incident.title}</Text>

        <Text style={styles.incidentProperty}>VALOR:</Text>
        <Text style={styles.incidentValue}>
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL"
          }).format(incident.value)}
        </Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.heroTitle}>Salve o dia!</Text>
        <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

        <Text style={styles.heroDesc}>Entre em contato:</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
            <FontAwesome
              style={styles.actionText}
              name="whatsapp"
              size={16}
              color="#E02041"
            ></FontAwesome>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={sendMail}>
            <FontAwesome
              style={styles.actionText}
              name="at"
              size={16}
              color="#E02041"
            ></FontAwesome>
            <Text style={[styles.actionText, { paddingHorizontal: 20 }]}>
              E-mail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
