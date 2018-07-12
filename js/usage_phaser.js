   /////Loading the .png and .json file from LaliaSprite////
   /*******************************************************/
   /*******************************************************/
   /**** ref: the key for the sprite and the json file ****/
   /**** img, json : path to .img and .json files      ****/
   /*******************************************************/
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
     /*******************************************************/
     /**** ref: the key for the sprite and the json file ****/
     /**** frame : the frame index to display            ****/
     /*******************************************************/
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

                          //The animations
                          this.actions = actions ;
 
                          this.frameIndex = frame ;

                          //Keep HitBoxes right positionning
                          this.anchor.setTo(0, 0);
                         
                    }

          
        } 
        lsadd.prototype = Object.create(Phaser.Sprite.prototype);
        lsadd.prototype.constructor = lsadd;

       //////// Check overlap between a hitbox and another object
       function checkOverlap(spriteA, spriteB) {

              var boundsA = spriteA.getBounds();
              var boundsB = spriteB.getBounds();

              return Phaser.Rectangle.intersects(boundsA, boundsB);


          }
 
       /////// Add an animation to a sprite
        function setaction(sprite , name, Aarray) 
         {

            var newaction = {name : name, frames : Aarray};
            sprite.actions.push(newaction);

         }


      /////////// Play an animation ( call in update )
      ///***** action : the function to call when the specified collision is achieved
       function playaction(sprite, ref, name, speed, hitType ,objects, action)
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
            
             var data = game.cache.getJSON(ref);
             if (sprite.frameIndex == 0)
              {
               return loopit(sprite, data, _frames,speed, hitType ,objects,action);
              }

 


         }

  ///// Parse animation frames
  function loopit(sprite, data, fArray, speed, hitType ,objects, action)
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

                    var newbox = setBox(hitGroup, boxId, boxX, boxY, boxW, boxH, boxType)
                    
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
                      {  clearInterval(boxloop); }


                },speed*2);

            

           if (i == fArray.length) 
           { 
            clearInterval(loop);

            sprite.frameIndex = 0;
            hitGroup.removeAll(true, true);
            

            sprite.removeChild(hitGroup);

           }

         },speed);

       
      
       
    }  
   
  function playcollide(hitGroup, opponents, type, action) 
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

                           action();
                             
                         }
                      oppIndex++;
                   });
                    
                 }
            });      

          return objIndex;
   }


    //Set for each frame (in the spritesheet) the specified hitboxes in the .json file
    function setBox(_thisHitGroup , id, x, y, w, h, type)
       {
          
           var fill  = '' ;

           if (type == 'hit') { fill = 0XDF0101;}
           if (type == 'action') { fill = 0X2E64FE;}
           if (type == 'both') { fill = 0X04B404;}
         
           // NB : Add a sprite with 'box' as key 
           var box = _thisHitGroup.create(x, y, 'box');
           box.width = w;
           box.boxType = type;
           box.height = h;
           box.tint = fill;
           box.alpha = 0.4; 

          return box;
       }



       ////Getting the frames of an animation 
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


         }
