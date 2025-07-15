import { validatedActionWithUser } from "@/lib/auth/actions";
import { auditTrailApi, organizationApi } from "@/lib/db/api";
import { AuditTrail } from "@/lib/db/data.types";
import { ActivityType } from "@/lib/db/schema";
import { z } from "zod";



export async function logActivity(
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




 const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export const createNewOrganization = validatedActionWithUser(createOrganizationSchema, async (data, _, user) => {
  await organizationApi.create(data)
  await logActivity(user.id ?? "", ActivityType.CREATE_ORGANIZATION, user.role !== "super_admin" ? user.organizationId : "")

  return {
    success: "Organization created successfully"
  }
}
    
)

