import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function logAuditEvent(params: {
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId || null,
    metadata: params.metadata || {},
  })
}
