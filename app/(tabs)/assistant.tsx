import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useTranslation } from '@/i18n';
import {
  ChatMessage,
  getBotResponse,
  getInitialChatMessages,
  getSuggestedQuestions,
} from '@/store/chatbot';

export default function AssistantScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialChatMessages());
  const [input, setInput] = useState('');

  const suggested = getSuggestedQuestions();
  const isInitialState = messages.length === 1 && !input;

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: content,
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const base = getBotResponse(content);
      const botMessage: ChatMessage = {
        id: userMessage.id + 1,
        sender: 'bot',
        text: base,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);

    setInput('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#f9fafb' }}>
          {t('chatbot.title')}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 13, color: '#9ca3af' }}>
          Cet assistant IA peut vous aider avec vos contrats, clients et statistiques.
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#020617',
        }}
      >
        {isInitialState ? (
          <InitialState suggested={suggested} onSelect={handleSend} />
        ) : (
          <ChatMessages messages={messages} />
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          placeholder={t('chatbot.inputPlaceholder')}
        />
      </View>
    </View>
  );
}

type InitialProps = {
  suggested: string[];
  onSelect: (value: string) => void;
};

function InitialState({ suggested, onSelect }: InitialProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 4 }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '100%', gap: 10 }}>
          {suggested.map((q) => (
            <Pressable
              key={q}
              onPress={() => onSelect(q)}
              style={{
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                backgroundColor: '#020617',
                borderWidth: 1,
                borderColor: '#1f2937',
              }}
            >
              <Text style={{ fontSize: 13, color: '#e5e7eb' }}>{q}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

type MessagesProps = {
  messages: ChatMessage[];
};

function ChatMessages({ messages }: MessagesProps) {
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingBottom: 16, paddingTop: 8, rowGap: 8 }}
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
              borderRadius: 18,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: msg.sender === 'user' ? '#22c55e' : '#111827',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: msg.sender === 'user' ? '#f9fafb' : '#e5e7eb',
              }}
            >
              {msg.text}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
};

function ChatInput({ value, onChange, onSend, placeholder }: ChatInputProps) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#111827',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 8,
          borderRadius: 999,
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: '#020617',
          borderWidth: 1,
          borderColor: '#1f2937',
        }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSend}
          style={{
            flex: 1,
            fontSize: 13,
            color: '#f9fafb',
            paddingVertical: 2,
          }}
        />
        <Pressable onPress={onSend}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#22c55e',
            }}
          >
            Envoyer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

