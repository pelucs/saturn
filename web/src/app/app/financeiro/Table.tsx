'use client'

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { OverviewOperation } from "./OverviewOperation";
import { useContext } from 'react';
import { OperationsContext } from '@/context/operationsContext';
import { FormatDate } from '@/components/FormatDate';
import { EditOperation } from "./EditOperation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export function TableOperations(){

  const { operations } = useContext(OperationsContext);

  return(
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {operations.length > 0 ? (
            operations.map(operation => (
              <TableRow key={operation.id}>
                <TableCell>
                  {operation.description}
                </TableCell>

                 <TableCell className={operation.type === "entrada" ? "text-green-500" : "text-red-500"}>
                  {operation.type === "entrada" ? "Entrada" : "Saída"}
                </TableCell>

                <TableCell className={operation.type === "entrada" ? "text-green-500" : "text-red-500"}>
                  <span>
                    {operation.type === "entrada" ? "+" : "-"}
                  </span>
                  
                  R${operation.amount.toFixed(2)}
                </TableCell>

                <TableCell>
                  <FormatDate date={operation.dateAt}/>
                </TableCell>

                <TableCell className="text-right">
                  <div className="float-end flex items-center gap-2">
                    <OverviewOperation operation={operation}/>
                    <EditOperation operation={operation}/>
                    <Button 
                      size={"icon"}
                      variant={'outline'} 
                      onClick={() => alert("Clicou")} 
                      className="size-7 p-0 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-60 text-muted-foreground text-center">
                Nenhuma operação registrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
    </div>
  );
}