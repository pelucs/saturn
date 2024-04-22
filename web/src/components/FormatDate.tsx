import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormatDateProps{
  date: string;
}

export function FormatDate({ date }: FormatDateProps){
  return(
    <span>
      {format(new Date(date), "dd' de 'MMM', 'y", { locale: ptBR })}
    </span>
  )
}