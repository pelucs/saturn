import { Button } from "@/components/ui/button";
import { ChevronUp, ReceiptText } from "lucide-react";
import { IOperations } from "@/utils/operationsType";
import { FormatDate } from "@/components/FormatDate";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTrigger 
} from "@/components/ui/drawer";

interface OverviewOperationProps{
  operation: IOperations;
}

export function OverviewOperation({ operation }: OverviewOperationProps){
  return(
    <Drawer>
      <Button 
        asChild
        variant={'outline'}
        size={"icon"}
        className="size-7 flex items-center justify-center"
      >
        <DrawerTrigger>
          <ChevronUp className="w-4 h-4"/>
        </DrawerTrigger>
      </Button>

      <DrawerContent className="w-[450px] mx-auto pb-10">
        <DrawerHeader className="pt-10 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <ReceiptText className="w-5 h-5"/>

              {operation.description}
            </h1>

            <span className="text-muted-foreground">
              ID da operação: #{operation.id}
            </span>
          </div>

          <span className="text-muted-foreground">
            <FormatDate date={operation.dateAt}/>
          </span>
        </DrawerHeader>

        <div className="px-4 space-y-1 font-semibold">
          <span className={operation.type === "entrada" ? "text-green-500" : "text-red-500"}>
            Tipo: {operation.type === "entrada" ? "Entrada" : "Saída"}
          </span>

          <h1 className={operation.type === "entrada" ? "text-green-500" : "text-red-500"}>
            <span>
              Valor: {operation.type === "entrada" ? "+" : "-"}
            </span>
            
            R${operation.amount.toFixed(2)}
          </h1>
        </div>
      </DrawerContent>
    </Drawer>
  );
}