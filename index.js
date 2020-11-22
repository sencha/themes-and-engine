global["chalk"]  = require('chalk');
global["rimraf"] = require("rimraf");
global["mkdirp"] = require("mkdirp");
global["fs"]     = require("fs-extra");

writeTemplateFile =(tplFile, outFile, vars) => {
  // $\u007B is replacement for ${ in .tpl file
  require("./XTemplate");
  //var path = require("path");
  var fs = require("fs-extra");
  var tpl = new Ext.XTemplate(fs.readFileSync(tplFile));
  var t = tpl.apply(vars);
  fs.writeFileSync(outFile, t);
  delete tpl;
}

var toolkit = process.argv[2];
var theme = process.argv[3];
var themeanddash = '-' + theme;
var isAll = false

if (theme == undefined) {
  theme = 'material'
  themeanddash = ''
  isAll = true
}

go()

async function go() {
  var appFolder = `./${toolkit}`
  var outputFolder = `${appFolder}/ext-${toolkit}-runtime${themeanddash}`
  var o = {
    toolkit: toolkit,
    theme: theme,
    themeanddash: themeanddash
  }

  console.log(`${chalk.green("Step 1:")} writeTemplateFile ./templates/build.xml.tpl to ${toolkit}/build.xml`)
  writeTemplateFile(`./templates/build.xml.tpl`, `${toolkit}/build.xml`, o)

  console.log(`${chalk.green("Step 2:")} writeTemplateFile ./templates/app.json.tpl to ${toolkit}/app.json`)
  writeTemplateFile(`./templates/app.json.tpl`, `${toolkit}/app.json`, o)

  console.log(`${chalk.green("Step 3:")} sencha app build in ${appFolder}`)
  await _executeAsync('sencha', ['app','build','production'], `${appFolder}`, {child: null});

  var inputFile = `${outputFolder}/${toolkit}.engine.enterprise.uncompressed.js`
  var outputFile = `${outputFolder}/${toolkit}.engine.enterprise.js`

  if (isAll) {
    var compress = false
    if (compress == true) {
      console.log(`${chalk.green("Step 4:")} uglify ${inputFile}`)
      var uglify = require("uglify-js");
      var ugly = uglify.minify({"ext": fs.readFileSync(`${inputFile}`, "utf8")})

      console.log(`${chalk.green("Step 5:")} write uglify to ${outputFile}`)
      fs.writeFileSync(outputFile, ugly.code);

      //console.log(`${chalk.green("Step 5:")} delete ${inputFile}`)
      //rimraf.sync(`${inputFile}`);
    }
    else {
      var inputCode = fs.readFileSync(`${inputFile}`, "utf8")
      console.log(`${chalk.green("Step 4:")} write uncompressed to ${outputFile}`)
      fs.writeFileSync(outputFile, inputCode);

      console.log(`${chalk.green("Step 5:")} delete ${inputFile}`)
      rimraf.sync(`${inputFile}`);
    }
  }

  var css1File = `${outputFolder}/${theme}/${theme}-all_1.css`
  console.log(`${chalk.green("Step 6:")} clean up ${css1File}`)
  var css1FileData = fs.readFileSync(`${css1File}`, "utf8")
  var css1FileData2 = css1FileData.replace(/display:box/g, 'display:flex');
  var css1FileDataFinal = css1FileData2.replace(/:start/g, ':flex-start');
  fs.writeFileSync(css1File, css1FileDataFinal);

  var css2File = `${outputFolder}/${theme}/${theme}-all_2.css`
  console.log(`${chalk.green("Step 7:")} clean up ${css2File}`)
  var css2FileData = fs.readFileSync(`${css2File}`, "utf8")
  var css2FileData2 = css2FileData.replace(/display:box/g, 'display:flex');
  var css2FileDataFinal = css2FileData2.replace(/:start/g, ':flex-start');
  fs.writeFileSync(css2File, css2FileDataFinal);

  console.log(`${chalk.green("Step 8:")} writeTemplateFile ./templates/package.json.tpl to ${outputFolder}/package.json`)
  writeTemplateFile(`./templates/package.json.tpl`, `${outputFolder}/package.json`, o)

  var tempFolder = `${appFolder}/temp`
  console.log(`${chalk.green("Step 9:")} delete ${tempFolder}`)
  rimraf.sync(`${tempFolder}`);

  console.log(`${chalk.green("Step 10:")} copy ./tocopy to ${outputFolder}\${theme}\calendar`)
  fs.copySync(`./tocopy`,`${outputFolder}/${theme}/calendar`);

  var toPackages = `./packages/ext-${toolkit}-runtime${themeanddash}`
  if (isAll) {
    console.log(`${chalk.green("Step 11:")} copy ${outputFolder} to ${toPackages}`)
    fs.copySync(outputFolder,toPackages);
  }
  else {
    console.log(`${chalk.green("Step 11:")} copy ${outputFolder}/${theme} to ./packages/ext-${toolkit}-runtime/${theme}`)
    fs.copySync(`${outputFolder}/${theme}`,`./packages/ext-${toolkit}-runtime/${theme}`);
  }

  console.log(`${chalk.green("Step 12:")} delete ${outputFolder}`)
  rimraf.sync(`${outputFolder}`);

  console.log(`${chalk.green("done")} output package is at: ${toPackages}`)
}

async function _executeAsync (program, parms, outputPath, vars) {
  //console.log('')
  const crossSpawn = require('cross-spawn-with-kill')
  //let sencha = 'sencha'
  //let sencha; try { sencha = require('@sencha/cmd') } catch (e) { sencha = 'sencha' }
  var opts = { cwd: outputPath, silent: false, stdio: 'pipe', encoding: 'utf-8'}
  await new Promise((resolve, reject) => {
    //console.log(program)
    //console.log(parms)
    //console.log(opts)
    vars.child = crossSpawn(program, parms, opts)
    vars.child.on('close', (code, signal) => {
      if(code === 0) { console.log('');resolve(0); }
      else {
        console.log('error: ' + code)
        resolve(0)
      }
    })
    vars.child.on('error', (error) => {
      console.log('error:')
      console.log(error)
      resolve(0)
    })
    vars.child.stdout.on('data', (data) => {
      //var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      //write(`${str.slice(0,100)}`)
      //write(`${str}`)
      write(data.toString())
    })
    vars.child.stderr.on('data', (data) => {
      //var str = data.toString().replace(/\r?\n|\r/g, " ").trim()
      // if (!str.includes("Picked up _JAVA_OPTIONS")) {
      //   console.log(`${chalk.red("[ERR]")} ${str}`)
      // }
      write(data.toString())
    })
  })
}

function write(str) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${str}`)
}

