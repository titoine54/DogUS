module.exports = function(app, passport) {

// =====================================
// INDEX PAGE (with login links) ========
// =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

// =====================================
// LOGIN ===============================
// =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// =====================================
// SIGNUP ==============================
// =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// =====================================
// HOME SECTION =====================
// =====================================
    app.get('/home', isLoggedIn, function(req, res) {

      var dogController = require('./controllers/dogController');
      var dogMethods = new dogController();

      dogMethods.getUserDogs(req.user.local.email, function(response){
        var dog_list = response;
        req.session.users_dog = dog_list;
        res.render('home.ejs', {
            user : req.user,
            users_dog : dog_list
        });
      });
    });
// =====================================
// ADD ANIMAL SECTION =================
// =====================================
    app.get('/addanimal', isLoggedIn, function(req, res) {
      res.render('addanimal.ejs', {
          user : req.user, // get the user out of session and pass to template
          users_dog : req.session.users_dog
      });
    });

    // Add new dog
    app.post('/addanimal', isLoggedIn, function(req,res){

      var dogController = require('./controllers/dogController');
      var dogMethods = new dogController();

      dogMethods.addNewDog(req, function(response){
        return res.redirect('/home');
      });
    });

// =====================================
// TRACKING SECTION =================
// =====================================
    app.get('/track/:dog_id', isLoggedIn, function(req, res) {
      var dog_id = req.params.dog_id;
      res.render('track.ejs', {
          user : req.user, // get the user out of session and pass to template
          users_dog : req.session.users_dog,
          dog_id : dog_id
      });
    });

// =====================================
// INFO SECTION =================
// =====================================
    app.get('/infos/:dog_id', isLoggedIn, function(req, res) {
      var dog_id = req.params.dog_id;
      console.log(req.session.users_dog);
      res.render('infos.ejs', {
          user : req.user, // get the user out of session and pass to template
          users_dog : req.session.users_dog,
          dog_id : dog_id
      });
    });

// =====================================
// CALENDAR SECTION =================
// =====================================
    app.get('/calendar/:dog_id', isLoggedIn, function(req, res) {
      var dog_id = req.params.dog_id;
      console.log(req.session.users_dog);
      res.render('calendar.ejs', {
          user : req.user, // get the user out of session and pass to template
          users_dog : req.session.users_dog,
          dog_id : dog_id
      });
    });

// =====================================
// PROFILE SECTION =====================
// =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

// =====================================
// LOGOUT ==============================
// =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
