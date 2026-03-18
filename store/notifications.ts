export type NotificationType = 'expiration' | 'renouvellement' | 'signature' | 'succès' | 'info';

export type NotificationPriority = 'haute' | 'moyenne' | 'basse';

export type NotificationItem = {
  id: number;
  type: NotificationType;
  titre: string;
  message: string;
  priorite: NotificationPriority;
  date: string; 
  lu: boolean;
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'expiration',
    titre: 'Contrat expire dans 5 jours',
    message: 'Le contrat CTR-2024-001 avec Entreprise ABC expire le 15 janvier 2025.',
    priorite: 'haute',
    date: '2024-11-10',
    lu: false,
  },
  {
    id: 2,
    type: 'expiration',
    titre: 'Contrat expire dans 10 jours',
    message: 'Le contrat CTR-2024-002 avec Société XYZ expire bientôt.',
    priorite: 'moyenne',
    date: '2024-11-09',
    lu: false,
  },
  {
    id: 3,
    type: 'renouvellement',
    titre: 'Contrat à renouveler',
    message: 'Le contrat CTR-2024-003 avec Client DEF doit être renouvelé.',
    priorite: 'moyenne',
    date: '2024-11-08',
    lu: true,
  },
  {
    id: 4,
    type: 'signature',
    titre: 'Nouvelle signature requise',
    message: 'Le contrat CTR-2024-004 avec Partenaire GHI attend une signature.',
    priorite: 'haute',
    date: '2024-11-07',
    lu: false,
  },
  {
    id: 5,
    type: 'succès',
    titre: 'Contrat activé',
    message: 'Le contrat CTR-2024-005 avec Client JKL a été activé avec succès.',
    priorite: 'basse',
    date: '2024-11-06',
    lu: true,
  },
  {
    id: 6,
    type: 'info',
    titre: 'Mise à jour système',
    message: 'Une nouvelle fonctionnalité de gestion des contrats est maintenant disponible.',
    priorite: 'basse',
    date: '2024-11-05',
    lu: true,
  },
];

export function getNotifications(): NotificationItem[] {
  return mockNotifications;
}

export function deleteNotification(id: number): void {
  const index = mockNotifications.findIndex((n) => n.id === id);
  if (index === -1) return;
  mockNotifications.splice(index, 1);
}

