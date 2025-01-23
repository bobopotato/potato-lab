<img src="readmeSamples/image.png" width="200" />

# Personalized Job Scheduler and Map Visualization

This project aims to enhance job search efficiency by allowing users to create personalized schedulers to collect (scrape) data from multiple job platforms. It leverages various frameworks and techniques such as Next.js, Node.js with Express, AWS, Tailwind, shadcn, and primarily Nx monorepo.

## Built With

- **Monorepo Management**:
  - <a href="https://github.com/nrwl/nx" target="_blank">Nx -Smart Monorepos</a>
- **Front-end**:
  - Next.js
  - Tailwind CSS
  - React Query
  - Zustand
  - <a href="https://ui.shadcn.com/" target="_blank">Shadcn/ui</a>
- **Back-end**:
  - Node.js
  - Express.js
- **Infrastructure**:
  - AWS Lambda
  - AWS S3
  - AWS SQS
  - AWS EventBridge
- **Database**:
  - Postgresql with <a href="tembo.io" target="_blank">tembo.io</a>
- **Auth**:
  - Custom auth with JWT refresh token

## Project Features

- **Personalized Scheduler**: Allows users to create custom schedules for scraping data from various job platforms.
- **Data Collection**: Scrapes job data from multiple platforms to overcome the limitations of standard search engines.
- **Map Visualization**: Displays collected company data on an interactive map.
- **Nx Monorepo**: Utilizes Nx to manage a monorepo with multiple frameworks and services.

## Guide

Follow these steps to automate your job hunting experience:

1. **Create a new account and login to introduction page**:
   ![alt text](readmeSamples/image-2.png)

2. **Get started by creating a scheduler**
   ![alt text](readmeSamples/image-3.png)

3. **Either wait for the automation to trigger or trigger manually to collect the data**
   ![alt text](readmeSamples/image-4.png)

4. **After triggering the scrapper, wait for a moment for the data to be inserted. And finally utilise the job filtering and map visualization features!**
   ![alt text](readmeSamples/image-5.png)
   ![alt text](readmeSamples/image-6.png)

## Disclaimer

**_This is just experimental project (for me to learn). The UI might look quite crappy_ :D**

- <img src="https://i.scdn.co/image/ab67616d0000b2730eedc93454627999037797c0" width="80" height="80" />
- But these is what i have learned:
  - Nx Monorepos
  - AWS Serverless Application
  - Github actions - CI/CD workflows
