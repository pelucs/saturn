'use client'

import { api } from "@/lib/axios";
import { User } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { IOperations } from "@/utils/operationsType";
import { ReactNode, createContext, useEffect, useState } from "react";

import Cookie from "js-cookie";
import React from "react";
import { subDays } from "date-fns";
import { useRouter } from "next/navigation";

interface OperationsContextProviderProps{
  children: ReactNode;
}

interface IDate{
  from: Date;
  to: Date;
}

interface OperationsServicesContext{
  operations: IOperations[];
  updateFilteringDates: (newDate: IDate) => void;
}

export const OperationsContext = createContext({} as OperationsServicesContext);

export function OperationsContextProvider({ children }: OperationsContextProviderProps){

  const router = useRouter();

  const [operations, setOperations] = useState<IOperations[]>([]);
  const [filteringDates, setFilteringDates] = useState<IDate>({
    from: subDays(new Date(), (new Date().getDate() - 1)),
    to: new Date(),
  });
  
  useEffect(() => {
    const getOperations = async () => {
      try {
        // Resgatando token
        const token = Cookie.get('token');
        if(!token){
          throw new Error('Unauthenticated!')
        }

        // Verificando se o token expirou
        const tokenExpiration = jwtDecode(token).exp,
              currentTime = Math.floor(Date.now() / 1000);

        if(tokenExpiration && tokenExpiration < currentTime) {
          router.push("/");
          throw new Error('Token expired!');
        }
        
        // Transportar esse código para o DatePicker
        // Pegando datas para obter operações no intervalo dessas datas
        const getDatesFromLocalstorage = localStorage.getItem('filtering_dates');
        const date: { from: string, to: string } = getDatesFromLocalstorage 
        ? JSON.parse(getDatesFromLocalstorage) 
        : filteringDates;
        
        // Formatando as querystrings
        const querystring = `startDate=${date.from}&endDate=${date.to}`;

        // Decodificando o token
        const user: User = jwtDecode(token);

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
  }, [filteringDates]);

  const updateFilteringDates = (newDate: IDate) => {
    setFilteringDates(newDate);
  }

  return(
    <OperationsContext.Provider value={{ operations, updateFilteringDates  }}>
      {children}
    </OperationsContext.Provider>
  );
}