import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { getContractById } from '@/store/contracts';
import {
  ChatMessage,
  getBotResponse,
  getInitialChatMessages,
} from '@/store/chatbot';

export default function ContractDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialChatMessages());
  const [input, setInput] = useState('');

  const contractId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [id]);

  const contract = useMemo(
    () => (Number.isFinite(contractId) ? getContractById(contractId) : null),
    [contractId],
  );

  if (!contract) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f8fafc',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#020617', marginBottom: 8 }}>
          Contrat introuvable
        </Text>
        <Text
          onPress={() => router.back()}
          style={{ fontSize: 14, color: '#2563eb', textDecorationLine: 'underline' }}
        >
          Retour aux contrats
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text
          onPress={() => router.back()}
          style={{ fontSize: 14, color: '#2563eb', marginBottom: 6 }}
        >
          ← {t('common.back')}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#020617' }}>
          {t('contracts.contractDetails')}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{contract.numero}</Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main card */}
        <View
          style={{
            borderRadius: 18,
            backgroundColor: '#ffffff',
            padding: 16,
            marginBottom: 16,
            shadowColor: '#0f172a',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#020617', marginBottom: 4 }}>
                {contract.client}
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>
                {contract.type} · {contract.montant}
              </Text>
            </View>
            <View
              style={{
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: '#e0f2fe',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#0369a1' }}>
                {contract.statut}
              </Text>
            </View>
          </View>

          {/* Dates */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={{ marginLeft: 4, fontSize: 12, color: '#64748b' }}>
                  {t('contracts.startDate')}
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#020617' }}>
                {new Date(contract.debut).toLocaleDateString('fr-FR')}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={{ marginLeft: 4, fontSize: 12, color: '#64748b' }}>
                  {t('contracts.endDate')}
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#020617' }}>
                {new Date(contract.fin).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>

        {/* Mini chatbot */}
        <MiniChat
          contractNumber={contract.numero}
          messages={messages}
          input={input}
          onChangeInput={setInput}
          onSend={(text) => {
            const trimmed = text.trim();
            if (!trimmed) return;

            const userMessage: ChatMessage = {
              id: messages.length + 1,
              sender: 'user',
              text: trimmed,
            };
            setMessages((prev) => [...prev, userMessage]);

            setTimeout(() => {
              const baseResponse = getBotResponse(trimmed);
              const botMessage: ChatMessage = {
                id: userMessage.id + 1,
                sender: 'bot',
                text: `Contrat ${contract.numero} — ${baseResponse}`,
              };
              setMessages((prev) => [...prev, botMessage]);
            }, 500);

            setInput('');
          }}
        />
      </ScrollView>
    </View>
  );
}

type MiniChatProps = {
  contractNumber: string;
  messages: ChatMessage[];
  input: string;
  onChangeInput: (value: string) => void;
  onSend: (text: string) => void;
};

function MiniChat({ contractNumber, messages, input, onChangeInput, onSend }: MiniChatProps) {
  return (
    <View
      style={{
        marginTop: 12,
        borderRadius: 18,
        backgroundColor: '#020617',
        padding: 14,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#e5e7eb', marginBottom: 4 }}>
        Assistant IA — {contractNumber}
      </Text>
      <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
        Posez une question sur ce contrat. Les réponses sont simulées à partir de votre logique web.
      </Text>

      <View
        style={{
          maxHeight: 180,
          marginBottom: 8,
        }}
      >
        <ScrollView
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ rowGap: 6 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={{
                flexDirection: 'row',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <View
                style={{
                  maxWidth: '80%',
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: msg.sender === 'user' ? '#22c55e' : '#0f172a',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: msg.sender === 'user' ? '#f9fafb' : '#e5e7eb',
                  }}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 8,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
          backgroundColor: '#020617',
          borderWidth: 1,
          borderColor: '#1f2937',
        }}
      >
        <TextInput
          placeholder="Votre question..."
          placeholderTextColor="#6b7280"
          value={input}
          onChangeText={onChangeInput}
          onSubmitEditing={() => onSend(input)}
          style={{
            flex: 1,
            fontSize: 13,
            color: '#f9fafb',
            paddingVertical: 4,
          }}
        />
        <Text
          onPress={() => onSend(input)}
          style={{ fontSize: 13, fontWeight: '600', color: '#22c55e' }}
        >
          Envoyer
        </Text>
      </View>
    </View>
  );
}


