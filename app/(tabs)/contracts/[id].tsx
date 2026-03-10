import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { getContractById } from '@/store/contracts';

export default function ContractDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { t } = useTranslation();

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

        {/* Placeholder for future chatbot / notes */}
        <View
          style={{
            borderRadius: 18,
            backgroundColor: '#0f172a',
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#e5e7eb', marginBottom: 4 }}>
            Assistant IA (bientôt)
          </Text>
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            Cet espace accueillera un mini chatbot dédié à ce contrat, adapté de la version web.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

