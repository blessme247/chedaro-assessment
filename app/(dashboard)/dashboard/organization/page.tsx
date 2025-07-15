"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";
import useSWR, { mutate } from "swr";
import { Suspense } from "react";
import { Organization, role } from "@/lib/db/data.types";
import { createUserSchema } from "../schema";
import {  userApi } from "@/lib/db/api";
import { z } from "zod";
import { Modal } from "@/components/Modal";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultiSelect from "@/components/multi-select";
import { permissionsData } from "./data";
import { useUser } from "@/hooks/useUser";

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


function MemberForm({organization_id, setOpen}: {organization_id:string, setOpen: Dispatch<SetStateAction<boolean>>}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<role>("employee");
  const [values, setValues] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // console.log(organization_id, 'organization id')


  const data = useMemo(
    () => permissionsData.filter((p) => p.roles.includes(role)),
    [role]
  );

    const {user} = useUser()

    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(error){
        setError("")
      }
      try {
        const validatedData = createUserSchema.parse({
          email,
        password,
        permissions: values,
        role
      });

      // console.log(validatedData, 'validated data')
      
      setIsPending(true);
      setError(null);
      setSuccess(null);
      
      const result = await userApi.create({...validatedData, organization_id});
      //  const res = await httpRequest(apiRoutes.users, {
      //         body: validatedData,
      //       });
      console.log(result, 'create user result')
      mutate(`/api/organizations/${user?.organizationId}`)
      setSuccess("Organization created successfully!");
      setPassword('')
      setEmail("")
      setValues([])
      setOpen(false)
    } catch (err) {
      // console.log(err, 'err')
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Validation error");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to create organization"
        );
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className={cn("space-y-4")} onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2" htmlFor="email">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          autoComplete="reg1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label className="mb-2" htmlFor="password">
          Password
        </Label>
        <Input
        autoComplete="reg"
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Label className="mb-2">Role</Label>
        <RadioGroup
          defaultValue={role}
          name="role"
          className="flex space-x-4"
          onChange={(e) => {
            setRole(
              (e.target as HTMLInputElement).value as "employee" | "admin"
            );
            if ((e.target as HTMLInputElement).value === "employee") {
              setValues([]);
            }
          }}
        >
          <div className="flex items-center space-x-2 mt-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <RadioGroupItem value="employee" id="employee" />
            <Label htmlFor="employee">Employee</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        {/* <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" /> */}
        <MultiSelect
          label="Permissions"
          values={values}
          setValues={setValues}
          data={data}
        />
      </div>
        {error && (
            <p className="text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-green-500">{success}</p>
          )}
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
        type="submit"
        disabled={isPending}
      >
         {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Save
              </>
            )}
      </Button>
    </form>
  );
}

function SuperAdminOrgList() {
  //   const { data: user } = useSWR<User>('/api/user', fetcher);
  const { data: orgData, isLoading } = useSWR("/api/organizations", fetcher);


  const [open, setOpen] = useState(false);
  const [organization_id, setOrgId] = useState("")
  
  console.log(orgData, 'organization data')

  if (isLoading)
    return (
      <Card className=" h-[260px]">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
        </CardHeader>
      </Card>
    );

  if (!orgData?.organizations?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No organizations yet.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <div className="border-b border-0.5 px-2 py-1 grid grid-cols-3 ">
        <p className="text-sm font-semibold ">Name</p>
        <p className="text-sm font-semibold ">Members</p>
        <p className="text-sm font-semibold ">Add Member</p>
      </div>
      <div className="flex flex-col gap-1  ">
        {orgData.organizations.map((org: Organization) => (
          <div
            key={org.id}
            className="px-2 py-1 grid grid-cols-3 border-b border-0.5"
          >
            <p className="text-sm">{org.name}</p>
            <p className="text-sm">{org.users.length}</p>
            {/* <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            //   disabled={isPending}
            >
             Add Member
            </Button> */}
            <PlusCircle
              role="button"
              tabIndex={0}
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={() => {
                setOrgId(org.id)
                setOpen(!open)
            }}
            />
          </div>
        ))}
      </div>

      <Modal
        title="Create Member"
        description="Add member to organization"
        open={open}
        setOpen={setOpen}
      >
        <MemberForm {...{organization_id, setOpen}} />
      </Modal>
    </>
  );
}

function AdminOrgList() {
  const {user} = useUser()
  // console.log(user, "user")
  const { data, isLoading } = useSWR(user?.organizationId ?  `/api/organizations/${user?.organizationId}` : null, fetcher);


  const [open, setOpen] = useState(false);
  const [organization_id, setOrgId] = useState("")

  const organization = useMemo(()=> data?.organization, [data])

  const { data:users,  } = useSWR('/api/users', fetcher)
  
    console.log(users, 'users data')

  if (isLoading)
    return (
      <Card className=" h-[260px]">
        <CardHeader>
          <CardTitle>Loading</CardTitle>
        </CardHeader>
      </Card>
    );

  if (!data?.organization) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No organization yet.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <div className="border-b border-0.5 px-2 py-1 grid grid-cols-3 ">
        <p className="text-sm font-semibold ">Name</p>
        <p className="text-sm font-semibold ">Members</p>
        <p className="text-sm font-semibold ">Add Member</p>
      </div>
      <div className="flex flex-col gap-1  ">
        {/* {orgData.organizations.map((org: Organization) => ( */}
          <div
            className="px-2 py-1 grid grid-cols-3 border-b border-0.5"
          >
            <p className="text-sm">{organization?.name}</p>
            <p className="text-sm">{organization?.users?.length}</p>
            {/* <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            //   disabled={isPending}
            >
             Add Member
            </Button> */}
            <PlusCircle
              role="button"
              tabIndex={0}
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={() => {
                setOrgId(organization?.id)
                setOpen(!open)
            }}
            />
          </div>
      </div>

      <Modal
        title="Create Member"
        description="Add member to organization"
        open={open}
        setOpen={setOpen}
      >
        <MemberForm {...{organization_id, setOpen}} />
      </Modal>
    </>
  );
}

function OrganizationListSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle> Organization List</CardTitle>
      </CardHeader>
    </Card>
  );
}


export default function OrganizationPage() {

  const {user} = useUser()
  const components = {
    "super_admin": <SuperAdminOrgList/>,
    "admin": <AdminOrgList />
  }

  const Element = components[user?.role as keyof typeof components]

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Organization
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Organization List</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="space-y-4">
            <Suspense fallback={<OrganizationListSkeleton  />}>
              {Element}
            </Suspense>
          </section>
        </CardContent>
      </Card>
    </section>
  );
}

