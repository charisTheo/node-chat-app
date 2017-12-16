let jetBubbles = document.getElementsByClassName('jetBubble');
let jet = document.getElementById('submit');
let shakeGroup = document.querySelector('.shakeGroup');
let mainTimeline = new TimelineMax({repeat:-1}).seek(100);
let mainSpeedLinesTimeline = new TimelineMax({repeat:-1, paused:false});
let radii = [];
let flag = false;
mainTimeline.timeScale(2);

function createJets(){
  TweenMax.to(jet, 0.05, {
      x:'+=4',
      repeat:9, 
      yoyo:true
  });  
  TweenMax.set(jetBubbles, {
    attr:{
      r:'-=5'
    }
  });

  for(var i = 0; i < jetBubbles.length; i++){    
 //configure initial radius of each circle
    if (flag) {
      jetBubbles[i].setAttribute("r", radii[i]);
      console.log("Set: ", radii[i]);
    } else {
      radii[i] = jetBubbles[i].getAttribute("r");
      console.log("Get: ", radii[i]);
    }
  }

  //jet bubbles
  for(var i = 0; i < jetBubbles.length; i++){    
    var jb = jetBubbles[i];    
    var tl = new TimelineMax({repeat:4,repeatDelay:Math.random()}).timeScale(4);
    
    tl.to(jb, Math.random() + 1, {
      attr:{
        r:'+=10'
      },
      ease:Linear.easeNone
    })
    .to(jb, Math.random() + 1 , {
      attr:{
        r:'-=10'
      },
      ease:Linear.easeNone
    });
    
    flag = true;  
    mainTimeline.add(tl, i/4);
  }  
}

TweenMax.globalTimeScale(0.50);