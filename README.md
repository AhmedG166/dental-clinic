# Dental Clinic Booking System 🦷

A full-stack web application I built to help dental clinics manage their appointments online. Patients can book appointments, choose their preferred doctor and time slot, and receive automatic email confirmations.

## What I Built

This is a complete booking system where patients can:
- Browse available dental services
- Choose a doctor based on their specialization
- Pick a date and time that works for them
- Get instant email confirmation
- Complete payment (demo version for now)

I also built an admin panel concept that can manage services, doctors, and view all appointments.

## Why I Built This

I wanted to challenge myself by building a real-world application that solves an actual problem. Many small clinics still rely on phone calls for bookings, which can be inefficient. This system automates the entire process.

It also gave me a chance to work with both frontend and backend, databases, email systems, and payment integrations - basically everything you'd need in a production app.

## Tech Stack

**Frontend:**
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Framer Motion for smooth animations
- React Hook Form for form handling

**Backend:**
- Node.js with Express
- PostgreSQL database
- Prisma ORM for database queries
- Nodemailer for sending emails
- JWT for authentication (ready to use)

## Features

### For Patients
- **Easy Booking:** Just fill out a simple form with your info, pick a service, doctor, date, and time
- **Email Confirmation:** Automatic emails sent immediately after booking
- **Responsive Design:** Works perfectly on phones, tablets, and desktops
- **Time Slot Availability:** Only shows available times to avoid conflicts

### For Clinic Staff
- **Service Management:** Add or update dental services and prices
- **Doctor Profiles:** Manage doctor information and specializations
- **Appointment View:** See all bookings in one place

### Technical Features
- Real-time form validation
- Smooth animations and transitions
- Secure database with Prisma
- Clean API design
- Environment variables for sensitive data

## How to Run Locally

If you want to test this project on your machine:

### 1. Clone it
git clone https://github.com/AhmedG166/dental-clinic-fullstack.git
cd dental-clinic



### 2. Setup the Backend
cd backend
npm install

Create a .env file and add your credentials
Check .env.example for what you need
Generate Prisma client and setup database
npx prisma generate
npx prisma db push

Start the server
npm run dev



The backend will run on http://localhost:5000

### 3. Setup the Frontend
cd frontend
npm install

Create .env.local and add:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start the development server
npm run dev



The frontend will run on http://localhost:3000

### 4. Environment Variables

**Backend (.env):**
You'll need:
- PostgreSQL database URL
- Gmail account for sending emails (use App Password, not your regular password)
- A random string for JWT_SECRET

**Frontend (.env.local):**
- Just the backend API URL

Check the `.env.example` files in each folder for the exact format.

## What I Learned

Building this taught me a lot:
- How to structure a full-stack application
- Working with databases and ORMs (Prisma is amazing!)
- Sending automated emails programmatically
- State management in React
- API design and REST principles
- Form validation and error handling
- Working with environment variables securely

## Challenges I Faced

**CORS Issues:** Spent some time figuring out why the frontend couldn't talk to the backend. Fixed it by properly configuring CORS middleware.

**Email Delivery:** Gmail has strict security, so I had to learn about App Passwords instead of using regular passwords.

**Time Slots Logic:** Making sure double bookings don't happen required careful database queries.

**TypeScript:** This was my first big TypeScript project, so there was a learning curve.

## What's Next

If I continue working on this, I'd add:
- Patient dashboard to view and manage their appointments
- Admin authentication with proper login
- SMS notifications in addition to email
- Calendar integration (Google Calendar, iCal)
- Payment processing with real Stripe integration
- Multi-language support
- Appointment reminders (24 hours before)

## Project Structure

dental-clinic-fullstack/
│
├── frontend/ # Next.js application
│ ├── src/
│ │ ├── app/ # Pages and layouts
│ │ ├── components/ # Reusable React components
│ │ └── lib/ # API utilities and helpers
│ └── package.json
│
├── backend/ # Express API
│ ├── src/
│ │ ├── routes/ # API endpoints
│ │ ├── config/ # Database and email config
│ │ └── utils/ # Helper functions
│ ├── prisma/ # Database schema
│ └── package.json
│
└── README.md



## Screenshots

*(Add your screenshots here after taking them)*

## Note

This is a portfolio/demo project. The payment system is in demo mode (no real transactions). If you want to use this in production, you'd need to:
- Add proper authentication and authorization
- Implement real Stripe payments
- Add more security measures
- Set up proper error logging
- Add rate limiting
- Write tests

## Contact

Built by **AhmedG**

Feel free to reach out if you have questions or want to chat about the project!

- GitHub: [AhmedG166](https://github.com/AhmedG166)

---

**Thanks for checking out my project!** If you found it interesting or useful, a star ⭐ would mean a lot!
