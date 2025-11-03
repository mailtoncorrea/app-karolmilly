import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

// --- Componente de Cabeçalho ESTÁVEL (Mova este bloco para FORA do VendasScreen) ---
// Ele agora recebe todas as props que precisa para ser estável.
const ListHeader = ({
  clienteNome,
  setClienteNome,
  telefone,
  setTelefone,
  valorPagamento,
  setValorPagamento,
  compraCliente,
  setCompraCliente,
  compraProduto,
  setCompraProduto,
  compraQtd,
  setCompraQtd,
  valorPago,
  setValorPago,
  buscarTransacaoNome,
  setBuscarTransacaoNome,
  adicionarCliente,
  buscarCliente,
  realizarPagamento,
  registrarCompra,
  buscarTransacoes,
  styles,
}) => (
  <View>
    <Text style={styles.title}>🛍️ Gerenciador de Vendas</Text>

    {/* CADASTRO DE CLIENTES */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Cadastro de Clientes</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={clienteNome}
        onChangeText={setClienteNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (99) 99999-9999"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={adicionarCliente}>
        <Text style={styles.btnText}>➕ Adicionar Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSearch} onPress={buscarCliente}>
        <Text style={styles.btnText}>🔍 Buscar Cliente</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Valor do Pagamento"
        keyboardType="numeric"
        value={valorPagamento}
        onChangeText={setValorPagamento}
      />
      <TouchableOpacity style={styles.btnAdd} onPress={realizarPagamento}>
        <Text style={styles.btnText}>💰 Realizar Pagamento</Text>
      </TouchableOpacity>
    </View>

    {/* REGISTRAR COMPRA */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Registrar Compra</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={compraCliente}
        onChangeText={setCompraCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={compraProduto}
        onChangeText={setCompraProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={compraQtd}
        onChangeText={setCompraQtd}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor Pago"
        keyboardType="numeric"
        value={valorPago}
        onChangeText={setValorPago}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={registrarCompra}>
        <Text style={styles.btnText}>🧾 Registrar Compra</Text>
      </TouchableOpacity>
    </View>

    {/* HISTÓRICO DE TRANSAÇÕES - Formulário de Busca */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Histórico de Transações</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={buscarTransacaoNome}
        onChangeText={setBuscarTransacaoNome}
      />
      <TouchableOpacity style={styles.btnSearch} onPress={buscarTransacoes}>
        <Text style={styles.btnText}>🔍 Ver Transações</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Componente Principal ---

export default function VendasScreen({ navigation }) {
  const [clienteNome, setClienteNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [compraCliente, setCompraCliente] = useState("");
  const [compraProduto, setCompraProduto] = useState("");
  const [compraQtd, setCompraQtd] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [buscarTransacaoNome, setBuscarTransacaoNome] = useState("");
  const [transacoes, setTransacoes] = useState([]);

  const API_URL = "http://192.168.18.14:5000";

  // --- Funções de API (Inalteradas) ---

  const adicionarCliente = async () => {
    if (!clienteNome.trim()) {
      Alert.alert("Erro", "O nome do cliente é obrigatório.");
      return;
    }

    const dados = { nome: clienteNome, telefone: telefone || null };

    try {
      const res = await fetch(`${API_URL}/clientes/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Erro", data.erro || "Falha ao cadastrar cliente.");
      } else {
        Alert.alert("Sucesso", data.mensagem || "Cliente cadastrado!");
        setClienteNome("");
        setTelefone("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  const buscarCliente = async () => {
    if (!clienteNome.trim()) {
      Alert.alert("Erro", "Digite o nome do cliente para buscar!");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/clientes/buscar?nome=${encodeURIComponent(clienteNome)}`
      );
      const data = await res.json();
      if (data.erro) {
        Alert.alert("Erro", data.erro);
      } else {
        Alert.alert(
          "Cliente encontrado",
          `Nome: ${data.nome}\nTelefone: ${data.telefone}\nSaldo devedor: ${data.saldo_devedor}`
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao buscar cliente.");
    }
  };

  const realizarPagamento = async () => {
    if (!clienteNome || !valorPagamento) {
      Alert.alert("Erro", "Informe o nome do cliente e o valor de pagamento.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/pagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_cliente: clienteNome,
          valor_pago: parseFloat(valorPagamento),
        }),
      });
      const data = await res.json();
      if (data.erro) {
        Alert.alert("Erro", data.erro);
      } else {
        Alert.alert("Sucesso", data.mensagem);
        setValorPagamento("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao registrar pagamento.");
    }
  };

  const registrarCompra = async () => {
    if (!compraCliente || !compraProduto || !compraQtd) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    const dadosCompra = {
      cliente_nome: compraCliente,
      produto_nome: compraProduto,
      quantidade: parseInt(compraQtd),
      valor_pago: parseFloat(valorPago) || 0,
    };

    try {
      const res = await fetch(`${API_URL}/vendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCompra),
      });
      const data = await res.json();
      if (data.erro) {
        Alert.alert("Erro", data.erro);
      } else {
        Alert.alert("Sucesso", "Compra registrada com sucesso!");
        setCompraCliente("");
        setCompraProduto("");
        setCompraQtd("");
        setValorPago("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao registrar compra.");
    }
  };

  const buscarTransacoes = async () => {
    if (!buscarTransacaoNome) {
      Alert.alert("Erro", "Digite o nome do cliente para buscar transações!");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/transacoes?nome=${encodeURIComponent(buscarTransacaoNome)}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransacoes(data);
      } else {
        setTransacoes([]);
        Alert.alert("Erro", "Nenhuma transação encontrada.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao buscar transações.");
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={transacoes}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <ListHeader
          clienteNome={clienteNome}
          setClienteNome={setClienteNome}
          telefone={telefone}
          setTelefone={setTelefone}
          valorPagamento={valorPagamento}
          setValorPagamento={setValorPagamento}
          compraCliente={compraCliente}
          setCompraCliente={setCompraCliente}
          compraProduto={compraProduto}
          setCompraProduto={setCompraProduto}
          compraQtd={compraQtd}
          setCompraQtd={setCompraQtd}
          valorPago={valorPago}
          setValorPago={setValorPago}
          buscarTransacaoNome={buscarTransacaoNome}
          setBuscarTransacaoNome={setBuscarTransacaoNome}
          adicionarCliente={adicionarCliente}
          buscarCliente={buscarCliente}
          realizarPagamento={realizarPagamento}
          registrarCompra={registrarCompra}
          buscarTransacoes={buscarTransacoes}
          styles={styles}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.transacaoItem}>
          <Text>
            {item.data} - {item.produto} - Qtd: {item.quantidade}
          </Text>
          <Text>
            💰 Total: R$ {item.valor_total} | Pago: R$ {item.valor_pago}
          </Text>
        </View>
      )}
      ListFooterComponent={() => (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.btnText}>🚪 Sair</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecf0f1", padding: 15 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  btnAdd: {
    backgroundColor: "#23b8e8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnSearch: {
    backgroundColor: "#a2a6f7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  transacaoItem: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
});
