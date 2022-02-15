# ghost-bot

This is a bot created for the Sad Ghost Town for Sad Ghosts server.

Requirements: node.js, Sequelize, Canvas

The bot comes with a prebuilt database that includes a couple of tags already, this is just so that it doesn't have to be built when setting up.

I ran into issues with the sync code overwriting the database on a hard reset, so it seemed easier to just include a very sparse db for now.


ToDo:

-Add Birthday database/scheduled check/posting feature

-Separate functions into different script files (prefix; custom responses; global message parse [in that order])

-Declare global variables for items that are defined multiple times.

-Connect to Spotify API to aggregate spotify links in #music into a playlist viewable on Spotify
