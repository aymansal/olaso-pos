import type { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function AppDataProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
