'use client'

import Image from "next/image";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContext } from "react";
import { OperationsContext } from "@/context/operationsContext";
import { FormatDate } from "@/components/FormatDate";

interface RecentOperationsProps{
  avatarUrl: string;
}

export function RecentOperations({ avatarUrl }: RecentOperationsProps){

  const { operations } = useContext(OperationsContext);

  return(
    <div className="p-5 flex flex-col gap-5 rounded-xl border">
      <h1 className="text-base font-semibold">Operações recentes</h1>
      
      <div className="space-y-4">
        {operations.slice(0, 4).map(operation => (
          <div key={operation.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image 
                width={40}
                height={40}
                src={avatarUrl}
                alt="Foto de perfil"
                className="rounded-full"
              />

              <div>
                <h1 className="font-medium leading-tight">
                  {operation.description}
                </h1>

                <span className="text-muted-foreground text-xs">
                  <FormatDate date={operation.dateAt}/>
                </span>
              </div>
            </div>

            <span className={operation.type === "entrada" ? "text-green-500" : "text-red-500"}>
              <span>
                {operation.type === "entrada" ? "+" : "-"}
              </span>
              
              R${operation.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}