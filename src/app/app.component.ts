import {  Component,  ElementRef,  OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
 export class AppComponent implements OnInit {

  title = 'app';
  canvas: any;
  ctx: any;
  BB: any;
  offsetX: number;
  offsetY: number;
  WIDTH: number;
  HEIGHT: number;
  dragok: boolean;
  startX;
  startY;
  rects: any[] = [{
      'x': 250,
      'y': 200,
      'radius': 15,
      'fill': '#50E3C2',
      'isDragging': false
    },
    {
      'x': 450,
      'y': 200,
      'radius': 10,
      'fill': '#F57F16',
      'isDragging': false
    },
    {
      'x': 744,
      'y': 200,
      'radius': 13,
      'fill': '#F8E71C',
      'isDragging': false
    }
  ];
  constructor(private eleRef: ElementRef) {
 
  }
  ngOnInit() {
    
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.BB = this.canvas.getBoundingClientRect();
    this.offsetX = this.BB.left;
    this.offsetY = this.BB.top;
    this.WIDTH = this.canvas.width;
    this.HEIGHT = this.canvas.height;
    this.draw();
    this.drawLine();
    this.drawGrid();
  }

  drawGrid() {
    for (let y = 1; y < this.WIDTH; y += 25) {
      this.ctx.moveTo(y, 0);
      this.ctx.lineTo(y, this.HEIGHT);
    }
    for (let x = 1; x < this.HEIGHT; x += 25) {
      this.ctx.moveTo(0, x);
      this.ctx.lineTo(this.WIDTH, x);
    }
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = "#bbb";
    this.ctx.stroke();
  }

  drawLine() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.HEIGHT);
    this.ctx.lineTo(this.rects[0].x, this.rects[0].y);
    this.ctx.strokeStyle = this.rects[0].fill;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    for (var i = 0; i < this.rects.length; i++) {
      var r = this.rects[i];
      var r2 = this.rects[i + 1];
      if (r2) {
        this.ctx.beginPath();
        this.ctx.moveTo(r.x, r.y);
        this.ctx.lineTo(r2.x, r2.y);
        this.ctx.strokeStyle = r2.fill;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

    }
  }

  rect(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.closePath();
    this.ctx.fill();
}

// clear the canvas
 clear() {
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
}

// Draw the circles
draw() {
  this.clear();
  for (var i = 0; i < this.rects.length; i++) {
      var r = this.rects[i];
      this.ctx.fillStyle = r.fill;
      this.ctx.beginPath();
      this.ctx.arc(r.x,r.y,r.radius,0,2*Math.PI);
      this.ctx.fill();
  }
  this.drawLine();
}

// On Mouse Down Event
myDown(e) {
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();
  
      // get the current mouse position
      var mx = e.clientX - this.offsetX;
      var my = e.clientY - this.offsetY;
  
      // test each rect to see if mouse is inside
      this.dragok = false;
      for (var i = 0; i < this.rects.length; i++) {
          var r = this.rects[i];
          if (this.pointInCircle(mx,my,r.x,r.y,r.radius)) {
              this.dragok = true;
              r.isDragging = true;
          }
      }
      // save the current mouse position
      this.startX = mx;
      this.startY = my;
  }

  pointInCircle(x, y, cx, cy, radius) {
    let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
  }

  // Handling Mouse up Event
  myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    this.dragok = false;
    for (var i = 0; i < this.rects.length; i++) {
        
        this.rects[i].isDragging = false;
    }
}

// Handaling Mouse move event
myMove(e) {
  // if we're dragging anything...
  
  if (this.dragok) {
      
      // tell the browser we're handling this mouse event
      e.preventDefault();
      e.stopPropagation();

      // get the current mouse position
      var mx = e.clientX - this.offsetX;
      var my = e.clientY - this.offsetY;
      
      // calculate the distance the mouse has moved
      // since the last mousemove
      var dx = mx - this.startX;
      var dy = my - this.startY;
      
      // move each rect that isDragging 
      // by the distance the mouse has moved
      // since the last mousemove
      for (var i = 0; i < this.rects.length; i++) {
          
          var r = this.rects[i];
          if (r.isDragging) {
              r.x += dx;
              r.y += dy;
          }
      }

      // redraw the scene with the new rect positions
      this.draw();
      this.drawGrid();
      // reset the starting mouse position for the next mousemove
      this.startX = mx;
      this.startY = my;

  }
}

drawOnChange(dir,ele,val) {
  this.rects[ele][dir] = parseInt(val);
  this.draw();
  this.drawGrid();
}

}

