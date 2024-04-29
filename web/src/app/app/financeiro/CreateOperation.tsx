'use client'

import Cookies from 'js-cookie';

import { z } from 'zod';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/DatePicker";
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogOverlay, 
  DialogPortal, 
  DialogTrigger 
} from "@/components/ui/dialog";

const formSchema = z.object({
  type: z.string().nonempty("Insira o tipo da operação"),
  amount: z.string().nonempty("O valor deve ser no mínimo 1"),
  description: z.string().nonempty("Informe a descrição da sua operação"),
});

type IFormTypes = z.infer<typeof formSchema>;

interface CreateOperationProps{
  userId: string;
  type: string;
}

export function CreateOperation({ userId, type }: CreateOperationProps){

  const [dataOperation, setDataOperation] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<IFormTypes>({
    resolver: zodResolver(formSchema)
  });

  const createOperation = async (data: IFormTypes) => {
    if (dataOperation.length > 0) {
      const token = Cookies.get('token');
  
      try {
        const res = await api.post('/operations/create', {
          userId: userId,
          type: data.type,
          amount: data.amount,
          description: data.description,
          dateAt: dataOperation,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast("Operação criada com sucesso!", {
          description: `ID da operação: #${res.data.operationId}`,
          duration: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000)
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  return(
    <Dialog>
      {type === "text" ? (
        <Button asChild className="gap-1">
          <DialogTrigger>
            <CirclePlus className="w-4 h-4"/>

            Adicionar operação
          </DialogTrigger>
        </Button>
      ) : (
        <Button 
          asChild
          className="w-14 h-14 flex items-center justify-center rounded-full z-10 fixed bottom-5 right-5"
        >
          <DialogTrigger>
            <Plus className="w-6 h-6"/>
          </DialogTrigger>
        </Button>
      )}

      <DialogPortal>
        <DialogOverlay className="bg-background/10"/>

        <DialogContent>
          <form onSubmit={handleSubmit(createOperation)} className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Registrar operação</h1>

            <Separator/>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="">Descrição</label>
                <input 
                  placeholder="Ex: Salário"
                  {...register("description")}
                  className="py-3 px-4 rounded border bg-transparent"
                />

                {errors.description && (
                  <span className="text-sm text-red-500">*{errors.description.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="">Valor</label>
                <input 
                  type="number"
                  {...register("amount")}
                  placeholder="Insira o valor"
                  className="py-3 px-4 rounded border bg-transparent"
                />

                {errors.amount && (
                  <span className="text-sm text-red-500">*{errors.amount.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="">Tipo</label>
                
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor="entrada" 
                      className="text-xs uppercase text-muted-foreground"
                    >
                      Entrada
                    </label>

                    <input 
                      id="entrada" 
                      type="radio"
                      value="entrada"
                      {...register("type")} 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor="saida" 
                      className="text-xs uppercase text-muted-foreground"
                    >
                      Saída
                    </label>

                    <input 
                      id="saida" 
                      type="radio"
                      value="saida"
                      {...register("type")} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="">Data da operação</label>
                
                <DatePicker setDataOperation={setDataOperation}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant={'secondary'}>
                <DialogClose>
                  Cancelar
                </DialogClose>
              </Button>

              <Button type='submit'>
                Registrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}