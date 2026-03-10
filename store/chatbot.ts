export type ChatSender = 'user' | 'bot';

export type ChatMessage = {
  id: number;
  sender: ChatSender;
  text: string;
};

export const suggestedQuestions: string[] = [
  'Quels contrats expirent bientôt ?',
  'Montant total des contrats actifs',
  'Combien de contrats avons-nous ?',
  'Liste des clients premium',
  'Résumé du mois',
];

export const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: "Bienvenue ! Je suis votre Assistant IA pour la gestion des contrats. Comment puis-je vous aider ?",
  },
];

const botResponses: Record<string, string> = {
  'Quels contrats expirent bientôt ?':
    'Basé sur nos données, 3 contrats expirent dans les 30 prochains jours : CTR-2024-001 (5 jours), CTR-2024-002 (10 jours), et CTR-2024-003 (15 jours).',
  'Montant total des contrats actifs':
    'Le montant total des contrats actifs est de 258,000 €. Cela comprend 8 contrats en cours répartis entre 5 clients.',
  'Combien de contrats avons-nous ?':
    'Vous avez actuellement 42 contrats au total : 33 actifs, 5 expirés et 4 en attente de signature.',
  'Liste des clients premium':
    'Vos clients avec les contrats les plus importants sont : Entreprise ABC (50,000 €), Société XYZ (75,000 €), et Partenaire GHI (60,000 €).',
  'Résumé du mois':
    "En ce moment, vous avez 33 contrats actifs et 3 renouvellements à prévoir. Aucun nouveau contrat n'a été signé ce mois-ci.",
};

const defaultBotFallback =
  "C'est une excellente question. Je suis capable de vous aider avec les informations sur vos contrats, clients et statistiques. N'hésitez pas à me poser une autre question !";

export function getInitialChatMessages(): ChatMessage[] {
  return initialMessages;
}

export function getSuggestedQuestions(): string[] {
  return [...suggestedQuestions];
}

export function getBotResponse(input: string): string {
  return botResponses[input] ?? defaultBotFallback;
}

