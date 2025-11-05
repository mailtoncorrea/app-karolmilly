import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";

// =================================================================
// 1. COMPONENTE DE CABEÇALHO
// =================================================================
const ListHeader = ({ nomeCliente, setNomeCliente, handleSearch, loading }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>Relatório de Transações</Text>
    <Text style={styles.label}>Digite o nome do cliente:</Text>
    <View style={styles.searchRow}>
      <TextInput
        style={styles.input}
        placeholder="Ex: Maria do Socorro"
        value={nomeCliente}
        onChangeText={setNomeCliente}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
    {loading && (
      <ActivityIndicator
        size="small"
        color="#3498db"
        style={{ marginTop: 10 }}
      />
    )}
  </View>
);
// =================================================================
// FIM DO CABEÇALHO
// =================================================================

export default function RelatoriosScreen() {
  const [nomeCliente, setNomeCliente] = useState("");
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDevido, setTotalDevido] = useState(0);

  const API_URL = "http://192.168.18.14:5000"; // confirme seu IP

  // Buscar transações
  const buscarTransacoes = async (cliente = "") => {
    setLoading(true);

    const url = cliente
      ? `${API_URL}/relatorios/transacoes?cliente=${cliente}`
      : `${API_URL}/relatorios/transacoes`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setTransacoes(data);

        // Calcula o total de "deve"
        const total = data.reduce(
          (acc, item) => acc + parseFloat(item.deve || 0),
          0
        );
        setTotalDevido(total);
      } else {
        setTransacoes([]);
        setTotalDevido(0);
        Alert.alert("Erro", data.erro || "Falha ao buscar transações.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTransacoes();
  }, []);

  const handleSearch = () => {
    buscarTransacoes(nomeCliente);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemCliente}>{item.nome_cliente}</Text>
      <Text style={styles.itemDetalhe}>Produto: {item.produto}</Text>
      <Text style={styles.itemDetalhe}>Quantidade: {item.quantidade}</Text>
      <Text style={styles.itemDetalhe}>
        Valor Total: R${" "}
        {parseFloat(item.valor_total).toFixed(2).replace(".", ",")}
      </Text>
      <Text style={styles.itemDetalhe}>
        Valor Pago: R${" "}
        {parseFloat(item.valor_pago).toFixed(2).replace(".", ",")}
      </Text>
      <Text style={styles.itemDetalhe}>
        Deve: R$ {parseFloat(item.deve).toFixed(2).replace(".", ",")}
      </Text>
      <Text style={styles.itemDetalhe}>Data: {item.data_transacao}</Text>
    </View>
  );

  // Rodapé com o total devido
  const ListFooter = () =>
    transacoes.length > 0 && (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          💰 Total em aberto:{" "}
          <Text style={styles.footerValue}>
            R$ {totalDevido.toFixed(2).replace(".", ",")}
          </Text>
        </Text>
      </View>
    );

  return (
    <FlatList
      style={styles.container}
      data={transacoes}
      keyExtractor={(item, index) => String(index)}
      ListHeaderComponent={
        <ListHeader
          nomeCliente={nomeCliente}
          setNomeCliente={setNomeCliente}
          handleSearch={handleSearch}
          loading={loading}
        />
      }
      renderItem={renderItem}
      ListEmptyComponent={
        !loading && (
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        )
      }
      ListFooterComponent={<ListFooter />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#34495e",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    outlineStyle: "none",
  },
  searchButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 15,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  itemCliente: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  itemDetalhe: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#7f8c8d",
  },
  footerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#bdc3c7",
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  footerValue: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
});
