AuthRouter

### auth

- POST /signup - completed
- POST /signin - completed
- POST /signout - completed

Profile Router

### profile

- GET /profile/view - completed
- PATCH /profile/edit - completed
- PATCH /profile/password - completed

Connection Request Router

### home

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

### request

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

User Router

### home

GET /user/feed

### connections

GET /user/connections

### requests

GET /user/requests
