import AsyncStorage from '@react-native-async-storage/async-storage';

const PEDIDOS_KEY = 'pedidos';

export const initDatabase = async () => {
  try {
    // Verifica se já existe dados, se não, inicializa com array vazio
    const pedidos = await AsyncStorage.getItem(PEDIDOS_KEY);
    if (pedidos === null) {
      await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify([]));
      console.log('Banco de dados inicializado com array vazio');
    }
    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.log('Erro ao inicializar banco de dados: ', error);
  }
};

export const adicionarPedido = async (pedido, callback) => {
  try {
    const pedidosJSON = await AsyncStorage.getItem(PEDIDOS_KEY);
    const pedidos = pedidosJSON ? JSON.parse(pedidosJSON) : [];
    
    const novoPedido = {
      id: Date.now().toString(), // ID único baseado no timestamp
      ...pedido,
      data_criacao: new Date().toISOString()
    };
    
    pedidos.push(novoPedido);
    await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
    
    console.log('Pedido salvo com sucesso! ID:', novoPedido.id);
    callback(novoPedido);
  } catch (error) {
    console.log('Erro ao salvar pedido: ', error);
  }
};

export const buscarPedidos = async (callback) => {
  try {
    const pedidosJSON = await AsyncStorage.getItem(PEDIDOS_KEY);
    const pedidos = pedidosJSON ? JSON.parse(pedidosJSON) : [];
    
    // Ordenar por data de criação (mais recentes primeiro)
    pedidos.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
    
    console.log('Pedidos recuperados: ', pedidos.length);
    callback(pedidos);
  } catch (error) {
    console.log('Erro ao buscar pedidos: ', error);
    callback([]);
  }
};

export const atualizarPedido = async (id, pedidoAtualizado, callback) => {
  try {
    const pedidosJSON = await AsyncStorage.getItem(PEDIDOS_KEY);
    const pedidos = pedidosJSON ? JSON.parse(pedidosJSON) : [];
    
    const index = pedidos.findIndex(pedido => pedido.id === id);
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], ...pedidoAtualizado };
      await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
      console.log('Pedido atualizado com sucesso!');
      callback(pedidos[index]);
    } else {
      console.log('Pedido não encontrado para atualização');
      callback(null);
    }
  } catch (error) {
    console.log('Erro ao atualizar pedido: ', error);
  }
};

export const excluirPedido = async (id, callback) => {
  try {
    const pedidosJSON = await AsyncStorage.getItem(PEDIDOS_KEY);
    const pedidos = pedidosJSON ? JSON.parse(pedidosJSON) : [];
    
    const pedidosFiltrados = pedidos.filter(pedido => pedido.id !== id);
    await AsyncStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidosFiltrados));
    
    console.log('Pedido excluído com sucesso!');
    callback();
  } catch (error) {
    console.log('Erro ao excluir pedido: ', error);
  }
};