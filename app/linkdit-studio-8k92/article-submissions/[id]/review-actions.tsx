"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import {
  adminApproveArticleSubmission,
  adminRejectArticleSubmission,
  adminDeleteArticleSubmission,
} from "@/actions/article-submissions"

type Submission = {
  id: string
  status: string
  title: string
}

export default function ArticleReviewActions({ submission }: { submission: Submission }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [showReject, setShowReject] = useState(false)

  async function handle(action: string) {
    setLoading(action)
    let result: { error?: string; success?: boolean } = {}

    switch (action) {
      case "approve":
        result = await adminApproveArticleSubmission(submission.id)
        break
      case "reject":
        result = await adminRejectArticleSubmission(submission.id, reason)
        break
      case "delete":
        result = await adminDeleteArticleSubmission(submission.id)
        break
    }

    setLoading(null)
    if (result.success) {
      router.refresh()
      setShowReject(false)
      setReason("")
    }
  }

  if (submission.status === "approved") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <span className="text-sm font-medium text-emerald-700">Approved</span>
      </div>
    )
  }

  if (submission.status === "rejected") {
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
          className="btn-success"
        >
          {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Approve & Publish
        </button>

        <button
          onClick={() => setShowReject(true)}
          disabled={loading !== null}
          className="btn-danger"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>

        <button
          onClick={() => handle("delete")}
          disabled={loading !== null}
          className="btn-danger"
        >
          {loading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Delete
        </button>
      </div>

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
              className="btn-danger"
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
    </div>
  )
}
