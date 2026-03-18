import { API_BASE_URL } from '@/constants/api';

export type ContractStatus = 'Actif' | 'Expiré' | 'En Attente';

export type Contract = {
  id: string;
  numero: string;
  client: string;
  type: string;
  debut: string;
  fin: string;
  montant: string;
  statut: ContractStatus;
};

type ContractApiDto = {
  id?: string;
  number?: string;
  title?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  status?: string;
};

export async function fetchContracts(): Promise<Contract[]> {
  const response = await fetch(`${API_BASE_URL}/api/Contracts`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des contrats');
  }

  const data = (await response.json()) as ContractApiDto[];

  return data.map((item) => ({
    id: item.id ?? '',
    numero: item.number ?? '',
    client: '', 
    type: item.title ?? '',
    debut: item.startDate ?? '',
    fin: item.endDate ?? '',
    montant: item.amount != null ? `${item.amount} €` : '',
    statut: (item.status as ContractStatus) ?? 'Actif',
  }));
}

export async function createContract(input: {
  titre: string;
  clientId: string;
  type: string;
  debut: string;
  fin: string;
  montant: string;
  description?: string;
}): Promise<void> {
  const amountValue = Number(input.montant.replace(',', '.'));

  const body = {
    number: '',
    title: input.titre,
    clientId: input.clientId,
    type: 0,
    startDate: input.debut,
    endDate: input.fin,
    amount: isNaN(amountValue) ? 0 : amountValue,
    description: input.description ?? null,
    pdfUrl: null,
  };

  const response = await fetch(`${API_BASE_URL}/api/Contracts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du contrat');
  }
}

