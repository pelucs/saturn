'use client'

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import Cookie from 'js-cookie';

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import logoSaturn from '../../public/logo-saturn.svg';

export default function Home(){

  const router = useRouter();

  const isAuthenticated = Cookie.get('token');

  if(isAuthenticated){
    router.push("/app/financeiro");
  }

  const [active, setActive] = useState<boolean>(false);
  
  useEffect(() => setActive(true), []);

  return(
    <div className={clsx("w-full h-screen flex items-center justify-center relative duration-500 transition-all", {
      "translate-y-0 opacity-100": active,
      "-translate-y-10 opacity-0": !active
    })}>
      <div className="flex flex-col items-center gap-8">
        <div>
          <Image src={logoSaturn} alt="Logo Saturn" className="size-16"/>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold">Junte-se ao time Saturn</h1>
          <p className="text-muted-foreground">Use suas informações do Github</p>
        </div>

        <Button 
          asChild 
          variant={"outline"} 
          className="gap-2"
        >
          <a 
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
          >
            <Github className="size-4"/>

            Faça Login com Github
          </a>
        </Button>

        <span className="text-center text-muted-foreground">
          Ao acessar a plataforma você aceita nossos 
          <br/> 
          <Link href="" className="hover:text-white underline">Termos de Serviço</Link> e <Link href="" className="hover:text-white underline">Políticas de Privacidade</Link>
        </span>
      </div>
    </div>
  );
}