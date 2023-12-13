# Streaks

Streaks is a simple web app, inspired by Duolingo’s streaks system. The feature allows users to earn virtual coins through daily interactions and receive bonuses for maintaining consistent activity.

- Users can click a button daily to earn 1 coin.
- Users maintain a streak by clicking the button consecutively every day.
- For every streak of 7 consecutive days, users receive a bonus in the form of 5 additional coins. They will continue to earn this bonus for every 7 days they maintain their streak.
- When the user comes back after missing one or more days, they should be told they’ve just reset a streak of X days, X being the length of their last streak.
- The user should be able to see their highest ever streak.
- The system will operate in the America/Los_Angeles time zone, resetting the day at midnight in this zone.
- In this version, for simplicity the app will only track a single streak from a single user.


## Design decisions

### Back end

The back end is a simple node.js app using Typescript and the Express HTTP framework. Given how simple the data is here (a single table with two columns), I thought that a full-blown ORM would be too heavyweight.

The node app connects to a Postgres database, whose schema is specified in [schema.sql](server/schema.sql). We simply store a timestamp of each press. Rather than do analysis on the node side, I chose to implement it as stored procedures. This was an unusual choice for me, but it felt right considering how simple the data is. In hindsight, it would have been faster to write if I just crunched the data (calculating streak length etc) on the Javascript side, given SQL is difficult to write and debug. However, now that it's working, it is pretty neat that we can just ask the database for the information we want, and don't have to deal with sifting through query responses on the Node side.

One interesting thing is that points are not stored in the database. We calculate the number of points the user should have using a stored procedure, based on their button-pressing history. This simplifies the database schema (no need for an extra points table) and ensures that the points never get out of sync with the presses. This is, of course, slower in theory, but even with thousands of presses, the entire request never took more than 10s of milliseconds to execute.

### Front end

The front end is a React app, bootstrapped with create-react-app and using the Tailwind CSS framework. Tailwind may have been a bit overkill for a simple UI like this, however because it includes so many useful classes, I did not have to write any custom CSS at all. Every UI element is styled using only the built-in Tailwind classes.

Check out [App.tsx](client/src/App.tsx) for the interaction logic and component layout. I created four custom components:

- StreakGrid, which is the grid of weeks that light up commensurate with our streak
- StreakButton, that big friendly button waiting to be pushed
- StreakStatus, the large numbers showing our streak lengths
- PointsDisplay, which shows how many coins we have

The interaction logic is pretty straightforward. On load we fetch the current status from the API and update our components. On button push, we send a POST to our API and refresh the status again.

Using Tailwind's flexbox classes made it responsive by default, which was pretty nice.

### Shortcomings and future ideas

It would be nice to have more eye candy (animations etc) that make it clear when we get points, in particular when we get the 7-day bonus points. In terms of UI, it might also be beneficial to highlight the current day in the weeks grid.

It would be nice to see our total streak history since we first started hitting the button in one large grid.

Naturally, it would be good to add support for multiple users, although this was not part of the assignment.