// Utility functions for managing guest user IDs

export const generateGuestId = (): string => {
  // Generate a unique guest ID using timestamp and random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `guest_${timestamp}_${randomStr}`;
};

export const getOrCreateGuestId = (): string => {
  const existingId = localStorage.getItem('videmy-guest-id');
  
  if (existingId) {
    return existingId;
  }
  
  const newGuestId = generateGuestId();
  localStorage.setItem('videmy-guest-id', newGuestId);
  return newGuestId;
};

export const clearGuestId = (): void => {
  localStorage.removeItem('videmy-guest-id');
};

export const isGuestId = (id: string): boolean => {
  return id.startsWith('guest_');
};
