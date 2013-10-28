sexyImageViewer
===============

A jQuery image viewing plugin with cool functionality that enables a nice viewing of images which resolutions are higher than that of the current window.

This is still rather untested, so don't be too surprised if you run into some bugs. :) The core functionality should be working however, If you have any suggested additions
or find any bugs, please report it to me.

Q: Why the additional style.css and fonts folder?<br>
A: SVG + and - icons 

How it works
======
It's like any image viewer in essence, the cool thing about it is the functionality for images with high resolutions.
When first displaying an image which has a higher resolution than that of the window it is scaled down to fit inside the window, but you have the ability to zoom the image to see specific parts of it in its actual resolution. 

When the image is zoomed, you can move to a different place in the image by clicking and dragging inside the image, or doing the same thing inside the little helper image which resides in the top left corner of the screen if an image with high resolution is currently being displayed.
This is to make it clearer to the user what exact part of the image is currently being displayed.

Method summary
=========
<ul>
<li>init - Default method, initializes the viewer</li>
<li>addImage - Adds an image to the image collection of the calling instance</li>
<li>show - Show the viewer with some image</li>
<li>hide - Hide the viewer</li>
<li>appendToTopbar - Append arbitrary html to the top bar</li>
<li>appendToBottomBar - **TODO** Append arbitrary html to the bottom bar</li>
<li>getEventBinding - Get the current show event of images, default dblclick</li>
<li>next - Go to the next image of the current instance</li>
<li>prev - Go to the previous image of the current instance</li>
</ul>

Demo
=======
Here follows a demonstration of the plugin:
www.kebabnormal.se/imagedemo

Since the actual sized images are large and the server on which the demo resides is really slow, they may take some time to load. :)

Usage
======
The plugin is supposed to be instantiated on an element which contains images, although it doesn't necessarily need to. You can instantiate it on any element you want really, and just add images to the plugin instance whenever you feel like it.

Current keybindings are:
<ul>
<li>Escape - close the viewer</li>
<li>Arrow right - go to the next image</li>
<li>Arrow left - go to the previous image</li>
</ul>

<b>Usage example 1:</b>

Let's say you have a container with two images like the following:

<pre>
  &lt;div class="image-container"&gt;
      &lt;img src="somesource1" /&gt;
      &lt;img src="somesource2" /&gt;
  &lt;/div&gt;
</pre>

If you just apply the viewer to the outer container like this:

<code> $(".image-container").sexyImageViewer(); </code>

The plugin will be instantiated, and if you double click on any of the images they will be shown in the viewer.
If you want to bind the showing of the viewer to a different event than double click you have the option to do so by
doing something like this: 

<code> $(".image-container").sexyImageViewer({ "show_event_binding" : "mouseover" }); </code>.

If you do not want images inside the container to be added automatically you can provide the option <code> { "automatic_add" : false } </code>

<b>Usage example 2</b>

Assume you have the same container as in the previous example, but you might want to add images which are residing elsewhere
or dynamically generated ones, this would be achieved by doing this:

<pre>
var image = $("&lt;img&gt;", { "src" : "somesource1" }).appendTo($(".image-container")); // This could also be any image
$(".image-container").sexyImageViewer("addImage", { "img" : image });
</pre>

Note that the image doesn't have to be appended to anything to be added to the viewer. Using this approach has some benefits over
the automatic addition; let's say you have a thumbnail version of an image with high resolution, you may want to display the
thumbnail version on the web page, and the actual sized one in the viewer. This is achieved by doing this:

<pre>
var image = $("&lt;img&gt;", { "src" : "thumbnail_src" }).appendTo($(".image-container")); // This could also be any image
$(".image-container").sexyImageViewer("addImage", { 
  "img" : image,
  "alt_src" : actual_image_source // actual_image_source being the source of actual image, go figure
});
</pre>

Now if you apply the event (default double click) to the thumbnail version, the viewer will be displayed with the actual
sized image.

Other options that might be provided to the addImage method are:
<ul>
<li><code>{ "cb_show" : function() {} }</code> - callback which is executed when the specified image is shown</li>
<li><code>{ "filename" : "Some name" }</code> - By default the actual file name will be displayed
</ul>

Browser support
======
It should be working in most relatively modern browsers, I've tested it down to IE 8 a while ago back, some bugs may have
appeared since then though, but all in all the cross browser support should be rather consistent.
