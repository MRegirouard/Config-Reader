const fs = require('fs')

exports.readOptions = readOptions
exports.writeOptions = writeOptions

/**
 * Read and parse specified options from the config file.
 * @param {string} [filePath = './Config.json'] Path of file to read config information from.
 * @param {{}} [options] Options to read from config file JSON data. Keys are options to read, values are defaults for creating and empty config.
 * @param {boolean} [acceptEmpty = true] Accept an empty value for a config option.
 * @param {boolean} [create = true] Create an empty config file if one is not found.
 * @param {boolean} [addNotExist = true] Add any options not present to the file with their default values.
 * @param {string | number} [space = 0] Indentation value for the config file creation. This will be passed directly to JSON.stringify.
 * @returns {Promise<Object>} A promise that contains an object with the parsed config options from the file when fulfilled.
 */
function readOptions(filePath = './Config.json', options, acceptEmpty = true, create = true, addNotExist = true, space = 0)
{
    return new Promise((resolve, reject) => 
    {
        let config = options

        fs.access(filePath, fs.constants.F_OK, (err) =>
        {
            if (err)
            {
                if (create)
                {
                    fs.writeFile(filePath, JSON.stringify(config, null, space), (err) =>
                    {
                        if (err) reject('Config file ' + filePath + ' does not exist, but failed to create a blank one: ' + err)

                        reject('Config file ' + filePath + ' does not exist, created a blank one.')
                    })
                }
                else reject('Config file ' + filePath + ' does not exist.')
            }
            else
            {
                fs.access(filePath, fs.constants.R_OK, (err) => 
                {
                    if (err) reject('Could not read configuration file ' + filePath + '. Ensure that it can be read.')
    
                    fs.readFile(filePath, (err, data) => 
                    {
                        if (err) reject('Error reading configuration file ' + filePath + '.')


                        try
                        {
                            const readConfig = JSON.parse(data)

                            var foundEmpty = false

                            for (const [key, value] of Object.entries(options))
                            {
                                let readOption = readConfig[key]

                                if (!acceptEmpty && (readOption == null || typeof readOption === 'undefined' || readOption === ''))
                                {
                                    foundEmpty = true

                                    if (addNotExist)
                                    {
                                        config[key] = value
                                    }
                                    else
                                        reject('Error parsing config option \"' + key + '\": Option not found or is blank.')
                                }
                                else if (typeof readOption !== typeof value)
                                    reject('Error parsing config option\"' + key + '\": Option is of the wrong type (expected ' + typeof value + ', recieved ' + typeof readOption + ').')
                                else
                                    config[key] = readOption
                            }
                            
                            if (foundEmpty && addNotExist)
                            {
                                writeOptions(filePath, config, create, space).then(() =>
                                {
                                    reject('Error parsing config option: Option not found or is blank. Added option to the file.')
                                })
                            }
                            else
                                resolve(config)
                        }
                        catch (err)
                        {
                            reject('Error reading JSON from file: ' + err)
                        }
                    })
                })
            }
        })
    })
}

/**
 * Write specified options from the config file.
 * @param {string} [filePath = './Config.json'] Path of file to read config information from.
 * @param {{}} [options] Options to write to config file JSON data.
 * @param {string | number} [space = 0] Indentation value for the config file. This will be passed directly to JSON.stringify.
 * @returns {Promise<Object>} A promise that contains an object with the parsed config options from the file when fulfilled.
 */
function writeOptions(filePath = './Config.json', options, create = true.valueOf, space = 0)
{
    return new Promise((resolve, reject) => 
    {
        const writeData = JSON.stringify(options, null, space)

        fs.access(filePath, fs.constants.W_OK, (err) => 
        {
            if (err) reject('Could not write to configuration file ' + filePath + '. Ensure that it can be written to.')

            fs.writeFile(filePath, writeData, (err, data) => 
            {
                if (err) reject('Error writing to configuration file ' + filePath + '.')

                resolve('Successfully wrote config options.')
            })
        })
    })
}