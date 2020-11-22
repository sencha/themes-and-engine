<project name="simple-build" basedir=".">

  <target name="init"/>

  <target name="init-cmd">
    <taskdef
      resource="com/sencha/ant/antlib.xml"
      classpath="$\u007Bcmd.dir}/sencha.jar"
      loaderref="senchaloader"
    />
    <x-extend-classpath>
      <jar path="$\u007Bcmd.dir}/sencha.jar"/>
    </x-extend-classpath>
    <x-sencha-init prefix=""/>
    <x-compile
      refid="theCompiler"
      dir="$\u007Bbasedir}"
      initOnly="true"
      inheritAll="true"
    >
      <![CDATA[
        -classpath=$\u007Bbasedir}/manifest.js
        load-app
        -temp=$\u007Bbasedir}/temp
        -tag=App
      ]]>
      </x-compile>
  </target>

  <target name="rebuild">
    <x-compile
      refid="theCompiler"
      dir="$\u007Bbasedir}"
      inheritAll="true"
    >
      <![CDATA[
        --debug
        exclude
          -all
        and
          include
          -f=Boot.js
        and
          concatenate
          -j=ES5
          ext-{toolkit}-runtime{themeanddash}/{toolkit}.engine.enterprise.uncompressed.js
        and
          exclude
          -all
        and
          # include theme overrides
          include
          -r
          -tag=overrides
        and
          # include all js files needed for manifest.js
          include
          -r
          -f=manifest.js
        and
          exclude
          -f=manifest.js
        and
          concatenate
          -j=ES5
          -strip
          ext-{toolkit}-runtime{themeanddash}/{toolkit}.engine.enterprise.uncompressed.js
        and
          scss
          -appName=App
          -imageSearchPath=runtime-{toolkit}/{theme}/resources
          -themeName=theme
          -resourceMapBase=.
          -output=ext-{toolkit}-runtime{themeanddash}/{theme}/{theme}-all.scss
        and
          resources
          -excludes=-all*.css
          -out=ext-{toolkit}-runtime{themeanddash}/{theme}
        and
          resources
          -model=true
          -out=ext-{toolkit}-runtime{themeanddash}/{theme}
      ]]>
    </x-compile>
  </target>

  <target name="build" depends="init-cmd,rebuild">
    <x-sencha-command dir="$\u007Bbasedir}">
      <![CDATA[
      #-compress
        fashion
          -pwd=.
          -split=4095
          -compress
          ext-{toolkit}-runtime{themeanddash}/{theme}/{theme}-all.scss
          ext-{toolkit}-runtime{themeanddash}/{theme}/{theme}-all.css
      ]]>
    </x-sencha-command>
  </target>

  <target name="watch" depends="init-cmd,build">
    <x-fashion-watch
      refName="fashion-watch"
      inputFile="ext-{toolkit}-runtime{themeanddash}/{theme}/{theme}-all.scss"
      outputFile="ext-{toolkit}-runtime{themeanddash}/{theme}/{theme}-all.css"
      split="4095"
      compress="false"
      configFile="app.json"
      fork="true"
    />
    <x-watch compilerRef="theCompiler" targets="rebuild"/>
  </target>

</project>