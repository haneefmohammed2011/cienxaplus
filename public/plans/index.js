const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your secret key

admin.initializeApp();

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Get userId and plan from the request body
  const { userId, plan } = req.body;
  if (!userId || !plan) {
    return res.status(400).send('Missing userId or plan');
  }

  // Determine price based on the selected plan
  let amount = 0;
  let planName = '';
  if (plan === 'basic') {
    amount = 899; // $8.99 in cents
    planName = 'Cinexa Basic';
  } else if (plan === 'premium') {
    amount = 1299; // $12.99 in cents
    planName = 'Cinexa Premium';
  } else if (plan === 'ultimate') {
    amount = 1899; // $18.99 in cents
    planName = 'Cinexa Ultimate';
  } else {
    return res.status(400).send('Invalid plan');
  }

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      // Replace these URLs with your actual success and cancel pages.
      success_url: 'https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://your-domain.com/cancel',
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    // Send the session URL back to the client
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
});
