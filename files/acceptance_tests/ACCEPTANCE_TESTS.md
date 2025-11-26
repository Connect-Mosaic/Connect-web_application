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

Story 12 – Admin Dashboard Statistics – Acceptance Tests

User Story:
As an Admin, I can view dashboard statistics so that I can monitor system activity.

Tester:
Jee Won Jung

AT-12.1 – Load Dashboard Page

Test Input:
Admin visits /admin/dashboard

Expected Outcome:
Dashboard loads successfully.
Statistics panel renders without delay.

Actual Outcome:
Dashboard loads successfully.
Statistics panel renders properly.

Status: Pass

AT-12.2 – Fetch Analytics Data

Test Input:
Dashboard triggers analytics data fetch request on page load.

Expected Outcome:
Correct numbers are displayed (e.g., total users, events created, active logs).
Data matches backend values.

Actual Outcome:
Correct statistics are displayed.
Values match backend response.

Status: Pass

AT-12.3 – Render Charts

Test Input:
Dashboard charts attempt to load using real analytics data.

Expected Outcome:
Charts render properly without errors.
Data points reflect actual system activity.

Actual Outcome:
Charts load properly.
No errors encountered.

Status: Pass

AT-12.4 – Unauthorized Access

Test Input:
Non-admin user visits /admin/dashboard

Expected Outcome:
User is redirected to Login or Unauthorized page.
Dashboard content is not visible.

Actual Outcome:
Proper redirect occurs.
Dashboard is not accessible.

Status: Pass

AT-12.5 – Responsive Layout

Test Input:
Window resized to mobile, tablet, and desktop breakpoints.

Expected Outcome:
Dashboard layout adjusts correctly.
No overlapping UI or broken chart layouts.

Actual Outcome:
Layout adapts normally to different screen sizes.
Charts resize as intended.

Status: Pass