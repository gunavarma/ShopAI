"use client";

import { ResponseStreamDemo } from '@/components/ui/response-stream-demo';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <ResponseStreamDemo />
      </div>
    </div>
  );
}