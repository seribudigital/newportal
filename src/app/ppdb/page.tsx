"use client";

import React, { useState } from "react";
import { PPDBInfoSection } from "@/features/ppdb/components/PPDBInfoSection";
import { PPDBForm } from "@/features/ppdb/components/PPDBForm";
import { PPDBSuccessDialog } from "@/features/ppdb/components/PPDBSuccessDialog";
import type { JenjangId } from "@/types";

export default function PPDBPublicPage() {
  const [selectedJenjangId, setSelectedJenjangId] = useState<JenjangId>("sdit");
  const [successResult, setSuccessResult] = useState<{
    id: string;
    nomorPendaftaran: string;
    namaCalon: string;
    jenjangId: JenjangId;
  } | null>(null);

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-12">
      {/* Info Section (Hero, Steps, Education Level Cards, Requirements) */}
      <PPDBInfoSection onSelectJenjang={(id) => setSelectedJenjangId(id)} />

      {/* Modular Registration Form */}
      <PPDBForm
        initialJenjangId={selectedJenjangId}
        onSuccess={(result) => setSuccessResult(result)}
      />

      {/* Success Dialog Popup */}
      {successResult && (
        <PPDBSuccessDialog
          nomorPendaftaran={successResult.nomorPendaftaran}
          namaCalon={successResult.namaCalon}
          jenjangId={successResult.jenjangId}
          onClose={() => setSuccessResult(null)}
        />
      )}
    </main>
  );
}
