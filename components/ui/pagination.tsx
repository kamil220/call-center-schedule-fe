import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current page index (0-based)
   */
  page: number
  /**
   * Total number of pages
   */
  totalPages: number
  /**
   * Callback when page is changed
   */
  onPageChange: (page: number) => void
  /**
   * Whether the pagination is in a loading state
   */
  isLoading?: boolean
  /**
   * Show page numbers in the middle?
   */
  showPageNumbers?: boolean
  /**
   * Max number of page buttons to show in the middle (only relevant if showPageNumbers is true)
   */
  maxPageButtons?: number
  /**
   * Show page size options?
   */
  showPageSizeOptions?: boolean
  /**
   * Current page size
   */
  pageSize?: number
  /**
   * Available page size options
   */
  pageSizeOptions?: number[]
  /**
   * Callback when page size is changed
   */
  onPageSizeChange?: (pageSize: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  showPageNumbers = false,
  maxPageButtons = 5,
  showPageSizeOptions = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange,
  className,
  ...props
}: PaginationProps) {
  
  // Calculate which page buttons to show
  const getPageButtons = () => {
    if (!showPageNumbers || totalPages <= 1) return []
    
    // If we have fewer pages than max buttons, show all
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }
    
    // Otherwise, show a range around current page
    const halfButtons = Math.floor(maxPageButtons / 2)
    let start = Math.max(0, page - halfButtons)
    const end = Math.min(totalPages - 1, start + maxPageButtons - 1)
    
    // Adjust start if we're near the end
    if (end === totalPages - 1) {
      start = Math.max(0, end - maxPageButtons + 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }
  
  const pageButtons = getPageButtons()
  
  return (
    <div 
      className={cn("flex items-center justify-end space-x-2", className)}
      {...props}
    >
      {showPageSizeOptions && onPageSizeChange && (
        <div className="flex items-center mr-4 space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              const newSize = parseInt(value, 10)
              onPageSizeChange(newSize)
              // When changing page size, reset to first page to avoid issues
              onPageChange(0)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      {showPageNumbers && pageButtons.length > 0 && (
        <div className="flex items-center gap-1">
          {pageButtons.map((pageIndex) => (
            <Button
              key={pageIndex}
              variant={pageIndex === page ? "default" : "outline"}
              size="sm"
              className="w-8"
              onClick={() => onPageChange(pageIndex)}
              disabled={isLoading}
            >
              {pageIndex + 1}
            </Button>
          ))}
        </div>
      )}
      
      {!showPageNumbers && (
        <div className="mx-2 text-sm">
          Page {page + 1} of {totalPages}
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1 || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  )
} 