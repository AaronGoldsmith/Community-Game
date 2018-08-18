var stats1 = 0.2;
var stats2 = 0.4;
var p;

var canvas
var startingPt;
function setup() {
  canvas = createCanvas(100, 30);
  canvas.parent('sketch-box');
	startingPt = createVector(width/2,height/2);
  // p = createP(stats1);
  

}

function draw() {
  background(220);
	if(mouseX<5){mouseX=5;}
	stats1 = map(mouseX,0,width,0,1);
	stats2 = 1-stats1;

	var width1 = stats1*width;
	var width2 = stats2*width;
	
	fill(0);
	  

	rect(15,height/2,width*stats1,40);
	fill("red");
	rect(width*stats1,height/2,width*stats2-15,40);

	
}

function mousePressed(){
  if(mouseX>=15&&mouseX<width-15){
    if(mouseY>=startingPt.y&&mouseY<height/2+40){
      console.log(mouseX,mouseY);

    }

  }
}