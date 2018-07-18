
   function Lalia()
   {  
   }

   Lalia.prototype = {

    checkOverlap : function(spriteA, spriteB)
     {
            if (!(spriteA instanceof Phaser.Rectangle) )
             {
              
               spriteA = spriteA.getBounds();

             }

            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(spriteA, boundsB);


     },

     //Loads spriteAtlases
     atlas : function(game, ref, img_atlases, json_atlases, json_hitboxes)
      {     

              game.load.atlas(ref, img_atlases, json_atlases);
              var _refAtlases = ref+'_@lsAtlases';
              var _refHitboxes = ref+'_@lsHitboxes';

              game.load.json(_refAtlases, json_atlases);
              game.load.json(_refHitboxes, json_hitboxes);


     },
     
     //Loads spriteSheet
     sheet : function(game, ref, img_sheet, json_hitboxes, w, h)
     {

           //Init 
           var w = w || 5;
           var h = h || 5;
           var _refHitboxes = ref+'_@lsHitboxes';

           game.load.spritesheet(ref , img_sheet , w , h);
           game.load.json(_refHitboxes, json_hitboxes);

            

     },
    //@param : sprite : Phaser.Sprite with lalia hitboxes
    //@param : animation_name : Array of frames (helps to define first frame mask props )
     atlasboxes : function (sprite, animation_name)
     {
            sprite.spritetype = 'atlas';
            var _ref = sprite.key;
            /*hitboxes Group*/
            var game = sprite.game;

            var _hitGroup = game.add.group();
            /*Mask for hitboxes Group : Display just the current frame viewport*/
            var _mask = game.add.graphics(0, 0);
            //  Shapes drawn to the Graphics object must be filled.
            _mask.beginFill(0xffffff);
            // _mask.alpha = 0.4;

            _hitGroup.x = sprite.x ;
            _hitGroup.y = sprite.y ;

            var _refHitboxes = _ref+'_@lsHitboxes';
            
            var _spriteHitboxes = game.cache.getJSON(_refHitboxes);
           
            var __spriteHitboxes = [];

            //Adding all properties item to a single array (check in hitboxes json file structure)
            for (var i = 0; i < _spriteHitboxes.sprites.length; i++) 
              {
                 _thisHitboxes = _spriteHitboxes.sprites[i].properties;

                 for (var j = 0; j < _thisHitboxes.length; j++)
                  {
                   
                    var _aHitbox = _thisHitboxes[j];

                    __spriteHitboxes.push(_aHitbox);

                  }

              }

            _spriteHitboxes = __spriteHitboxes;
           
            // console.log(_spriteHitboxes)
            //Draw mask
            
            this.setboxes(sprite, animation_name, _hitGroup, _mask, _spriteHitboxes)
 
 

     },

     sheetboxes : function (sprite, animation_name)
     {
            sprite.spritetype = 'sheet';
            var _ref = sprite.key;
            /*hitboxes Group*/
            var game = sprite.game;

            var _hitGroup = game.add.group();
            /*Mask for hitboxes Group : Display just the current frame viewport*/
            var _mask = game.add.graphics(0, 0);
            //  Shapes drawn to the Graphics object must be filled.
            _mask.beginFill(0xffffff);
            // _mask.alpha = 0.4;

            _hitGroup.x = sprite.x ;
            _hitGroup.y = sprite.y ;

            var _refHitboxes = _ref+'_@lsHitboxes';
            
            var _spriteHitboxes = game.cache.getJSON(_refHitboxes);
            
            var _spriteHitboxes2 = game.cache.getJSON(_refHitboxes);
           
            var __spriteHitboxes = [];
            var __spriteHitboxes2 = []; /*Caching real hitboxes coords for Intersections check*/

            //Adding all properties item to a single array
            //Updating each hitboxes x and y attribute : Set them absolute (not relative to their native frame)
            for (var i = 0; i < _spriteHitboxes.sprites.length; i++) 
              {
                  var _currentSprite = _spriteHitboxes.sprites[i];
                  var _cs_x = _currentSprite.x; var _cs_y = _currentSprite.y; //_cs : _currentSprite
                 
                  var _thisHitboxes = _currentSprite.properties;

                 for (var j = 0; j < _thisHitboxes.length; j++)
                  {
                   
                    var _aHitbox = _thisHitboxes[j];
                    
                    //Updating values (x & y)
                    _aHitbox.x = parseInt(_aHitbox.x,10) + _cs_x ;
                    _aHitbox.y = parseInt(_aHitbox.y,10) + _cs_y ;
                    //Store parent reference for real boundRectangles generation
                    _aHitbox.px = _cs_x ;
                    _aHitbox.py = _cs_y ;

                    __spriteHitboxes.push(_aHitbox);

                  }

              }

 

 
            _spriteHitboxes = __spriteHitboxes;


           
            // console.log(_spriteHitboxes)
            //Draw mask

            this.setboxes(sprite, animation_name, _hitGroup, _mask, _spriteHitboxes)



     },

     setboxes : function(sprite, animation_name, _hitGroup, _mask, _spriteHitboxes)
     {
            
            // _firstAnimationFrameIndex = sprite.animations._anims[animation_name]._frames[0];
            //Render hitboxes for the suitable current frame
            _currentFrameIndex = sprite.frame;
            // console.log(_currentFrameIndex)
            var _animationFramesData = sprite.animations._anims[animation_name]._frameData._frames;

            _firstAnimationFrame = _animationFramesData[_currentFrameIndex];
          

            var _x,_y,_w,_h;

            _x = _firstAnimationFrame.x; _y = _firstAnimationFrame.y;
            _w = _firstAnimationFrame.width; _h = _firstAnimationFrame.height;
            
            //Check sprite scaling : Then scale _hitGroup & mask consequently
             var _xScaling = sprite.scale.x;
             var _yScaling = sprite.scale.y;
             _hitGroup.scale.setTo(_xScaling, _yScaling);
             
             //Draw mask with this width and height instead of scaling after drawRect() : else mask position is corrupted 
             var _maskW = _w * _xScaling;
             var _maskH = _h * _yScaling;
 
            _hitGroup.x = sprite.x - _x;
            _hitGroup.y = sprite.y - _y;

            _mask.drawRect(sprite.x, sprite.y, _maskW, _maskH);


            // console.log(_spriteHitboxes.length)

            for (var j = 0; j < _spriteHitboxes.length; j++)
             {
                  /*Get hitbox specs*/
                   var boxId = _spriteHitboxes[j].id;
                   var boxX = parseInt(_spriteHitboxes[j].x,10);
                   var boxY = parseInt(_spriteHitboxes[j].y,10);
                   var boxW = parseInt(_spriteHitboxes[j].w,10);
                   var boxH = parseInt(_spriteHitboxes[j].h,10);

                   var boxPx = _spriteHitboxes[j].px;
                   var boxPy = _spriteHitboxes[j].py;

                   var boxType = _spriteHitboxes[j].type; 


                   /////////Render to group ///////////////////
 
                   var fill  = '' ;

                   if (boxType == 'hit') { fill = 0XF4B0A1;}
                   if (boxType == 'action') { fill = 0X2E64FE;}
                   if (boxType == 'both') { fill = 0X04B404;}

                   var box = _hitGroup.create(boxX, boxY, '@laliakey');
                   box.boxId = boxId;
                   box.width = boxW;
                   box.boxType = boxType;
                   box.height = boxH;
                   box.tint = fill;
                   box.px = boxPx;
                   box.py = boxPy;
                   //Hide hitbox
                   box.alpha = 0;
                   // box.visible = false;

                   ///////////////////////////////////////////

             }
                //_mask.alpha = 0.4;
                //Apply mask to the Group
                _hitGroup.mask = _mask;

                sprite._hitGroup = _hitGroup;

                sprite._mask = _mask;

                

     },

     updateBoxes : function(sprite, animation_name, _frameindex, hitType, hitters, action)
      {
            //frameindex get sometime undefined value at the first frame
            frameindex = _frameindex || sprite.animations._anims[animation_name]._frames[0];

            var _hitGroup = sprite._hitGroup;
            var _mask = sprite._mask;
 
 
            var _frames , _animationFrames;


            /*This follows Phaser Sprite|Animation Object structure (tree)*/
            _animationFrames = sprite.animations._anims[animation_name]._frames;
            _animationFramesData = sprite.animations._anims[animation_name]._frameData._frames;

            /*Getting sprite specs*/
            var _spriteX = sprite.x;
            var _spriteY = sprite.y;
            var _spriteW = sprite.width;
            var _spriteH = sprite.height;
            /////////////////////////////
          
           /******For each frame move its hitboxes to correct relative pos*******/
            
           var currentFrame = _animationFramesData[frameindex]; //cf
           
           var cf_x, cf_y, cf_w, cf_h ;
           cf_x = currentFrame.x; cf_y = currentFrame.y; 
           cf_width = currentFrame.width; cf_height = currentFrame.height;
          
           sprite_xsc = sprite.scale.x; sprite_ysc = sprite.scale.y;
           
           //Managing positionning and scaling with sprite_xsc|sprite_ysc
           _hitGroup.x = sprite.x - (cf_x * sprite_xsc);
           _hitGroup.y = sprite.y - (cf_y * sprite_ysc);

           //Show only hitboxes contained in the current frame viewport : 
           //By using mask with the cf properties
           
           //Managing positionning and scaling with sprite_xsc|sprite_ysc
           _mask.width =  (cf_width * sprite_xsc); 
           _mask.height = (cf_height * sprite_ysc); 


           //Call action when specified hiboxes are hitted by hitters

          _hitGroup.forEach(function(hitbox)
            {
                  

                if (hitbox.boxType === hitType)
                 {  
                    
                    hitters.forEach(function(hitter)
                     {
                          
                         //Check if sprite is loaded with atlas or spritesheet
                         if(sprite.spritetype === 'sheet') /*BoundRect are generated*/
                         {
                             //hitbox minus hitbox parent (frame to which it belongs relatively) plus sprite coords
                             var hitboxRelativeX = hitbox.x - hitbox.px + sprite.x;
                             var hitboxRelativeY = hitbox.y - hitbox.py + sprite.y;
                             
                             var hitboxRealBR = new Phaser.Rectangle(hitboxRelativeX, hitboxRelativeY, hitbox._width, hitbox._height); ;//BR :boundRectangle
                              
                             if (Lalia.checkOverlap(hitboxRealBR , hitter))
                               {   
                                  // console.log("touché : "+ hitbox.boxId);
                                   action();
                                   /*Return hitted object | hitbox*/
                                   return hitter;
                                   //return hitbox

                               }
                         } //spritetype = 'atlas'
                         else
                         {
                            if (Lalia.checkOverlap(hitbox , hitter))
                             {   
                                // console.log("touché : "+ hitbox.boxId);
                                 action();
                                 /*Return hitted object | hitbox*/
                                 return hitter;
                                 //return hitbox

                             }
                         }
                        


                    });
                    
                 }

            });      
 

           // //////////////////////////////////////////////////////
            

     }




   }


//Create  playaction method on AnimationManager to manage callback at a specific collide event triggered by lalia-hitboxes

Phaser.AnimationManager.prototype.playaction = function(name,hitType, hitters, action, frameRate, loop, killOnComplete)
{

        if (this._anims[name])
        {


            if (this.currentAnim === this._anims[name])
            {
                if (this.currentAnim.isPlaying === false)
                {
                    this.currentAnim.paused = false;
                    return this.currentAnim.playaction(hitType, hitters, action,frameRate, loop, killOnComplete);
                }

                return this.currentAnim;
            }
            else
            {
                if (this.currentAnim && this.currentAnim.isPlaying)
                {
                    this.currentAnim.stop();
                }

                this.currentAnim = this._anims[name];
                this.currentAnim.paused = false;
                this.currentFrame = this.currentAnim.currentFrame;
                return this.currentAnim.playaction(hitType, hitters, action, frameRate, loop, killOnComplete);
            }
        }

    }

//RENAME  Animation.play into playaction for hitboxes
Phaser.Animation.prototype.playaction = function(hitType, hitters, action, frameRate, loop, killOnComplete) {

        //Setting parameters for lalia-hitboxes event
        /*Then they can be reached easily */
        this.hitType = hitType;
        this.hitters = hitters
        this.action  = action;
        // console.log(this);

        if (typeof frameRate === 'number')
        {
            //  If they set a new frame rate then use it, otherwise use the one set on creation
            this.delay = 1000 / frameRate;
        }

        if (typeof loop === 'boolean')
        {
            //  If they set a new loop value then use it, otherwise use the one set on creation
            this.loop = loop;
        }

        if (typeof killOnComplete !== 'undefined')
        {
            //  Remove the parent sprite once the animation has finished?
            this.killOnComplete = killOnComplete;
        }

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;
        this.loopCount = 0;

        this._timeLastFrame = this.game.time.time;
        this._timeNextFrame = this.game.time.time + this.delay;

        this._frameIndex = this.isReversed ? this._frames.length - 1 : 0;
        this.updateCurrentFrame(false, true);

        this._parent.events.onAnimationStart$dispatch(this._parent, this);

        this.onStart.dispatch(this._parent, this);

        this._parent.animations.currentAnim = this;
        this._parent.animations.currentFrame = this.currentFrame;

        return this;

    }
  
  // OVERRIDE : Phaser.Animation updateCurrentFrame method to match hitboxes displaying with frames animation
  Phaser.Animation.prototype.updateCurrentFrame = function (signalUpdate, fromPlay) {

        if (fromPlay === undefined) { fromPlay = false; }

        if (!this._frameData)
        {
            // The animation is already destroyed, probably from a callback
            return false;
        }

        //  Previous index
        var idx = this.currentFrame.index;


        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

        if (this.currentFrame && (fromPlay || (!fromPlay && idx !== this.currentFrame.index)))
        {

            ///////HITBOXES UPDATE////////////
            var sprite = this._parent;
            var animation_name = this.name;
            // console.log(this.currentFrame.index);
            Lalia.updateBoxes(sprite, animation_name, this.currentFrame.index, this.hitType, this.hitters, this.action);

            ///////HITBOXES UPDATE////////////

            this._parent.setFrame(this.currentFrame);
 
 
        }

        if (this.onUpdate && signalUpdate)
        {


            this.onUpdate.dispatch(this, this.currentFrame);

            // False if the animation was destroyed from within a callback
            return !!this._frameData;
        }
        else
        {
            return true;
        }

    }


