var stats1 = 0.2;
var stats2 = 0.4;

var margin = 15;
var p;

var canvas
var startingPt;
function setup() {
  canvas = createCanvas(windowWidth/4, 40);
  canvas.parent('sketch-box');
	startingPt = createVector(width/2,height/2);
  // p = createP(stats1);
  

}

function draw() {
  background(255);
	if(mouseX>5&&mouseX<width-margin){
		stats1 = map(mouseX,5,width,0,1);
		stats2 = 1-stats1;
	}
	else if(mouseX > width-margin){
		mouseX =width-margin
	}

	var width1 = margin+stats1*width;
	var width2 = margin+stats2*width;
	
	fill(0);
	  

	rect(margin,10,width1,20);
	fill("red");
	rect(width1,10,width2-margin,20);

	
}

function mousePressed(){
  if(mouseX>=margin&&mouseX<width-margin){
    if(mouseY>=startingPt.y&&mouseY<height/2+20){
      console.log(mouseX,mouseY);

    }

  }
}