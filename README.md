# Ext JS Bridges Themes and Engine Generator
This repo contains documentation of the themes and engine npm package generation process.
These packages are used by the following products:
- ExtAngular
- ExtReact
- ExtWebComponents

## Step 1 - Acquire the latest version/branch of the SDK from https://github.com/extjs/SDK

**NOTE: this readme will refer to this folder as {sdkroot}**

**NOTE: If you wish a watermark to appear in the code, aquire a version of the SDK with the watermark.

TODO: need direction on how to acquire this: the trial download does not seem to have the watermark

**

This initial version of themes-and-engine.js requires modifications to legacy slicing source code in the SDK and must be run locally,
by the developers / maintainers.

## Step 2 - edit first of 2 scss files

- cd to {sdkroot}/classic/theme-base/sass/etc/mixins
- edit: slicer.scss

edit this function: (see 2 comments)
//comment out this line
//add this line
```
@function sliceit($cls, $kind, $path, $extension) {
    $url: theme-background-image($path, $extension, true);

    @if $url != none {
        $op: $kind + ':' + $url;
        $slice: add-slice($cls, $op);
    }

//comment out this line
    //@return $url;
//add this line
    @return 'images/magnify.png';
}
```

## Step 3 - edit second of 2 scss files

- cd to {sdkroot}/classic/theme-base/sass/etc/mixins
- edit: slicer.scss

edit this mixin: (see 2 comments)
//comment out this line
//add this line
```
@mixin x-slicer($cls) {
    $cls: quote($cls);
    $slices: map_get($slicer-map, $cls);

    @if $slices != '' {
        // We don't need to use the $prefix for x-cmd-slicer and doing so would make it
        // difficult for Cmd to know what class to add...
        /*<if slicer>*/
        .x-cmd-slicer.#{$prefix}#{$cls}:before {
            display: none;
            // We need to override content when slicing:
//comment out this line
            //content: "x-slicer:#{$slices}" !important;
//add this line
            content: "" !important;
        }
        /*</if slicer>*/
// add a comment line to ensure the end directive gets its own line
        /* */
    }
}
```

## Step 4 - Create an app and copy ext folder

- With Sencha Cmd, generate a universal app (both classic and modern toolkits) with the latest release of the SDK (the one above that was just edited), for example:

```
sencha -sdk {sdkroot} generate app reference-app ./reference-app
```

- this command will create an 'ext' folder in the ./reference-app folder
- you can use this 'ext' folder created by this command for the next step

## Step 5 - add the premium packages to ./reference-app/ext/packages

- copy all premium package folders to ./reference-app/ext/packages

## Step 6 - replace the 'ext' folder for both modern and classic

- in ./modern folder of themes-and-engine
  - replace ./modern/ext with new SDK version ('ext' folder from above)

- in ./classic folder of themes-and-engine
  - replace ./classic/ext with new SDK version ('ext' folder from above)

## Step 7 - edit version property

- in ./template folder of themes-and-engine
  - replace version property in package.json.tpl

## Step 8 -  generate the packages

- run: npm install
- run: npm run allmodern
- run: npm run allclassic

When completed, the ./packages folder will have these 2 npm packages:

- ext-classic-runtime
- ext-modern-runtime

## Step 9 - Publish or link both of these packages

- run: ./packages/ext-modern-runtime/npm publish
- run: ./packages/ext-classic-runtime/npm publish

###or

- run: ./packages/ext-modern-runtime/npm link
- run: ./packages/ext-classic-runtime/npm link


## testing

- Angular must be tested with this version of Angular CLI
- https://www.npmjs.com/package/@angular/cli/v/9.1.12

to install this version of Angular CLI, use this command:

- npm i @angular/cli@9.1.12

there is a 'tests' folder in this repo

- with an Angular CLI ExtAngularClassic project
- test of a Pivot Grid
- test of all classic themes
  - aria
  - classic
  - crisp
  - crisp-touch
  - graphite
  - gray
  - neptune
  - neptune-touch
  - triton

