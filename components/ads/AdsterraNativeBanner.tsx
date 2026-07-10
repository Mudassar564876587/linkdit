"use client"

import Script from "next/script"
import { useId } from "react"

const SRC = "https://pl30278685.effectivecpmnetwork.com/0d94ddca1251a9d5e3ab921c32d2813c/invoke.js"
const CONTAINER_ID = "container-0d94ddca1251a9d5e3ab921c32d2813c"

export default function AdsterraNativeBanner() {
  const uid = useId()

  return (
    <>
      <Script
        id={`adsterra-${uid}`}
        src={SRC}
        strategy="lazyOnload"
        data-cfasync="false"
        async
      />
      <div className="flex w-full justify-center" style={{ minHeight: "90px" }}>
        <div id={CONTAINER_ID} className="w-full max-w-[728px]" />
      </div>
    </>
  )
}
