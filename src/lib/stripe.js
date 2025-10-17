import { loadStripe } from '@stripe/stripe-js'

// Debug environment variables
console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET')

// Fallback key if environment variable is not available
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rut6V2MKT6HumxnDZ7DwJN9DuigVCcStaqzS7OIUYQRA7OLgMpQfeHq8oP7gchdTGLXsvbFUK2Kg89YVfkaLSGD00sIMtt0H0'

// Initialize Stripe with error handling
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Price IDs for the subscription plans
export const PRICE_IDS = {
  STUDENT_MONTHLY: 'price_1RutXI2MKT6Humxnh0WBkhCp',
  STUDENT_YEARLY: 'price_1SB9e52MKT6Humxnx7qxZ2hj',
  TEACHER_MONTHLY: 'price_1SBPN62MKT6HumxnBoQgAdd0',
  TEACHER_YEARLY: 'price_1SB9co2MKT6HumxnOSALvAM4'
}

// Modern Stripe Checkout approach - create session on backend first
export const createCheckoutSession = async (priceId, userEmail) => {
  try {
    console.log('Creating Stripe checkout session...')
    console.log('Price ID:', priceId)
    console.log('User Email:', userEmail)
    
    // Call our backend to create the checkout session
    const response = await fetch('http://localhost:3001/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/pricing`,
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const session = await response.json()
    console.log('Checkout session created:', session)
    
    if (session.error) {
      throw new Error(session.error)
    }
    
    // Redirect to Stripe Checkout
    window.location.href = session.url
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Legacy function name for backward compatibility
export const redirectToCheckout = createCheckoutSession
