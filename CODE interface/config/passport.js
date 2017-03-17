// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
       // by default, local strategy uses username and password, we will override with email
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback : true // allows us to pass back the entire request to the callback
   },
   function(req, email, password, done) {

       // asynchronous
       // User.findOne wont fire unless data is sent back
       process.nextTick(function() {

         var re_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         var isEmail = re_email.test(email);

         if (!isEmail)
            return done(null, false, req.flash('signupMessage', 'Please enter a valid email adress. (ex: john@domain.com)'));

        var re_pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
        var isPass = re_pass.test(password);

        //For developping  mode
        isPass = true;

        if (!isPass)
           return done(null, false, req.flash('signupMessage', 'Password must be at least 6 caracters long, have at least one number, one lowercase and one uppercase letter.'));

       // find a user whose email is the same as the forms email
       // we are checking to see if the user trying to login already exists
       User.findOne({ 'local.email' :  email }, function(err, user) {
           // if there are any errors, return the error
           if (err)
               return done(err);

           // check to see if theres already a user with that email
           if (user) {
               return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
           } else {

               // if there is no user with that email
               // create the user
               var newUser            = new User();

              var random_url = "";
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

              for( var i=0; i < 40; i++ )
                random_url += possible.charAt(Math.floor(Math.random() * possible.length));

               // set the user's local credentials
               newUser.local.email    = email;
               newUser.local.password = newUser.generateHash(password);
               newUser.local.active   = false;
               newUser.local.verif_url = random_url;

               req.session.email = email;

               // save the user
               newUser.save(function(err) {
                   if (err) {
                     throw err;
                   }

                  var nodemailer = require('nodemailer');
                  var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'senderdogus@gmail.com',
                        pass: '%Dogus60***'
                    }
                  });

                  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                  var html_content = '<html><head><title>DogUS</title><link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> <!-- load bootstrap css --><link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"> <!-- load fontawesome --><style>body { padding-top:80px; }</style></head><body><div class="container"><div class="jumbotron text-center"><img src="http://titoine.me/img/logo.png" alt="DogUS logo" width="75px"><h1>DogUS</h1><br/>Please confirm your account by clicking the following link: <a href="'+ fullUrl + '/verification-email/' + random_url + '">Activate my Account</a></div></div></body></html>';

                  var mailOptions = {
                    from: 'senderdogus@gmail.com', // sender address
                    to: email,
                    subject: 'Account Verification', // Subject line
                    html: html_content
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    };
                  });
                  return done(null, newUser);
              });
           }
       });

       });

   }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email, 'local.active' :  true  }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No active user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
