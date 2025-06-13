'use client'

import { useState, useEffect } from 'react'
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
import { CustomAssetConfig } from '@/lib/types'
import { toast } from 'sonner'

export function SettingsDrawer() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [copiedAddress, setCopiedAddress] = useState(false)
  
  // Custom asset form state
  const [customAsset, setCustomAsset] = useState<CustomAssetConfig>({
    network: '',
    asset: '',
    metadata: {
      name: '',
      symbol: '',
      decimals: 6
    }
  })

  // Sync custom asset state with settings from localStorage
  useEffect(() => {
    if (settings.customAsset) {
      setCustomAsset(settings.customAsset)
    }
  }, [settings.customAsset])

  const handleRecipientAddressChange = (value: string) => {
    updateSettings({ recipientAddress: value })
  }

  const handlePaymentAssetChange = (value: string) => {
    updateSettings({ defaultPaymentAsset: value as any })
  }

  const handleCustomAssetChange = (field: string, value: string | number) => {
    if (field.startsWith('metadata.')) {
      const metadataField = field.replace('metadata.', '')
      setCustomAsset(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }))
    } else {
      setCustomAsset(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSaveCustomAsset = () => {
    // Validate custom asset fields
    if (!customAsset.network || !customAsset.asset || !customAsset.metadata.name || !customAsset.metadata.symbol) {
      toast.error('Please fill in all custom asset fields')
      return
    }
    
    updateSettings({ 
      customAsset,
      defaultPaymentAsset: 'custom'
    })
    toast.success('Custom asset saved successfully')
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
    setCustomAsset({
      network: '',
      asset: '',
      metadata: {
        name: '',
        symbol: '',
        decimals: 6
      }
    })
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

              {/* Custom Asset Configuration */}
              {settings.defaultPaymentAsset === 'custom' && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Custom Asset Configuration</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="custom-network" className="text-xs">Network (CAIP-2 format)</Label>
                        <Input
                          id="custom-network"
                          placeholder="e.g., solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
                          value={customAsset.network}
                          onChange={(e) => handleCustomAssetChange('network', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-asset" className="text-xs">Asset Address</Label>
                        <Input
                          id="custom-asset"
                          placeholder="Asset contract/mint address"
                          value={customAsset.asset}
                          onChange={(e) => handleCustomAssetChange('asset', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="custom-name" className="text-xs">Name</Label>
                          <Input
                            id="custom-name"
                            placeholder="USD Coin"
                            value={customAsset.metadata.name}
                            onChange={(e) => handleCustomAssetChange('metadata.name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="custom-symbol" className="text-xs">Symbol</Label>
                          <Input
                            id="custom-symbol"
                            placeholder="USDC"
                            value={customAsset.metadata.symbol}
                            onChange={(e) => handleCustomAssetChange('metadata.symbol', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="custom-decimals" className="text-xs">Decimals</Label>
                        <Input
                          id="custom-decimals"
                          type="number"
                          placeholder="6"
                          value={customAsset.metadata.decimals}
                          onChange={(e) => handleCustomAssetChange('metadata.decimals', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSaveCustomAsset}
                        className="w-full"
                        variant="outline"
                      >
                        Save Custom Asset
                      </Button>
                    </div>
                  </div>
                </>
              )}

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