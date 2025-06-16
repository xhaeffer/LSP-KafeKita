export type StaffRole = 'admin' | 'cashier' | 'kitchen';

export type Staff = {
  id: string;
  displayName: string;
  email: string;
  role: StaffRole;
  disabled?: boolean;
  createdAt: string;
}

export type StaffProfile = Omit<Staff, 'createdAt' | 'updatedAt'>

export type StaffPayload = Omit<StaffProfile, 'id'> & {
  password: string;
};