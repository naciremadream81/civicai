"use client";

/**
 * RoleContext - Global role management for Permit Management App
 * 
 * Provides role state ('admin' | 'citizen') and toggle function
 * to switch between roles throughout the application.
 */

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "citizen";

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");

  const toggleRole = () => {
    setRoleState((prev) => (prev === "admin" ? "citizen" : "admin"));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
