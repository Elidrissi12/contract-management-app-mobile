import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTranslation } from '@/i18n';
import { Client, fetchClientById } from '@/store/clients';

export default function EditClientScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [original, setOriginal] = useState<Client | null>(null);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!id) return;
      try {
        const client = await fetchClientById(String(id));
        if (isActive) {
          setOriginal(client);
          if (client) {
            setForm({
              nom: client.nom,
              email: client.email,
              telephone: client.telephone ?? '',
            });
          }
        }
      } catch {
        if (isActive) {
          setOriginal(null);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (!original) {
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
          Client introuvable
        </Text>
        <Text
          onPress={() => router.back()}
          style={{ fontSize: 14, color: '#2563eb', textDecorationLine: 'underline' }}
        >
          Retour aux clients
        </Text>
      </View>
    );
  }

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.nom || !form.email) {
      Alert.alert(
        'Champs manquants',
        'Merci de renseigner au minimum le nom et l’email.',
      );
      return;
    }

    // TODO: implémenter l'appel PUT /api/Clients/{id} côté backend
    router.replace('/clients');
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
          Modifier le client
        </Text>
        <Text style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>{original.nom}</Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 4, rowGap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Nom"
          value={form.nom}
          onChangeText={(v) => handleChange('nom', v)}
          placeholder="Nom du client"
        />

        <Field
          label="Email"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          placeholder="email@exemple.com"
        />

        <Field
          label="Téléphone"
          value={form.telephone}
          onChangeText={(v) => handleChange('telephone', v)}
          placeholder="+33 ..."
        />

        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            columnGap: 8,
          }}
        >
          <Pressable
            onPress={handleSave}
            style={{
              flex: 1,
              borderRadius: 999,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2563eb',
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
};

function Field({ label, value, onChangeText, placeholder }: FieldProps) {
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
        style={{
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          fontSize: 14,
          color: '#0f172a',
        }}
      />
    </View>
  );
}

