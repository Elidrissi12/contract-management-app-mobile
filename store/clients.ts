export type Client = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  contrats: number;
};

export const mockClients: Client[] = [
  {
    id: 1,
    nom: 'Entreprise ABC',
    email: 'contact@abc.fr',
    telephone: '+33 1 23 45 67 89',
    contrats: 5,
  },
  {
    id: 2,
    nom: 'Société XYZ',
    email: 'info@xyz.fr',
    telephone: '+33 1 98 76 54 32',
    contrats: 3,
  },
  {
    id: 3,
    nom: 'Client DEF',
    email: 'hello@def.fr',
    telephone: '+33 2 11 22 33 44',
    contrats: 2,
  },
  {
    id: 4,
    nom: 'Partenaire GHI',
    email: 'support@ghi.fr',
    telephone: '+33 2 55 66 77 88',
    contrats: 4,
  },
  {
    id: 5,
    nom: 'Client JKL',
    email: 'business@jkl.fr',
    telephone: '+33 3 99 88 77 66',
    contrats: 1,
  },
];

export function getClients(): Client[] {
  return mockClients;
}

export function getClientById(id: number): Client | null {
  return mockClients.find((client) => client.id === id) ?? null;
}

export function addClient(client: Client): void {
  mockClients.push(client);
}

export function updateClient(id: number, partial: Partial<Client>): void {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index === -1) return;
  mockClients[index] = { ...mockClients[index], ...partial };
}

export function deleteClient(id: number): void {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index === -1) return;
  mockClients.splice(index, 1);
}


