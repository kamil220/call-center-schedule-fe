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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface CallHistoryEntry {
  id: string
  dateTime: string
  line: string
  phoneNumber: string
  operator: string
  duration: string
  tags: string[]
}

interface CallHistoryTableProps {
  data: CallHistoryEntry[]
}

export function CallHistoryTable({ data }: CallHistoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6">Date & Time</TableHead>
            <TableHead className="px-6">Line</TableHead>
            <TableHead className="px-6">Phone Number</TableHead>
            <TableHead className="px-6">Operator</TableHead>
            <TableHead className="px-6">Duration</TableHead>
            <TableHead className="px-6">Tags</TableHead>
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
              <TableCell className="px-6">{entry.line}</TableCell>
              <TableCell className="px-6">{entry.phoneNumber}</TableCell>
              <TableCell className="px-6">{entry.operator}</TableCell>
              <TableCell className="px-6">{entry.duration}</TableCell>
              <TableCell className="px-6">
                <div className="flex gap-1 flex-wrap">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
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