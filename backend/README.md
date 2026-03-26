https://pocketbase.io/docs/

The prebuilt PocketBase executable will create and manage 2 new directories alongside the executable:

pb_data - stores your application data, uploaded files, etc. (usually should be added in .gitignore).
pb_migrations - contains JS migration files with your collection changes (can be safely committed in your repository).
You can even write custom migration scripts. For more info check the JS migrations docs.
____

Serving
./pocketbase serve

http://127.0.0.1:8090 - if pb_public directory exists, serves the static content from it (html, css, images, etc.)
http://127.0.0.1:8090/_/ - superusers dashboard
http://127.0.0.1:8090/api/ - REST-ish API
____

Reset migrations
(./pocketbase migrate history-sync)
Delete all files in pb_migrations folder
Run migrate history-sync to clear _migrations table
Run migrate collections to create a new migration mirroring the current collections state



# to do
email confirmation
upload to server
add error popups
migrate to app builds