"use client"

import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale'; 
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
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

  // Verifica se já existe alguma data pre setada no localstorage
  useEffect(() => {
    const datesFromLocalStorage = localStorage.getItem("filtering_dates");

    if (datesFromLocalStorage) {
      const json = JSON.parse(datesFromLocalStorage);
      setDate({
        from: json.from,
        to: json.to,
      });
    }
  }, []);

  // Setando a data escolhida no localstorage
  const handleFiltered = () => {
    if (date && date.from && date.to) {
      const filteringDates = {
        from: new Date(date.from),
        to: new Date(date.to),
      };
      localStorage.setItem('filtering_dates', JSON.stringify(filteringDates));
      window.location.reload();
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
        <PopoverContent className="w-auto p-0" align="end">
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
            <Button asChild onClick={handleFiltered} className="gap-2">
              <PopoverClose>
                <SlidersHorizontal className="size-4"/>

                Filtrar
              </PopoverClose>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
