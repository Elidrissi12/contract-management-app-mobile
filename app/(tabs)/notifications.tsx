import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { useTranslation } from '@/i18n';
import {
  deleteNotification,
  getNotifications,
  NotificationItem,
} from '@/store/notifications';

type Filter = 'tous' | 'non-lues' | 'expiration';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('tous');
  const [notifs, setNotifs] = useState<NotificationItem[]>(() => getNotifications());

  const filteredNotifs = notifs.filter((notif) => {
    if (filter === 'non-lues') return !notif.lu;
    if (filter === 'expiration') return notif.type === 'expiration';
    return true;
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      'Supprimer la notification',
      'Voulez-vous vraiment supprimer cette notification ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteNotification(id);
            setNotifs([...getNotifications()]);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#020617' }}>
          {t('notifications.title')}
        </Text>
      </View>

      {/* Filters */}
      <View
        style={{
          flexDirection: 'row',
          columnGap: 8,
          paddingHorizontal: 20,
          marginBottom: 8,
        }}
      >
        
        <FilterChip
          label={t('notifications.all')}
          active={filter === 'tous'}
          onPress={() => setFilter('tous')}
        />
        <FilterChip
          label={`${t('notifications.unread')} (${notifs.filter((n) => !n.lu).length})`}
          active={filter === 'non-lues'}
          onPress={() => setFilter('non-lues')}
        />
        <FilterChip
          label={t('notifications.expirations')}
          active={filter === 'expiration'}
          onPress={() => setFilter('expiration')}
        />
      </View>

      {/* List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 4, rowGap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifs.length === 0 ? (
          <View
            style={{
              borderRadius: 18,
              backgroundColor: '#ffffff',
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#020617', marginBottom: 4 }}>
              {t('notifications.emptyTitle')}
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
              {t('notifications.emptyDescription')}
            </Text>
          </View>
        ) : (
          filteredNotifs.map((notif) => (
            <NotificationCard key={notif.id} notif={notif} onDelete={handleDelete} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function FilterChip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: active ? '#2563eb' : '#ffffff',
        borderWidth: 1,
        borderColor: active ? '#2563eb' : '#e2e8f0',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: active ? '#f9fafb' : '#0f172a',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type CardProps = {
  notif: NotificationItem;
  onDelete: (id: number) => void;
};

function NotificationCard({ notif, onDelete }: CardProps) {
  const priorityColor = (() => {
    switch (notif.priorite) {
      case 'haute':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'moyenne':
        return { bg: '#fef3c7', text: '#92400e' };
      default:
        return { bg: '#e5e7eb', text: '#4b5563' };
    }
  })();

  return (
    <View
      style={{
        borderRadius: 18,
        backgroundColor: notif.lu ? '#ffffff' : '#dbeafe',
        padding: 16,
        flexDirection: 'row',
        columnGap: 12,
        alignItems: 'flex-start',
        shadowColor: '#0f172a',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      {/* Left marker */}
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          backgroundColor: notif.lu ? '#cbd5f5' : '#2563eb',
          marginTop: 6,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: notif.lu ? '#6b7280' : '#111827',
            marginBottom: 4,
          }}
        >
          {notif.titre}
        </Text>
        <Text style={{ fontSize: 13, color: '#111827', marginBottom: 6 }}>{notif.message}</Text>
        <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: priorityColor.bg,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: priorityColor.text }}>
              {notif.priorite}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: '#6b7280' }}>
            {new Date(notif.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>

      <Pressable onPress={() => onDelete(notif.id)} style={{ padding: 4 }}>
        <Text style={{ fontSize: 12, color: '#9ca3af' }}>🗑</Text>
      </Pressable>
    </View>
  );
}

