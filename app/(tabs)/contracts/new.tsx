import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@/i18n';
import { addContract, Contract, ContractStatus, getContracts } from '@/store/contracts';

const contractTypes = ['Service', 'Fourniture', 'Consultation', 'Maintenance'] as const;

export default function NewContractScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [form, setForm] = useState({
    titre: '',
    client: '',
    type: contractTypes[0],
    debut: '',
    fin: '',
    montant: '',
    description: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.titre || !form.client || !form.debut || !form.fin || !form.montant) {
      return;
    }

    const existing = getContracts();
    const nextId = (existing[existing.length - 1]?.id ?? 0) + 1;

    const newContract: Contract = {
      id: nextId,
      numero: `CTR-NEW-${nextId.toString().padStart(3, '0')}`,
      client: form.client,
      type: form.type,
      debut: form.debut,
      fin: form.fin,
      montant: `${form.montant} €`,
      statut: 'Actif' as ContractStatus,
    };

    addContract(newContract);
    router.replace('/contracts');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text
          onPress={() => router.back()}
          style={{ fontSize: 14, color: '#2563eb', marginBottom: 6 }}
        >
          ← {t('common.back')}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#020617' }}>
          Ajouter un contrat
        </Text>
        <Text style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>
          Renseignez les informations principales du contrat.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 4, rowGap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Titre du contrat"
          value={form.titre}
          onChangeText={(v) => handleChange('titre', v)}
          placeholder="Contrat de Services Informatiques"
        />

        <Field
          label="Client"
          value={form.client}
          onChangeText={(v) => handleChange('client', v)}
          placeholder="Nom du client"
        />

        <Field
          label="Type de contrat"
          value={form.type}
          onChangeText={(v) => handleChange('type', v)}
          placeholder="Service / Fourniture..."
        />

        <Field
          label="Date de début (YYYY-MM-DD)"
          value={form.debut}
          onChangeText={(v) => handleChange('debut', v)}
          placeholder="2024-01-15"
        />

        <Field
          label="Date de fin (YYYY-MM-DD)"
          value={form.fin}
          onChangeText={(v) => handleChange('fin', v)}
          placeholder="2025-01-15"
        />

        <Field
          label="Montant (€)"
          value={form.montant}
          onChangeText={(v) => handleChange('montant', v)}
          placeholder="50000"
          keyboardType="numeric"
        />

        <Field
          label="Description"
          value={form.description}
          onChangeText={(v) => handleChange('description', v)}
          placeholder="Détails principaux du contrat..."
          multiline
        />

        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            columnGap: 8,
          }}
        >
          <Pressable
            onPress={handleSubmit}
            style={{
              flex: 1,
              borderRadius: 999,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#16a34a',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#f9fafb' }}>
              {t('common.save')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
};

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType }: FieldProps) {
  return (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#020617', marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 10 : 8,
          minHeight: multiline ? 80 : undefined,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          fontSize: 14,
          color: '#0f172a',
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

