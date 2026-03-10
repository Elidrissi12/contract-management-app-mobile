export type ContractStatus = 'Actif' | 'Expiré' | 'En Attente';

export type Contract = {
  id: number;
  numero: string;
  client: string;
  type: string;
  debut: string; 
  fin: string; 
  montant: string;
  statut: ContractStatus;
};

export const mockContracts: Contract[] = [
  {
    id: 1,
    numero: 'CTR-2024-001',
    client: 'Entreprise ABC',
    type: 'Service',
    debut: '2024-01-15',
    fin: '2025-01-15',
    montant: '50,000 €',
    statut: 'Actif',
  },
  {
    id: 2,
    numero: 'CTR-2024-002',
    client: 'Société XYZ',
    type: 'Fourniture',
    debut: '2024-02-01',
    fin: '2024-12-31',
    montant: '75,000 €',
    statut: 'Actif',
  },
  {
    id: 3,
    numero: 'CTR-2024-003',
    client: 'Client DEF',
    type: 'Consultation',
    debut: '2023-06-01',
    fin: '2024-05-31',
    montant: '25,000 €',
    statut: 'Expiré',
  },
  {
    id: 4,
    numero: 'CTR-2024-004',
    client: 'Partenaire GHI',
    type: 'Service',
    debut: '2024-04-10',
    fin: '2024-10-10',
    montant: '60,000 €',
    statut: 'En Attente',
  },
  {
    id: 5,
    numero: 'CTR-2024-005',
    client: 'Client JKL',
    type: 'Maintenance',
    debut: '2024-03-15',
    fin: '2025-03-15',
    montant: '40,000 €',
    statut: 'Actif',
  },
];

export function getContracts(): Contract[] {
  return mockContracts;
}

export function getContractById(id: number): Contract | null {
  return mockContracts.find((contract) => contract.id === id) ?? null;
}

