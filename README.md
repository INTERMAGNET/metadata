This project uses the React library to present Intermagnet Metadata from the Geomagnetism Community Metadata Database, which is hosted at BGS in the UK. The project was originally created using the [Create React App](https://github.com/facebook/create-react-app). Create React App was deprecated in 2025 and project was migrated to the [Vite framework](https://vite.dev/).

## Developing the project

The project has been successfully compiled on Ubuntu, but development should be possible on any Linux distribution that can run [Node](https://nodejs.org/en). To set up a development environment:

1. Install the Node Version Manager (nvm): https://github.com/nvm-sh/nvm
1. Use nvm to install node V22: 

```
   nvm install 22
   nvm use 22
```

To install the project dependencies:

```
    # To do a clean install, remove transitory dependency files
    rm -rf node_modules package-lock.json
    # Install the dependencies
    npm install
```

To run the project tests:

```
    npm run test
    npm run test:watch      # run tests and then wait for changes to files
    npm run test:coverage
```

To run the project:

```
    npm run dev
```

This will run a development server in the background and launch a web browser window where you can interact with the project components. The page will reload if you make edits. You will also see any lint errors in the console (you can run the linter separately: ```npm run lint```). The console also has a simple command structure allowing you to interact with the server - to see the available commands type "h<ENTER>".

To preview the project:

```
    npm run build
    npm run preview
```

This will build the project's static pages in the ./dist folder, then run a web server to view these static pages. This mirrors the action taken during deployment, so is a further check that the project is working correctly before commiting changes to GitHub.

## Deploying the project

A GitHub action (in .github/workflows/pages.yml) builds the Vite + React app and deploys the resulting static site to GitHub Pages. All pushes to the default branch on GitHub will trigger the deployment of the site (pushes to other branches will not cause a deployment to take place).
