'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
// import { customerPortalAction } from '@/lib/payments/actions';
import {  useState } from 'react';
import useSWR from 'swr';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { auditTrailApi, organizationApi } from '@/lib/db/api';
import { z } from 'zod';
import { createOrganizationSchema } from './schema';
import { useRouter } from 'next/navigation';
import { logActivity,  } from '@/app/(dashboard)/dashboard/clientActions';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());




function CreateOrganizationSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
      </CardHeader>
    </Card>
  );
}



export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Dashboard</h1>
    
      <Suspense fallback={<CreateOrganizationSkeleton/>}>
      <CreateOrganisation/>
      </Suspense>
       <Suspense fallback={<CreateOrganizationSkeleton/>}>
      <ActivityLogs/>
      </Suspense>
    </section>
  );
}

function CreateOrganisation() {

  const { data,  } = useSWR('/api/users', fetcher);
  const { data:orgData,  } = useSWR('/api/organizations', fetcher);

  console.log(data, 'users data')

  const router = useRouter()
   const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    try {
      const validatedData = createOrganizationSchema.parse({ name });
      
      setIsPending(true);
      setError(null);
      setSuccess(null);



      const result = await organizationApi.create(validatedData).then(()=> {

        setSuccess('Organization created successfully!');
        setName(''); // Clear form
        // console.log('Created organization:', result);
        // logActivityy()
        // logActivity(
        //       userWithTeam.teamId,
        //       user.id,
        //       ActivityType.REMOVE_TEAM_MEMBER
        //     );
      })
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'Validation error');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create organization');
      }
    } finally {
      setIsPending(false);
    }
  };



  return (

    <Card className="mt-8">
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>Create Organization</CardTitle>
        <Button type="submit" onClick={()=> router.push('/dashboard/organization')} variant="outline">
                Manage Organizations
              </Button>
      </CardHeader>
      <CardContent>
        <form 
        // action={createAction}
        onSubmit={handleSubmit}
         className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="name"
              placeholder="Enter name"
              onChange={(e)=> setName(e.target.value)}
              value={name}
              required
              // disabled={!isOwner}
            />
          </div>
          
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-green-500">{success}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {/* {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )} */}
    </Card>
  )
}

 function  ActivityLogs() {

  const { data:orgData,  } = useSWR('/api/organizations', fetcher);

  const router = useRouter()




  return (

    <Card className="mt-8">
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>Audit Trail</CardTitle>
        <Button type="submit" onClick={()=> router.push('/dashboard/activity')} variant="outline">
                View full audit trail
              </Button>
      </CardHeader>
      {/* <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.ipAddress && ` from IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                When you perform actions like signing in or updating your
                account, they'll appear here.
              </p>
            </div>
          )}
        </CardContent> */}
      {/* {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You must be a team owner to invite new members.
          </p>
        </CardFooter>
      )} */}
    </Card>
  )
}
