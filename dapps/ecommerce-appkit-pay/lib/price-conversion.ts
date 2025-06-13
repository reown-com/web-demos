interface CoinGeckoPriceResponse {
  [coinId: string]: {
    usd: number
  }
}

interface ConversionResult {
  convertedAmount: number
  exchangeRate: number
  originalAmount: number
}

interface CachedPriceData {
  data: CoinGeckoPriceResponse
  timestamp: number
}

const CACHE_DURATION = 30 * 1000 // 30 seconds in milliseconds
const CACHE_KEY_PREFIX = 'coingecko_price_'

/**
 * Gets cached price data from localStorage
 * @param cacheKey - Cache key for the specific coin request
 * @returns Cached data if valid, null otherwise
 */
function getCachedPrices(cacheKey: string): CoinGeckoPriceResponse | null {
  try {
    const cached = localStorage.getItem(cacheKey)
    if (!cached) return null
    
    const cachedData: CachedPriceData = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid (within 30 seconds)
    if (now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data
    }
    
    // Cache expired, remove it
    localStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.error('Error reading price cache:', error)
    return null
  }
}

/**
 * Caches price data in localStorage
 * @param cacheKey - Cache key for the specific coin request
 * @param data - Price data to cache
 */
function cachePrices(cacheKey: string, data: CoinGeckoPriceResponse): void {
  try {
    const cachedData: CachedPriceData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(cacheKey, JSON.stringify(cachedData))
  } catch (error) {
    console.error('Error caching price data:', error)
  }
}

/**
 * Fetches cryptocurrency prices from CoinGecko API with caching
 * @param coinIds - Array of coin IDs (e.g., ['ethereum', 'bitcoin'])
 * @returns Promise with price data
 */
export async function fetchCryptoPrices(coinIds: string[]): Promise<CoinGeckoPriceResponse> {
  const sortedCoinIds = coinIds.sort() // Sort for consistent cache keys
  const cacheKey = `${CACHE_KEY_PREFIX}${sortedCoinIds.join(',').toLowerCase()}`
  
  // Try to get cached data first
  const cachedData = getCachedPrices(cacheKey)
  if (cachedData) {
    console.log('Using cached price data for:', sortedCoinIds)
    return cachedData
  }
  
  // Cache miss, fetch from API
  const url = new URL('https://api.coingecko.com/api/v3/simple/price')
  url.searchParams.set('ids', sortedCoinIds.join(',').toLowerCase())
  url.searchParams.set('vs_currencies', 'usd')
  
  try {
    console.log('Fetching fresh price data from CoinGecko for:', sortedCoinIds)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Cache the response
    cachePrices(cacheKey, data)
    
    return data
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error)
    throw new Error('Unable to fetch current crypto prices. Please try again.')
  }
}

/**
 * Converts USD amount to cryptocurrency amount using current market price
 * @param usdAmount - Amount in USD
 * @param cryptoSymbol - Cryptocurrency symbol (e.g., 'ETH')
 * @returns Promise with conversion result
 */
export async function convertUSDToCrypto(
  usdAmount: number, 
  cryptoSymbol: string
): Promise<ConversionResult> {
  // Map symbols to CoinGecko IDs
  const symbolToId: Record<string, string> = {
    'ETH': 'ethereum',
    'BTC': 'bitcoin',
    'USDC': 'usd-coin',
    // Add more mappings as needed
  }
  
  const coinId = symbolToId[cryptoSymbol.toUpperCase()]
  
  if (!coinId) {
    throw new Error(`Unsupported cryptocurrency symbol: ${cryptoSymbol}`)
  }
  
  // For stablecoins like USDC, return 1:1 conversion
  if (cryptoSymbol.toUpperCase() === 'USDC') {
    return {
      convertedAmount: usdAmount,
      exchangeRate: 1,
      originalAmount: usdAmount
    }
  }
  
  try {
    const priceData = await fetchCryptoPrices([coinId])
    const cryptoPrice = priceData[coinId]?.usd
    
    if (!cryptoPrice || cryptoPrice <= 0) {
      throw new Error(`Unable to get valid price for ${cryptoSymbol}`)
    }
    
    const convertedAmount = parseFloat((usdAmount / cryptoPrice).toFixed(6))
    
    return {
      convertedAmount,
      exchangeRate: cryptoPrice,
      originalAmount: usdAmount
    }
  } catch (error) {
    console.error(`Price conversion error for ${cryptoSymbol}:`, error)
    throw error
  }
}

/**
 * Gets the cryptocurrency symbol from payment asset ID
 * @param paymentAssetId - Payment asset ID (e.g., 'baseETH', 'baseUSDC')
 * @returns Cryptocurrency symbol
 */
export function getSymbolFromAssetId(paymentAssetId: string): string {
  // Map asset IDs to symbols
  const assetIdToSymbol: Record<string, string> = {
    'baseETH': 'ETH',
    'baseSepoliaETH': 'ETH',
    'baseUSDC': 'USDC',
    // Add more mappings as needed
  }
  
  return assetIdToSymbol[paymentAssetId] || 'ETH'
}

/**
 * Formats crypto amount for display
 * @param amount - Crypto amount
 * @param symbol - Crypto symbol
 * @returns Formatted string
 */
export function formatCryptoAmount(amount: number, symbol: string): string {
  const decimals = symbol === 'ETH' ? 6 : 2
  return `${amount.toLocaleString('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  })} ${symbol}`
} 