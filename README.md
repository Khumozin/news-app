# News App

This README provides an overview of a News App built with Angular, Angular Material & Tailwindcss, Semantic Release, GitHub Actions for CI/CD, Cypress for end-to-end tests, and Jasmine & Karma for unit tests. This app fetches news data from [newsapi.org](https://newsapi.org/) using their REST API.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Continuous Integration](#continuous-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- Display news articles from various sources and categories.
- Search for news articles using keywords.
- View detailed information about individual news articles.
- Responsive design for mobile and desktop.
- End-to-end tests to ensure app functionality.
- Unit tests for robust code quality.

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/news-app.git
   ```

2. Change to the project directory:

   ```bash
   cd news-app
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Build the application:

   ```bash
   ng build
   ```

## Project Structure

The project structure is organized as follows:

- `src/app`: Contains the Angular application components, services, and modules.
- `src/assets`: Includes static assets like images, icons, and styles.
- `cypress`: Contains end-to-end test files.
- `karma.conf.js`: Configuration file for Karma and Jasmine unit-testing.
- `.github/workflows`: Configuration files for Github Actions and Semantic Release.

## Running the Application

To run the application locally, use the following command:

```bash
ng serve
```

This will start a development server, and you can access the app in your web browser at `http://localhost:4200`.

## Running Tests

### Unit Tests with Jasmine & Karma

You can run unit tests using the following command:

```bash
ng test --code-coverage
```

### End-to-End Tests with Cypress

You can run end-to-end tests using the following command:

```bash
ng serve --port=4200
```

```bash
npx cypress run
```

## Continuous Integration

Continuous Integration (CI) is set up using GitHub Actions to automate the build, test, and deployment processes. The workflow can be found in the .github/workflows directory. Make sure to configure the necessary environment variables and deployment settings in your CI/CD platform.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test them thoroughly.
4. Create a pull request with a clear description of you changes.


## License
This News App project is licensed under the `MIT License`. Feel free to use and modify it as per your requirements.