# TypeORMIONICMigrationSample
A ionic example with TypeORM SDK with migrations

### How to run this example
1. Install the ionic and cordova cli: `npm install -g cordova ionic`
2. Install all dependencies: `npm install`
3. Add a platform: `ionic cordova platform add <ios | android>`
4. Run the app: `ionic cordova run <ios | android>`. If you need help, you can read [ionic's guide](https://ionicframework.com/docs/intro/deploying/) for running an app on your device

### Using TypeORM in your own app
1. Install the plugin: `ionic cordova plugin add cordova-sqlite-storage --save`
2. Install TypeORM: `npm install typeorm --save`
3. Install node.js-Types: `npm install @types/node --save-dev`
4. Add `"typeRoots": ["node_modules/@types"]` to your `tsconfig.json` under `compilerOptions`
5. Create a custom webpack config file like the one [included in this project](config/webpack.config.js) to use the correct TypeORM version and add the config file to your [`package.json`](package.json#L14-16) (Required with TypeORM >= 0.1.7)
