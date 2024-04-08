
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" })

// Handling uncaught Exception
process.on("uncaughtException", (err) => { 
    console.log(`Error ${err.message}`);
        console.log(`Shutting down the server due to uncaught exception`);

})

const PORT = process.env.PORT || 5000;

require("./db/database");

const server=app.listen(PORT, () => { 
    console.log(`Server is running successfully on ${PORT}`);
})

// unhandled promise rejection
process.on("unhandledRejection", (err) => { 
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise rejection`);
    server.close(()=> {
        process.exit(1);
    })
})

