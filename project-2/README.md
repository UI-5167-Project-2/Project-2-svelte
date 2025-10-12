# UI Project 2

## Environment Setup

1. Make sure node version is >= 20.17.0 (use `node -v` to check)
2. Make sure npm version is >= 10.8.2 (use `npm -v` to check)
3. Clone this repo to your computer
4. Navigate to the project-2 folder
5. Run `npm i` to install node_modules and various packages included in the package.json file
6. Run `npm run dev` to start the project
7. Install the prettier extension (this extension ensures consistent code formatting)
8. Go to settings -> Search 'Default Formatter' -> Select prettier
9. Go to settings -> Search 'Format on save' -> [x] select

## Consistent styling instructions

- We are utilizing bootstrap for this project which includes a majority of classes and styles which will be used for theming, spacing, text formatting, etc.
- Go to [Bootstrap - Docs](https://getbootstrap.com/docs/5.2/getting-started/introduction/) for information on styling and formatting
- Go to [Bootstrap - icons](https://icons.getbootstrap.com/) for available icons and implementation

## Consistent component instructions

- I have built out several components included in the shared components folder, please use these before grabbing componnets from the bootstrap docs as they have been styled consistently and already have built in binding and behaviors configured. Please ask Jordan for assistance as needed
- For details on what can be brought into each component, check out comment included above each component or included documentation when adding the component to a new area.

## Building & Deploying

1. Run `npm run build`
2. Copy all files and folders from the dist folder into the root of the `UI-5167-Project-2.github.io` repository
3. Push changes
4. The public website will automatically regenerate with the latest build files
