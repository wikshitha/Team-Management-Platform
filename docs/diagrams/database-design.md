# Database Design

## Entities

The system currently contains the following entities:

1. Role
2. User
3. Project
4. ProjectMember
5. Task
6. TaskComment
7. Notification

## Main Relationships

- One Role can belong to many Users.
- One User can create many Projects.
- Users and Projects have a many-to-many relationship through ProjectMember.
- One Project can contain many Tasks.
- One User can be assigned many Tasks.
- One Task can contain many TaskComments.
- One User can create many TaskComments.
- One User can receive many Notifications.

## Important Business Rules

- User email addresses must be unique.
- Role names must be unique.
- A user cannot be added to the same project more than once.
- A task must belong to a project.
- An assigned task user must be a member of the related project.
- Only authorized users can manage projects and tasks.
- Team Members can access only projects and tasks assigned to them.