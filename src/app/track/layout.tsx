// src/app/track/layout.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}