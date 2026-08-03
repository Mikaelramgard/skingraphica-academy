import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatTile({ label, value, sublabel, className, children }: StatTileProps) {
  return (
    <Card className={cn("flex items-center justify-between gap-4 p-5", className)}>
      <div>
        <p className="text-[13px] font-medium text-ink-faint">{label}</p>
        <p className="mt-1.5 font-mono text-[28px] font-semibold leading-none tabular-nums text-ink">
          {value}
        </p>
        {sublabel ? <p className="mt-1.5 text-[12.5px] text-ink-faint">{sublabel}</p> : null}
      </div>
      {children}
    </Card>
  );
}
