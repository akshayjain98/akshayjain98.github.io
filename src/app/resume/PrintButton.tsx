'use client';

export const PrintButton = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
  >
    Download PDF
  </button>
);
