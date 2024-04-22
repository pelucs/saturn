import Link from "next/link";
import Image from "next/image";

import { Theme } from "@/components/Theme";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { DollarSign, LayoutGrid, LogOut, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import logoSaturn from '../../../public/logo-saturn.svg';

export function Header(){

  const { avatarUrl } = getUser();

  return(
    <div className="w-full h-16 px-5 md:px-7 flex items-center justify-between border-b">
      <div className="flex items-center gap-5">
        <Image src={logoSaturn} alt="Logo Saturn" className="size-6"/>

        <Separator orientation="vertical" className="h-6 bg-secondary"/>

        <Select defaultValue="financeiro">
          <SelectTrigger className="w-40 h-9 justify-between hover:bg-secondary transition-all">
            <div className="flex items-center justify-start gap-2">
              <DollarSign className="w-4 h-4"/>

              <SelectValue placeholder="Ferramenta"/>
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="financeiro">Financeiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4 font-medium text-muted-foreground ">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground transition-colors">
            <LayoutGrid className="w-4 h-4"/>
            
            Dashboard
          </Link>

          <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <User className="w-4 h-4"/>

            Perfil
          </Link>
        </nav>

        <Separator orientation="vertical" className="h-6 bg-secondary"/>
        
        <Theme/>

        <Popover>
          <PopoverTrigger>
            <Image 
              width={35}
              height={35}
              src={avatarUrl}
              alt="Foto de perfil"
              className="rounded-full"
            />
          </PopoverTrigger>

          <PopoverContent align="end" className="p-3 mt-1 w-56">
            <Button asChild variant={"ghost"} className="w-full px-2 justify-start gap-2">
              <Link href="/api/auth/logout">
                <LogOut className="size-4"/>

                Encerrar Sessão
              </Link>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}