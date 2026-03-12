import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { useAppContext } from '@/context/AppContext';
import { getProfile, updateProfile } from '@/store/profile';

type SettingsTab = 'profile' | 'theme' | 'ai';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { themeMode, setThemeMode, language, setLanguage } = useAppContext();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState(() => getProfile());

  const handleSaveProfile = () => {
    updateProfile(profile);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#020617' }}>
          {t('settings.title')}
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          columnGap: 12,
          paddingHorizontal: 20,
          marginBottom: 8,
        }}
      >
        <TabChip
          label={t('settings.profileTab')}
          active={activeTab === 'profile'}
          onPress={() => setActiveTab('profile')}
        />
        <TabChip
          label={t('settings.themeTab')}
          active={activeTab === 'theme'}
          onPress={() => setActiveTab('theme')}
        />
        <TabChip
          label={t('settings.aiTab')}
          active={activeTab === 'ai'}
          onPress={() => setActiveTab('ai')}
        />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' && (
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
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#020617', marginBottom: 4 }}>
              {t('settings.personalInfoTitle')}
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
              {t('settings.personalInfoSubtitle')}
            </Text>

            <Field
              label={t('settings.fullName')}
              value={profile.fullName}
              onChangeText={(fullName) => setProfile((p) => ({ ...p, fullName }))}
            />
            <Field
              label={t('settings.email')}
              value={profile.email}
              onChangeText={(email) => setProfile((p) => ({ ...p, email }))}
            />
            <Field
              label={t('settings.company')}
              value={profile.company}
              onChangeText={(company) => setProfile((p) => ({ ...p, company }))}
            />

            <View style={{ marginTop: 16 }}>
              <Pressable
                onPress={handleSaveProfile}
                style={{
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
          </View>
        )}

        {activeTab === 'theme' && (
          <View
            style={{
              borderRadius: 18,
              backgroundColor: '#ffffff',
              padding: 16,
              rowGap: 16,
              shadowColor: '#0f172a',
              shadowOpacity: 0.04,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#020617', marginBottom: 8 }}>
                {t('settings.themeMode')}
              </Text>
              <View style={{ flexDirection: 'row', columnGap: 8 }}>
                <OptionChip
                  label={t('settings.themeSystem')}
                  active={themeMode === 'system'}
                  onPress={() => setThemeMode('system')}
                />
                <OptionChip
                  label={t('settings.themeLight')}
                  active={themeMode === 'light'}
                  onPress={() => setThemeMode('light')}
                />
                <OptionChip
                  label={t('settings.themeDark')}
                  active={themeMode === 'dark'}
                  onPress={() => setThemeMode('dark')}
                />
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#020617', marginBottom: 8 }}>
                {t('settings.language')}
              </Text>
              <View style={{ flexDirection: 'row', columnGap: 8 }}>
                <OptionChip
                  label={t('settings.languageFrench')}
                  active={language === 'fr'}
                  onPress={() => setLanguage('fr')}
                />
                <OptionChip
                  label={t('settings.languageEnglish')}
                  active={language === 'en'}
                  onPress={() => setLanguage('en')}
                />
              </View>
            </View>
          </View>
        )}

        {activeTab === 'ai' && (
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
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#020617', marginBottom: 4 }}>
              Assistant IA
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b' }}>
              Ici, tu pourras plus tard configurer le comportement de l’assistant IA (tonalité,
              niveau de détail, etc.).
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

type TabChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabChip({ label, active, onPress }: TabChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: active ? '#2563eb' : '#e5e7eb',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: active ? '#f9fafb' : '#111827',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type OptionChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function OptionChip({ label, active, onPress }: OptionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: active ? '#0f172a' : '#f3f4f6',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: active ? '#f9fafb' : '#111827',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
};

function Field({ label, value, onChangeText }: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#020617', marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: '#f9fafb',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          fontSize: 14,
          color: '#0f172a',
        }}
      />
    </View>
  );
}

