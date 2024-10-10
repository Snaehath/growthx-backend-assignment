# GrowthX Back-end Assignment

### Database Setup:

1. Create a [`MongoDB`](https://www.mongodb.com/) with a collection named `Assignment-project`
2. Create `.env` file in the root directory with variable `CONNECTION_STRING` assigned to the `mongodb uri` which can be found in the `Connect -> Connect your application` section of your mongo db database
3. Make sure to select the `Node.JS` driver with the version `4.1 or later`

### JWT Setup:

1. Visit [`Norton Password Generator`](https://my.norton.com/extspa/passwordmanager?path=pwd-gen) to generate an secure password to use as secret for token generation
2. Put the generated password in the `.env` file for the `SECRET` variable

#### `Note`: Your `.env` file should look something like this (kindly refer to `Database Setup` and `JWT Setup`for fill these variables)

```
CONNECTION_STRING =
SECRET =
```

## Usage:

```
1. git clone https://github.com/Snaehath/growthx-backend-assignment.git
2. cd growthx-backend-assignment
3. npm / yarn install
4. npm / yarn start (in production)
5a. npm / yarn run dev-win (in development for Windows)
5b. npm / yarn run dev-mac (in development for MacOS / Linux)
```
