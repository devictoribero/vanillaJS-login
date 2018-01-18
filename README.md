# Login-Signup-Vanilla-Javascript
This is a Login and Sign up created with Vanilla Javascript using pattern designs and modules.

*Feel free to use and give me advices to optimize code*

## SETUP
- Webpack
- Babel
- ES6
- SASS
- Hot refresh

## WORK FLOW
From the begining we have 2 options:

1. Login/signup with Facebook
> The user has clicked on the FB continue button

1.1. Introduce Facebook Credentials
> Give permissions to the APP (if it's his first time)
  
1.3. Ask for the email (if user registered on Facebook without email)
> Since some time ago users can do signup on Facebook without email so,
> it is why we ask for one. To register the user to our platform
    
1.4. The user exists, we log in


2. Login/signup manually
> The user has clicked on the `with email` button

2.1. Introduce the email
> We check if the user already exists
  
2.2. Depending on the user state (if exist or not)

2.2.1 The user exists

2.2.1.1 We ask for the password

2.2.1.2 Wrong credentials
> Retry 2.2.2

2.2.2 The user doesn't exist

2.2.2.1 We ask for the data to create a user account
> User created successfully! :)
