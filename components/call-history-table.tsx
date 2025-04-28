import * as React from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Call } from "@/types/calls"
import { formatDuration } from "@/lib/formatters"

interface CallHistoryTableProps {
  data: Call[]
}

export function CallHistoryTable({ data }: CallHistoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6">Date & Time</TableHead>
            <TableHead className="px-6">Line</TableHead>
            <TableHead className="px-6">Line topic</TableHead>
            <TableHead className="px-6">Phone Number</TableHead>
            <TableHead className="px-6">Operator</TableHead>
            <TableHead className="px-6">Duration</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow 
              key={entry.id}
              className="group cursor-pointer hover:bg-muted/50"
              onClick={() => window.location.href = `/dashboard/call-history/${entry.id}`}
            >
              <TableCell className="px-6">{entry.dateTime}</TableCell>
              <TableCell className="px-6">{entry.skillPath.name}</TableCell>
              <TableCell className="px-6">{entry.line.name}</TableCell>
              <TableCell className="px-6">{entry.phoneNumber}</TableCell>
              <TableCell className="px-6">{entry.operator.fullName}</TableCell>
              <TableCell className="px-6">{formatDuration(entry.duration)}</TableCell>
              <TableCell>
                <Link href={`/dashboard/call-history/${entry.id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 