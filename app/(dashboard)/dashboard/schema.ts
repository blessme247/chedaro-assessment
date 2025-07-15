import { permissions } from "@/lib/db/data.types";
import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

const signInSchema = z.object({
  email: z.string().email().min(5, {message: "Email must contain at least 5 characters"}).max(255),
  password: z.string().min(8, {message: "Password must contain at least 8 characters"}).max(100)
});

export const createUserSchema = z.object({
  email: z.string().email().min(5, {message: "Email must contain at least 5 characters"}).max(255),
  password: z.string().min(8, {message: "Password must contain at least 8 characters"}).max(100),
  // organization_id: z.string().min(8).max(100),
  role:  z.enum(["super_admin", "admin", "employee"]),
//   permissions: z.array(z.string()),
permissions: z.array(z.enum(Object.values(permissions) as [string, ...string[]]))

})