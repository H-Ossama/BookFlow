import { createContext, useContext } from 'react';

const TenantContext = createContext<any>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  return <TenantContext.Provider value={{}}>{children}</TenantContext.Provider>;
}

export const useTenantContext = () => useContext(TenantContext);
