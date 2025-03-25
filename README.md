# TechRadar - Store Finder Application

A modern web application built with Next.js that helps users find and interact with stores in their area. This application includes features for both customers and store owners.

## Features

### For Customers
- 🔍 **Store Search & Discovery**
  - Interactive map interface showing store locations
  - Advanced filtering options for store search
  - Detailed store information including opening hours and contact details
  - Real-time store status (Open/Closed)

- 🛍️ **Inventory Management**
  - View available products at each store
  - Real-time inventory updates
  - Product details including price and availability

- 💬 **AI-Powered Chatbot**
  - Interactive chatbot for store inquiries
  - Instant responses to common questions
  - Store-specific information and recommendations

### For Store Owners
- 📊 **Dashboard**
  - Inventory management interface
  - Store profile customization
  - Business analytics and insights

- 🔐 **Authentication**
  - Secure sign-up and sign-in
  - Role-based access control
  - Protected routes for store owners

### Technical Features
- 🗺️ **Interactive Maps**
  - OpenStreetMap integration
  - Custom markers for store locations
  - Responsive map interface

- 🎨 **Modern UI/UX**
  - Responsive design
  - Dark/Light mode support
  - Intuitive navigation

- 🔒 **Security**
  - Supabase authentication
  - Protected API routes
  - Secure data handling

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet, OpenStreetMap
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/aljojoby9/TechRadar.git
```

2. Install dependencies:
```bash
cd TechRadar
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
TechRadar/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── stores/            # Store-related pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── chatbot/          # Chatbot components
│   ├── inventory/        # Inventory management
│   └── map/              # Map-related components
├── lib/                   # Utility functions and types
└── public/               # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 