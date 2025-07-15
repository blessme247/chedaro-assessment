import { z } from 'zod';
import { User } from '../db/data.types';
import { auditTrailApi } from "@/lib/db/api";
import { AuditTrail } from "@/lib/db/data.types";
import { ActivityType } from "@/lib/db/schema";
import { getUser } from '../db/query';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any; // This allows for additional properties
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;


type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: Omit<User, 'password'>
) => Promise<T>;




export async function logActivityy(
  userId: string,
  type: ActivityType,
  organizationId?: string,
) {
  if (userId === null || userId === undefined) {
    return;
  }
  const newActivity: AuditTrail = {
    organizationId,
    userId,
    action: type,
  };
  await auditTrailApi.create(newActivity)
}

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async ( formData: any) => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData);
  };
}

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const user = await getUser();
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    return action(result.data, formData, user);
  };
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());