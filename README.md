# json-dynamo-putrequest

[![npm version](https://badge.fury.io/js/json-dynamo-putrequest.svg)](http://badge.fury.io/js/json-dynamo-putrequest)
[![CircleCI](https://circleci.com/gh/lmammino/json-dynamo-putrequest.svg?style=shield)](https://circleci.com/gh/lmammino/json-dynamo-putrequest)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Converts an arbitrary JSON into a DynamoDB PutRequest JSON to simplify the import of the raw data

The command basically takes a JSON string defining an array of objects as input and it converts to
a JSON that contains an array of PutRequests suitable for loading the data in the original file in DynamoDB.

As an example if you have the following `integers.json` file as input:

```json
[
  { "value": 1 },
  { "value": 2 }
]
```

and you run:

```bash
json-dynamo-putrequest integersTable integers.json --beautify
```

It will output:

```json
{
  "integersTable": [
    {
      "PutRequest": {
        "Item": {
          "value": {
            "N": "1"
          }
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "value": {
            "N": "2"
          }
        }
      }
    }
  ]
}
```

If you save this output in a file called `integersDynamo.json` you can then import
the data directly in DynamoDB using the AWS command line client:

```bash
aws dynamodb batch-write-item --request-items file://integersDynamo.json
```


## Install

Globally:

```bash
npm install --global json-dynamo-putrequest
```

Or as a dev dependency (e.g. you need it as part of your build process)

```bash
npm install --save-dev json-dynamo-putrequest
```


## Usage

Using "pipes":

```bash
cat some.json | json-dynamo-putrequest tableName
```

Using input redirection:

```bash
json-dynamo-putrequest tableName < some.json
```

If you want to save the output to a file just use output redirection (or the `--output` option):

```bash
json-dynamo-putrequest tableName < some.json > dynamo.json
# OR json-dynamo-putrequest tableName --output dynamo.json < some.json
```

If you prefer to read the input from a file (rather then from the standard input) you can pass an extra parameter instead of using pipes or input redirection:

```bash
json-dynamo-putrequest tableName some.json
```

You can also beautify the output using the `--beautify` flag:

```bash
json-dynamo-putrequest --beautify tableName some.json
```

> **PRO-TIP**: if you don't want to write `json-dynamo-putrequest` all the time,
 there is also the abbreviated alias `jdp`! :)


## Command line options

You can display the live help by running:

```bash
json-dynamo-putrequest --help
```

Which will give you the list of all the available options and arguments:


```
json-dynamo-putrequest <tableName> [sourceFile]

Converts a JSON input into a JSON containing a set of DynamoDB PutRequests

Positionals:
  tableName   The name of the DynamoDB table                            [string]
  sourceFile  The source JSON file. If not specified the data will be read from
              the standard input                                        [string]

Options:
  --help          Show help                                            [boolean]
  --output, -o    the output file, if specified the output will be written in
                  the file
  --beautify, -b  the output file, if specified the output will be written in
                  the file                                             [boolean]
  --version       Show version number                                  [boolean]
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/json-dynamo-putrequest/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
