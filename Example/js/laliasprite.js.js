   ///// JS Based hitboxes definer for 2D Game : LaliaSprite.js////
   /*******************************************************/
   /*********   @Author : Shadow (Habibe BA)  *************/   
   /**********  Date :    20/04/2017 14:14      ***********/
   /*********   Under GPL Licence             *************/
   /*******************************************************/
   /*******************************************************/
 
   /*******************************************************/
   /**** Check if a sprite or a hitbox overlap another hitbox ****/
   /***  For each hitbox a "virtual" sprite is created   *********/
     function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);


    }

 
   /////Reading the json file                           ////
   /*******************************************************/

      function lJson(file, callback) {
          var rawFile = new XMLHttpRequest();
          rawFile.overrideMimeType("application/json");
          rawFile.open("GET", file, true);
          rawFile.onreadystatechange = function() {
              if (rawFile.readyState === 4 && rawFile.status == "200") {
                  callback(JSON.parse(rawFile.responseText));
              }
          }
          rawFile.send(null);
      }


   /////Loading the .png and .json file from LaliaSprite////
   /*******************************************************/
   /**** ref: the key for the sprite and the json file ****/
   /**** img, json : path to .img and .json files      ****/
   /*******************************************************/

       lsload = function(game, ref, img, json)
        {    
              //Init 
              var initWidth = 5;
              var initHeight = 5;

              game.load.spritesheet(ref , img , initWidth , initHeight);
              game.load.json(ref, json);
 
          
        } 
        lsload.prototype = Object.create(Phaser.Sprite.prototype);
        lsload.prototype.constructor = lsload;


     /////Loading the .png and .json file from LaliaSprite////
     /*******************************************************/
     /**** ref: the key for the sprite and the json file ****/
     /**** frame : the frame index to display            ****/
     /*******************************************************/
   
       lsadd = function(game, ref, x, y , frame)
        {   
            
            var _this = this;
            var actions = [] ;

            var data = game.cache.getJSON(ref);
        
                    //Using frame 
                    // console.log(data.sprites[0]);
                    if (data.sprites[frame]) 
                    {
                          var neededX = parseInt(data.sprites[frame].x);
                          var neededY = parseInt(data.sprites[frame].y);
                          
                          var neededWidth = parseInt(data.sprites[frame].w);
                          var neededHeight = parseInt(data.sprites[frame].h);
                           
                          Phaser.Sprite.call(_this, game, x, y, ref);

                          game.add.existing(_this);//In order to add it in the Game
                         
                          this.texture.frame.x = neededX;
                          this.texture.frame.y = neededY;
                          this.texture.frame.width = neededWidth;
                          this.texture.frame.height = neededHeight;


                          this.actions = actions ;

                          this.hitters = [] ;
                          this.frameIndex = frame ;

                          //Keep HitBoxes right positionning
                          this.anchor.setTo(0, 0);
                         
                    }

          
        } 
        lsadd.prototype = Object.create(Phaser.Sprite.prototype);
        lsadd.prototype.constructor = lsadd;


       /////// Add an animation to a sprite
       /**name: animation's name        '**/
       /**Aarray: animation array :frames**/
        function setaction(sprite , name, Aarray) 
         {

            var newaction = {name : name, frames : Aarray};
            sprite.actions.push(newaction);

         }


      /////////// Plays an animation ( To call in update() )
      /*** sprite : the sprite with hitboxes (any sprite with Lalia hitboxes) ***/
      /*** ref : the sprite key                                               ***/
      /*** name : the animation name provided in @setaction()                 ***/
      /*** speed : animation speed                                            ***/
      /*** hitType : hitbox type :  ( action | hit | both )                                           ***/
      /*** objects : Array of sprites with which collision is possible        ***/
      /*** action : Callback after collision                                  ***/

       function playaction(sprite, ref, name, speed, hitType, objects, action)
         {
            var _frames ;

          ////Get anim props

           var animArray = sprite.actions;
           //////////// Matching the needed animation /////
           for (var i = 0; i < animArray.length; i++) 
             {
               if (animArray[i].name == name) 
                 {
                   _frames = animArray[i].frames;
                 }
              }
            
             /*Getting the spritesheet sprites with their details (x, y, index,  ...) */
             var data = game.cache.getJSON(ref);
             if (sprite.frameIndex == 0)
              {
               return loopIt(sprite, data, _frames,speed, hitType , objects,action);
              }


             sprite.hitters = [];


         }

  ///// Parse animation frames
  /*@Ref --> previous*/

  function loopIt(sprite, data, fArray, speed, hitType ,objects, action)
   {
       
     
     var _thisGame = sprite.game ;

     var hitGroup = _thisGame.add.group();

     var i=0;
     var loop = setInterval(function()
        {
           
           // getting the specified frameIndex
              var index = fArray[i];

              // console.log(data.sprites[index]);

              var neededX = parseInt(data.sprites[index].x);
              var neededY = parseInt(data.sprites[index].y);
              
              var neededW = parseInt(data.sprites[index].w);
              var neededH = parseInt(data.sprites[index].h);
             
              sprite.texture.frame.x = neededX;
              sprite.texture.frame.y = neededY;
              sprite.texture.frame.width = neededW;
              sprite.texture.frame.height = neededH;

              sprite.frameIndex = index;

              ///////////////--HITBOXES--//////////////
            
               // console.log("frame : "+sprite.frame);
               var boxes = data.sprites[index].properties;
               // console.log(boxes);

               for (var j = 0; j < boxes.length; j++)
                {
                    var boxId = boxes[j].id;
                    var boxX = parseInt(boxes[j].x, 10);
                    var boxY = parseInt(boxes[j].y, 10);
                    var boxW = parseInt(boxes[j].w, 10);
                    var boxH = parseInt(boxes[j].h, 10);
                    var boxType = boxes[j].type;

                    var newbox = setBox(hitGroup, boxId, boxX, boxY, boxW, boxH, boxType, neededW, neededH)
                    sprite.hitters.push(newbox);
                    
                   // console.log(boxes[j].type);
                }
      


              /////////////////////////////////////////
               sprite.addChild(hitGroup); 

               playcollide(hitGroup, objects , hitType, action);
             
               // console.log("hitGroup : "+hitGroup.length);

               i++;

             var boxloop = 
               setInterval(function()
                {

                   if (i == fArray.length)
                      {  clearInterval(boxloop); 
                         sprite.hitters = []; }


                },speed*2);

            

           if (i == fArray.length) 
           { 
            clearInterval(loop);
            // return hitGroup;
            sprite.frameIndex = 0;
            hitGroup.removeAll(true, true);
            

            sprite.removeChild(hitGroup);
            // console.log("inner : "+hitGroup.length);
         }

         },speed);

            // hitGroup.removeAll(true, true);
               
       
    }  

  //Plays the callback after a specific collision
  //@For example : Opponent turn into red when touched over head!
  /*** hitGroup : Array (group) of current sprite's hitboxes  **/
  /*** opponents : Array (group) of opponents                 **/
  /*** type : type of hitbox :  ( action | hit | both )       **/
  /*** action : The Callback                                  **/

  function playcollide(hitGroup, opponents, type , action) 
   {      
          var objIndex = -1;
          hitGroup.forEach(function(item)
            {
                if (item.boxType == type)
                 {  
                    var oppIndex = 0;
                   opponents.forEach(function(opponent)
                     {
                         if (checkOverlap(item , opponent))
                         {   
                            // objIndex = oppIndex;
                            // console.log("touché !");
                            action();
                             
                         }
                      oppIndex++;
                   });
                    
                 }
            });      

          return objIndex;
   }


    //Set for each frame (sprite) (in the spritesheet) the corresponding specified hitboxes in the .json file
    //It creates fictive sprite (setted to transparent) with a non-existing key reference (@laliakey)
    function setBox(_thisHitGroup , id, x, y, w, h, type, neededW, neededH)
       {
           var realX = x; 
           var realY = y;
           var fill  = '' ;

           if (type == 'hit') { fill = 0XDF0101;}
           if (type == 'action') { fill = 0X2E64FE;}
           if (type == 'both') { fill = 0X04B404;}

           var box = _thisHitGroup.create(realX, realY, '@laliakey');
           box.width = w;
           box.boxType = type;
           box.height = h;
           box.tint = fill;
           box.alpha = 0.4;


          return box;
       }




/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
       ////Get the frames of an animation 

       function getFrames(sprite, ref, name, speed)
         {
            var _frames = [sprite.frameIndex] ;

          ////Get anim props

           var animArray = sprite.actions;
           ///// Matching the needed animation /////
           for (var i = 0; i < animArray.length; i++) 
             {
               if (animArray[i].name == name) 
                 {
                   _frames.pusanimArray[i].frames;
                 }
              }
            
             // var data = game.cache.getJSON(ref);

            return _frames;

             sprite.hitters = [];


         }
