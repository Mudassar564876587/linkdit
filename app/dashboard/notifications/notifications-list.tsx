"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCheck, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { markNotificationRead, markAllNotificationsRead } from "@/actions/dashboard/notifications"
import { formatDate } from "@/lib/utils"

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()

  async function handleMarkRead(id: string) {
    await markNotificationRead(id)
    router.refresh()
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    router.refresh()
  }

  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-border p-12 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">No notifications yet.</p>
      </div>
    )
  }

  const unread = notifications.filter((n) => !n.is_read)
  const read = notifications.filter((n) => n.is_read)

  return (
    <div className="space-y-4">
      {unread.length > 0 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        </div>
      )}

      {unread.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">New</p>
          {unread.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}

      {read.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">Earlier</p>
          {read.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  )
}

function NotificationCard({
  notification: n,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const content = (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
        n.is_read ? "border-border bg-background" : "border-primary/20 bg-primary/5"
      }`}
    >
      <div
        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
          n.is_read ? "bg-transparent" : "bg-primary"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{n.title}</p>
        {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
        <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
      </div>
      {!n.is_read && (
        <button
          onClick={() => onMarkRead(n.id)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          title="Mark as read"
        >
          <CheckCheck className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  if (n.link) {
    return <Link href={n.link}>{content}</Link>
  }
  return content
}
