"use client"

import Cookies from "js-cookie";

import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale'; 
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), (new Date().getDate() - 1)),
    to: new Date(),
  });

  // Verificando se existe data 
  useEffect(() => {
    const getDateLocalStorage = localStorage.getItem('filtering_dates');

    if(getDateLocalStorage){
      const json = JSON.parse(getDateLocalStorage);

      setDate({
        from: json.from,
        to: json.to,
      });
    }
  }, []);

  const handleFiltered = async () => {
    if(date){
      const filteringDates = {
        from: date.from?.toISOString(),
        to: date.to?.toISOString(),
      };

      localStorage.setItem('filtering_dates', JSON.stringify(filteringDates)); // Verificar
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "capitalize w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Insira uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            numberOfMonths={2}
          />

          <div className="pt-2 pb-5 px-5">
            <Button onClick={handleFiltered} className="gap-2">
              <SlidersHorizontal className="size-4"/>

              Filtrar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
