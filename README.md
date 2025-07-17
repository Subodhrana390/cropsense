# CropSense AI

CropSense AI is a smart farming assistant built with Next.js and Google's Generative AI. It provides farmers with intelligent tools to make informed decisions, from crop selection to market price estimation, and fosters a community through a built-in chat feature.

## Features

-   **User Authentication**: Secure sign-up and login system for a personalized experience.
-   **Dashboard**: A central hub providing access to all the application's features.
-   **Seasonal Crop Suggestion**:
    -   Get AI-powered recommendations for crops based on location, season, and soil type.
    -   Automatically detect user location via browser geolocation.
    -   Click on a suggested crop to get detailed information, including planting advice and climatic benefits.
    -   Receive responses in multiple Indian languages.
    -   Listen to the advice with the text-to-speech feature.
-   **Crop Identifier**:
    -   Upload an image of a crop to have the AI identify it.
    -   Receive detailed information including a description, ideal growing conditions, common pests, and an estimated market price in Indian Rupees (₹).
-   **AI Farming Assistant**:
    -   An interactive chatbot to answer any farming-related questions.
    -   Supports both text and voice input (speech-to-text).
    -   Provides answers in multiple Indian languages.
    -   Listen to the AI's response with the text-to-speech feature.
-   **Community Chat**:
    -   A real-time chat feature for users to connect with and message each other.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **Authentication**: JWT-based session management

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance.
-   A [Google AI API Key](https://ai.google.dev/).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following variables:

    ```env
    # Your MongoDB connection string
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

    # Your Google AI API Key for Genkit
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"

    # A secret key for signing JWTs (any long, random string will do)
    JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
    ```

### Running the Application

This application requires two processes to run concurrently: the Next.js frontend and the Genkit development server for the AI flows.

1.  **Start the Next.js development server:**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

2.  **Start the Genkit development server:**
    Open a second terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit toolchain, which makes the AI flows available to the Next.js application.

Once both servers are running, you can access the application in your browser at the specified localhost address.
