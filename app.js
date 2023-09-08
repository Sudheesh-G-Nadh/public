/**
 * This project is created using TVM Layered Architecture
 * @author Sudheesh G Nadh
 */
var createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const DBConfig=require('./config')
require('dotenv/config');

// Loading Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Add all middlewares to the project. Include middlewares for routes
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static('docs'));
app.use(compression());

// Load module user
const userModule = require(`./modules/user/route/userRoute`);

const login = require(`./modules/Login/route/loginRoute`);

app.use('/login', login)

app.use('/user', userModule);

// // Load UserPermission
// const UserPermissionModule = require(`./modules/UserPermission/route/userpermissionRoute`);
// app.use('/userpermission', UserPermissionModule);

// // Load UserPermission and Module
// const GetMasters = require(`./modules/GetMasters/routes/MastersRoutes`);
// app.use('/getmasters', GetMasters);

//Load User details
//const UserDetails = require(`./modules/userDetails/route/UserDetailsRoute`);

app.use(function (req, res, next) {
    console.log(404)
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(500)
    res.send('error');
});

const mongoDB = `mongodb+srv://${DBConfig.user}:${DBConfig.password}@${DBConfig.host}/${DBConfig.mydb}?retryWrites=true&w=majority`
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.once('open', _ => {
    console.log('Mongo Database connected');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));