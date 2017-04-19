   File.prototype.convertToBase64 = function(callback){
            var reader = new FileReader();
            reader.onload = function(e) {
                 callback(e.target.result)
            };
            reader.onerror = function(e) {
                 callback(null, e);
            };        
            reader.readAsDataURL(this);
    };

   

       var file = document.getElementById('file');
       var el = document.getElementById('el');
       var addbox = document.getElementById('box');
     
   
       var indexer = -1;
       var ul = document.getElementsByTagName('ul')[0];
       var wT = 0;
       var hT = 0;
       var _URL = window.URL || window.webkitURL;

        file.addEventListener("change" , function(e) {
            
            var image, file;

            if ((file = this.files[0])) {
               
                image = new Image();
                
                image.onload = function() {
                    
                    wT = this.width;
                    hT = this.height;
                    
                };
            
                image.src = _URL.createObjectURL(file);


            }

        });

      var spriteCont = document.getElementById('my-node');
      
       add.addEventListener('click', function()
        { 
          indexer++;
          var li = document.createElement('li');
          li.setAttribute('id' ,  indexer);
  
          ul.appendChild(li);
           
            var selectedFile = file.files[0];
             
                if (selectedFile) 
                {
                 selectedFile.convertToBase64(function(imgurl){
                 
                  if (imgurl != "") 
                   {
                       
                    ///////////////SETTING SIZE ////////////////////
                       
                      var actualWidth = spriteCont.offsetWidth;
                      var newWidth = actualWidth + wT ;
                      
                      spriteCont.style.width = newWidth+"px";

                    ///////////////////////////////////////////////

                       var draw = SVG(indexer.toString()).size(wT, hT).fill('#f06');
                       var img = draw.image(imgurl ,'100%', '100%') ;
 
                      file.value = "";

                    }
                    else
                    {
                      console.log("NO FILE SELECTED");
                    }


              });
             }

        
        });


      addbox.addEventListener('click' , function()
         {

             for (var i = 0; i < svgs.length; i++)
              {
                var editable = svgs[i].getAttribute('editable');
                var id = svgs[i].getAttribute('id');
                 if (editable == "true") 
                  {
                       var elem = SVG.get(id);

                       var  rect = elem.rect(20, 20)
                       .x(5)
                       .y(5)
                       .opacity(0.4)
                       .fill('#2E64FE') 
                       .draggable() 
                       .attr('type' , 'action');
                   
                  }
              }




           var firstSVG = SVG.get('SvgjsSvg1001');
           firstSVG.hide();
           


         });




    form.width.addEventListener('input', function()
        { 
          var rectP = document.getElementById(form.id.value);
          rectP.setAttribute('width' , form.width.value);
       });

    form.height.addEventListener('input', function()
        { 
          var rectP = document.getElementById(form.id.value);
          rectP.setAttribute('height' , form.height.value);
       });
    form.type.addEventListener('input', function()
        { 
          var rectP = document.getElementById(form.id.value);
          rectP.setAttribute('type' , form.type.value);
          //change color 
         var type = form.type.value;

          if (type == 'hit')
           { rectP.setAttribute('fill' , '#DF0101');}
          if (type == 'action')
           { rectP.setAttribute('fill' , '#2E64FE');}
          if (type == 'both')
           { rectP.setAttribute('fill' , '#04B404');}

       });
    
  /////////////parse all svg and take each of it's rect/////////


     var svgs = document.getElementsByTagName('svg');


     window.addEventListener('mousemove' , function(){


     var svgs = document.getElementsByTagName('svg');
   
     for (var i = 0; i < svgs.length-1; i++) 
       {
         // console.log(svgs[i]);
         var rects = svgs[i].getElementsByTagName('rect');

         for (var j = 0; j < rects.length; j++)
          {
            
             rects[j].addEventListener('mousedown' , function()
               {
 
                    // console.log(this.getAttribute('width'));
                    initialFill = this.getAttribute('fill');

                    form.y.value = this.getAttribute('y');
                    this.setAttribute('fill' , '#008a52');
                    form.id.value = this.getAttribute('id');
                    form.x.value = this.getAttribute('x');
                    form.width.value = this.getAttribute('width');
                    form.height.value = this.getAttribute('height');  
                    form.type.value = this.getAttribute('type'); 
 
               });

              rects[j].addEventListener('mouseup' , function()
               {  
                var type = this.getAttribute('type');
                  if (type == 'hit')
                   { this.setAttribute('fill' , '#DF0101');}
                  if (type == 'action')
                   { this.setAttribute('fill' , '#2E64FE');}
                  if (type == 'both')
                   { this.setAttribute('fill' , '#04B404');}
                 

               });


          }
       }


    /////////////////  setting editable svg //////
      for (var i = 0; i < svgs.length-1; i++) 
       {
          
            svgs[i].addEventListener('click' , function(el)
              {
                
                 // window.event.stopPropagation();

                 //       var id = svgs[i].getAttribute('id');

                 //       var currentSvg = SVG.get(id);  

                 //        form.idsprite.value = id;
                 //        form.xsprite.value = currentSvg.x();
                 //        form.ysprite.value = currentSvg.y();
                 //        form.widthsprite.value = currentSvg.width();
                 //        form.heightsprite.value = currentSvg.height();

                      for (var j = 0; j < svgs.length-1; j++) 
                       {
                            svgs[j].setAttribute('editable' , 'false');
                            svgs[j].parentNode.style.outline = "none" ;
                            svgs[j].parentNode.style.opacity = 1 ;



                        }

                      this.setAttribute('editable' , 'true');
                      this.parentNode.style.opacity = 0.7 ;
                      this.parentNode.style.outline = "solid 0.5px red" ;


              }


              );
 
       }



});

/////////////////////////////////////////////////////////////
       function getBase64Image(img) {
          // Create an empty canvas element
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          // Copy the image contents to the canvas
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

           
          var dataURL = canvas.toDataURL("image/png");

          return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      }

 
 
    var result;
    function Xhr(url, dataString, handler)  
    {  
    
    // Now debogable !!!!

    var xhr;    
        xhr = new XMLHttpRequest();  
     

         var data = dataString;  
         xhr.open("POST", url, true);     
         xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
         xhr.send(data);  
         xhr.onreadystatechange = display_data;  
        
         function display_data() {  
           if (xhr.readyState == 4) {  
            if (xhr.status == 200) {  
             result = JSON.parse( xhr.responseText );
             // result =   xhr.responseText;
               
              handler(result);
   

            } 
          else{}  
         }  
        }  

    }



/////////////////////////////////////////////////////////////

var generate = document.getElementById('gen');
var json = {};
var sprites = [];

var refX = 0 ;

generate.addEventListener('click' , function()
   {


        ////////////////////////////////////////
        /////////// GETTING IMAGE /////////////
        var node = document.getElementById('my-node');
     

  


      for (var i = 0; i < svgs.length-1; i++) 
       {
         // console.log(svgs[i]);
         // svgs[i].setAttribute('fill' , 'transparent');
         //Set to none eventual outline

         svgs[i].parentNode.style.outline = "none" ;
         svgs[i].parentNode.style.opacity = 1 ;


         var properties = [];

         var rects = svgs[i].getElementsByTagName('rect');

         for (var j = 0; j < rects.length; j++)
            {
               
               var id = rects[j].getAttribute('id');
               id = id.replace("SvgjsRect" , "box");
               var x = rects[j].getAttribute('x');
               var y = rects[j].getAttribute('y');
               var w = rects[j].getAttribute('width');
               var h = rects[j].getAttribute('height');
               var type = rects[j].getAttribute('type');

               var hit = 
                {"id": id, "x": x, "y": y, "w": w, "h": h , "type": type };

               properties.push(hit);
 
            }

           var imgSprite = svgs[i].getElementsByTagName('image')[0];

               var id = svgs[i].getAttribute('id');
               id = id.replace("SvgjsSvg" , "s");
               var w = svgs[i].getAttribute('width');
               var h = svgs[i].getAttribute('height'); 

                var x = refX;
                refX+= parseInt(w,10);
                
         
          var sprite = 
                {"id": id, "x": x, "y": 0, "w": w, "h": h };
           
          sprite.properties = properties ;

          sprites.push(sprite);


       }
        
        json.sprites = sprites;

        var title = document.getElementById('title').value;
        if (title == "") {title = "jsondata" ;}
        

        domtoimage.toPng(node)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                // console.log(dataUrl);
                dataUrl = encodeURIComponent(dataUrl);
                var dataString =
                "title="+title+"&data="+JSON.stringify(json)+"&img="+dataUrl;
                
                   Xhr("maker.php" , dataString, function(res)
                       {
                           
                       });


                var output = document.getElementById('output');
                document.body.appendChild(img);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
      

     

        // console.log(JSON.stringify(json));
//////////////////////////////////////////////////////////////
//////////////////// HIDING HITBOXES /////////////////////////


        var rects = document.getElementsByTagName('rect');

        
        for (var i = 0; i < rects.length; i++) {
          rects[i].setAttribute('visibility' , 'hidden');
        }




   });
