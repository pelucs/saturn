'use client'

import Cookies from "js-cookie";

import { z } from "zod";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/DatePicker";
import { IOperations } from "@/utils/operationsType";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogOverlay, 
  DialogPortal, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface EditOperationProps{
  operation: IOperations;
}

const formSchema = z.object({
  type: z.string().nonempty("Insira o tipo da operação"),
  amount: z.string().nonempty("O valor deve ser no mínimo 1"),
  description: z.string().nonempty("Informe a descrição da sua operação"),
});

type IFormTypes = z.infer<typeof formSchema>;

export function EditOperation({ operation }: EditOperationProps){

  const [dataOperation, setDataOperation] = useState<string>(operation.dateAt);

  const { register, handleSubmit, formState: { errors } } = useForm<IFormTypes>({
    resolver: zodResolver(formSchema)
  });

  const updateOperation = async (data: IFormTypes) => {
    if (dataOperation.length > 0) {
      const token = Cookies.get('token');
  
      try {
        const res = await api.put(`/operation/${operation.id}`, {
          type: data.type,
          amount: data.amount,
          description: data.description,
          dateAt: dataOperation,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast("Operação atualizada com sucesso!", {
          description: `ID da operação: #${res.data.operationId}`
        });

        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return(
    <Dialog>
      <Button
        asChild 
        size={"icon"}
        variant={'outline'} 
        className="size-7 p-0 flex items-center justify-center"
      >
        <DialogTrigger>
          <Pencil className="w-4 h-4"/>
        </DialogTrigger>
      </Button>

      <DialogPortal>
        <DialogOverlay className="bg-background/10"/>

        <DialogContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(updateOperation)} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                Editar operação
              </h1>

              <span className="text-muted-foreground">ID da operação: #{operation.id}</span>
            </div>

            <Separator/>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="">Descrição</label>
                <input 
                  placeholder="Ex: Salário"
                  {...register("description")}
                  defaultValue={operation.description}
                  className="py-3 px-4 rounded border bg-transparent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="">Valor</label>
                <input 
                  type="number"
                  {...register("amount")}
                  placeholder="Insira o valor"
                  defaultValue={operation.amount}
                  className="py-3 px-4 rounded border bg-transparent"
                />
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
                      defaultChecked={ operation.type === "entrada" ? true : false }
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
                      defaultChecked={ operation.type === "saida" ? true : false }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="">Data da operação</label>
                
                <DatePicker  setDataOperation={setDataOperation}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant={'secondary'}>
                <DialogClose>
                  Cancelar
                </DialogClose>
              </Button>

              <Button type='submit'>
                Salvar alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}