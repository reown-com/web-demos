'use client'

import { useState } from 'react'
import { Settings, Wallet, RotateCcw, Copy, Check } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/lib/settings-context'
import { paymentAssetOptions } from '@/lib/appkit-config'
import { toast } from 'sonner'

export function SettingsDrawer() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [copiedAddress, setCopiedAddress] = useState(false)

  const handleRecipientAddressChange = (value: string) => {
    updateSettings({ recipientAddress: value })
  }

  const handlePaymentAssetChange = (value: string) => {
    updateSettings({ defaultPaymentAsset: value as any })
  }

  const handleCopyAddress = async () => {
    if (settings.recipientAddress) {
      try {
        await navigator.clipboard.writeText(settings.recipientAddress)
        setCopiedAddress(true)
        toast.success('Address copied to clipboard')
        setTimeout(() => setCopiedAddress(false), 2000)
      } catch (error) {
        toast.error('Failed to copy address')
      }
    }
  }

  const handleReset = () => {
    resetSettings()
    toast.success('Settings reset to defaults')
  }

  return (
    <>
      {/* Floating Settings Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-card border border-border hover:bg-accent"
            >
              <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Open settings</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-6 px-6">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5" />
                AppKit Pay Settings
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 px-6 pb-6">
              {/* Recipient Address Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <Label className="text-sm font-medium">Recipient Address</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="0x..."
                      value={settings.recipientAddress}
                      onChange={(e) => handleRecipientAddressChange(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyAddress}
                      disabled={!settings.recipientAddress}
                    >
                      {copiedAddress ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the wallet address where crypto payments will be received
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment Asset Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Default Payment Asset</Label>
                <RadioGroup
                  value={settings.defaultPaymentAsset}
                  onValueChange={handlePaymentAssetChange}
                  className="space-y-2"
                >
                  {paymentAssetOptions.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center space-x-3 rounded-lg border p-3 transition-all cursor-pointer hover:bg-accent/50"
                    >
                      <RadioGroupItem value={asset.id} id={asset.id} />
                      <Label htmlFor={asset.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {asset.symbol} on {asset.network}
                            </div>
                          </div>
                          {asset.testnet && (
                            <Badge variant="secondary" className="text-xs">
                              Testnet
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Reset Settings */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 