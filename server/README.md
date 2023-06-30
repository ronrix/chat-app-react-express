# Chat App Backend

## Description

A good backend structure handling API with Express JS

## Installation

Follow the steps to install this project.

1. Clone the repo
   `git clone https://github.com/ronrix/chat-app-react-express.git`
2. Install NPM packages
   `npm install`
3. Run the project
   `npm run dev`

## Usage

Instructions on how to use this backend structure

1. **API** folder and invoke the functions in index.js to initialize your api's
   - Add new file here for your api controllers
   - inside index.js, you can export your newly created API there to have a centralized file exporting
2. **config** folder exports any env variable, to make the env accessing short
3. **database** folder is for schemas/tables and connections of your database
4. **services** folder is for handling api request, this implements more logic than the api controller
5. **socket** folder is for handling sockets
6. **utils** folder is for additional functions
7. **index.js** file is where all functions are initialized
