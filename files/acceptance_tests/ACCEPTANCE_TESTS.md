Story 5 – Student Search – Acceptance Tests

User Story:
As a User, I can search for other students so that I can find people with similar interests.

Tester:
Jee Won Jung

AT-5.1 – Search Existing Interest

Test Input:
User types “music” in search bar.

Expected Outcome:
Search results list students tagged with “music.”

Actual Outcome:
Matching students appear properly in results.

Status: Pass

AT-5.2 – Search Non-Existent Term

Test Input:
User searches for a term with no matches.

Expected Outcome:
“No results found” message displayed.

Actual Outcome:
“No results found” message appears correctly.

Status: Pass

AT-5.3 – Backend Query Execution

Test Input:
Backend receives GET /api/search?query=music

Expected Outcome:
API returns status 200 and an array of matching users.

Actual Outcome:
API returns 200 and the correct array of users.

Status: Pass

AT-5.4 – Reload Search Page

Test Input:
User reloads the page.

Expected Outcome:
Search state resets; page loads without errors.

Actual Outcome:
Page resets normally with no errors.

Status: Pass

Story 6 – Chat Messaging – Acceptance Tests

User Story:
As a User, I can chat with other students so that I can communicate in real time.

Tester:
Jee Won Jung

AT-6.1 – Load Chat History

Test Input:
User selects a chat thread.

Expected Outcome:
Chat history loads correctly.

Actual Outcome:
Chat history loads without errors.

Status: Pass

AT-6.2 – Send Message

Test Input:
User sends “Hello.”

Expected Outcome:
Message appears instantly in chat window.

Actual Outcome:
Message appears instantly.

Status: Pass

AT-6.3 – Backend POST Request

Test Input:
Backend receives POST /api/chat/send

Expected Outcome:
Server responds with message object including timestamp and sender.

Actual Outcome:
Server returns the correct message response.

Status: Pass

AT-6.4 – Load More Messages

Test Input:
User scrolls upward.

Expected Outcome:
Older messages load without duplication or gaps.

Actual Outcome:
Older messages load properly with no duplicates.

Status: Pass

Story 7, 8, 9 – Events Browsing, Creating, and Joining – Acceptance Tests

User Story:
As a User, I can view, join, and browse events so that I can participate in campus activities.
As an Organizer, I can create and post student events.

Tester:
Jee Won Jung

AT-7/8/9.1 – Load Events List

Test Input:
User visits /events

Expected Outcome:
Events list loads with title, date, and category.

Actual Outcome:
Events list loads properly with correct data.

Status: Pass

AT-7/8/9.2 – View Event Details

Test Input:
User clicks “View Details.”

Expected Outcome:
Event page shows description, participants, and join button.

Actual Outcome:
Details page displays all required information.

Status: Pass

AT-7/8/9.3 – Create Event

Test Input:
Organizer submits event creation form.

Expected Outcome:
API returns 200; new event appears in the events list.

Actual Outcome:
Event is created and appears immediately.

Status: Pass

AT-7/8/9.4 – Join Event

Test Input:
User clicks “Join Event.”

Expected Outcome:
Join confirmation appears; participant count updates.

Actual Outcome:
Join succeeds; participant count updates correctly.

Status: Pass

Story 10 – Event Map – Acceptance Tests

User Story:
As a User, I can view events on a map so that I can see which ones are closest to me.

Tester:
Jee Won Jung

AT-10.1 – Load Map Page

Test Input:
User visits /map

Expected Outcome:
Map container loads without errors; Leaflet map displayed.

Actual Outcome:
Map loads successfully.

Status: Pass

AT-10.2 – Load Event Pins

Test Input:
API provides events with coordinates.

Expected Outcome:
Pins appear at correct map locations.

Actual Outcome:
Pins appear accurately.

Status: Pass

AT-10.3 – Open Event Popup

Test Input:
User taps on a pin.

Expected Outcome:
Popup shows event name, date, and quick-view link.

Actual Outcome:
Popup displays correct event information.

Status: Pass

AT-10.4 – Pan/Zoom Map

Test Input:
User zooms or pans the map.

Expected Outcome:
Map re-renders smoothly; pins remain accurate.

Actual Outcome:
Map interaction is smooth; pins remain stable.

Status: Pass

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
Admin section is not visible.

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

Story 13 – Notifications – Acceptance Tests

User Story:
As a User, I can view notifications so that I can see new alerts about messages or events.

Tester:
Jee Won Jung

AT-13.1 – Open Notification Menu

Test Input:
User clicks the notification bell.

Expected Outcome:
Dropdown menu appears with the latest notifications.

Actual Outcome:
Dropdown appears and displays notifications correctly.

Status: Pass

AT-13.2 – Backend GET Request

Test Input:
Backend receives GET /api/notifications

Expected Outcome:
API returns status 200; unread notifications include timestamps and type fields.

Actual Outcome:
API returns 200 and correct notification objects.

Status: Pass

AT-13.3 – Mark Notification as Read

Test Input:
User marks a notification as read.

Expected Outcome:
Badge count decreases or disappears.

Actual Outcome:
Badge count updates correctly.

Status: Pass