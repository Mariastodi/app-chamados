//  --- DOCUMENTAÇÃO DA INTERFACE ---
//  Responsabilidade - Apresentar o painel central de controle com a listagem geral e filtrada de chamados do usuário.
//  Funcionamento - Consome o estado global do usuário logado para renderizar uma saudação personalizada. 
//  Utiliza o hook useIsFocused para disparar requisições automáticas à API Rest toda vez que a tela ganha foco, 
//  garantindo dados atualizados em tempo real. Implementa filtros interativos horizontais em memória 
//  e estilização condicional de acordo com o status atual do ticket no banco MySQL.

import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, ScrollView 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { styles } from './styles';

const BACKEND_URL = "http://192.168.1.228:3000/uploads"; 

const buildImageUri = (fotoUrl: string) => {
  console.log("valor vindo do banco(foto_url):", JSON.stringify(fotoUrl));
  if (!fotoUrl) return '';

  const trimmed = fotoUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  
  const cleaned = trimmed.replace(/^\/+/, '').replace(/^uploads\//i, '');
  const urlFinal = `${BACKEND_URL}/${encodeURI(cleaned)}`;

  console.log("Url gerada para o android:", urlFinal);
  
  return urlFinal;
};


function TicketImage({ uri }: { uri: string }) {
  const [hasError, setHasError] = useState(false);

  if (!uri) {
    return null;
  }

  return hasError ? (
    <View style={styles.ticketImagePlaceholder}>
      <Ionicons name="image-outline" size={24} color="#94A3B8" />
      <Text style={styles.ticketImagePlaceholderText}>Imagem não carregou</Text>
    </View>
  ) : (
    <Image
      source={{ uri }}
      style={styles.ticketImage}
      resizeMode="cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function Home() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused(); 
  const { signOut, user } = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = ['Todos', 'TI', 'Infraestrutura', 'Recursos Humanos'];

  const getStatusTheme = (status: string) => {
    const s = status ? status.toLowerCase().trim() : '';
    if (s.includes('concl')) return { bg: '#DCFCE7', text: '#15803d', dot: '#22C55E' }; 
    if (s.includes('andamento')) return { bg: '#FEF3C7', text: '#b45309', dot: '#F59E0B' }; 
    return { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' }; 
  };

  async function loadTickets() {
    try {
      setLoading(true);
      const response = await api.get('/tickets');
      
      if (Array.isArray(response.data)) {
        const validTickets = response.data.filter((ticket: any) => ticket && ticket.id);
        
        const uniqueTickets = validTickets.filter((value: any, index: number, self: any[]) =>
          self.findIndex((t) => t.id === value.id) === index
        );

        setTickets(uniqueTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.log("Erro ao carregar tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) loadTickets();
  }, [isFocused]);

  const filteredTickets = activeFilter === 'Todos' 
    ? tickets 
    : tickets.filter((t: any) => {
        const area = (t.area_nome || t.area || '').toUpperCase().trim();
        const filtro = activeFilter.toUpperCase().trim();
        
        if (filtro === 'RH' || filtro.includes('RECURSOS') || filtro.includes('HUMANOS')) {
          return area === 'RH' || area.includes('RECURSOS') || area.includes('HUMANOS');
        }
        
        if (filtro === 'TI' || filtro.includes('TECNOLOGIA')) {
          return area === 'TI' || area.includes('TECNOLOGIA') || area.includes('INFORMAÇÃO');
        }

        return area.includes(filtro) || filtro.includes(area);
      });

  const renderTicket = ({ item }: any) => {
    const theme = getStatusTheme(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.cardWrapper}
        onPress={() => navigation.navigate('TicketDetails', { id: item.id })}
      >
        <View style={styles.ticketCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: theme.dot }]} />
              <Text style={[styles.statusBadgeText, { color: theme.text }]}>
                {item.status?.toLowerCase().includes('concl') ? 'CONCLUÍDO' : (item.status || 'Aberto').toUpperCase()}
              </Text>
            </View>
            
            <Text style={styles.dateText}>
              {item.created_at 
                ? new Date(item.created_at).toLocaleDateString('pt-BR') 
                : new Date().toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <Text style={styles.ticketTitle}>
            {item.assunto || item.titulo || item.title || "Chamado sem título"}
          </Text>

          <Text style={styles.ticketDescription} numberOfLines={2}>
            {item.descricao || item.description || "Nenhuma descrição informada."}
          </Text>

          {item.foto_url && (
            <TicketImage uri={buildImageUri(item.foto_url)} />
          )}

          <View style={styles.cardFooter}>
            <View style={styles.tag}>
              <Ionicons name="business-outline" size={12} color="#64748B" />
              <Text style={styles.tagText}>
                {item.area_nome || item.area || 'Geral'}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>ID #{item.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem-vinda de volta,</Text>
          <Text style={styles.userName}>{user?.nome || 'Maria Beatriz'}</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge} onPress={signOut}>
          <Ionicons name="log-out-outline" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Seus Chamados</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredTickets}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={renderTicket}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateTicket')}>
        <Ionicons name="add" size={35} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}