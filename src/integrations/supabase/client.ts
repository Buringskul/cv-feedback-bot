// Mock Supabase client for UI-only development (Sprint 4)

const mockQuery = {
  select: async () => ({ data: [], error: null }),
  insert: async () => ({ data: null, error: null }),
  update: async () => ({ data: null, error: null }),
  delete: async () => ({ data: null, error: null }),
};

export const supabase = {
  from: () => mockQuery,
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
};
