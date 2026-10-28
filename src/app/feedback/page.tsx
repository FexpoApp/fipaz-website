"use client";

import React, { useState } from "react";
import { FeedbackHeader } from "@/components/feedback/FeedbackHeader";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackSuccess } from "@/components/feedback/FeedbackSuccess";
import { FexpoPageFooter } from "@/components/shared/fexpo-page-footer";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F4EF] text-[#132D46] antialiased">
      <FeedbackHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {submitted ? (
          <FeedbackSuccess />
        ) : (
          <FeedbackForm onSubmitted={() => setSubmitted(true)} />
        )}
      </main>
      <FexpoPageFooter current="feedback" />
    </div>
  );
}
