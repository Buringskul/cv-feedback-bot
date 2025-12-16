# TailorMyCV - AI-Powered Resume Analysis

# Test change by Edison

TailorMyCV is an intelligent web application that provides instant AI-powered feedback on your CV or resume. Upload your resume and receive a comprehensive analysis with actionable improvement suggestions, helping you create a more effective and professional CV.

## Features

- **AI-Powered Analysis**: Advanced algorithms analyze your resume content, structure, and formatting
- **Comprehensive Scoring**: Get detailed scores on different aspects of your resume
- **Actionable Feedback**: Receive specific suggestions for improvement
- **Instant Results**: Get feedback in seconds, not days
- **Modern Interface**: Clean, intuitive design built with modern web technologies

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (see Environment Variables section below)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - Your OpenAI API key
- `REDIS_URL` - (Optional) Redis connection URL. Defaults to `redis://localhost:6379` if not provided

### Redis Setup (Optional but Recommended)

Redis is used to cache CV analysis results, reducing OpenAI API usage and improving response times for duplicate analyses.

**Local Installation:**

1. Install Redis on your system:

   - **Windows**: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases) or use WSL
   - **macOS**: `brew install redis`
   - **Linux**: `sudo apt-get install redis-server` (Ubuntu/Debian)

2. Start Redis:

   ```sh
   redis-server
   ```

3. The application will automatically connect to `redis://localhost:6379` by default.

**Note:** If Redis is not available, the application will continue to work normally but without caching benefits. Cache errors are logged but do not affect the API functionality.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
