// ============================================================
// 📊 BOOK STATS — IES SMARTLIB ADMIN
// Premium Cards | Mobile-First | Dark Navy Accents
// ============================================================

import React from "react";
import { BookOpen, CheckCircle, XCircle, Layers } from "lucide-react";

// ── Stat card config ─────────────────────────────────────────
const getCards = (totalBooks, availableBooks, unavailableBooks, categoriesCount) => [
  {
    label: "Total Books",
    value: totalBooks.toLocaleString(),
    icon: BookOpen,
    accent: "#0f172a",
    iconBg: "bg-[#0f172a]",
    valueCls: "text-gray-900",
    border: "border-[#0f172a]/10",
    tag: "Library catalog",
  },
  {
    label: "Available",
    value: availableBooks.toLocaleString(),
    icon: CheckCircle,
    accent: "#059669",
    iconBg: "bg-emerald-600",
    valueCls: "text-emerald-700",
    border: "border-emerald-100",
    tag: totalBooks > 0
      ? `${Math.round((availableBooks / totalBooks) * 100)}% of total`
      : "0% of total",
  },
  {
    label: "Unavailable",
    value: unavailableBooks.toLocaleString(),
    icon: XCircle,
    accent: "#dc2626",
    iconBg: "bg-red-600",
    valueCls: "text-red-600",
    border: "border-red-100",
    tag: totalBooks > 0
      ? `${Math.round((unavailableBooks / totalBooks) * 100)}% of total`
      : "0% of total",
  },
  {
    label: "Departments",
    value: categoriesCount.toLocaleString(),
    icon: Layers,
    accent: "#4f46e5",
    iconBg: "bg-indigo-600",
    valueCls: "text-indigo-700",
    border: "border-indigo-100",
    tag: "Active categories",
  },
];

// ============================================================
// 📊 BOOK STATS COMPONENT
// ============================================================
function BookStats({ stats, categoriesCount = 0 }) {
  const {
    totalBooks    = 0,
    availableBooks   = 0,
    unavailableBooks = 0,
  } = stats || {};

  const cards = getCards(totalBooks, availableBooks, unavailableBooks, categoriesCount);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`relative bg-white rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group`}
          >
            {/* Top accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: card.accent }}
              aria-hidden="true"
            />

            <div className="p-4 md:p-5">
              {/* Icon + label row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs md:text-sm font-semibold text-gray-500 leading-none">
                  {card.label}
                </p>
                <div className={`p-2 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" aria-hidden="true" />
                </div>
              </div>

              {/* Value */}
              <p className={`text-2xl md:text-3xl font-extrabold ${card.valueCls} leading-none mb-2 tabular-nums`}>
                {card.value}
              </p>

              {/* Tag */}
              <p className="text-[10px] md:text-xs text-gray-400 font-medium">
                {card.tag}
              </p>
            </div>

            {/* Subtle hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none rounded-2xl"
              style={{ background: card.accent }}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}

export default BookStats;