# E-commerce with Crypto Payments Made Simple

**Experience the future of online shopping with seamless cryptocurrency payments.**

This demo showcases how **Reown AppKit Pay** transforms the complexity of crypto payments into a simple, user-friendly checkout experience that rivals traditional payment methods.

## Why AppKit Pay?

**Traditional crypto payments are complex:**
- Users need to manually enter recipient addresses (error-prone)
- Calculating gas fees and token amounts is confusing
- Multiple wallet interactions slow down checkout
- Network switching creates friction
- Technical knowledge required

**AppKit Pay solves these problems:**
- ✅ **One-click payments** - No manual address entry or amount calculations
- ✅ **Automatic network handling** - Seamlessly switches between Base and Base Sepolia
- ✅ **Gas fee management** - Users see total cost upfront, no surprises
- ✅ **Multiple payment options** - Support for USDC, ETH with simple selection
- ✅ **Error recovery** - Intelligent handling of failed transactions
- ✅ **Mobile optimized** - Works perfectly on all devices

## The Payment Experience

### For Customers
1. **Shop normally** - Browse products, add to cart, enter shipping details
2. **Choose crypto payment** - Select "Pay with Crypto" at checkout
3. **Connect wallet** - One-click wallet connection if not already connected
4. **Confirm payment** - Review total cost and confirm in one click
5. **Payment complete** - Transaction handled automatically

### For Merchants
- **Easy integration** - Just a few lines of code to add crypto payments
- **Persistent configuration** - Set recipient address and preferred tokens once
- **Reliable transactions** - Built-in retry logic and error handling
- **Real-time updates** - Transaction status updates automatically

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ecommerce-appkit-pay
   pnpm install
   ```

2. **Get Your Project ID**
   - Visit [Reown Cloud](https://cloud.reown.com/)
   - Create a new project
   - Copy your Project ID

3. **Configure Environment**
   ```bash
   echo "NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here" > .env.local
   ```

4. **Run the Demo**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Configure Payment Settings**
   - Click the settings icon (⚙️) in the bottom-left
   - Add your wallet address as the payment recipient
   - Choose preferred tokens (USDC, ETH)
   - Toggle testnet support if needed

## Key Features

### 🔄 **Seamless Integration**
AppKit Pay integrates directly into your existing checkout flow. When customers select crypto payment, the payment modal opens automatically with pre-configured settings.

### 💾 **Persistent Configuration**
Set your recipient address and payment preferences once. The app remembers your settings using localStorage, so you don't need to reconfigure every time.

### 🌐 **Multi-Network Support**
Automatically handles payments on:
- **Base Mainnet** (USDC, ETH)
- **Base Sepolia Testnet** (for testing)

### 📱 **Mobile-First Design**
The entire experience is optimized for mobile users, who make up the majority of online shoppers.

### 🛡️ **Error Handling**
Comprehensive error handling ensures users understand what's happening and can retry failed transactions easily.

## How It Works

```typescript
// Simple integration - when user clicks "Pay with Crypto"
const handleCryptoPayment = () => {
  openPay({
    amount: totalAmount,
    currency: 'USD',
    recipient: settings.recipientAddress,
    asset: settings.preferredAsset
  })
}
```

That's it! AppKit Pay handles:
- Wallet connection
- Network switching
- Token approval (if needed)
- Gas fee calculation
- Transaction submission
- Success/failure feedback

## Real-World Benefits

**For E-commerce Businesses:**
- Reduce payment processing fees compared to credit cards
- Access global crypto holders as customers
- Instant settlement with no chargebacks
- Lower fraud risk

**For Customers:**
- Privacy-focused payments
- Lower international transaction fees
- No need to share credit card information
- Support for various cryptocurrencies

## Try It Yourself

1. **Browse the demo store** - Add some merchandise to your cart
2. **Go through checkout** - Fill in shipping information as normal
3. **Select crypto payment** - Choose "Pay with Crypto" 
4. **Experience the simplicity** - See how easy crypto payments can be

Compare this experience to traditional crypto payments where you'd need to:
- Copy/paste wallet addresses manually
- Calculate token amounts yourself
- Handle gas fees separately
- Switch networks manually
- Monitor transaction status

## Learn More

- [AppKit Pay Documentation](https://docs.reown.com/appkit/react/payments)
- [Integration Guide](https://docs.reown.com/appkit)
- [Reown Cloud Console](https://cloud.reown.com/)

---

*This demo proves that crypto payments don't have to be complicated. With AppKit Pay, they can be as simple as any traditional payment method.*
