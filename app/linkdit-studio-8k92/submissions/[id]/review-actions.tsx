"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Send, Loader2 } from "lucide-react"
import {
  adminApproveSubmission,
  adminRejectSubmission,
  adminRequestChanges,
  adminDeleteSubmission,
} from "@/actions/submissions"

type Submission = {
  id: string
  submission_status: string
  tool_name: string
  slug: string | null
}

export default function ReviewActions({ submission }: { submission: Submission }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [showReject, setShowReject] = useState(false)
  const [showChanges, setShowChanges] = useState(false)

  async function handle(action: string) {
    setLoading(action)
    let result: { error?: string; success?: boolean } = {}

    switch (action) {
      case "approve":
        result = await adminApproveSubmission(submission.id)
        break
      case "reject":
        result = await adminRejectSubmission(submission.id, reason)
        break
      case "changes":
        result = await adminRequestChanges(submission.id, reason)
        break
      case "delete":
        result = await adminDeleteSubmission(submission.id)
        break
    }

    setLoading(null)
    if (result.success) {
      router.refresh()
      setShowReject(false)
      setShowChanges(false)
      setReason("")
    }
  }

  if (submission.submission_status === "approved") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <span className="text-sm font-medium text-emerald-700">Approved</span>
      </div>
    )
  }

  if (submission.submission_status === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
        <span className="text-sm font-medium text-red-700">Rejected</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handle("approve")}
          disabled={loading !== null}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Approve & Publish
        </button>

        <button
          onClick={() => { setShowReject(true); setShowChanges(false) }}
          disabled={loading !== null}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>

        <button
          onClick={() => { setShowChanges(true); setShowReject(false) }}
          disabled={loading !== null}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
          Request Changes
        </button>

        <button
          onClick={() => handle("delete")}
          disabled={loading !== null}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
          {loading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Delete
        </button>
      </div>

      {/* Reject form */}
      {showReject && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
          <label htmlFor="reason" className="text-sm font-medium text-red-800">Reason for rejection</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            placeholder="Let the submitter know why..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handle("reject")}
              disabled={!reason.trim() || loading !== null}
              className="inline-flex h-8 items-center rounded-lg bg-red-600 px-3 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Confirm Reject
            </button>
            <button
              onClick={() => { setShowReject(false); setReason("") }}
              className="inline-flex h-8 items-center rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Request Changes form */}
      {showChanges && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <label htmlFor="changes" className="text-sm font-medium text-amber-800">What needs to be changed?</label>
          <textarea
            id="changes"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-foreground focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            placeholder="Describe what the submitter should change..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handle("changes")}
              disabled={!reason.trim() || loading !== null}
              className="inline-flex h-8 items-center rounded-lg bg-amber-600 px-3 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Send Request
            </button>
            <button
              onClick={() => { setShowChanges(false); setReason("") }}
              className="inline-flex h-8 items-center rounded-lg border border-amber-200 bg-white px-3 text-xs font-medium text-amber-700 hover:bg-amber-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
