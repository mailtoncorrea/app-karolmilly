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

const FormularioProduto = ({ onSave, produtoParaEditar, onCancel }) => {
  const [nome, setNome] = useState(
    produtoParaEditar ? produtoParaEditar.nome : ""
  );
  const [preco, setPreco] = useState(
    produtoParaEditar ? String(produtoParaEditar.preco) : ""
  );
  const [estoque, setEstoque] = useState(
    produtoParaEditar ? String(produtoParaEditar.estoque) : ""
  );

  // Efeito para resetar/carregar dados quando o produtoParaEditar muda
  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setPreco(String(produtoParaEditar.preco));
      setEstoque(String(produtoParaEditar.estoque));
    } else {
      setNome("");
      setPreco("");
      setEstoque("");
    }
  }, [produtoParaEditar]);

  const handleSave = () => {
    if (!nome || !preco || !estoque) {
      Alert.alert("Atenção", "Todos os campos devem ser preenchidos.");
      return;
    }

    const produto = {
      nome: nome.trim(),
      preco: parseFloat(preco.replace(",", ".")),
      estoque: parseInt(estoque),
      id: produtoParaEditar ? produtoParaEditar.id : null, // Inclui o ID se for edição
    };

    onSave(produto);
  };

  const handleCancel = () => {
    setNome("");
    setPreco("");
    setEstoque("");
    onCancel();
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {produtoParaEditar ? "Editar Produto" : "Cadastrar Novo Produto"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Preço de Venda (Ex: 15.50)"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade em Estoque"
        value={estoque}
        onChangeText={setEstoque}
        keyboardType="numeric"
      />

      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {produtoParaEditar ? "Atualizar" : "Salvar"}
          </Text>
        </TouchableOpacity>
        {produtoParaEditar && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
// =================================================================
// FIM DO FORMULÁRIO
// =================================================================

// =================================================================
// 2. COMPONENTE PRINCIPAL (PRODUTOSSCREEN)
// =================================================================
export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null); // Produto que está sendo editado
  const API_URL = "http://192.168.18.14:5000"; // SEU IP CONFIRMADO

  // Função para buscar a lista de produtos (operação READ )
  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/produtos`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setProdutos(data);
      } else {
        Alert.alert("Erro", data.erro || "Falha ao buscar produtos.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Falha ao conectar com o servidor para buscar produtos."
      );
    } finally {
      setLoading(false);
    }
  };

  // Chama a busca de produtos ao montar a tela
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função de Salvar (Create/Update)
  const handleSaveProduto = async (produto) => {
    const isUpdate = produto.id !== null;
    const method = isUpdate ? "PUT" : "POST";
    const url = isUpdate
      ? `${API_URL}/produtos/${produto.id}`
      : `${API_URL}/produtos`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Sucesso", data.mensagem);
        setProdutoEmEdicao(null); // Limpa o estado de edição
        buscarProdutos(); // Recarrega a lista
      } else {
        Alert.alert(
          "Erro",
          data.erro ||
            `Falha ao ${isUpdate ? "atualizar" : "cadastrar"} produto.`
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao comunicar com o servidor.");
    }
  };

  // Função de Excluir (Delete)
  const handleDelete = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/produtos/${id}`, {
                method: "DELETE",
              });

              const data = await res.json();

              if (res.ok) {
                Alert.alert("Sucesso", data.mensagem);
                buscarProdutos(); // Recarrega a lista
              } else {
                Alert.alert("Erro", data.erro || "Falha ao excluir produto.");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Falha ao comunicar com o servidor.");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (produto) => {
    // Coloca o produto selecionado no formulário para edição
    setProdutoEmEdicao(produto);
  };

  const handleCancelEdit = () => {
    setProdutoEmEdicao(null);
  };

  // Renderização de cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhe}>
          Preço: R$ {parseFloat(item.preco).toFixed(2).replace(".", ",")}
        </Text>
        <Text style={styles.itemDetalhe}>Estoque: {item.estoque}</Text>
      </View>
      <View style={styles.itemButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && produtos.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando Produtos...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={
        <View>
          <FormularioProduto
            onSave={handleSaveProduto}
            produtoParaEditar={produtoEmEdicao}
            onCancel={handleCancelEdit}
          />
          <Text style={styles.listTitle}>
            Lista de Produtos ({produtos.length})
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
      }
    />
  );
}
// =================================================================
// FIM DO COMPONENTE PRINCIPAL
// =================================================================

// =================================================================
// 3. STYLESHEET
// =================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#34495e",
  },
  // Estilos do Formulário
  formContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  input: {
    height: 40,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    outlineStyle: "none",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Estilos da Lista
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    color: "#2c3e50",
    backgroundColor: "#dcdde1",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
  },
  itemDetalhe: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  itemButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#3498db", // Azul para editar
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#7f8c8d",
  },
});
