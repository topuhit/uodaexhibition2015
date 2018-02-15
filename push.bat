@ECHO OFF
SET /p comment=Comment:
git add *
git commit -a -m "%comment%"
git push
git push heroku master