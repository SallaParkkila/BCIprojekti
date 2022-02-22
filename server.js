const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const res = require('express/lib/response')
const app = express()
const port = 3000
const { default: Ajv } = require('ajv');
const ajv = new Ajv();

const products = require('./routes/products')

const userSchema = require('./routes/schema/users.schema.json');
const userValidator = ajv.compile(userSchema);

const usersMw = function(req, res, next) {
    const userResult = userValidator(req.body);
    if(userResult == true) {
        next();
    } else {
        res.sendStatus(400);
    }
}

app.use(bodyParser.json());

passport.use(new BasicStrategy(
    function(username, password, done) {
        console.log(username + ' ' + password);
        users.find(users => (users.username === username) && (bcrypt.compareSync(password, users.password)));
        if(users != undefined){
            done(null, users);
        }
        else{
          done(null, false);  
        }
    }
));

const users = [
    {   //esimerkkikäyttäjät
        "id": uuidv4(),
        "firstName": "Salla",
        "lastName": "Parkkila",
        "email": "allas.parkkila@gmail.com",
        "dateOfBirth": "1989-10-31",
        "emailVerified": true,
        "signUpDate": "2019-08-24"
      },
      {
        "id": uuidv4(),
        "firstName": "Jonna",
        "lastName": "Koskela",
        "email": "kosu.nonna@gmail.com",
        "dateOfBirth": "1992-09-25",
        "emailVerified": true,
        "signUpDate": "2020-01-27"
      }

];

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const secret = require('./keys.json');
const jwt = require('jsonwebtoken'); 
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secret.secretkey;


passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    
    const user = users.find(u => u.username === jwt_payload.user)
    done(null, user);

}));

app.post('/login', passport.authenticate('basic' , {session : false}), (req, res) => {

    const payloadData = {
       user: req.body.username
    };
    //res.send("secure toimii")
    const token = jwt.sign(payloadData, secret.secretkey);

    res.json({ token : token })
})

app.get('/jwtSecured', passport.authenticate('jwt', {session: false}), (req, res) => {

    res.json({status: "jwt toimii", user: req.body.username });

})

app.get('/users', (req, res) => {
    res.json(users);
})

app.get('/users/:id', (req, res) => {

    let foundIndex = users.findIndex(t => t.id === req.params.id);

    if(foundIndex === -1){
        res.sendStatus(404);
        return;
    }else{
        res.json(users[foundIndex]);
    }
})
app.delete('/users/:id', (req, res) =>{
    let foundIndex = -1;
    for(let i = 0; i < users.length; i++){
        if(users[i].id === req.params.id) {
            foundIndex = i;
            break;
        }
    }

    if(foundIndex === -1){
        res.sendStatus(404);
        return;
    }else{
         users.splice(foundIndex, 1);
         res.sendStatus(202);
    }
})

app.post('/users', usersMw, (req, res) =>{
//console.log(req.body);
const salt = bcrypt.genSaltSync(3);
//console.log('salt' +salt);
const hashedPassword = bcrypt.hashSync(req.body.password, salt);
//console.log('pass' +hashedPassword);
const userResult = userValidator(req.body);
console.log(userResult);

    if(userResult == true) {

    users.push({
        id: uuidv4(),
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        emailVerified: req.body.emailVerified,
        signUpDate: req.body.signUpDate
    });
    res.sendStatus(201);
    }else{
        res.sendStatus(400);
    }
 } )

app.put('/users/:id', (req, res) => {
    let founduser = users.find(t => t.id === req.params.id);
    if(founduser){
        founduser.firstName = req.body.firstName;
        founduser.lastName = req.body.lastName;
        founduser.email = req.body.email;
        founduser.dateOfBirth = req.body.dateOfBirth;
        founduser.emailVerified = req.body.emailVerified;
        founduser.signUpDate = req.body.signUpDate;

        res.sendStatus(200);
    }
    else{
        res.sendStatus(404);
    }
})

app.use('/products', products)

let serverInstance = null;

module.exports = {
    start: function() {
        serverInstance = app.listen(port, () => {
            console.log(`listening port ${port}`)
        })
},
    close: function() {
    serverInstance.close();
}
}
