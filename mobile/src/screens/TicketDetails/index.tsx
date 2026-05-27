// --- DOCUMENTAÇÃO DA INTERFACE ---
//  Responsabilidade - Exibir de forma isolada as especificações, histórico e anexo de um ticket selecionado.
//  Funcionamento - Recupera o parâmetro id injetado na rota de navegação e faz uma consulta do tipo GET 
//  ao endpoint /tickets/:id da API. Renderiza as informações estruturadas na tela através de um ScrollView
//  e reconstrói dinamicamente o endereço IP de rede local para buscar e carregar a imagem armazenada 
//  estaticamente na pasta de uploads do backend Node.js.

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { api } from '../../services/api';

const BACKEND_URL = 'http://192.168.1.228:3000/uploads';

const buildImageUri = (fotoUrl: string) => {
  if (!fotoUrl) return '';
  const trimmed = fotoUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleaned = trimmed.replace(/^\/+/, '').replace(/^uploads\//i, '');
  return `${BACKEND_URL}/${encodeURI(cleaned)}`;
};

export default function TicketDetails() {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { id } = route.params as { id: number };
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const response = await api.get(`/tickets/${id}`);
        console.log("Dados do ticket carregado nos Detalhes:", response.data); 
        setTicket(response.data);
      } catch (error) {
        console.log("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const getStatusColor = (status: string) => {
    if (!status) return '#E74C3C';
    
    const text = status.toLowerCase();

    if (text.includes('concl')) {
      return '#2E7D32'; 
    }
    if (text.includes('andamento') || text.includes('progres')) {
      return '#FBC02D';
    }
    if (text.includes('aguard') || text.includes('atend')) {
      return '#757575'; 
    }

    return '#E74C3C'; 
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#48426D" />;

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()} 
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalhes do Chamado</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>{ticket?.title || ticket?.assunto || "Sem título"}</Text>
        
        <View style={styles.infoGroup}>
          <Text style={styles.label}>STATUS</Text>
          <Text style={[styles.statusText, { color: getStatusColor(ticket?.status) }]}>
            {ticket?.status?.toLowerCase().includes('concl') ? 'CONCLUÍDO' : ticket?.status?.toUpperCase()}
          </Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <Text style={styles.description}>{ticket?.description || ticket?.descricao || "Sem descrição."}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>ÁREA / TIPO</Text>
          <Text style={styles.boldText}>{ticket?.area_nome || 'TI'} • {ticket?.tipo_nome || 'Equipamentos'}</Text>
        </View>

        {ticket?.foto_url ? (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>IMAGEM ANEXADA</Text>
            <Image 
              source={{ uri: buildImageUri(ticket.foto_url) }}
              style={styles.image}
              onError={(e) => console.log("Erro ao carregar imagem:", e.nativeEvent.error)}
            />
          </View>
        ) : (
          <View style={styles.infoGroup}>
            <Text style={styles.label}>IMAGEM</Text>
            <Text style={{ color: '#999', fontStyle: 'italic' }}>Nenhuma imagem anexada.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: {
    backgroundColor: '#111E38', 
    height: 90,
    paddingTop: 40,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4, 
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20,
    marginTop: 10 
  },
  infoGroup: { 
    marginBottom: 20 
  },
  label: { 
    color: '#888', 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  statusText: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  description: { 
    fontSize: 16, 
    color: '#333', 
    lineHeight: 24 
  }, 
  boldText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#444' 
  },
  imageContainer: { 
    marginTop: 10, 
    marginBottom: 40 
  },
  image: { 
    width: '100%', 
    height: 300, 
    borderRadius: 12, 
    marginTop: 10,
    backgroundColor: '#F0F0F0'
  }
});