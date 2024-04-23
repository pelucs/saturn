"use client"

import { format } from 'date-fns';
import { operations } from '@/lib/operations';
import { useContext, useEffect, useState } from 'react';
import { 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  CartesianGrid,
  ResponsiveContainer, 
} from 'recharts';
import { OperationsContext } from '@/context/operationsContext';

interface OperationTypeChart{
  name: string; // Data
  input: string; // Entradas
  output: string; // Saídas
}

export function Chart(){

  const data = [
    {
      "name": "Semana 1",
      "Entrada": 4000,
      "Saída": 2400
    },
    {
      "name": "Page B",
      "Entrada": 3000,
      "Saída": 1398
    },
    {
      "name": "Page C",
      "Entrada": 2000,
      "Saída": 9800
    },
    {
      "name": "Page D",
      "Entrada": 2780,
      "Saída": 3908
    },
    {
      "name": "Page E",
      "Entrada": 1890,
      "Saída": 4800
    },
    {
      "name": "Page F",
      "Entrada": 2390,
      "Saída": 3800
    },
    {
      "name": "Page G",
      "Entrada": 3490,
      "Saída": 4300
    }
  ];

  return(
    <ResponsiveContainer width="95%" height={250}>
      <BarChart data={data}>
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
          dataKey="Entrada" 
          radius={[4, 4, 0, 0]}
          className="fill-green-500" 
        />
        <Bar 
          dataKey="Saída" 
          radius={[4, 4, 0, 0]}
          className="fill-red-500" 
        />
        <Tooltip cursor={false}/>
      </BarChart>
    </ResponsiveContainer>
  );
}