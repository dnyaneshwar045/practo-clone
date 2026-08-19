import type { PaymentMethod, PaymentStatus } from "@prisma/client";
import { Badge } from "@/components/ui";

const tones = {
  PAID: "green",
  PENDING: "amber",
  FAILED: "red",
  REFUNDED: "slate",
} as const;

export function PaymentBadge({ status, method }: { status: PaymentStatus; method: PaymentMethod }) {
  const label =
    status === "PAID"
      ? method === "ONLINE"
        ? "Paid online"
        : "Fee collected"
      : status === "PENDING"
        ? method === "ONLINE"
          ? "Payment pending"
          : "Pay at clinic"
        : status === "FAILED"
          ? "Payment failed"
          : "Refunded";

  return <Badge tone={tones[status]}>{label}</Badge>;
}
