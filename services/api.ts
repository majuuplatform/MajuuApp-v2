export const apiService = {
  get: async (path: string) => {
    return Promise.resolve({ path, status: 'placeholder' });
  },
};
