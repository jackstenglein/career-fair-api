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


### Token

The Token model represents a code that allows users to join an organization as an administrator or to reset their passwords.  
The Token model has the following attributes:  
* `token` (string, required) - The random code generated by crypto
* `type` (integer, required) - Indicates the type of token
  * `0` - The token is used to join an organization
  * `1` - The token is used to reset a password
* `email` (string, required) - The email the token is sent to
* `expiration` (datetime, required) - The expiration date and time of the token
* `organization` (Organization) - The organization the user wants to join
* `user` (User) - The user that wants to reset their password


## Endpoints

The server runs on port 1337, so all endpoints are in relation to localhost:1337. Unless stated, all parameters are required. Query parameters are passed in the URL (Ex: `http://localhost:1337/user/interactions-fair?fair=FAIR_ID`), while body parameters are passed in the body of the request.


### User endpoints

#### `PUT /user/change-password`
Allows a user to change their password. The user must be logged in and know their current password.

Body:
* `currentPassword` (string) - The user's current password
* `newPassword` (string) - The user's new password

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The user whose password changed
* `error` (string) - The error message, if applicable


#### `PUT /user/confirm-password-reset`
Confirm a password reset generated by /user/request-password-reset.

Body:
* `token` (string) - The token emailed to the user
* `newPassword` (string) - The new password the user has chosen

Response:
* `message` (string) - Message from API to help with debugging
* `user` (object) - The user whose password was changed
* `error` (string) - The error message, if applicable


#### `GET /user/fairs-all`
Gets all fairs for the logged in user. The user must be an employer or student. The fair has the organization attribute populated.

Response:
* `message` (string) - Message from API to help with debugging
* `fairs` ([object]) - A list of the user's fairs, populated with the organization
* `error` (string) - The error message, if applicable


#### `GET /user/interactions-all`
Gets all interactions for the logged in user. The user must be an employer or student. The interactions have the fair attribute and either the employer or student attribute populated.

Query:
* `role` (integer) - The role of the user

Response:
* `message` (string) - Message from API to help with debugging
* `interactions` ([object]) - A list of the user's interactions, populated with fairs and employers or students depending on the user's role
* `error` (string) - The error message, if applicable


#### `GET /user/interactions-fair`
Gets interactions from a specific fair for the logged in user. The user must be an employer or student. The interactions have either the employer or student attribute populated.

Query:
* `role` (integer) - The role of the user
* `fair` (string) - The ID of the fair the interactions occurred at

Response:
* `message` (string) - Message from API to help with debugging
* `interactions` ([object]) - A list of the user's interactions, populated with either employers or students depending on the user's role
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


#### `POST /user/request-password-reset`
Requests a password reset for a user.

Body:
* `email` (string) - The email address of the user

Response:
* `message` (string) - Message from API to help with debugging
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

#### `POST /organization/add-admin`
Sends an invitation email to join as an administrator of an organization. The user making the request must be logged in and have administrator or creator access.

Body:
* `email` (string) - The email address to send the email to

Response:
* `message` (string) - Message from API to help with debugging
* `error` (string) - The error message, if applicable


#### `GET /organization/fairs-all`
Gets all fairs for an organization. The user must be logged in and have administrator or creator role. The fairs do not have any model attributes populated.

Response:
* `message` (string) - Message from API to help with debugging
* `fairs` ([object]) - A list of the organization's fair's
* `error` (string) - The error message, if applicable


#### `GET /organization/fair`
Gets a specific fair for an organization. The user must be logged in and have administrator or creator role. The fair will be returned with three extra attributes: number of students, number of employers and number of interactions. No model attributes will be populated.

Query:
* `fair` (string) - The ID of the fair to return

Response:
* `message` (string) - Message from API to help with debugging
* `fair` (object) - The requested fair
* `error` (string) - The error message, if applicable


#### `GET /organization/invitations`
Gets a list of administrator invitations for an organization. The user must be logged in and have administrator or creator role.

Response:
* `message` (string) - Message from API to help with debugging
* `invitations` ([object]) - A list of the organization's pending invitations
* `error` (string) - The error message, if applicable


#### `DELETE /organization/invitation`
Delete an administrator invitation for an organization. The user making the request must be logged in and have administrator or creator role.

Query:
* `invitation` (string) - The ID of the invitation token to delete

Response:
* `message` (string) - Message from API to help with debugging
* `invitation` (object) - The deleted invitation token
* `error` (string) - The error message, if applicable


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
