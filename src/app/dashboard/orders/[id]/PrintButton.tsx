"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition print:hidden">
      🖨️ Imprimer
    </button>
  );
}