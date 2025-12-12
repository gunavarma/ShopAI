"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Spec {
  label: string;
  value: string;
}

interface ProductAccordionsProps {
  specs: Spec[];
}

export function ProductAccordions({ specs }: ProductAccordionsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
      <details className="group" open>
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Specifications
          </span>
          <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800">
          <ul className="space-y-3 pt-4 text-slate-600 dark:text-slate-300 text-sm">
            {specs.map((spec, index) => (
              <li key={index} className="flex justify-between">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {spec.label}:
                </span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
      <details className="group border-t border-slate-200 dark:border-slate-800">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Reviews (1,288)
          </span>
          <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800">
          <p className="pt-4 text-slate-600 dark:text-slate-300 text-sm">
            Review content goes here...
          </p>
        </div>
      </details>
      <details className="group border-t border-slate-200 dark:border-slate-800">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Q&A
          </span>
          <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800">
          <p className="pt-4 text-slate-600 dark:text-slate-300 text-sm">
            Q&A content goes here...
          </p>
        </div>
      </details>
    </div>
  );
}
