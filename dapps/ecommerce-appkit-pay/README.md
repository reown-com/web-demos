# E-commerce AppKit Pay Demo

A modern Next.js e-commerce demo showcasing **Reown AppKit Pay** integration with persistent settings and beautiful UI.

## Features

- 🛒 **Shopping Cart**: Add products, manage quantities, and checkout
- 💳 **Dual Payment Options**: Traditional credit card and cryptocurrency payments
- 🔗 **AppKit Pay Integration**: Seamless crypto payments with USDC, ETH on Base and Base Sepolia
- ⚙️ **Persistent Settings**: Configure recipient address and payment preferences with localStorage
- 🎨 **Modern UI**: Built with Tailwind CSS and Shadcn UI components
- 📱 **Responsive Design**: Works perfectly on desktop and mobile

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ecommerce-appkit-pay
   pnpm install
   ```

2. **Configure Environment**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
   ```
   Get your Project ID from [Reown Cloud](https://cloud.reown.com/)

3. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Configure Settings**
   - Click the settings icon (⚙️) in the bottom-left corner
   - Add your wallet address as the recipient for crypto payments
   - Choose your preferred payment asset (USDC, ETH)
   - Toggle testnet support if needed

## AppKit Pay Integration

This demo integrates Reown AppKit Pay directly into the checkout flow:

- **Settings Management**: Recipient address and payment preferences are stored in localStorage
- **Payment Flow**: When "Pay with Crypto" is selected, `openPay` is called directly in the checkout handler
- **Asset Selection**: Support for baseUSDC, baseETH, and baseSepoliaETH
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Project Structure

```
├── app/
│   ├── checkout/page.tsx         # Main checkout page with AppKit Pay
│   └── layout.tsx                # Root layout with providers
├── components/
│   ├── settings-drawer.tsx       # Persistent settings UI
│   ├── appkit-provider.tsx       # AppKit/Wagmi providers
│   └── ui/                       # Shadcn UI components
├── lib/
│   ├── settings-context.tsx      # Settings state management
│   ├── appkit-config.ts          # AppKit Pay configuration
│   ├── cart-context.tsx          # Shopping cart state
│   └── types.ts                  # TypeScript definitions
└── public/                       # Static assets
```

## Usage

1. **Browse Products**: View available merchandise on the homepage
2. **Add to Cart**: Select sizes and add items to your shopping cart
3. **Checkout**: Navigate to checkout and fill in shipping information
4. **Payment Method**: Choose between credit card or cryptocurrency
5. **Crypto Payment**: If crypto is selected, AppKit Pay modal opens automatically
6. **Settings**: Configure recipient address and preferences via the settings drawer

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context API
- **Crypto Payments**: Reown AppKit Pay
- **Blockchain**: Wagmi + Viem
- **Storage**: localStorage for settings persistence

## Learn More

- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [AppKit Pay Integration Guide](https://docs.reown.com/appkit/react/payments)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy this demo is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `NEXT_PUBLIC_REOWN_PROJECT_ID` environment variable
4. Deploy!
