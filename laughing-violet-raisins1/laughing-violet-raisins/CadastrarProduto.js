import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert
} from 'react-native';
import { adicionarPedido, atualizarPedido, initDatabase } from './Database';

export default function CadastrarProduto({ route, navigation }) {
  const produtoParaEditar = route?.params?.produto || null;

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [codigoBarra, setCodigoBarra] = useState('');
  const [validade, setValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [emojiSelecionado, setEmojiSelecionado] = useState('');
  const [animacao] = useState(new Animated.Value(1));

  useEffect(() => {
    initDatabase();
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setCategoria(produtoParaEditar.categoria);
      setDetalhes(produtoParaEditar.detalhes);
      setCodigoBarra(produtoParaEditar.codigoBarra);
      setValidade(produtoParaEditar.validade);
      setQuantidade(String(produtoParaEditar.quantidade));
      setPreco(String(produtoParaEditar.preco));
      setEmojiSelecionado(produtoParaEditar.emoji);
    }
  }, []);

  const emojis = [
    { label: '🥩', nome: 'Carne' },
    { label: '🥬', nome: 'Alface' },
    { label: '🍅', nome: 'Tomate' },
    { label: '🧀', nome: 'Queijo' },
    { label: '🥓', nome: 'Bacon' },
    { label: '🍗', nome: 'Frango' },
    { label: '🥖', nome: 'Pão' },
    { label: '🥤', nome: 'Refrigerante' },
    { label: '🍨', nome: 'Milk Shake' },
  ];

  const handleSalvar = async () => {
    if (!nome || !categoria || !quantidade || !preco) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios: Nome, Categoria, Quantidade e Preço.');
      return;
    }

    const produto = {
      nome,
      categoria,
      detalhes,
      codigoBarra,
      validade,
      quantidade: parseInt(quantidade) || 0,
      preco: parseFloat(preco) || 0.0,
      emoji: emojiSelecionado,
    };

    if (produtoParaEditar) {
      atualizarPedido(produtoParaEditar.id, produto, () => {
        Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
        navigation.goBack();
      });
      return;
    }

    await adicionarPedido(produto, () => {
      Animated.sequence([
        Animated.timing(animacao, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(animacao, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start(() => {
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
        handleLimpar();
      });
    });
  };

  const handleLimpar = () => {
    setNome('');
    setCategoria('');
    setDetalhes('');
    setCodigoBarra('');
    setValidade('');
    setQuantidade('');
    setPreco('');
    setEmojiSelecionado('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>🍟 McDonald’s</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>
          {produtoParaEditar ? 'Editar Produto' : 'Cadastrar Produto'}
        </Text>

        {emojiSelecionado ? (
          <Animated.View style={[styles.previewContainer, { transform: [{ scale: animacao }] }]}>
            <Text style={styles.previewEmoji}>{emojiSelecionado}</Text>
            <Text style={styles.previewLabel}>Prévia do produto</Text>
          </Animated.View>
        ) : (
          <View style={styles.previewContainer}>
            <Text style={styles.previewPlaceholder}>🍔 Selecione um ícone abaixo</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          placeholderTextColor="#777"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Categoria"
          placeholderTextColor="#777"
          value={categoria}
          onChangeText={setCategoria}
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Detalhes"
          placeholderTextColor="#777"
          value={detalhes}
          onChangeText={setDetalhes}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Código de barras"
          placeholderTextColor="#777"
          value={codigoBarra}
          onChangeText={setCodigoBarra}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Validade"
          placeholderTextColor="#777"
          value={validade}
          onChangeText={setValidade}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          placeholderTextColor="#777"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Preço"
          placeholderTextColor="#777"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Selecione o ícone do produto:</Text>
        <View style={styles.emojiContainer}>
          {emojis.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.emojiButton,
                emojiSelecionado === item.label && styles.emojiSelecionado,
              ]}
              onPress={() => setEmojiSelecionado(item.label)}
            >
              <Text style={styles.emoji}>{item.label}</Text>
              <Text style={styles.emojiNome}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>
            {produtoParaEditar ? 'Salvar Alterações' : 'Salvar Produto'}
          </Text>
        </TouchableOpacity>

        {!produtoParaEditar && (
          <TouchableOpacity style={styles.botaoLimpar} onPress={handleLimpar}>
            <Text style={styles.textoBotaoLimpar}>Limpar Campos</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DA291C',
  },
  header: {
    backgroundColor: '#FFC72C',
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DA291C',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#DA291C',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
    margin: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#DA291C',
    marginVertical: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emojiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#EEE',
    borderRadius: 10,
    width: 80,
    margin: 5,
  },
  emojiSelecionado: {
    borderColor: '#DA291C',
    backgroundColor: '#FFF0E0',
  },
  emoji: {
    fontSize: 28,
  },
  emojiNome: {
    fontSize: 12,
    color: '#555',
  },
  botaoSalvar: {
    backgroundColor: '#FFC72C',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
    elevation: 8,
  },
  textoBotao: {
    color: '#DA291C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoLimpar: {
    backgroundColor: '#FFF',
    padding: 13,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DA291C',
  },
  textoBotaoLimpar: {
    color: '#DA291C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  previewEmoji: {
    fontSize: 60,
  },
  previewLabel: {
    fontSize: 14,
    color: '#DA291C',
    fontWeight: '600',
    marginTop: 5,
  },
  previewPlaceholder: {
    fontSize: 16,
    color: '#AAA',
    fontStyle: 'italic',
    marginBottom: 10,
  },
});
