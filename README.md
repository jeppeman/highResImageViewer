sexyImageViewer
===============

A jQuery image viewing plugin with cool additional functionality for images which resolution is higher than that of the current window.
Images with very high resolutions can be viewed in a nice way on devices with very small screens.

This is still kind of crude and some stuff is missing, but the core functionality is there and working.

How it works
======
It's like any image viewer in essence, what is cool about it is the functionality for images with high resolution.
When first displaying an image which has a higher resolution than that of the window it is scaled down to fit inside the window, but you have the ability to zoom the image to see specific parts of it in its actual resolution. 

When the image is zoomed, you can move to a different place in the image by clicking and dragging inside the image, or doing the same thing inside the little helper image which resides in the top left corner of the screen if an image with high resolution is currently being displayed.
This is to make it clearer to the user what exact part of the image is currently being displayed.

Usage
======
The plugin is supposed to be instantiated on an element which contains images, although it doesn't necessarily need to, you can instantiate it on any element you want really, and just add images to the plugin instance whenever you feel like it.

<b>Usage example 1:</b>

Let's say you have a container which looks like this:

<code>
  \<div class="image-container"\>
      \<img src="somesource1" /\>
      \<img src="somesource2" /\>
  \</div\>
</code>

If you just apply the viewer to the outer container like this:

<code> $(".image-container").sexyImageViewer(); </code>

The plugin will be instantiated, and if you double click on any of the images it will be shown in the viewer.
If you want to bind the showing of the viewer to a different event than double click you have the option to do so by
doing something like this: <code> $(".image-container").sexyImageViewer({ "show_event_binding" : "mouseover" }); </code>.

If you do not want images inside the container to be added automatically you can provide the option <code> { "automatic_add" : false } </code>

<b>Usage example 2</b>

Assume you have the same container as in the previous example, but with no images inside.
