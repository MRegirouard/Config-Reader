# Config-Reader
An NPM package to read a configuration file in a robust and user-friendly manner.
<br>
This package allows your to easily store config information in JSON format for your programs. It is intended for use with projects that have "secrets" (e.g. API keys) or options you want the user to configure before running your project.

# Features
 - Can read a JSON file and pull specific data from the file
 - Will ensure that it has read/write access where applicable before attempting to access the file
 - Ability to create a file with default settings if one is not found
 - Ability to add options to a file if the option is not found
 - Checking if certain options are not found or empty
 - Type checking
 - Writing options back to a file
 - Error handling and robustness
 - Asynchronous operation

# Installation
```
npm i @eta357/config-reader
```
# Usage
This package was designed with ease of use in mind as a universal JSON file reader.
First, require the module:
```js
const confReader = require('@eta357/config-reader')
```
## Reading
Then, specify a file path and an object with options to read. In the object, set the option values to what the default should be if you would like to create a new file:
```js
const configFile = './Options.json'
const configOptions = {
  'Environment':'Production',
  'API_Key':'',
  'API_Secret':'',
  'Users':[],
  'Settings':{ 'Theme':'Dark' }
}

const acceptEmpty = false
const createNew = true
const addNotExist = true
var config
```
Read the specified options from the file:
```js
confReader.readOptions(configFile, configOptions, acceptEmpty, createNew, addNotExist).then((options) =>
{
  console.info('Successfully read config information.')
  console.debug('Read options:', options)
  client.login(options['API_Key'])
  config = options
}).catch((error) =>
{
  console.error(error)
  proccess.exit(1)
})
```
This will read the listed options from `Options.json`, failing if a field is empty, and creating a new file with the filled defaults if one does not exist. If one of the specified options is not found in the file, it will be added to the JSON.
## Writing
After modifying your config options, you can write them back to the file just as easily:
```js
confReader.writeOptions(configFile, config, createNew).then((result) =>
{
  console.info('Successfully saved configuration info.')
}).catch((error) =>
  console.error(error)
  process.exit(1)
})
```
