module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
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
    // DOG SECTION =====================
    // =====================================
		// =====================================
		// TRACK SECTION =====================
		// =====================================
	app.get('/track', isLoggedIn, function(req, res) {
        res.render('track.ejs', {
            user : req.user,
            users_dog : req.session.users_dog
        });
    });
	
    // =====================================
    // ADD ANIMAL SECTION =====================
    // =====================================
    app.get('/addanimal', isLoggedIn, function(req, res) {
        res.render('addanimal.ejs', {
            user : req.user, // get the user out of session and pass to template
            users_dog : req.session.users_dog
        });
    });

    //add new dog
    app.post('/addanimal', isLoggedIn, function(req,res){
      // grab the dog model
      var Dog = require('./models/dog');

      var dog_name = req.body.dog_name;
      var dog_age = req.body.dog_age;
      var dog_weight = req.body.dog_weight;
      var dog_description = req.body.dog_description;

      // create a new dog
      var newDog = Dog({
        name: dog_name,
        owner_email: req.user.local.email,
        age: dog_age,
        weight: dog_weight,
        description: dog_description
      });

      // save the dog
      newDog.save(function(err) {
        if (err) throw err;

        console.log('Dog created for user :' + req.user.local.email);
      });
      return res.redirect('/home');
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
