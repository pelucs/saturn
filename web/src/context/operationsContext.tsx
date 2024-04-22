'use client'

import { api } from "@/lib/axios";
import { User } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { IOperations } from "@/utils/operationsType";
import { ReactNode, createContext, useEffect, useState } from "react";

import Cookie from "js-cookie";
import React from "react";

interface OperationsContextProviderProps{
  children: ReactNode;
}

interface OperationsServicesContext{
  operations: IOperations[];
}

export const OperationsContext = createContext({} as OperationsServicesContext);

export function OperationsContextProvider({ children }: OperationsContextProviderProps){

  const [operations, setOperations] = useState<IOperations[]>([]);
  
  useEffect(() => {
    const fetchOperations = async () => {
      try {

        // Resgatando token
        const token = Cookie.get('token');

        if(!token){
          throw new Error('Unauthenticated!')
        }

        // Decodificando o token
        const user: User = jwtDecode(token);

        // Resgatando as operações
        const response = await api.get(`/operations/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOperations(response.data);
      } catch (error) {
        console.error("Erro ao buscar operações:", error);
      }
    };

    fetchOperations();
  }, []);

  return(
    <OperationsContext.Provider value={{ operations }}>
      {children}
    </OperationsContext.Provider>
  );
}