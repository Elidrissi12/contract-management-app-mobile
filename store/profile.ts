export type Profile = {
  fullName: string;
  email: string;
  company: string;
};

const profile: Profile = {
  fullName: 'abdou el idrissi',
  email: 'abdou.elidrissi@example.com',
  company: 'MobiArchitects',
};

export function getProfile(): Profile {
  return { ...profile };
}

export function updateProfile(partial: Partial<Profile>): void {
  Object.assign(profile, partial);
}

