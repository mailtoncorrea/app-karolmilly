import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

// Importe a sua logo. Ajuste o caminho se for diferente.
import LogoBackground from "../assets/image_logo.jpg";

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 1. COMPONENTE DE IMAGEM DE FUNDO */}
      <Image
        source={LogoBackground}
        style={styles.backgroundImage}
        resizeMode="cover" // cobre toda a tela sem deixar espaços brancos
      />

      {/* O resto do conteúdo fica por cima */}
      <Text style={styles.text}>Bem-vindo ao app Karolmilly!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Vendas")}
      >
        <Text style={styles.buttonText}>Ir para Vendas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.reportButton]}
        onPress={() => navigation.navigate("Relatorios")}
      >
        <Text style={styles.buttonText}>📊 Ir para Relatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.produtosButton]}
        onPress={() => navigation.navigate("Produtos")}
      >
        <Text style={styles.buttonText}>📦 Ir para Estoque</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e74c3c" }]}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  // 2. IMAGEM DE FUNDO AJUSTADA
  backgroundImage: {
    position: "absolute",
    width: "100%", // cobre toda a largura da tela
    height: "100%", // cobre toda a altura da tela
    opacity: 0.25, // mais visível, mas ainda suave como fundo
    top: 0,
    left: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: 200,
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  reportButton: {
    backgroundColor: "#2ecc71",
    marginTop: 10,
    marginBottom: 10,
  },
  produtosButton: {
    backgroundColor: "#3498db",
    marginTop: 10,
    marginBottom: 10,
  },
});
