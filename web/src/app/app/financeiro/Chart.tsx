"use client"

import { useContext, useEffect, useState } from 'react';
import { 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  CartesianGrid,
  ResponsiveContainer,
  Legend, 
} from 'recharts';
import { OperationsContext } from '@/context/operationsContext';

interface OperationTypeChart{
  name: string;
  entrada: string; 
  saida: string;
}

export function Chart(){

  const { operations } = useContext(OperationsContext);

  const [operationChartData, setOperationChartData] = useState<OperationTypeChart[]>([]);

  useEffect(() => {

    // Função para agrupar e somar as operações por data
    const groupAndSumOperationsByDate = () => {
      const operationSum: Record<string, { inputs: number, outputs: number }> = {};

      operations.forEach(operation => {
        const date = new Date(operation.dateAt).toLocaleDateString();
        const amount = operation.amount;

        if (!operationSum[date]) {
          operationSum[date] = {
            inputs: 0,
            outputs: 0
          };
        }

        if (operation.type === 'entrada') {
          operationSum[date].inputs += amount;
        } else {
          operationSum[date].outputs += amount;
        }
      });
      
      return operationSum;
    };

    // Agrupar e somar as operações por data
    const operationSumByDate = groupAndSumOperationsByDate();

    // Transformar os dados no formato necessário para o gráfico
    const chartData: OperationTypeChart[] = Object.entries(operationSumByDate).map(([date, { inputs, outputs }]) => ({
      name: date,
      entrada: inputs.toString(),
      saida: outputs.toString(),
    }));

    
    setOperationChartData(chartData);
  }, [operations]); 

  return(
    <div>
      {operationChartData.length > 0 ? (
        <ResponsiveContainer width="95%" height={250}>
          <BarChart data={operationChartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={.3}/>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
            />
            <YAxis
              stroke="#888888"
              fontSize={12} 
            />
            <Bar 
              dataKey="entrada" 
              radius={[4, 4, 0, 0]}
              className="fill-green-500" 
            />
            <Bar 
              dataKey="saida" 
              radius={[4, 4, 0, 0]}
              className="fill-red-500" 
            />
            <Tooltip cursor={false}/>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-60 flex items-center justify-center">
          <span className="text-muted-foreground">Nenhuma operação registrada</span>
        </div>
      )}
    </div>
  );
}