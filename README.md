# Important info

## Tasks completed in this demo

- [ ] Created a simple netlify functions workflow using `netlify dev`
    ```yaml
    # example netlify.toml
    [build]
        command = "# no build command"
        functions = "functions"
        publish = "./public"

    [[redirects]]
        from = "/api/*"
        to = "/.netlify/functions/:splat"
        status = 200
    ```

    - Here we can see that we are not having any project level build command yet
    - We can also see that we are using a redirect to make the functions API URLs more developer friendly. So instead of calling `/.netlify/functions/hello` everytime, we can use `/api/hello` which is short and sweet. 
    - We created folder based functions with `index.js` file

- [ ] Tested some netlify functions
    - A simple hello function signature looks like this
        ```javascript
        exports.handler = async function(event, context) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/json'
                },
                body: JSON.stringify({message: "Hello World from me..."})
            };
        }
        ```

        1. Always, there should be a function assigned to `exports.handler` to make a Netlify function work. You cannot simply use modern ES6 import and export syntax.
        2. The function passed here has `event` and `context` params passed. event has information of the type of request and context has some other stuff.
        3. Whatever is returned out of this function is what makes the response. 
        4. You can set a response status using `statusCode` key.
        5. The `headers` key allows you to affect response headers
        6. The `body` key allows you to pass response body, should always be a stringified object.
    - A test function (axios-test) to check if third party request based plugins and async promised based syntax can be used to interact with third party stuff.
        ```javascript
        const axios = require('axios');

        exports.handler = async (event, context) => {
            const res = await axios.get('https://jsonplaceholder.typicode.com/users/1');

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(res.data)
            }
        }
        ```
        1. In the above snippet, the `async` keyword is what allows us to use asynchronous api like `axios`.
        2. We can await response from axios and then pass that in our return response object.
        3. This is proof that we can do all types of asynchronous operations like DB push or pull, multiple data calls etc.

    - A full demo of express based netlify function that integrates with passport.js and github oauth to authenticate user based on github. I relied on this [implementation post](https://markus.oberlehner.net/blog/implementing-an-authentication-flow-with-passport-and-netlify-functions/) a lot during my own implementation.
        
        What is happening here
        1. There are a bunch of sub-routes in the express app that are handling various things.
        2. The main authentication route is `/api/express-demo/login` which is a hard route, when user clicks on a login button, we need to point to this URL in the browser to trigger Github authentication. 
        3. Once user authenticates, Github redirects user back to the callback URL configured in the Github OAuth application.
        4. By the way, for this to happen, we need to create two separate Github OAuth applications, one for local and the other for Netlify build URL. The location of OAth applications -> github.com >> Settings >> Developer Settings >> OAuth section.
        5. We are using `passport.js` authentication strategies, two of them. One is the Github strategy (using `passport-github2` package) and the other one is JWT strategy where a unique JWT is maintained in a cookie. The JWT strategy is made possible by `passport-jwt` package. 
        6. A separate route `/api/express-demo/status` will take a look at the request cookie and if it is there then extract the email info (that we are putting in the token earlier in the login route) and send it in the response. If the cookie is not there, which means the user is not yet authenticated or explicitly logged out, then we give back a non-200 error.
        7. The cookie cannot be removed by the front-end. it can only be removed by the `/api/express-demo/logout` route. 
        8. If the user is authenticated in the github.com in the browser session, the user will not be asked to re-authenticate, instead will be redirected automatically to the home page.