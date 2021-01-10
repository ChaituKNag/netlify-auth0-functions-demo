const express = require('express'); 
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./utils/auth');

const app = express();
const { COOKIE_SECURE } = require('./utils/config');

const router = express.Router();






const handleCallback = () => (req, res) => {
    res
        .cookie('jwt', req.user.jwt, { httpOnly: true, COOKIE_SECURE })
        .redirect('/');
};

router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        res.json({
            msg: 'authenticated'
        })
    } else {
        res.json({
            msg: "not authenticated"
        })
    }
    
})

router.get('/login', passport.authenticate('github', { session: false }));
router.get(
    '/callback', 
    passport.authenticate('github', {
        failureRedirect: '/', session: false
    }), 
    handleCallback()
);

router.get(
    '/status',
    passport.authenticate('jwt', { session: false }),
    (req, res) => res.json({ email: req.user.email })
)

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({
        msg: 'logged out'
    })
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/express-demo/', router);

module.exports = app;
module.exports.handler = serverless(app);