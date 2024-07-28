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
    git clone https://github.com/Lonercode/user-microservice-project.git
    cd user-microservice-project
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
