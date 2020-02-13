
	function verde (){
		$(".main-titulo").animate({color:"green"}, "slow", function(){ amarillo() } )
	}
	function amarillo (){
		$(".main-titulo").animate({color:"yellow"}, "slow", function(){ verde() })
	}

	verde();

  $(".btn-reinicio").click(function(){
    i=0;
    score=0;
    mov=0;
    $(".panel-score").css("width","25%");
    $("#score-text").html("0");
    $("#movimientos-text").html("0");
    $(this).html("REINICIAR");
    $('#timer').timer({
		countdown: true,
		duration: '2m',
		format: '%M:%S',
		callback: function() {
        alert('Time up!');
        $('#timer').timer('reset');
    	}
	});
  });
  
  var rows=7; 
  var cols = 7; 
  var grid = []; 
  var validFigures=0;
  var score = 0;
  var moves = 0;


  function candy(r,c,obj,src) {
    return {
    r: r, 
    c: c, 
    src:src, 
    locked:false, 
    isInCombo:false, 
    o:obj 
    }
  }

  var candyType=[];
  candyType[0]="image/1.png";
  candyType[1]="image/2.png";
  candyType[2]="image/3.png";
  candyType[3]="image/4.png";  
            
  function pickRandomCandy() {
    var pickInt = Math.floor((Math.random()*4));
    return candyType[pickInt];
  }

  for (var r = 0; r < rows; r++) {
   grid[r]=[];
   for (var c =0; c< cols; c++) {
      grid[r][c]= new candy(r,c,null,pickRandomCandy());
   }
  }
    
  // Coordenadas iniciales:
  var width = $('.panel-tablero').width();
  var height = $('.panel-tablero').height(); 
  var cellWidth = width / 7;
  var cellHeight = height / 7;
  var marginWidth = cellWidth/7;
  var marginHeight = cellHeight/7;

  for (var r = 0; r < rows; r++) {
    for (var c =0; c< cols; c++) {
      var cell = $("<img class='candy' id='candy_"+r+"_"+c+"' r='"+r+"' c='"+c+
        "'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+
        grid[r][c].src+"' style='height:"+cellHeight+"px'/>");
      cell.attr("ondragstart","_ondragstart(event)");
      $(".col-"+(c+1)).append(cell);
      grid[r][c].o = cell;
    }
  }

reponer();
reponer();

score= 0 ;
moves= 0 ;
 $("#score-text").html("0");
  $("#movimientos-text").html("0");


  function _ondragstart(a)
  {
    a.dataTransfer.setData("text/plain", a.target.id);
   }
   
   function _onDragOverEnabled(e)
   {
     e.preventDefault();
     console.log("pasando sobre caramelo " + e.target.id);
    }
           
    function _onDrop(e)
    {
      //var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      //if (isFirefox) {
       // console.log("firefox compatibility");
      //  e.preventDefault();
      //}
 
     var src = e.dataTransfer.getData("text");
     var sr = src.split("_")[1];
     var sc = src.split("_")[2];

     var dst = e.target.id;
     var dr = dst.split("_")[1];
     var dc = dst.split("_")[2];

     var ddx = Math.abs(parseInt(sr)-parseInt(dr));
     var ddy = Math.abs(parseInt(sc)-parseInt(dc));
     if (ddx > 1 || ddy > 1)
     {
     //  alert("Los movimientos no pueden tener una distancia mayor a 1");
      // return;
     }
     else{
        console.log("intercambio " + sr + "," + sc+ " to " + dr + "," + dc);
      
        var tmp = grid[sr][sc].src;
        grid[sr][sc].src = grid[dr][dc].src;
        grid[sr][sc].o.attr("src",grid[sr][sc].src);
        grid[dr][dc].src = tmp;
        grid[dr][dc].o.attr("src",grid[dr][dc].src);

        
        moves+=1;
        $("#movimientos-text").html(moves);

        destruirCombos(); 
        
     }
    
    
}
      function destruirCombos()
      {    
        for (var r = 0; r < rows; r++)
        {          
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var c=0; c< cols; c++)
          {
          
               
            if (grid[r][c].locked || grid[r][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            
            if (prevCell==null) 
            {
              prevCell = grid[r][c].src;
              figureStart = c;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
             
              var curCell = grid[r][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = grid[r][c].src;
                figureStart = c;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
               
                figureLen+=1;
                if (figureLen==3)
                {
                  validFigures+=1;
                  score+=10;
                  $("#score-text").html(score);
                  figureStop = c;
                  console.log("Combo de columna " + figureStart + " a columna " + figureStop);
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    grid[r][ci].isInCombo=true;
                    grid[r][ci].src=null;                     
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
          
        for (var c=0; c< cols; c++)
        {              
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var r = 0; r < rows; r++)
          {
            
            if (grid[r][c].locked || grid[r][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            if (prevCell==null) 
            {
              prevCell = grid[r][c].src;
              figureStart = r;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
              var curCell = grid[r][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = grid[r][c].src;
                figureStart = r;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
                figureLen+=1;
                if (figureLen==3)
                {
                  validFigures+=1;
                  score+=10;
                  $("#score-text").html(score);
                  figureStop = r;
                  console.log("Combo de fila " + figureStart + " a fila " + figureStop );
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    grid[ci][c].isInCombo=true;
                    grid[ci][c].src=null;         
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
              
         var isCombo=false;
         for (var r = 0;r<rows;r++)
          for (var c=0;c<cols;c++)
            if (grid[r][c].isInCombo)
            { 
              console.log("Combo disponible");
              isCombo=true; 
              
               reponer() 
            }
            
        if (isCombo)  
          desaparecerCombos();
        else 
        console.log("No más combos automáticos");
        
                          
        
      }
    
      
      function desaparecerCombos()
      {
         for (var r=0;r<rows;r++)  { 
          for (var c=0;c<cols;c++){
            if (grid[r][c].isInCombo)
            {
              grid[r][c].o.animate({
                opacity:0
              },slow);
            } 
          }   
        } 

         
      
      }
      
   
      
      function reponer() {
         
         for (var r=0;r<rows;r++)
         {           
          for (var c=0;c<cols;c++)
          {  
            if (grid[r][c].isInCombo)  
            {
              grid[r][c].o.attr("src","");
                             
              grid[r][c].isInCombo=false;
               
              for (var sr=r;sr>=0;sr--)
              {
                if (sr==0) break; 
                if (grid[sr-1][c].locked) break;       
                var tmp = grid[sr][c].src;
                grid[sr][c].src=grid[sr-1][c].src;
                grid[sr-1][c].src=tmp;
              }
            } 
          }  
        }   
                          
          for (var r=0;r<rows;r++)
          { for (var c = 0;c<cols;c++)
            {
              grid[r][c].o.attr("src",grid[r][c].src);
              grid[r][c].o.css("opacity","1"); 
              grid[r][c].isInCombo=false;
              if (grid[r][c].src==null) 
                grid[r][c].respawn=true;
              if (grid[r][c].respawn==true)
              {  
                grid[r][c].o.off("ondragover");
                grid[r][c].o.off("ondrop");
                grid[r][c].o.off("ondragstart"); 
                grid[r][c].respawn=false;
                console.log("Reponiendo fila " + r+ " , columna " + c);
                grid[r][c].src=pickRandomCandy();
                grid[r][c].locked=false;
                grid[r][c].o.attr("src",grid[r][c].src);
                grid[r][c].o.attr("ondragstart","_ondragstart(event)");
                grid[r][c].o.attr("ondrop","_onDrop(event)");
                grid[r][c].o.attr("ondragover","_onDragOverEnabled(event)");
              }
            }
          }
              
           
              
          console.log("celdas repuestas");
          
        
          destruirCombos();
         
      } 
       
             


