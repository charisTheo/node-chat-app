var jetBubbles = document.getElementsByClassName('jetBubble');
var jet = document.getElementById('submit');
var shakeGroup = document.querySelector('.shakeGroup');
var mainTimeline = new TimelineMax({repeat:-1}).seek(100);
var mainSpeedLinesTimeline = new TimelineMax({repeat:-1, paused:false});

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
  //jet bubbles
  for(var i = 0; i < jetBubbles.length; i++){    
    var jb = jetBubbles[i];    
    var tl = new TimelineMax({repeat:-1,repeatDelay:Math.random()}).timeScale(4);
    tl.to(jb, Math.random() + 1 , {
      attr:{
        r:'+=15'
      },
      ease:Linear.easeNone
    })
    .to(jb, Math.random() + 1 , {
      attr:{
        r:'-=15'
      },
      ease:Linear.easeNone
    })
    
    mainTimeline.add(tl, i/4)
  }  
}

TweenMax.globalTimeScale(0.50);