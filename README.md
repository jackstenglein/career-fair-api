# career-fair-api

The API for a new career-fair app.


## Models

### User

The User model represents the administrators, employees and students that use the service.  
The User model has the following attributes:  
* `name` (string, required) - The full name of the user  
* `email` (string, required, unique) - The email address of the user  
* `password` (string, required) - The salted and hashed password of the user  
* `phone` (string) - The phone number of the user  
* `website` (string) - The website URL of the user
* `resumeUrl` (string) - The URL of the user's resume on Amazon S3
* `role` (integer, required) - Indicates whether the user is an admin, employer or student (or creator?)
* `organization` (Organization) - The organization the administrator is affiliated with


### Organization

The Organization model represents the organizations that host the career fairs, for example McCombs.  
The Organization model has the following attributes:  
* `name` (string, required) - The name of the organization
* `creator` (User, required) - The user that created the organization
* `administartors` ([User]) - A list of the organization's administrators
* `fairs` ([Fair]) - A list of the organization's fairs


### Fair

The Fair model represents a single career fair.  
The Fair model has the following attributes:
* `name` (string, required) - The name of the career fair
* `dateTime` (string) - The date and time of the career fair formatted YY/MM/DD-HH/MM-HH/MM 
* `organization` (Organization, required) - The organization hosting the career fair
* `students` ([User]) - A list of the students that have signed up for the career fair
* `employers` ([User]) - A list of the employers that will attend the fair



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
