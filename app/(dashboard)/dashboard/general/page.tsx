'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Suspense } from 'react';
import { useUser } from '@/hooks/useUser';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm() {

  const {user} = useUser()

  const getUserRoleName = ()=>{
    switch (user?.role) {
      case "super_admin": 
      return "Super Admin"
        
     case "admin" : return "Admin" ;

     case "employee": return "Employee"
    
      default: return ""
        
    }
  }
  return (
    <>
     
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={user?.email ?? ''}
          disabled
          // defaultValue={emailValue}
          required
        />
      </div>

       <div>
        <Label htmlFor="name" className="mb-2">
          Role
        </Label>
        <Input
          id="role"
          name="role"
          value={getUserRoleName()}
          disabled
          required
        />
      </div>
    </>
  );
}

// function AccountFormWithData({ state }: { state: ActionState }) {
//   return (
//     <AccountForm
//     />
//   );
// }

function AccountInformationSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function GeneralPage() {
  

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" >
            <Suspense fallback={<AccountInformationSkeleton  />}>
              <AccountForm />
            </Suspense>
          
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
