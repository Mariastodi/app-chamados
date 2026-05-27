// --- DOCUMENTAÇÃO DA INTERFACE ---
//  Responsabilidade - Disponibilizar o formulário interativo para abertura de novos tickets de suporte.
//  Funcionamento - Busca as listas dinâmicas de áreas e tipos de problemas em paralelo do backend via Promise.all 
//  para alimentar os seletores. Gerencia permissões nativas de privacidade para disparar e capturar 
//  mídia da câmera ou da galeria de fotos, empacotando dados textuais e binários em um objeto 
//  do tipo FormData para realizar o upload assíncrono para a API.

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 
import { Ionicons } from '@expo/vector-icons'; 
import { api } from '../../services/api';

const colors = {
  primary: '#0F172A',
  accent: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  textMain: '#1E293B',   
  border: '#E2E8F0',
};

export default function CreateTicket() {
  const navigation = useNavigation();
  const [areas, setAreas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resAreas, resTipos] = await Promise.all([
          api.get('/areas'),
          api.get('/tipos')
        ]);
        setAreas(resAreas.data);
        setTipos(resTipos.data);
      } catch(e) {
        console.log("Erro ao carregar listas", e);
      } finally {
        setLoadingLists(false);
      }
    }
    loadData();
  }, []);

  const handlePickImage = async (useCamera: boolean) => {
    const currentPermission = useCamera
      ? await ImagePicker.getCameraPermissionsAsync()
      : await ImagePicker.getMediaLibraryPermissionsAsync();

    let finalStatus = currentPermission.status;

    if (currentPermission.status !== 'granted') {
      const requestPermission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      finalStatus = requestPermission.status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        "Permissão necessária", 
        `Para anexar fotos, habilite o acesso à ${useCamera ? 'câmera' : 'galeria'} nas configurações do seu dispositivo.`
      );
      return;
    }

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.5 });

    const resultAny = result as any;
    const canceled = result.canceled === true || resultAny.cancelled === true;
    if (!canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  async function handleCreateTicket() {
    if (!selectedArea || !selectedTipo || !title.trim() || !description.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('assunto', title);
      formData.append('descricao', description);
      formData.append('area_id', selectedArea);
      formData.append('tipo_id', selectedTipo);
      
      if (image) {
        const filename = image.split('/').pop() || 'upload.jpg';
        
        formData.append('image', { 
          uri: Platform.OS === 'ios' ? image.replace('file://', '') : image, 
          name: filename, 
          type: 'image/jpeg' 
        } as any);
      }

      await api.post('/tickets', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });

      Alert.alert('Sucesso', 'Chamado aberto!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar.');
    } finally {
      setLoading(false);
    }
  }

  if (loadingLists) return <ActivityIndicator style={{flex: 1}} color={colors.accent} />;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Abrir Novo Chamado</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Resumo do Problema *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: Monitor piscando" placeholderTextColor="#94A3B8" />

          <Text style={styles.label}>Área Responsável *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsScrollContent}
            style={styles.optionsWrapper}
          >
            {areas.length > 0 ? (
              areas.map((a: any) => (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => setSelectedArea(a.id)}
                  style={[
                    styles.optionButton,
                    selectedArea === a.id && styles.optionButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    selectedArea === a.id && styles.optionTextActive,
                  ]}>
                    {a.nome}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma área disponível.</Text>
            )}
          </ScrollView>

          <Text style={styles.label}>Tipo de Problema *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsScrollContent}
            style={styles.optionsWrapper}
          >
            {tipos.length > 0 ? (
              tipos.map((t: any) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSelectedTipo(t.id)}
                  style={[
                    styles.optionButton,
                    selectedTipo === t.id && styles.optionButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    selectedTipo === t.id && styles.optionTextActive,
                  ]}>
                    {t.nome}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum tipo disponível.</Text>
            )}
          </ScrollView>

          <Text style={styles.label}>Descrição Detalhada *</Text>
          <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline placeholder="Descreva o que aconteceu..." placeholderTextColor="#94A3B8" />

          <Text style={styles.label}>Anexar Foto</Text>
          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickImage(true)}>
              <Ionicons name="camera" size={24} color={colors.accent} />
              <Text style={styles.photoBtnText}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickImage(false)}>
              <Ionicons name="image" size={24} color={colors.accent} />
              <Text style={styles.photoBtnText}>Galeria</Text>
            </TouchableOpacity>
          </View>

          {image && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.removeBtn}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleCreateTicket} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Criar Chamado</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.primary, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: colors.border, color: colors.textMain },
  optionsWrapper: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 8, marginBottom: 4 },
  optionsScrollContent: { alignItems: 'center' },
  optionButton: { minWidth: 90, maxWidth: 140, height: 42, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, marginRight: 8, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  optionButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  optionText: { color: colors.primary, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  optionTextActive: { color: '#FFF' },
  emptyText: { color: '#94A3B8', fontSize: 13 },
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  photoBtn: { flex: 1, height: 50, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
  photoBtnText: { marginLeft: 8, color: colors.accent, fontWeight: '600' },
  previewContainer: { marginTop: 20, alignItems: 'center' },
  previewImage: { width: '100%', height: 200, borderRadius: 12 },
  removeBtn: { position: 'absolute', top: -10, right: -10 },
  submitButton: { backgroundColor: colors.accent, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 40 },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});