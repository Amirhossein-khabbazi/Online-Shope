# Online-Shope

Online-Shope is a robust e-commerce platform built using Node.js, MongoDB, jQuery, and EJS. It provides a seamless shopping experience and efficient backend functionality. The platform frontend templates are in Persian (Farsi) language.

## Getting Started

Before getting started, please ensure that you have Node.js and MongoDB installed on your system. Follow the steps below to set up and run the project:

1. Clone the repository to your local machine.
2. Install the project dependencies by running the following command in the terminal:
```
npm i
```
or
```
npm install
```

This will install all the necessary packages mentioned in the `package.json` file.

3. The project's backend is written in Node.js and uses `nodemon` for automatic server restarts during development. The main file for the project is `server.js`. To start the project, run the following command in the terminal:
```
npm start
```


This will start the server and make the platform accessible through your browser.

## Project Structure

The project is organized into several directories to enhance modularity and maintainability:

- The `app` folder contains all the backend files and codes, including the `controllers`, `middlewares`, `router`, and `validator` modules. The entry point for the backend is `index.js`.

- The `model` folder holds the MongoDB schemas used by the application.

- The `public` folder contains static assets such as CSS, JavaScript, jQuery, and fonts. Additionally, any uploaded files, such as photos and documents, will be stored in the `upload` folder inside the `public` directory. Please note that the `upload` folder will be automatically created upon the first file upload.

- The `views` folder houses the frontend files, including HTML and EJS templates. These files define the structure and presentation of the platform's user interface.

Feel free to explore the project structure and customize the various components to suit your specific requirements.

## License
This project is licensed under the [MIT License](LICENSE).


## Acknowledgements

We would like to express our gratitude to the following individuals and projects:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [jQuery](https://jquery.com/)
- [EJS](https://ejs.co/)

Their contributions and efforts have made this project possible.

## Contributing

Contributions to Online-Shope are welcome! If you encounter any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request on the project's GitHub repository.

Happy shopping and coding!
