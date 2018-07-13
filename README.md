# LaliaSprite
<img src="img/logo.png" >
<h4>Js spritesheet generator & hitboxes definer</h4>
<span>
Lalia sprite is a tool that you can easily (like a web site) run locally in order to generate your spritesheet
with different sprite sizes and define for each sprite the hit areas (or collide zone).

  Lalia sprite generate a .png file (the spritesheet) and a .json file (the spritesheet details and hitboxes details )
</span>

<h4>Preview</h4>

<img src="img/preview.png" >
<h2>Getting started</h2>
<h4>Installation</h4>
<span>Download the zip , unzip it in your server local directory and access to localhost/laliasprite.</span>
 

<h2>Usage</h2>
<h4>Phaser JS</h4>
<span> In your Phaser game code , load the .json file () and the .png file like this</span>
<span><em> All the functions below are in laliasprite.js</em></span>
<pre>
 <code>
  //In your preload function
  
  function preload() 
    {
       var mySprite;
       new lsload(game, 'ref', 'laliasprite.png' ,'laliasprite.json');

      ...
    }

 </code>
</pre>

<pre>
 <code>
  //In your preload function
  function create() 
    { 
       //Add the sprite
       mySprite = new lsadd(game, 'ref', 250, 200, 0);

      ...
      //Set an animation (This replaces sprite.animations.add() )
      
      myAnimation = [1,2,3,4];
      setaction(mySprite, "jump", myAnimation);
      
      ....
    }

 </code>
</pre>

<pre>
 <code>
  //In your update function
  function update() 
    {
       
       //When an event is triggered
       //call
       objects = [aSprite, anotherSprite, ...];
       
       function myCallback()
        {
          //do stuffs
        }
  
        playaction(mySprite, "ref", "jump", 200, "action|hit|both", objects, myCallback); 
       
    }

 </code>
</pre>


<h5>You can write your own functions to handle the spritesheet and the hitboxes : Just look at to "laliasprite.js" functions structure  or the .json file</h5>






