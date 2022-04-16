# Meta Logger for Metarhia

## Output example

<img src="https://user-images.githubusercontent.com/4405297/111154959-7b99c700-859c-11eb-81bb-0f8398535106.png" width="60%"/>

## Usage

```js
const logger = await metalog.openLog({
  path: './log', // absolute or relative path
  workerId: 7, // mark for process or thread
  writeInterval: 3000, // flush log to disk interval
  writeBuffer: 64 * 1024, // buffer size (default 64kb)
  keepDays: 5, // delete after N days, 0 - disable
  home: process.cwd(), // remove substring from paths
  json: false, // print logs in JSON format, by default false
});

const { console } = logger;
console.log('Test message');
await logger.close();
```

## License & Contributors

Copyright (c) 2017-2022 [Metarhia contributors](https://github.com/metarhia/metalog/graphs/contributors).
Metalog is [MIT licensed](./LICENSE).\
Metalog is a part of [Metarhia](https://github.com/metarhia) technology stack.