const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const app = express();

const server = https.createServer(credentials, app);


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OIDCStrategy({
  clientID: 'dcee6e9a-15f2-4d2a-876c-88a420628f53',
  clientSecret: 'bcd96052-af8d-48f0-b93d-e6e0e6d3a389',
  identityMetadata: 'https://login.microsoftonline.com/92bf490c-8157-40e5-88df-995bdfc9303d/v2.0/.well-known/openid-configuration',
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: 'https://localhost:3000/auth/openid/return',
  passReqToCallback: true
}, (req, iss, sub, profile, accessToken, refreshToken, done) => {
  // Handle user authentication and store user details as needed
  // You can access user details in the 'profile' object
  res.send(profile)
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/login', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

app.post('/auth/openid/return', passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }), (req, res) => {
  console.log('here')
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', ensureAuthenticated, (req, res) => {
  // Access protected resources here
  // User details are available in req.user
  res.send('Authenticated!!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
