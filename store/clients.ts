import { API_BASE_URL } from '@/constants/api';

export type Client = {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  contrats: number;
};

type ClientApiDto = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
};

export async function createClient(input: {
  nom: string;
  email: string;
  telephone?: string;
  company?: string;
}): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/api/Clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: input.nom,
      email: input.email,
      phone: input.telephone ?? null,
      company: input.company ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du client');
  }

  const created = (await response.json()) as string;

  return {
    id: created,
    nom: input.nom,
    email: input.email,
    telephone: input.telephone,
    contrats: 0,
  };
}

export async function fetchClientById(id: string): Promise<Client | null> {
  const response = await fetch(`${API_BASE_URL}/api/Clients/${id}`);
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Erreur lors du chargement du client');
  }

  const item = (await response.json()) as ClientApiDto;

  return {
    id: item.id ?? id,
    nom: item.name ?? '',
    email: item.email ?? '',
    telephone: item.phone ?? undefined,
    contrats: 0,
  };
}

export async function fetchClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE_URL}/api/Clients`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des clients');
  }

  const data = (await response.json()) as ClientApiDto[];

  return data.map((item) => ({
    id: item.id ?? '',
    nom: item.name ?? '',
    email: item.email ?? '',
    telephone: item.phone ?? undefined,
    contrats: 0,
  }));
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Clients/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 404) {
    throw new Error('Erreur lors de la suppression du client');
  }
}

