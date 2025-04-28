import * as React from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface CallHistoryTableProps {
  data: Call[]
}

export function CallHistoryTable({ data }: CallHistoryTableProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
              onClick={() => setIsDialogOpen(true)}
            >
              <TableCell className="px-6">{entry.dateTime}</TableCell>
              <TableCell className="px-6">{entry.skillPath.name}</TableCell>
              <TableCell className="px-6">{entry.line.name}</TableCell>
              <TableCell className="px-6">{entry.phoneNumber}</TableCell>
              <TableCell className="px-6">{entry.operator.fullName}</TableCell>
              <TableCell className="px-6">{formatDuration(entry.duration)}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature Not Available</DialogTitle>
            <DialogDescription>
              The call details view is currently not available. This feature will be implemented in a future update.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
} 