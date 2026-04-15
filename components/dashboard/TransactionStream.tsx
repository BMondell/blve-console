import { TransactionEvent } from "@/lib/transactionFeed";

function statusColor(status: TransactionEvent["status"]) {
  if (status === "confirmed") return "text-green-400";
  if (status === "failed") return "text-red-400";
  return "text-yellow-400";
}

export default function TransactionStream({ events }: { events: TransactionEvent[] }) {
  return (
    <div className="bg-[#111418] border border-white/5 rounded-lg p-4 h-full">
      <p className="text-xs uppercase tracking-wide text-white/45 mb-3">
        Transaction Stream
      </p>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start justify-between border-b border-white/5 pb-2 last:border-b-0"
          >
            <div>
              <p className="text-sm text-white">
                ${event.amount.toFixed(2)}{" "}
                <span className="text-white/45 text-xs">
                  • {event.org}
                </span>
              </p>
              <p className="text-[11px] text-white/45">
                {event.cardOwner} • {new Date(event.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <p className={`text-[11px] uppercase font-medium ${statusColor(event.status)}`}>
              {event.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
