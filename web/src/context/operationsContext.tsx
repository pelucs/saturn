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
    const getOperations = async () => {
      try {
        // Resgatando token
        const token = Cookie.get('token');

        if(!token){
          throw new Error('Unauthenticated!')
        }

        // Decodificando o token
        const user: User = jwtDecode(token);

        const querystring = `startDate=2024-04-13&endDate=2024-04-21`;

        // Resgatando as operações
        const response = await api.get(`/operations/${user.sub}?${querystring}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOperations(response.data);
      } catch (error) {
        console.error("Erro ao buscar operações:", error);
      }
    };

    getOperations();
  }, []);

  return(
    <OperationsContext.Provider value={{ operations }}>
      {children}
    </OperationsContext.Provider>
  );
}