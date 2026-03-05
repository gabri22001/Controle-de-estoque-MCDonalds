import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { buscarPedidos, initDatabase, excluirPedido } from './Database';

const EstoqueScreen = ({ navigation }) => {
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    initDatabase();
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    setCarregando(true);
    buscarPedidos((pedidos) => {
      setEstoque(pedidos);
      setCarregando(false);
    });
  };

  const handleExcluirProduto = (id, nome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o produto "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            excluirPedido(id, () => {
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              carregarPedidos();
            });
          },
        },
      ]
    );
  };

  const handleEditarProduto = (produto) => {
    navigation.navigate('CadastrarProduto', { produto, editando: true });
  };

  const renderItem = ({ item }) => {
    let validadeStyle = styles.validadeNormal;
    let validadeTexto = `⏰ ${item.validade || 'Não informada'}`;
    let diasRestantes = null;

    if (item.validade) {
      try {
        const hoje = new Date();
        const partesData = item.validade.split('/');
        if (partesData.length === 3) {
          const validade = new Date(partesData[2], partesData[1] - 1, partesData[0]);
          const diffTempo = validade.getTime() - hoje.getTime();
          const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
          diasRestantes = diffDias;
          if (diffDias < 0) {
            validadeStyle = styles.validadeVencida;
            validadeTexto = `⚠️ Vencido em ${item.validade}`;
          } else if (diffDias === 0) {
            validadeStyle = styles.validadeProxima;
            validadeTexto = `⏰ Vence hoje!`;
          } else if (diffDias <= 3) {
            validadeStyle = styles.validadeProxima;
            validadeTexto = `⏰ Vence em ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
          } else {
            validadeTexto = `⏰ Vence em ${item.validade}`;
          }
        }
      } catch (error) {}
    }

    const textoValidadeStyle =
      validadeStyle === styles.validadeProxima || validadeStyle === styles.validadeVencida
        ? styles.validadeTextoEscuro
        : styles.validadeTextoClaro;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{item.emoji || '📦'}</Text>
          <View style={styles.nomeContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.categoria}>{item.categoria}</Text>
          </View>
        </View>

        <View style={styles.cardInfoRow}>
          <View style={styles.quantidadeBadge}>
            <Text style={styles.quantidadeTexto}>📦 {item.quantidade || 0} un</Text>
          </View>
          <Text style={styles.preco}>R$ {parseFloat(item.preco || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.cardInfoRow}>
          <View style={validadeStyle}>
            <Text style={[styles.validadeTexto, textoValidadeStyle]}>{validadeTexto}</Text>
          </View>
        </View>

        {item.detalhes ? <Text style={styles.detalhes}>{item.detalhes}</Text> : null}
        {item.codigoBarra ? <Text style={styles.codigoBarra}>Código: {item.codigoBarra}</Text> : null}

        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoEditar]}
            onPress={() => handleEditarProduto(item)}
          >
            <Text style={styles.textoBotaoAcao}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoExcluir]}
            onPress={() => handleExcluirProduto(item.id, item.nome)}
          >
            <Text style={styles.textoBotaoAcao}>🗑️ Excluir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dataCriacao}>
          Cadastrado em: {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.tituloWrapper}>
          <Text style={styles.titulo}>🍟 McStock - Estoque</Text>
          <Text style={styles.subtitulo}>Total: {estoque.length} produtos</Text>

          <View style={styles.botoesHeader}>
            <TouchableOpacity onPress={carregarPedidos} style={styles.botaoAtualizar}>
              <Text style={styles.textoBotaoAtualizar}>🔄 Atualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CadastrarProduto')}
              style={styles.botaoAdicionar}
            >
              <Text style={styles.textoBotaoAdicionar}>➕ Novo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {carregando ? (
        <View style={styles.carregandoContainer}>
          <Text style={styles.textoCarregando}>Carregando produtos...</Text>
        </View>
      ) : (
        <FlatList
          data={estoque}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estoque.length === 0 ? styles.listaVaziaContainer : null}
          ListEmptyComponent={
            <View style={styles.listaVazia}>
              <Text style={styles.textoListaVazia}>📭 Nenhum produto cadastrado</Text>
              <Text style={styles.textoListaVaziaSub}>
                Toque no botão "➕ Novo" para cadastrar seu primeiro produto
              </Text>
              <TouchableOpacity
                style={styles.botaoCadastrar}
                onPress={() => navigation.navigate('CadastrarProduto')}
              >
                <Text style={styles.textoBotaoCadastrar}>Cadastrar Primeiro Produto</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DA291C' },
  headerContainer: { backgroundColor: '#DA291C', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 20 },
  tituloWrapper: {
    backgroundColor: '#FFC72C',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#DA291C', textAlign: 'center', marginBottom: 5 },
  subtitulo: { fontSize: 16, color: '#DA291C', textAlign: 'center', marginBottom: 15, fontWeight: '600' },
  botoesHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  botaoAtualizar: {
    backgroundColor: '#DA291C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  textoBotaoAtualizar: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  botaoAdicionar: {
    backgroundColor: '#DA291C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  textoBotaoAdicionar: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFC72C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 40, marginRight: 12 },
  nomeContainer: { flex: 1 },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#DA291C' },
  categoria: { fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 2 },
  cardInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  quantidadeBadge: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  quantidadeTexto: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  preco: { fontSize: 18, fontWeight: 'bold', color: '#DA291C' },
  validadeNormal: { backgroundColor: '#E5E5EA', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  validadeProxima: { backgroundColor: '#FF9500', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  validadeVencida: { backgroundColor: '#FF3B30', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  validadeTexto: { fontSize: 13, fontWeight: '600' },
  validadeTextoClaro: { color: '#333' },
  validadeTextoEscuro: { color: '#FFF' },
  detalhes: { fontSize: 14, color: '#555', marginTop: 8, marginBottom: 4, fontStyle: 'italic' },
  codigoBarra: { fontSize: 12, color: '#666', marginBottom: 8 },
  botoesAcao: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 8 },
  botaoAcao: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  botaoEditar: { backgroundColor: '#FFC72C', borderWidth: 1, borderColor: '#DA291C' },
  botaoExcluir: { backgroundColor: '#FF3B30', borderWidth: 1, borderColor: '#C1272D' },
  textoBotaoAcao: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  dataCriacao: { fontSize: 10, color: '#999', textAlign: 'center', marginTop: 5 },
  carregandoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  textoCarregando: { fontSize: 18, color: '#FFF', textAlign: 'center' },
  listaVaziaContainer: { flexGrow: 1, justifyContent: 'center' },
  listaVazia: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  textoListaVazia: { fontSize: 20, color: '#FFF', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  textoListaVaziaSub: { fontSize: 14, color: '#FFC72C', textAlign: 'center', marginBottom: 20 },
  botaoCadastrar: { backgroundColor: '#FFC72C', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, marginTop: 10 },
  textoBotaoCadastrar: { color: '#DA291C', fontSize: 16, fontWeight: 'bold' },
});

export default EstoqueScreen;
