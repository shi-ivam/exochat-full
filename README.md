
# Exochat
### Next Gen Content Based Interaction
---

This chrome extension allows people to communicate and express there thoughts in a whole new way using hop.io and modern technology.
Take Advantage of our application's live chat feature and timestamp marking on youtube videos to take your notetaking experience or brainstroming session to the next level.

### Inspirations

#### People
1. The Coding Train (Youtube)
2. Gary Simmons aka DesignCourse (Youtube)
3. Brad Traversy aka Traversy Media

#### Apps
1. Liner
2. Discord
3. Youtube

---

### How I Built This Project?
1. Started with a barebones chrome extension
2. Landing Page Design & Implementation
3. Simple Live Chat Integration using hop.io API
4. Server-side Message Persistence using Express & MongoDB
5. Simple username and password authentication
6. DOM Api from chrome
7. Video Timestamp Manipulation using DOM element manipulation

---

### What I Learned?
1. I learn't how the chrome extension development works.
2. The Relationship between content-script, page-script and background-workers
3. Design Techniques
4. Color Scheme Selection
5. Font Selection
6. Web Socket Instant Updates

---

### Challenges I Faced?
1. Hop.io helped a lot in instant messaging side.
2. State Management and Updates
3. Authentication
4. Unclear Docs for chrome extension development by google
5. Large Package Sizes
6. Manifest.json Fequently changing structure and requirement (chrome extension)


### How to run this on your local machine?
#### Follow these steps:

1. Install mongodb on your localmachine and get connection url string for exochat database.
    
    or run the below command if you have docker
    
    ```
    docker run -d -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret -p 27017:27017 mongo
    ```
    then, you connection url will be : mongodb://admin:secret@localhost:27017/exochat

2. Add the Connection string to exochat-server/.env
3. Install The Packages in "exochat-server" folder
    ```
        npm install
    ```
4. Go to "exochat" folder and Install the packages (if the package install doesnt work, try using -f )

    ```
        npm install
    ```
    If the packages are not installed then, run
    ```
        npm install --legacy-peer-deps
    ```
    If that also doesn't work, just extract the "build.zip" file and use it to load extension



5. Start the express server by going to "exochat-server" and run
    ```
        npm run start
    ```
6. Goto the "exochat" folder and run 
    ```
        npm run build
    ```
7. Goto "chrome://extensions" and enable developer mode ( toggle on the top right of the screen )

8. Click Load Unpacked

9. Choose the "exochat/build" folder
10. Voila! You have loaded the extension.
11. Create a Exochat account
12. Go to a youtube video url
13. Start Chatting