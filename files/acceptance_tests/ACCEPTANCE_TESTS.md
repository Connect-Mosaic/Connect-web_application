Story 11 – Admin User Management – Acceptance Tests

User Story:
As an Admin, I can manage users so that I can control access and maintain the system.

Testers:

Jee Won Jung

AT-11.1 – Load User List

Test Input:
Admin visits /admin/management

Expected Outcome:
User list loads successfully.
Table displays all registered users retrieved from the database.

Actual Outcome:
User list loads successfully.
Table displays all registered users retrieved from the database.

Status: Pass

AT-11.2 – Add User

Test Input:
Admin clicks “Add User”
Admin enters valid first name, last name, email, role, and password
Admin clicks Save

Expected Outcome:
New user is created.
New user appears immediately in the users table.

Actual Outcome:
New user is created.
New user appears immediately in the users table.

Status: Pass

AT-11.3 – Edit User

Test Input:
Admin selects an existing user
Admin updates fields (e.g., name, email, role)
Admin clicks Save

Expected Outcome:
Updated values appear immediately in the user table.
Changes are persisted in the backend.

Actual Outcome:
Updated values appear immediately in the user table.
Changes are persisted in the backend.

Status: Pass

AT-11.4 – Delete User

Test Input:
Admin clicks “Delete” on a user
Admin confirms deletion

Expected Outcome:
User is removed from the list.
User is deleted from the database.

Actual Outcome:
User is removed from the list.
User is deleted from the database.

Status: Pass

AT-11.5 – Unauthorized Access

Test Input:
Non-admin user attempts to visit /admin/management

Expected Outcome:
No admin content is visible.

Actual Outcome:
Admin section is not visible


Status: Pass