{
  "framework": "ext",
  "toolkit": "{toolkit}",
  "theme": "theme-{theme}",
  "requires": [
<tpl if="toolkit == 'modern'">
    "froala-editor",
</tpl>
    "ux",
    "font-awesome",
    "calendar",
    "charts",
    "d3",
    "exporter",
    "pivot",
    "pivot-d3"
  ],
  "classpath": [
    "app",
    "$\u007Btoolkit.name}/src"
  ],
  "resources": [
    {
        "path": "resources",
        "output": "shared"
    },
    {
        "path": "$\u007Btoolkit.name}/resources"
    },
    {
        "path": "$\u007Bbuild.id}/resources"
    }
  ],
  "overrides": ["overrides"],
  "slicer": null,
  "packages": {
    "dir": [
      "./packages"
    ]
  },
  "language": {
    "js": {
      "input": "ES5",
      "output": "ES5"
    }
  },
  "output": {
    "base": ".",
    "js": {
      "path": "$\u007Bbuild.id}/app.js"
    }
    // "resources": {
    //   "path": "./ext-runtime-{toolkit}/resources",
    //   "shared": "./ext-runtime-{toolkit}/resources"
    // }
  },
  "production": {
    "compressor": {
      "type": "cmd",
      "wrapLines": 100
    },
    "output": {
      "appCache": {
        "enable": false
        }
    },
    "cache": {
      "enable": false
    }
  }
}