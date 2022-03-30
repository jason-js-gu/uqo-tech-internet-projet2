# Suggestion for the distribution of tasks
### documentation (2 persons)
- documention of functionalities
- documentation of architecture
- diagram of architecture

### html and AJAX (1 person)
- index.html
- css

### AJAX (1 person)
- cipher and decipher
- ajax requests

### APIs (getLetters, peers, postLetter) (2 persons) 
- getLetters, peers
- postLetters

---

# uqo-tech-internet-projet2
For the session project (part II) -- send encrypted message within SPA (Single Page Application) 

---

## create you own branch
Go to the branch *'main'* of uqo-tech-internet-projet2, in the input field *'Find or create a branch'* enter a name for your own branch, click *'Create branch : [your branch name] from 'main'*

## clone the repository to your pc
- click the green button *'Code'*, then copy the HTTPS url (you can just click on the icon besides the url)
- go to the desktop, open a terminal of Git Bash, you can enter *'Bash'* in the search bar to find this application on your pc
- in Git Bash, enter the directory of desktop with this command: ***cd Desktop***
- then enter this command to clone the repository: ***git clone [the url you've just copied]***, when done you can find a new folder on the Desktop
- close the Git Bash

## connect to remote repository in VS Code
- open VS Code, open folder you've just cloned
- open a new terminal with the command: ***Ctr+Shift+`***, or go to the nav option 'Terminal/New Terminal'
- in terminal, create a new local branch and connect to remote branch with the command: ***git checkout -b [local branch name you want to create] origin/[your remote branch name]***

## push your local files to Github
- ***git add .*** (don't forget the point)
- ***git commit -m "[name your commit]"***
- ***git push***

## other operations of Git
- git pull origin [your remote branch name]  (to get the files from your remote branch)
