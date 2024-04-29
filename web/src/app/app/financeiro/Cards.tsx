'use client'

import { Button } from "@/components/ui/button";
import { DatePickerRange } from "@/components/DatePickerRange";
import { useContext, useEffect, useState } from "react";
import { OperationsContext, OperationsContextProvider } from "@/context/operationsContext";
import { 
  CircleMinus, 
  CirclePlus, 
  DollarSign, 
  Eye, 
  EyeOff, 
  ReceiptText 
} from "lucide-react";

export function Cards(){

  const { operations } = useContext(OperationsContext);

  const [displayAmount, setDisplayAmount] = useState<"hidden" | "visible">("hidden");

  const [total, setTotal] = useState<number>(0);
  const [inputs, setInputs] = useState<number[]>([]);
  const [outputs, setOutputs] = useState<number[]>([]);

  useEffect(() => {

    checkDisplayAmount(); 

    // Filtra as operações de entrada e saída
    const inputAmounts = operations.filter(operation => operation.type === "entrada").map(operation => operation.amount);
    const outputAmounts = operations.filter(operation => operation.type !== "entrada").map(operation => operation.amount);
  
    const totalInput = inputAmounts.reduce((a, b) => a + b, 0);
    const totalOutput = outputAmounts.reduce((a, b) => a + b, 0); 

    setTotal(totalInput - totalOutput);
    setInputs(inputAmounts);
    setOutputs(outputAmounts);
  }, [operations]);

  // Verificando o display dos amounts (Preferência do usuário: "Visível ou Oculto")
  const checkDisplayAmount = () => {
    const checkFromLocalstorage = localStorage.getItem("amounts_display");

    if(checkFromLocalstorage){
      setDisplayAmount(
        checkFromLocalstorage === "hidden" ? "hidden" : "visible"
      );
    }
  }

  const handleDisplayAmount = () => {
    setDisplayAmount(displayAmount === "hidden" ? "visible" : "hidden");
    localStorage.setItem("amounts_display", displayAmount === "hidden" ? "visible" : "hidden");
  }

  return(
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="w-9 h-9 p-0"
            onClick={handleDisplayAmount}
          >
            {displayAmount === "hidden" ? (
              <Eye className="w-4 h-4"/>
            ) : (
              <EyeOff className="w-4 h-4"/>
            )}
          </Button>

          <OperationsContextProvider>
            <DatePickerRange/>
          </OperationsContextProvider>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Valor final</span>

            <DollarSign className="w-5 h-5"/>
          </div>

          <div className="mt-3">
            {displayAmount === "hidden" ? (
              <span className="w-40 h-6 rounded bg-secondary block"/>
            ) : (
              <h1 className="text-2xl font-bold leading-none">
                R${total.toFixed(2)}
              </h1>
            )}

            <span className="text-xs text-muted-foreground">(de acordo com filtro)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Entradas</span>

            <CirclePlus className="w-5 h-5 text-green-500"/>
          </div>

          <div className="mt-3">
            {displayAmount === "hidden" ? (
              <span className="w-40 h-6 rounded bg-secondary block"/>
            ) : (
              <h1 className="text-green-500 text-2xl font-bold leading-none">
                R${inputs.reduce((a, b) => a + b, 0).toFixed(2)}
              </h1>
            )}

            <span className="text-xs text-muted-foreground">(de acordo com filtro)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Saídas</span>

            <CircleMinus className="w-5 h-5 text-red-500"/>
          </div>

          <div className="mt-3">
            {displayAmount === "hidden" ? (
              <span className="w-40 h-6 rounded bg-secondary block"/>
            ) : (
              <h1 className="text-red-500 text-2xl font-bold leading-none">
                R${outputs.reduce((a, b) => a + b, 0).toFixed(2)}
              </h1>
            )}

            <span className="text-xs text-muted-foreground">(de acordo com filtro)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border">
          <div className="flex items-center justify-between">
            <span className="font-medium">Contas registradas</span>

            <ReceiptText className="w-5 h-5"/>
          </div>

          <div className="mt-3">
            <h1 className="text-2xl font-bold leading-none">
              {operations.length}
            </h1>

            <span className="text-xs text-muted-foreground">(de acordo com filtro)</span>
          </div>
        </div>
      </div>
    </div>
  );
}