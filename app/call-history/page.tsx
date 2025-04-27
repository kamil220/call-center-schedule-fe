import { CallHistoryTable } from "@/components/call-history-table"

const sampleData = [
  {
    id: "1",
    dateTime: "2024-03-20 14:30:00",
    line: "Sales",
    phoneNumber: "+48 123 456 789",
    operator: "Jack Davis",
    duration: "00:52:30",
    tags: ["Basic medical package", "Follow-up required"],
  },
  {
    id: "2",
    dateTime: "2024-03-20 13:15:00",
    line: "Customer Service",
    phoneNumber: "+48 987 654 321",
    operator: "Emma Wilson",
    duration: "00:15:45",
    tags: ["Premium package", "Resolved"],
  },
  {
    id: "3",
    dateTime: "2024-03-20 11:45:00",
    line: "Technical",
    phoneNumber: "+48 555 123 456",
    operator: "Michael Brown",
    duration: "00:23:10",
    tags: ["System issue", "Urgent"],
  },
]

export default function CallHistoryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historia rozmów</h1>
          <p className="text-muted-foreground">
            Przeglądaj historię wszystkich rozmów telefonicznych.
          </p>
        </div>
        <CallHistoryTable data={sampleData} />
      </div>
    </div>
  )
} 