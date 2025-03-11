TechRadar Store Finder
This project is a full-featured store finder application built with Next.js, React, and Tailwind CSS. It combines interactive maps, searchable store listings, dashboards for store owners, and an extensive UI component library (including Radix UI and ShadCN UI) to deliver a modern, responsive experience.

Features
Store Explorer:
Filter and view nearby stores using the interactive map and search functionality.

Interactive Map:
Display store locations, calculate user distance, and show detailed store info.

Dashboard & Inventory Management:
Manage store items and inventory if you are a store owner.

Responsive UI:
Built using Next.js server and client components with Tailwind CSS for consistent styling across devices.

Custom UI Components:
Includes modals, drawers, toasts, calendars, and additional components built with Radix and ShadCN UI libraries.

Supabase Integration:
Fetch data such as store listings and user details through Supabase client integration.

Getting Started
Prerequisites
Node.js (v14+)
Yarn or npm
Supabase account (for database and authentication)
Installation
Clone the repository:

Install dependencies:

or

Configure Environment Variables:

Create a .env.local file at the root with your Supabase credentials and any other required settings. For example:

Running Locally
Start the development server:

or

Visit http://localhost:3000 to view the app.

Project Structure
/app
Next.js pages and layouts, including entry points for home, dashboard, and store owner pages.

/components
React components which include:

StoreExplorer, StoreMap, StoreList, and additional store-related components.
UI components (sidebar, navigation-menu, dropdown-menu, toast, card, calendar, etc.).
/hooks
Custom hooks such as use-toast and use-mobile.

/lib
Utility functions and type definitions including the Supabase client.

/styles & /app/globals.css
Global styles using Tailwind CSS along with custom configuration via tailwind.config.js.

components.json
UI configuration for shadcn components with project-specific settings.

Build & Deployment
To build the project for production:

Then start the production server:

Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the ISC License. See the LICENSE file for details.

This README gives an overview of the codebase, instructions on installation and running locally, as well as insights into project structure and deployment. Adjust details (especially regarding environment variables and license) as needed for your specific setup.