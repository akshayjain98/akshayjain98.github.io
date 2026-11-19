'use client';

export const PrintButton = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="btn-apple !px-5 !py-2 !text-sm"
  >
    Download PDF
  </button>
);
