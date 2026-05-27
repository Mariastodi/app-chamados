//  --- DOCUMENTAÇÃO DA INTERFACE ---
//  Responsabilidade - Fornecer a interface de formulário para coleta de credenciais e login do usuário.
//  Funcionamento - Captura o e-mail e a senha digitados, sanitiza os espaços em branco com a função .trim() 
//  e dispara o método global de autenticação signIn consumido do useAuth. Gerencia estados locais de 
//  carregamento para alterar visualmente o comportamento do botão principal e adota propriedades 
//  nativas de segurança e acessibilidade para teclados móveis.

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from './styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<any>();
  const { signIn } = useAuth(); 

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      
      await signIn(email.trim(), password.trim()); 
      
      navigation.navigate('Home');

    } catch (error: any) {
      const errorMsg = error.message || 'E-mail ou senha incorretos.';
      Alert.alert('Falha no Acesso', errorMsg);
      console.log("Erro capturado no Login:", errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}> 
        
        <Text style={styles.title}>Suporte App</Text>
        
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input} 
            placeholder="email@exemplo.com"
            placeholderTextColor="#94A3B8"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Sua senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

      </View> 
    </KeyboardAvoidingView>
  );
}