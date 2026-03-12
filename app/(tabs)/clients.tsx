import { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';

import { useTranslation } from '@/i18n';
import { Client, deleteClient, getClients } from '@/store/clients';

export default function ClientsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);

  useFocusEffect(
    useCallback(() => {
      setClients(getClients());
    }, []),
  );

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return c.nom.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 48,
          paddingHorizontal: 20,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#020617' }}>
            {t('clients.title')}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>
            Liste de vos clients principaux.
          </Text>
        </View>
        <Link href="/clients/new" asChild>
          <Pressable
            style={{
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: '#2563eb',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#f9fafb' }}>+ Ajouter</Text>
          </Pressable>
        </Link>
      </View>

      {/* Search */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 8,
        }}
      >
        <TextInput
          placeholder="Rechercher par nom ou email..."
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={setQuery}
          style={{
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            fontSize: 14,
            color: '#0f172a',
          }}
        />
      </View>

      {/* List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8, rowGap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onDeleted={() => setClients(getClients())}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type CardProps = {
  client: Client;
  onDeleted: () => void;
};

function ClientCard({ client, onDeleted }: CardProps) {
  const handleMail = () => {
    Linking.openURL(`mailto:${client.email}`).catch(() => {});
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${client.telephone}`).catch(() => {});
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le client',
      `Supprimer ${client.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteClient(client.id);
            onDeleted();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View
      style={{
        borderRadius: 18,
        backgroundColor: '#ffffff',
        padding: 16,
        shadowColor: '#0f172a',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#020617', marginBottom: 6 }}>
        {client.nom}
      </Text>

      <View style={{ marginBottom: 8 }}>
        <Text
          onPress={handleMail}
          style={{ fontSize: 13, color: '#2563eb', marginBottom: 4 }}
        >
          {client.email}
        </Text>
        <Text
          onPress={handlePhone}
          style={{ fontSize: 13, color: '#0f172a' }}
        >
          {client.telephone}
        </Text>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          marginTop: 8,
          paddingTop: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, color: '#64748b' }}>
          {client.contrats} contrat{client.contrats > 1 ? 's' : ''}
        </Text>
        <View style={{ flexDirection: 'row', columnGap: 8 }}>
          <Link href={{ pathname: '/clients/[id]', params: { id: String(client.id) } }} asChild>
            <Pressable>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#2563eb' }}>Modifier</Text>
            </Pressable>
          </Link>
          <Pressable onPress={handleDelete}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#dc2626' }}>Supprimer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

