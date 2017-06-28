# career-fair-api

The API for a new career-fair app.


## Endpoints


### User endpoints

#### `POST /user/login`
Logs in a user.

Body:
* `email` (string) - The email address of the user
* `password` (string) - The plaintext password of the user

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The logged-in user
* `error` (string) - The error message, if applicable


#### `GET /user/logout`
Logs out a user.

Response:
* `message` (string) - Message from API to help with debugging


#### `PUT /user/update-info`
Updates the contact info of the user. The user must be logged in. One of two possible parameters must be supplied.

Body:
* `phone` (string, optional) - The new phone number for the user
* `website` (string, optional) - The new website URL for the user

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The updated user
* `error` (string) - The error message, if applicable


#### `POST /user/upload-resume`
Uploads the resume of the user to Amazon S3. The resume must be a pdf and the user must be logged in.

Body:
* `resume` (pdf) - The resume to upload to AWS S3

Response:
* `message` (string) - Message from API to help with debugging
* `url` (string) - The URL of the resume on S3
* `error` (string) - The error message, if applicable


#### `POST /user/signup`
Creates a new user.  

Body:
* `name` (string) — The full name of the user
* `email` (string) - The email address of the user
* `password` (string) - The plaintext password of the user
* `role` (integer) - Indicates whether the user is an admin, employer or student

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The newly-created user
* `error` (string) - The error message, if applicable
