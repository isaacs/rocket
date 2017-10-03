# Rocket
A fully NPM/Yarn compatible repository, without NPM.


I started working on Rocket after hearing about the ridiculous views of NPM's CEO.

I also wanted something for the Node community to use that is fully 100% open source, as NPM's registry isn't.

### Contents:

- Contribution guidelines.
- General code documentation.
- Info on NPM's API.




### Contribution guidelines.

Please only make a PR if it is useful, and follows the StandardJS standard.

TODO: Add more here.




### TODO.

- Write the script to populate the users database with a default dummy user. 



### code docs and general info. 

The backend is Express. Currently the registry can handle the following: 

- Login (logout in the works)
- Package Publish. 

### Building Rocket locally. 

Now that I have the package publish command support implemented, I am going to be next working on the serving of downloads and package information, for this I am going to be using Redis. So you might as well set it up now, though this is up to you. 

I will be at some point, booting up a DO server to run a public database and cache server, this will be used for development purposes only. The user will not have root privileges, but for now you will need a MySQL database of your own. 

Mac users can use MAMP, I do not know anything (no really, I don't) any way, if you are here wanting to contribute to or run your own Rocket registry, I can be pretty confident that you know how to setup a database.


Rocket is not on NPM, and neither are any of its components, the required module are though. 

1)```git clone https://github.com/ozzie1998/rocket.git``` 
this step is optional, if you use PM2 or something else, skip this step. 
2) ``` yarn add global pm2```

3) ```yarn || npm install - up to you```

You will now need to switch from the default registry, to Rocket.  

4) ```node server.js```

If that all starts up, create a new terminal window/tab and run the following:

```npm set registry http://localhost:3000``` 

HTTPS is on the list