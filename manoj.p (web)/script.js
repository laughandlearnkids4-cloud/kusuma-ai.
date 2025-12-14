   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

const micBtn = document.getElementById('micBtn');
const statusEl = document.getElementById('status');
const responseEl = document.getElementById('response');
const historyEl = document.getElementById('history');
const ratingEl = document.getElementById('rating');

let exitConfirm = false;

micBtn.onclick = () => {
  recognition.start();
  micBtn.classList.add('listening');
  statusEl.textContent = 'Listening…';
};

recognition.onresult = e => {
  const cmd = e.results[0][0].transcript.toLowerCase();
  micBtn.classList.remove('listening');
  handleCommand(cmd);
};

function speak(text){
  responseEl.textContent = text;
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
}

function addHistory(c,r){
  const d=document.createElement('div');
  d.textContent = c + ' → ' + r;
  historyEl.appendChild(d);
}

function degToRad(d){ return d*Math.PI/180; }

function handleCommand(cmd){
  let res = '';

  if(cmd.includes('your name')) res = 'My name is Kusuma AI.';
  else if(cmd.includes('created') || cmd.includes('invented'))
    res = 'I was created by Mr. Manoj.';

  else if(cmd.includes('exit')){
    if(!exitConfirm){
      res = 'Do you want to exit? Please confirm.';
      exitConfirm = true;
    }else{
      res = 'Thank you for using Kusuma AI.';
    }
  }

  else if(cmd.includes('percent')){
    const n = cmd.match(/(\d+)/g);
    if(n && n.length>=2)
      res = `${n[0]} percent of ${n[1]} is ${(n[0]/100)*n[1]}`;
  }

  else if(cmd.includes('square root')){
    const n = cmd.match(/(\d+)/);
    if(n) res = `The square root of ${n[0]} is ${Math.sqrt(n[0])}`;
  }

  else if(cmd.includes('square')){
    const n = cmd.match(/(\d+)/);
    if(n) res = `The square of ${n[0]} is ${n[0]*n[0]}`;
  }

  else if(cmd.includes('sin')){
    const n = cmd.match(/(\d+)/);
    if(n) res = `The value of sine ${n[0]} degrees is ${Math.sin(degToRad(n[0])).toFixed(2)}`;
  }

  else if(cmd.includes('cos')){
    const n = cmd.match(/(\d+)/);
    if(n) res = `The value of cosine ${n[0]} degrees is ${Math.cos(degToRad(n[0])).toFixed(2)}`;
  }

  else if(cmd.includes('tan')){
    const n = cmd.match(/(\d+)/);
    if(n) res = `The value of tangent ${n[0]} degrees is ${Math.tan(degToRad(n[0])).toFixed(2)}`;
  }

  else if(cmd.includes('cone volume')){
    const n = cmd.match(/(\d+)/g);
    if(n && n.length>=2)
      res = `The volume of the cone is ${(1/3*Math.PI*n[0]*n[0]*n[1]).toFixed(2)} cubic units`;
  }

  else res = 'Please say a valid mathematical command.';

  speak(res);
  addHistory(cmd,res);
  ratingEl.style.display='block';
}

// rating
document.querySelectorAll('.rating span').forEach((s,i)=>{
  s.onclick=()=>{
    document.querySelectorAll('.rating span').forEach((x,j)=>{
      x.classList.toggle('active',j<=i);
    });
    speak('Thank you for your feedback.');
  };
});