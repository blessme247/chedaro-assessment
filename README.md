# Chedaro Frontend Assessment

This is a multi-tenant team management app built with **Next.js**, with client side authentication and route protection, including a login page and a dashboard for logged-in users.

<!-- **Demo: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)** -->

## Features

- Login page
- Dashboard pages with CRUD operations on users/organizations
- Basic RBAC with Super Admin, Admin and Employee roles
- Email/password authentication with user data stored to localStorage
- Custom hook to protect logged-in routes
- schema validation with Zod
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Mock Database**: [Mirage](https://miragejs.com/docs)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/blessme247/chedaro-assessment
cd chedaro-assessment
pnpm install
```

## Running Locally


This will create the following users and organization:

- Super admin User: `super.admin@email.com`
- Password: `Test@12345`

- Admin User: `admin@email.com`
- Password: `Test@12345`

- Organization: `Rangers`

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

