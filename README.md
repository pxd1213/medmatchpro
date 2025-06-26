# MedMatch Pro - Medical Device RFX Platform

A modern RFX platform connecting medical device manufacturers with consultants.

## Features

- Role-based authentication (Manufacturer/Consultant)
- Project management and bidding system
- Profile management
- Stripe payment integration
- Responsive design with Chakra UI

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with the following variables:
```
# Netlify Identity
NETLIFY_AUTH_URL=https://your-site.netlify.app/.netlify/identity
NETLIFY_REDIRECT_URL=https://your-site.netlify.app/

# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Stripe
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Site Configuration
SITE_URL=https://your-site.netlify.app
```

3. Start the development server:
```bash
npm start
```

## Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. In Netlify dashboard:
   - Go to Site settings > Build & deploy
   - Add these environment variables:
     - NETLIFY_AUTH_URL
     - NETLIFY_REDIRECT_URL
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_ANON_KEY
     - REACT_APP_STRIPE_PUBLIC_KEY
     - STRIPE_SECRET_KEY
     - SITE_URL
   - Add these build settings:
     - Build command: npm run build
     - Publish directory: build

4. Deploy to Netlify

## Database Setup

1. Create a new Supabase project
2. In Supabase dashboard:
   - Create these tables:
     - profiles (id, role, full_name, company_name, country, bio, expertise, certifications)
     - projects (id, manufacturer_id, title, description, device_type, country, regulatory_requirements, timeline, budget_range, status)
     - bids (id, project_id, consultant_id, proposal, price, status)
     - reviews (id, from_user_id, to_user_id, rating, comment)
3. Set up Row Level Security (RLS) policies for each table
4. Add database functions for project management and bidding

## Stripe Setup

1. Create a Stripe account
2. Get your Stripe API keys
3. Set up Stripe Connect for consultant payments
4. Configure Stripe webhook endpoints in Netlify

## Netlify Identity Setup

1. Enable Netlify Identity in your site settings
2. Configure role-based access control
3. Set up custom authentication flows for manufacturer/consultant roles

## Local Development

For local development, you can use the VITE_ prefixed variables in your .env.local file:
```
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

## Security

- Never commit your .env files to version control
- Use environment variables for all sensitive information
- Implement proper error handling for API calls
- Use HTTPS for all production deployments
- Regularly update dependencies and security patches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Tech Stack

- React with TypeScript
- Chakra UI
- Netlify Identity
- Stripe Connect
- Supabase
- React Router

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utility functions
└── App.tsx        # Main application component
```
