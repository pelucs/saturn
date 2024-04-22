import { Chart } from "./Chart";
import { Cards } from "./Cards";
import { Header } from "@/app/app/Header";
import { cookies } from "next/headers";
import { RedirectClient } from "@/components/RedirectClient";
import { TableOperations } from "./Table";
import { CreateOperation } from "./CreateOperation";
import { OperationsContextProvider } from "@/context/operationsContext";

import { getUser } from "@/lib/auth";
import { RecentOperations } from "./RecentOprations";

export default () => {

  const isAuthenticated = cookies().has('token');
  
  if(!isAuthenticated){
    return <RedirectClient to="/"/>
  }

  const { sub, avatarUrl } = getUser();

  return(
    <div>
      <Header/>    
      <CreateOperation userId={sub} type={'icon'}/>

      <div className="p-5 md:p-7">
        <OperationsContextProvider>
          <Cards/>
        </OperationsContextProvider>

        {/* Contas */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="py-5 flex flex-col gap-5 rounded-xl border">
            <h1 className="text-base font-semibold px-5">Overview</h1>
            <Chart/>
          </div>

          <OperationsContextProvider>
            <RecentOperations avatarUrl={avatarUrl}/>
          </OperationsContextProvider>
        </div>

        {/* Tabela de operações */}
        <div className="mt-5 px-5 pt-5 border rounded-xl space-y-4">
          <h1 className="text-base font-semibold">Tabela de operações</h1>

          <OperationsContextProvider>
            <TableOperations/>
          </OperationsContextProvider>
        </div>
      </div>
    </div>
  );
}