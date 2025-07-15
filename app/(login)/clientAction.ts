import { logActivityy, validatedAction, validatedActionWithUser } from "@/lib/auth/actions";
import { auditTrailApi, authApi, organizationApi, userApi } from "@/lib/db/api";
import { AuditTrail } from "@/lib/db/data.types";
import { ActivityType } from "@/lib/db/schema";
import { z } from "zod";






export const logInSchema = z.object({
  email: z.string().email().min(3).max(100),
  password: z.string().min(8).max(100)
});

export const logIn = validatedAction(logInSchema, async (data, _ ) => {
    
    // const user = await  authApi.login(data)
    const res = await fetch("/api/login",  {method: "POST", body: JSON.stringify(data), headers: {
        'Content-Type': 'application/json',
    }})
    const user = await res.json()
    if(res.ok){
        
        // await logActivityy(res.user.id ?? "", ActivityType.SIGN_IN)
        // localStorage.setItem("user", JSON.stringify(user?.user))
        
        // window.location.href = user.user?.role === "super_admin" ?  "/dashboard" : "/dashboard/general"
    }
    else {
        console.log(user, 'user')
        throw new Error(user.error)
    }
// try {
    
// } catch (error) {
//     // console.log(error, 'login error')
//     throw error
// }


}
    
)

