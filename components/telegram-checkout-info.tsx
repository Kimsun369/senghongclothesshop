import { MessageCircle, CheckCircle, Truck, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TelegramCheckoutInfo() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-[#0088cc]" />
          <span>How to Order via Telegram</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-[#0088cc]/10 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-[#0088cc]" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">1. Send Order</h4>
              <p className="text-sm text-muted-foreground">
                Click "Buy via Telegram" to send your order details to our chat
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">2. Confirm Details</h4>
              <p className="text-sm text-muted-foreground">We'll confirm your order and collect delivery information</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Truck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">3. Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Pay on delivery and receive your items quickly</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#0088cc]/5 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-4 w-4 text-[#0088cc]" />
            <span className="font-medium text-sm">Payment Options</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Cash on Delivery • Bank Transfer • Mobile Payment • Credit Card
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
