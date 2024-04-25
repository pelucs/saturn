'use client'

import { useRouter } from "next/navigation";

interface RedirectClientProps {
  to: string;
}

export function RedirectClient({ to }: RedirectClientProps) {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push(to);
  }

  // Null já que este componente não precisa renderizar nada
  return null;
}