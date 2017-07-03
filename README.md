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
* `role` (integer, required) - Indicates the type of user
    * `0` - The user is the creator of an organization
    * `1` - The user is the administrator of an organization
    * `2` - The user is an employer
    * `3` - The user is a student
* `organization` (Organization) - The organization the administrator is affiliated with
* `studentFairs` ([Fair]) - A list of the fairs the student has been to
* `employerFairs` ([Fair]) - A list of the fairs the employer has been to
* `studentInteractions` ([Interaction]) - A list of the interactions a student has had
* `employerInteractions` ([Interaction]) - A list of the interactions an employer has had


### Organization

The Organization model represents the organizations that host the career fairs, for example McCombs.  
The Organization model has the following attributes:  
* `name` (string, required) - The name of the organization
* `creator` (User, required) - The user that created the organization
* `administrators` ([User]) - A list of the organization's administrators
* `fairs` ([Fair]) - A list of the organization's fairs


### Fair

The Fair model represents a single career fair.  
The Fair model has the following attributes:
* `name` (string, required) - The name of the career fair
* `dateTime` (string) - The date and time of the career fair formatted YY/MM/DD/HH/MM/HH/MM
* `organization` (Organization, required) - The organization hosting the career fair
* `students` ([User]) - A list of the students that have signed up for the career fair
* `employers` ([User]) - A list of the employers that will attend the fair
* `interactions` ([Interaction]) - A list of the interactions that take place at the fair


### Interaction

The Interaction model represents a single interaction between employer and student.
The Interaction model has the following attributes:
* `employer` (User, required) - The employer involved in the interaction
* `student` (User, required) - The student involved in the interaction
* `fair` (Fair, required) - The fair the interaction happened at



## Endpoints


### User endpoints

#### `GET /user/interactions-all`
Gets all interactions for the logged in user. The user must be an employer or student. The interactions have the fair attribute and either the employer or student attribute populated.

Query:
* `role` (integer) - The role of the user

Response:
* `message` (string) - Message from API to help with debugging
* `interactions` ([object]) - A list of the user's interactions, populated with employers or students depending on the user's role
* `error` (string) - The error message, if applicable


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


#### `POST /user/register-fair`
Registers a user for a fair. The user must be logged in and have either employer or student role.

Body:
* `fair` (string) - The ID of the fair to register to

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The user added to the fair
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


### Organization endpoints

#### `POST /organization/new`
Creates a new organization. The user creating the organization must be logged in and have a creator role.

Body:
* `name` (string) - The name of the new organization

Response:
* `message` (string) - Message from API to help with debugging
* `organization` (object) - The newly-created organization
* `error` (string) - The error message, if applicable


### Fair endpoints

#### `POST /fair/new`
Creates a new fair. The user creating the fair must be logged in and have a creator or administrator role.

Body:  
* `name` (string) - The name of the new fair
* `dateTime` (string, optional) - The date and time of the fair, formatted as specified in the Models section

Response:
* `message` (string) - Message from API to help with debugging
* `fair` (object) - The newly-created fair
* `error` (string) - The error message, if applicable


#### `PUT /fair/update-info`
Updates the date and time or name of a fair. The user updating the fair must be logged in and have a creator or administrator role.

Body:
* `fair` (string) - The ID of the fair to update
* `name` (string, optional) - The new name of the fair
* `dateTime` (string, optional) - The new date and time of the fair

Response:
* `message` (string) - Message from API to help with debugging
* `fair` (object) - The updated fair
* `error` (string) - The error message, if applicable


### Interaction Endpoints

#### `POST /interaction/new`
Creates a new interaction between a student and an employer. The user making the request must be logged in and have a student role. The other user must be an employer.

Body:
* `employer` (string) - The ID of the employer
* `fair` (string) - The ID of the fair the interaction happened at

Response:
* `message` (string) - Message from API to help with debugging
* `interaction` (object) - The newly-created interaction
* `error` (string) - The error message, if applicable
