import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default () => {

  const isAuthenticated = cookies().has('token');
  
  if(!isAuthenticated){
    redirect("/")
  }
  
  return(
    <div>
      
    </div>
  );
}