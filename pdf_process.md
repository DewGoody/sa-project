
# Session management
## Token 
- This token for authenicate user for use our SA service by give to client via coolie
- We use jwt for validate Token cookie and have signature at `JWT_SECRET` in `.env` file
- Tokens commonly have a lifespan of one hour, but they can be regenerated when the previous token has less than 15 minutes.
## Authenication
``` mermaid
sequenceDiagram
autonumber
    actor User
    User ->>+ CUNEX: Login
    CUNEX ->> CUNEX: Validate user & generate token
    CUNEX -->> SA Callback: Return SA with token
    SA Callback ->> CUNEX: Validate token
    opt Token valid
    CUNEX ->>SA Callback: Retrieve info
    SA Callback ->> SA Callback: Generate token for SA service
    SA Callback -->> User: Return SA service token
    SA Callback ->> SA Services: Redirect

    
    SA Services-->> User: Access granted
    end

```

## Token management
We use the user SA token for authentication through our SA services. All processes will be checked via middleware. When the token is nearly expired, middleware can regenerate the new token for the user.


``` mermaid
sequenceDiagram
    actor User
    User->>Middleware: Requests resource with SA token
    Middleware->>SA Services: Validates SA token
    SA Services-->>Middleware: Returns validation result

    alt Token valid
        Middleware-->>User: Grants access to resource
    else Token nearly expired
        Middleware->>SA Services: Requests new SA token
        SA Services-->>Middleware: Returns new SA token
        Middleware-->>User: Grants access to resource with new token
    end
```