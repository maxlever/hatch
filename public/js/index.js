(function (jQuery, Firebase, Path) {
    "use strict";

    // the main firebase reference
    var rootRef = new Firebase('https://hackduke-hatch.firebaseio.com');
    
    // pair our routes to our form elements and controller
    var routeMap = {
        '#/': {
            page: 'pageLogin',
            controller: 'login'
        },
        '#/logout': {
            page: 'pageLogout',
            controller: 'logout'
        },
        '#/register': {
            page: 'pageRegister',
            controller: 'register'
        },
        '#/profile': {
            page: 'pageProfile',
            controller: 'profile',
            authRequired: true // must be logged in to get here
        },
        '#/home': {
            page: 'pageHome',
            controller: 'home',
            authRequired: true
        },
        '#/questions': {
            page: 'pageQuestions',
            controller: 'questions',
            authRequired: true
        },
        '#/categories': {
            page: 'pageCategories',
            controller: 'categories',
            authRequired: true
        },
        '#/results': {
            page: 'pageResults',
            controller: 'results',
            authRequired: true
        },
        '#/info': {
            page: 'pageInfo',
            controller: 'info',
            authRequired: true
        }
    };

    // create the object to store our controllers
    var controllers = {};

    var activePage = null;

    var alertBox = $('#alert');

    function routeTo(route) {
        window.location.href = '#/' + route;
    }

    // Handle Email/Password login
    // returns a promise
    function authWithPassword(userObj) {
        var deferred = $.Deferred();
        console.log(userObj);
        rootRef.authWithPassword(userObj, 
                                 function onAuth(err, user) {
            if (err) {
                deferred.reject(err);
            }

            if (user) {
                deferred.resolve(user);
            }

        });

        return deferred.promise();
    }

    // create a user but not login
    // returns a promsie
    function createUser(userObj) {
        var deferred = $.Deferred();
        rootRef.createUser(userObj, function (err) {

            if (!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }

        });

        return deferred.promise();
    }

    // Create a user and then login in
    // returns a promise
    function createUserAndLogin(userObj) {
        return createUser(userObj)
            .then(function () {
            return authWithPassword(userObj);
        });
    }

    // route to the specified route if sucessful
    // if there is an error, show the alert
    function handleAuthResponse(promise, route) {
        $.when(promise)
            .then(function (authData) {

            // route
            routeTo(route);

        }, function (err) {
            console.log(err);
            // pop up error
            showAlert({
                title: err.code,
                detail: err.message,
                className: 'alert-danger'
            });

        });
    }

    // options for showing the alert box
    function showAlert(opts) {
        var title = opts.title;
        var detail = opts.detail;
        var className = 'alert ' + opts.className;

        alertBox.removeClass().addClass(className);
        alertBox.children('#alert-title').text(title);
        alertBox.children('#alert-detail').text(detail);
    }

    /// Controllers
    ////////////////////////////////////////
    
    controllers.login = function (page) {
        // Form submission for logging in
        page.children('form').on('submit', function (e) {
            var userAndPass = page.children('form').serializeObject();
            var loginPromise = authWithPassword(userAndPass);
            e.preventDefault();

            handleAuthResponse(loginPromise, 'profile');

        });
    };
    
    // logout immediately when the controller is invoked
    controllers.logout = function (page) {
        rootRef.unauth();
    };

    controllers.register = function (page) {

        // Form submission for registering
        page.children('form').on('submit', function (e) {

            var userAndPass = page.children('form').serializeObject();
            var loginPromise = createUserAndLogin(userAndPass);
            e.preventDefault();

            handleAuthResponse(loginPromise, 'profile');

        });

    };

    controllers.profile = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;

        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }

        // Load user info
        userRef = rootRef.child('users').child(user.uid);
        userRef.once('value', function (snap) {
            var user = snap.val();
            if (!user) {
                return;
            }

            // set the fields
            page.children('form').find('#txtName').val(user.name);
            page.children('form').val(user.favoriteDinosaur);
        });

        // Save user's info to Firebase
        page.children('form').on('submit', function (e) {
            e.preventDefault();
            var userInfo = page.children('form').serializeObject();

            userRef.set(userInfo, function onComplete() {

                // show the message if write is successful
                showAlert({
                    title: 'Successfully saved!',
                    detail: 'You are still logged in',
                    className: 'alert-success'
                });

            });
        });

    };
    controllers.home = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;
        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }
    };
    controllers.questions = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;
        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }
    };
    controllers.categories = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;
        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }
    };
    controllers.results = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;
        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }
    };
    controllers.info = function (page) {
        // Check the current user
        var user = rootRef.getAuth();
        var userRef;
        // If no current user send to register page
        if (!user) {
            routeTo('register');
            return;
        }
    };


    var questions = [
        [
            "Do you feel anxious or nervous when you are around your partner?", 
            "Do you watch what you are doing in order to avoid making your partner angry or upset?",
            "Are you afraid of voicing a different opinion than your partner?",
            "Is your partner jealous, such as accusing you of having affairs?",
            "Has your pushed you to stop seeing your friends or family?"
        ],
        [
            "Do you feel that your workplace has an inclusive culture for both men and women?",
            "Do you feel or know of women getting lower positions in your occupation because of their gender?",
            "Do you think that you are treated equally at work place when compared with the opposite sex?"
        ],
        [
            "I avoid eating when I am hungry.",
            "I feel that food controls my life.",
            "I feel extremely guilty after eating."
        ],
        [
            "My future seems hopeless.",
            "The pleasure and joy has gone out of my life.",
            "I have lost interest in aspects of life that used to be important to me."
        ]
    ]

    var categories = [
        "Domestic Abuse",
        "Sexual Discrimination",
        "Eating Disorders & Body Image",
        "Depression"
    ]

    var results = [null, null, null, null]

    /// Routing
    ////////////////////////////////////////

    // Handle transitions between routes
    function transitionRoute(path) {
        // grab the config object to get the form element and controller
        var pageRoute = routeMap[path];
        var currentUser = rootRef.getAuth();

        // if authentication is required and there is no
        // current user then go to the register page and
        // stop executing
        if (pageRoute.authRequired && !currentUser) {
            routeTo('register');
            return;
        }

        // wrap the upcoming form in jQuery
        var upcomingPage = $('#' + pageRoute.page);

        // if there is no active form then make the current one active
        if (!activePage) {
            activePage = upcomingPage;
        }

        // hide old form and show new form
        activePage.hide();
        upcomingPage.show().hide().fadeIn(750);

        // remove any listeners on the soon to be switched form
        activePage.off();

        // set the new form as the active form
        activePage = upcomingPage;

        // invoke the controller
        controllers[pageRoute.controller](activePage);
    }

    // Set up the transitioning of the route
    function prepRoute() {
        transitionRoute(this.path);
    }


    /// Routes

    Path.map("#/").to(prepRoute);
    Path.map("#/logout").to(prepRoute);
    Path.map("#/register").to(prepRoute);
    Path.map("#/profile").to(prepRoute);
    Path.map("#/home").to(prepRoute);
    Path.map("#/questions").to(prepRoute);
    Path.map("#/info").to(prepRoute);
    Path.map("#/results").to(prepRoute);
    Path.map("#/categories").to(prepRoute);

    Path.root("#/");

    /// Initialize
    ////////////////////////////////////////

    $(function () {

        // Start the router
        Path.listen();

        // whenever authentication happens send a popup
        rootRef.onAuth(function globalOnAuth(authData) {

            if (authData) {
                showAlert({
                    title: 'Logged in!',
                    detail: 'Using ' + authData.provider,
                    className: 'alert-success'
                });
            } else {
                showAlert({
                    title: 'You are not logged in',
                    detail: '',
                    className: 'alert-info'
                });
            }

        });

    });


}(window.jQuery, window.Firebase, window.Path))