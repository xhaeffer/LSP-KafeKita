import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type TableSectionProps = {
  tableNumber: string
  setTableNumber: (val: string) => void
  cancel: () => void
  proceed: () => void
}

const TableSection = ({
  tableNumber,
  setTableNumber,
  cancel,
  proceed,
}: TableSectionProps) => {
  return (
    <div className="min-h-screen bg-gray-200 gap-8 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-64 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Table Number</h1>
      <Input
        value={tableNumber}
        onChange={e => setTableNumber(e.target.value)}
        
        className="text-center sm:text-2xl md:text-2xl w-24 h-12 mb-8"
      />
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <Button variant="secondary" className="text-xl py-6" onClick={cancel}>
          Cancel
        </Button>
        <Button className="text-xl py-6" onClick={proceed}>
          Proceed
        </Button>
      </div>
    </div>
  )
}

export default TableSection
