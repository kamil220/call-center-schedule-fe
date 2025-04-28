interface HourData {
  hour: number
  departments: Record<string, number>
}

export function groupHoursIntoBlocks(staffingData: HourData[], blockSize = 6): HourData[][] {
  const blocks = []
  for (let i = 0; i < staffingData.length; i += blockSize) {
    blocks.push(staffingData.slice(i, i + blockSize))
  }
  return blocks
} 