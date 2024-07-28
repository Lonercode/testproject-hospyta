# testproject-hospyta
>
> ***The app targets node 18.7.0***

## Start here

To use the api, you would need mongodb, nodejs (TypeScript) and npm installed.

### How to set up MongoDB
> Install mongodb on your machine.\
> Refer to the <a href="https://www.mongodb.com/docs/manual/installation">*www.mongodb.com*</a> for instructions on installation for your operation system.
>Afterwards, start the mongod service in your cmd.

## Alternative (Docker)
> Alternatively, you can set up Docker for MongoDB. If docker is not installed in your machine, follow the guide here <a href='https://docs.docker.com/guidesgetting-started'>docker guide</a>.

### How to set up Nodejs
>Install nodejs from <a href="https://nodejs.org">*nodejs.org*</a>. Likewise, follow the instructions for your operating system.
>
#### Installation of nodejs and npm on different Operating Systems

*windows*
>Install using the link above and follow the instructions.

*macOS*
>Install nodejs and npm using Homebrew. Open the terminal and run;

```bash
    brew install node
```

*Linux*
>Use apt to install nodejs and npm. In the terminal run;

```bash
    sudo apt update
    sudo apt install nodejs npm
```

### Steps to run project

1. *Clone the Repository*

``` bash
    git clone https://github.com/Lonercode/testproject-hospyta.git
    cd testproject-hospyta
```

2. *Backend Setup*

```bash
    npm install
```

3. *Environment variables*

> Create a .env file using the .env.example file as a guide.
> Create your PORT and DB_URI env variables depending on your setup.


4. *Start the Application*

>Start the api. To start in development mode, run: 

```bash
    npm run dev
```

### Challenges
>A challenge for me was time. I had envisioned a complete api with testing included but could not accomplish this due to power failures. 
>In addition, the instructions were keen on authentication and security. I had to implement a couple of endpoints that achieved this feat while being cautious not to include routes that were unncessary. Drawing that line is a little difficult.