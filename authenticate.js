var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id })
            .then(user => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch(err => {
                done(err, false);
            });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = function (req, res, next) {
    if (req.user && req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403; // Forbidden
        return next(err);
    }
};

exports.verifyCommentOwnership = async function (req, res, next) {
    try {
        // Extract the user's ID from req.user and comment ID from req.params
        const userId = req.user._id; // Assuming req.user contains the authenticated user's information
        const commentId = req.params.commentId;

        // Fetch the comment from the database
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            const err = new Error('Comment not found');
            err.status = 404;
            throw err;
        }

        // Check if the user performing the operation is the same as the comment's author
        if (!comment.author.equals(userId)) {
            const err = new Error('You are not authorized to perform this operation');
            err.status = 403; // Forbidden
            throw err;
        }

        // If the user is authorized, call next() to pass control to the next middleware
        next();
    } catch (err) {
        // Handle errors
        next(err);
    }
};