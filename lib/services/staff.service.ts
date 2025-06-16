import { UserRecord } from 'firebase-admin/auth';

import { Staff, StaffPayload } from '@/types/staff';

import { auth } from '../firebase-admin';

const userToStaff = (user: UserRecord): Staff => {
  return {
    id: user.uid,
    displayName: user.displayName || '',
    email: user.email || '',
    role: user.customClaims?.role,
    disabled: user.disabled || false,
    createdAt: user.metadata.creationTime!,
  };
}

export const createStaff = async (userData: StaffPayload) => {
  const userRecord = await auth.createUser(userData);
  await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });

  return userToStaff(userRecord);
}

export const getStaffs = async () => {
  const listUsersResult = await auth.listUsers();
  return listUsersResult.users.map(userToStaff);
}

export const getStaff = async (uid: string) => {
  const userRecord = await auth.getUser(uid);
  return userToStaff(userRecord);
}

export const updateStaff = async (uid: string, userData: Partial<StaffPayload>) => {
  const userRecord = await auth.updateUser(uid, userData);
  if (userData.role) {
    await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });
  }
}

export const deleteStaff = async (uid: string) => {
  await auth.deleteUser(uid);
}