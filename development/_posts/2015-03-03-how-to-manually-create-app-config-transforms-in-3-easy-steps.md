--- 
layout: post
title: "How to manually create App.Config transforms in 3 easy steps"
author: "Robert Bird"
comments: true
excerpt_separator: <!--more-->
---

For this example we will assume that we are adding a transform for a configuration called PROD. 

![My helpful screenshot]({{ site.url }}/assets/config-transforms.png)


### Step 1.

Create a new empty config file using the same naming conventions as web.config files follow. So for our example we would create a new file alongside the _app.config_ called _app.PROD.config_.


### Step 2

Edit the project file to include the new file. To do this you first need to right click on the project and select &quot;_Unload Project_&quot; near the bottom of the menu. Then right click on the project again and select edit from the menu.  



You will then see the project files XML contents. Hit CTRL+F and search in the file for &quot;app.config&quot; you should find the following:
<!--more-->


{% highlight xml lineanchors %}
<None Include="App.config">
  <SubType>Designer</SubType>
</None>

<None Include="App.config">
  <SubType>Designer</SubType>
</None>
{% endhighlight %}


Below this fragment of XML add 

{% highlight xml lineanchors %}
<None Include="App.PROD.config">
  <DependentUpon>App.config</DependentUpon>
  <SubType>Designer</SubType>
</None>
{% endhighlight %}

This will add the new file to the project, but the dependentUpon element will mean that the new file appears nested below the app.config file.

You can now right click on the project and select "_Reload Project_"

### Step 3

While you have the project file open, add the following XML to the end of the file just before the closing </Project> tag.

{% highlight xml lineanchors %}
<UsingTask TaskName="TransformXml" AssemblyFile="$(MSBuildExtensionsPath)\Microsoft\VisualStudio\v10.0\Web\Microsoft.Web.Publishing.Tasks.dll" />
<Target Name="AfterCompile" Condition="exists('app.$(Configuration).config')">
    <!-- Generate transformed app config in the intermediate directory -->
    <TransformXml Source="app.config" Destination="$(IntermediateOutputPath)$(TargetFileName).config" Transform="app.$(Configuration).config" />
    <!-- Force build process to use the transformed configuration file from now on. -->
    <ItemGroup>
      <AppConfigWithTargetPath Remove="app.config" />
      <AppConfigWithTargetPath Include="$(IntermediateOutputPath)$(TargetFileName).config">
        <TargetPath>$(TargetFileName).config</TargetPath>
      </AppConfigWithTargetPath>
    </ItemGroup>
</Target>
{% endhighlight %}


Hang on, what did that do? Ok, so the XML above checks for a file called app.[BuildConfiguration].config and If it exists it will apply the same XML transform used in web projects. The result is that after running a build the output folder will contain a file called app.config that has been transformed using the appropriate transform file. 

I personally find this really useful for testing projects where you want the build server to be able to execute tests against different environments by simply running the tests with a configuration flag from msbuild and mstest. 