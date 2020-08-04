# Project Status

Track your project status and send notifications about completed project stages or projects to your client. 
Your clients can check the status of a project by entering their email address and project id. 

![Screenshot of Web Application Project Status](https://raw.githubusercontent.com/a-dridi/Project-Status/master/screenshot.PNG)

The application needs Angular, Express JS, NodeJS and Mongo Database. All needed dependencies are saved in the package.json in the frontend and backend folders. 




## Configuration

Please adjust the file "server.js" in the folder "backend" to your server settings. You need to setup a functioning mongoDB server. 

Do also copy the file "emailCredentials.txt.template" to "emailCredentials.txt" (in the folder "credentials") with the adjusted settings for your mail server and account.



## Run
To start the application directly. You need to have NodeJS and MongoDB installed.

"server.js" production file is in the root of this repository. As well as other backend files that are needed for "NodeJS" server. The files in the folder "frontend" are needed for your "Angular" server.

**Start Database server (In Windows): **
`bin/mongod.exe`

**Start backend server:**
`cd backend`
`npm run dev`

**Start Frontend server:**
`cd frontend`
`ng serve --open`



## API

The id field of MongoDB is used to reference a project. 

- Get all projects  - GET request:
`GET /api/projects`

- Get a project for a certain ID - GET request:
`GET /api/project/ID`

Check the file "server.js" in the folder "backend" for more API routes. 



## Installation (Deployment)

Copy all backend files into the folder "src". 

- Backend:
```
npm install
```
```
npm run build
```

Copy the content of the folder "build" to your server.
 

- Frontend:
```
npm install
```
```
ng build --prod=true
```

Copy the content of the folder "public" to your server.


## Authors

* **A. Dridi** - [a-dridi](https://github.com/a-dridi/)
* Check licences of dependencies


## Screenshots

![Screenshot 2 of Web Application Project Status](https://raw.githubusercontent.com/a-dridi/Project-Status/master/screenshot2.PNG)
![Screenshot 3 of Web Application Project Status](https://raw.githubusercontent.com/a-dridi/Project-Status/master/screenshot3.PNG)
![Screenshot 3 of Web Application Project Status](https://raw.githubusercontent.com/a-dridi/Project-Status/master/screenshot4.PNG)
![Screenshot 3 of Web Application Project Status](https://raw.githubusercontent.com/a-dridi/Project-Status/master/screenshot5.PNG)