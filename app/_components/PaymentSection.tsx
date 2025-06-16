import { Button } from "@/components/ui/button"

import { OrderPaymentMethod } from "@/types/order"

type PaymentSectionProps = {
  paymentMethod: OrderPaymentMethod
  setPaymentMethod: (val: OrderPaymentMethod) => void
  cancel: () => void
  submit: () => void
}

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  cancel,
  submit,
}: PaymentSectionProps) => {
  return (
    <div className="min-h-screen bg-gray-200 gap-12 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-64 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Payment Method</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {(["cash", "card", "qris"] as OrderPaymentMethod[]).map(method => (
          <Button
            key={method}
            variant={paymentMethod === method ? "default" : "outline"}
            onClick={() => setPaymentMethod(method)}
            className="size-24 max-w-[8rem] text-lg capitalize"
          >
            {method}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <Button variant="secondary" className="text-xl py-6" onClick={cancel}>
          Cancel
        </Button>
        <Button className="text-xl py-6" onClick={submit}>
          Proceed
        </Button>
      </div>
    </div>
  )
}

export default PaymentSection
