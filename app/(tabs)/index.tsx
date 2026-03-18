import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { fetchContracts } from '@/store/contracts';
import { useEffect, useState } from 'react';

const alertes = [
  { id: 1, contrat: 'Contrat A-2024-001', client: 'Client ABC', expiration: '5 jours', priorite: 'haute' },
  { id: 2, contrat: 'Contrat B-2024-002', client: 'Client XYZ', expiration: '10 jours', priorite: 'moyenne' },
  { id: 3, contrat: 'Contrat C-2024-003', client: 'Client DEF', expiration: '15 jours', priorite: 'basse' },
];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [expired, setExpired] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const contracts = await fetchContracts();
        if (!isActive) return;

        const totalCount = contracts.length;
        const activeCount = contracts.filter((c) => c.statut === 'Actif').length;
        const expiredCount = contracts.filter((c) => c.statut === 'Expiré').length;
        const pendingCount = contracts.filter((c) => c.statut === 'En Attente').length;

        setTotal(totalCount);
        setActive(activeCount);
        setExpired(expiredCount);
        setPending(pendingCount);
      } catch {
        // en cas d'erreur, on garde les compteurs à 0
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
    >
      {/* Header */}
      <View
        className="px-4 pt-12 pb-4"
        style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 12 }}
      >
        <Text
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase"
          style={{ fontSize: 12, fontWeight: '600', color: '#64748b' }}
        >
          {t('common.appName')}
        </Text>
        <Text
          className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50"
          style={{ marginTop: 4, fontSize: 24, fontWeight: '700', color: '#020617' }}
        >
          {t('navigation.dashboard')}
        </Text>
        <Text
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
          style={{ marginTop: 4, fontSize: 14, color: '#64748b' }}
        >
          {t('dashboard.expiringSoon')}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat cards */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: 12,
            rowGap: 12,
            marginBottom: 24,
          }}
        >
          <DashboardCard
            label={t('dashboard.totalContracts')}
            value={String(total)}
            description={t('dashboard.allContracts')}
            tone="primary"
            icon="document-text-outline"
          />
          <DashboardCard
            label={t('dashboard.activeContracts')}
            value={String(active)}
            description={t('dashboard.inProgress')}
            tone="success"
            icon="trending-up-outline"
          />
          <DashboardCard
            label={t('dashboard.expiredContracts')}
            value={String(expired)}
            description={t('dashboard.toRenew')}
            tone="danger"
            icon="warning-outline"
          />
          <DashboardCard
            label={t('dashboard.pendingContracts')}
            value={String(pending)}
            description={t('dashboard.forSignature')}
            tone="warning"
            icon="time-outline"
          />
        </View>

        {/* Alerts section */}
        <View
          style={{
            borderRadius: 16,
            backgroundColor: '#ffffff',
            padding: 16,
            shadowColor: '#0f172a',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8, marginBottom: 8 }}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#020617' }}>
              {t('dashboard.expiringSoon')}
            </Text>
          </View>

          {alertes.map((alerte) => (
            <View
              key={alerte.id}
              style={{
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                backgroundColor: '#f8fafc',
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#020617' }}>
                  {alerte.contrat}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{alerte.client}</Text>
              </View>

              <View style={{ alignItems: 'flex-end', rowGap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#b91c1c' }}>
                  {`Expire dans ${alerte.expiration}`}
                </Text>
                <View
                  style={{
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      alerte.priorite === 'haute'
                        ? '#fee2e2'
                        : alerte.priorite === 'moyenne'
                        ? '#fef3c7'
                        : '#e5e7eb',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151' }}>{alerte.priorite}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type DashboardCardProps = {
  label: string;
  value: string;
  description: string;
  tone?: 'primary' | 'success' | 'danger' | 'warning';
  icon?: keyof typeof Ionicons.glyphMap;
};

function DashboardCard({ label, value, description, tone = 'primary' }: DashboardCardProps) {
  const toneClasses: Record<
    NonNullable<DashboardCardProps['tone']>,
    { badge: string; accent: string }
  > = {
    primary: {
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
      accent: 'text-blue-600 dark:text-blue-300',
    },
    success: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
      accent: 'text-emerald-600 dark:text-emerald-300',
    },
    danger: {
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
      accent: 'text-rose-600 dark:text-rose-300',
    },
    warning: {
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
      accent: 'text-amber-600 dark:text-amber-300',
    },
  };

  const { badge, accent } = toneClasses[tone];

  return (
    <View
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 16,
        shadowColor: '#0f172a',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <View style={{ marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>
      <Text className={`text-3xl font-bold tracking-tight ${accent}`}>{value}</Text>
      <Text style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{description}</Text>
    </View>
  );
}

