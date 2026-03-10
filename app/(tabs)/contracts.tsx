import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from '@/i18n';
import { Contract, ContractStatus, getContracts } from '@/store/contracts';

const statusColors: Record<ContractStatus, string> = {
  Actif: '#16a34a',
  Expiré: '#dc2626',
  'En Attente': '#d97706',
};

export default function ContractsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const contracts = useMemo(() => getContracts(), []);

  const filtered = useMemo(
    () =>
      contracts.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.numero.toLowerCase().includes(q) ||
          c.client.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
        );
      }),
    [contracts, query],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#020617' }}>
          {t('contracts.title')}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>
          {t('contracts.listTitle')}
        </Text>
      </View>

      {/* Search */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 8,
        }}
      >
        <TextInput
          placeholder={t('contracts.number')}
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
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((contract) => (
          <ContractRow key={contract.id} contract={contract} />
        ))}
      </ScrollView>
    </View>
  );
}

type RowProps = {
  contract: Contract;
};

function ContractRow({ contract }: RowProps) {
  const color = statusColors[contract.statut];

  return (
    <Link href={{ pathname: '/contracts/[id]', params: { id: String(contract.id) } }} asChild>
      <Pressable
        style={{
          marginBottom: 10,
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: '#ffffff',
          shadowColor: '#0f172a',
          shadowOpacity: 0.04,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#020617' }}>
            {contract.numero}
          </Text>
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 3,
              backgroundColor: `${color}20`,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color }}>{contract.statut}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 13, color: '#0f172a' }}>{contract.client}</Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
          }}
        >
          <Text style={{ fontSize: 11, color: '#64748b' }}>
            {contract.type} · {contract.montant}
          </Text>
          <Text style={{ fontSize: 11, color: '#64748b' }}>
            {new Date(contract.debut).toLocaleDateString('fr-FR')} →{' '}
            {new Date(contract.fin).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

