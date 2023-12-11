const t=()=>{const t=document.querySelector(".alert");t&&t.parentElement.removeChild(t)},e=(e,n)=>{t();const a=`<div class="alert alert--${e}">${n}</div>`;document.querySelector("body").insertAdjacentHTML("afterbegin",a),window.setTimeout(t,3e3)},n=t=>{const e={"á":"a","é":"e","í":"i","ó":"o","ú":"u","à":"a","è":"e","ì":"i","ò":"o","ù":"u","â":"a","ê":"e","î":"i","ô":"o","û":"u","ã":"a","õ":"o","ñ":"n","ç":"c"};return(t=t.toLowerCase()).replace(/[áéíóúàèìòùâêîôûãõñç]/gi,(function(t){return e[t]})).replace(/['"!@#$%¨&*\[\]\(\)_\-`´\{\}^~<,>.:;?/\+\-\=]/g,"")},a=t=>n(t).replace(/ /g,""),s=(t,e,...n)=>{let a=document.createElement(t);for(let t of Object.keys(e))a.setAttribute(t,e[t]);for(let t of n)a.appendChild(t);return a};function o(t){return t.toString().padStart(2,"0")}const d=()=>{document.getElementById("dictionarynotification").setAttribute("style","visibility: hidden")},r=()=>{document.getElementById("dictionarynotification").setAttribute("style","visibility: visible")},l=async t=>{const n=t.target.parentNode.firstChild.innerText;"success"===(await axios.post("/api/v1/tickets",{target:n})).data.status?e("success","This word has been added to your queue"):e("error","This word is already in your queue")},c=[],u=[];for(i=0;i<20;++i)c.push(document.getElementById(`rc${i}`));for(i=0;i<4;++i)u.push(document.getElementById(`te${i}`));let m,p,g,y,h,f,v,I,x,E,$,w,B,b=document.getElementById("attempt"),M=document.getElementById("due"),T=document.getElementById("steps"),P=document.getElementById("timeplaying"),C=0,L=10;P&&($=1*P.innerHTML),document.getElementById("solutions")&&(w=JSON.parse(document.getElementById("solutions").innerHTML)),document.getElementById("tries")&&(B=document.getElementById("tries").innerText),b&&(b.style.borderRadius="15px",h={left:0,top:0},f=2,v=b.clientWidth,I=b.clientHeight,x=1*b.style.borderRadius.slice(0,-2),E=2*I+2*v-8*x+2*Math.PI*x);let k,S,O=document.getElementById("border");const D=(t=10)=>{clearTimeout(p),A(),N(2,t-2),p=setTimeout(q,1e3*t)},A=()=>{for(let t=1;t<=E;++t)document.getElementById(`point${t}`).style.visibility="visible"},N=(t=2,e=8)=>{clearInterval(g);let n=1,a=1;const i=1e3*e/E;g=setInterval((function(){n>1e3*t/i&&a<=E&&(document.getElementById(`point${a}`).style.visibility="hidden",a+=1),n+=1,C+=i}),i)},q=()=>{B>1?(j(),B-=1,H(),D(L),clearInterval(y),y=setInterval(R,100)):(j(),A(),clearInterval(g),clearTimeout(p),G(!1),clearInterval(y),b.value="")},H=()=>{m=2==B?"hsl(32, 92%, 65%)":1==B?"hsl(0, 84%, 71%)":"hsl(0, 0%, 100%)",document.getElementById("attempt").setAttribute("style",`color: ${m}`),(()=>{for(let t=1;t<=E;++t)document.getElementById(`point${t}`).style.backgroundColor=m})()};function _(t){if(J.src.match("/img/soundOn.png")){const e=new SpeechSynthesisUtterance(t);e.lang="pt-BR",speechSynthesis.speak(e)}}const G=async t=>{try{const e=await axios.post("/api/v1/gameData/submitAttempt",{correct:t,time:C});C=0,"success"===e.data.status&&(F(e.data),w=e.data.data.attempt.solutions,B=e.data.data.tries,H(),_(e.data.data.attempt.target))}catch(t){console.log(t)}};function j(){let t=Math.PI/2;requestAnimationFrame((function e(n,a){null!=a&&(t+=.1*(n-a)),b.style.top=5*Math.sin(t)+"px",b.style.left=5*Math.cos(t)+"px",t<10*Math.PI&&requestAnimationFrame((t=>e(t,n)))}))}const F=t=>{for(i=0;i<20;++i)c[i].innerText=t.data.raceTrack[i];for(i=0;i<4;++i)u[i].innerText=t.data.tail[i]||"";M.innerText=t.data.stats.due,T.innerText=t.data.stats.steps,P.innerText=`${Math.floor(t.data.stats.time/6e4)}:${(Math.floor(t.data.stats.time/1e3)-60*Math.floor(t.data.stats.time/6e4)).toString().padStart(2,"0")}`,$=t.data.stats.time,L=t.data.timer?10:20,t.data.blurred&&(document.getElementById("racetrack").style="visibility:hidden")};function R(){$+=100,document.getElementById("timeplaying").innerText=(t=>{let e=Math.floor(t/1e3),n=Math.floor(e/60),a=Math.floor(n/60);return e%=60,n%=60,a>0?`${a}:${o(n)}:${o(e)}`:`${n}:${o(e)}`})($)}b&&b.addEventListener("keydown",(async t=>{"Enter"==t.key&&(t.preventDefault(),((t,e)=>t.map((t=>a(t))).includes(a(e)))(w,b.value)?(G(!0),D(L),clearInterval(y),y=setInterval(R,100),b.value="",_()):(q(),_()))}));const J=document.getElementById("sound"),U=document.getElementById("blurred"),W=document.getElementById("soundBox"),z=document.getElementById("blurredBox"),K=document.getElementById("timer1020"),Q=document.getElementById("timer1020Box"),V=async t=>{sound="On"===t,J.src=`/img/sound${t}.png`,await axios.post("/api/v1/gameData/updateGameSettings",{sound:sound})},X=async t=>{blurred="On"===t,U.src=`/img/blurred${t}.png`,await axios.post("/api/v1/gameData/updateGameSettings",{blurred:blurred})};J&&W.addEventListener("click",(async t=>{J.src.match("/img/soundOff.png")?V("On"):(V("Off"),X("Off"),document.getElementById("racetrack").style="visibility:visible")})),U&&z.addEventListener("click",(async t=>{U.src.match("/img/blurredOff.png")?(X("On"),V("On"),document.getElementById("racetrack").style="visibility:hidden"):(X("Off"),document.getElementById("racetrack").style="visibility:visible")})),K&&Q.addEventListener("click",(async t=>{"10s"===K.innerText?(K.innerText="20s",L=20,await axios.post("/api/v1/gameData/updateGameSettings",{timer:!1})):(K.innerText="10s",L=10,await axios.post("/api/v1/gameData/updateGameSettings",{timer:!0}))})),b&&(!function(){for(i=1;i<=E;++i)i<v/2-x?O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n    left:${h.left+v/2+i-f/2}px ; \n    top:${h.top-f/2}px;\n    `})):i<v/2-x+Math.PI*x/2?(S=Math.PI/2-(i-v/2+x)/x,O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+v-x+x*Math.cos(S)-f/2}px ; \n      top:${h.top+x-x*Math.sin(S)-f/2}px;\n      `}))):i<v/2-3*x+Math.PI*x/2+I?O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+v-f/2}px ; \n      top:${h.top+x+i-(v/2-x+Math.PI*x/2)-f/2}px;\n      `})):i<v/2-3*x+Math.PI*x+I?O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+v-x+x*Math.cos((i-(v/2-3*x+Math.PI*x/2+I))/x)-f/2}px ; \n      top:${h.top+I-x+x*Math.sin((i-(v/2-3*x+Math.PI*x/2+I))/x)-f/2}px;\n      `})):i<3*v/2-5*x+Math.PI*x+I?O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+v-x-i+v/2-3*x+Math.PI*x+I-f/2}px ; \n      top:${h.top+I-f/2}px;\n      `})):i<3*v/2-5*x+3*Math.PI*x/2+I?(k=i-(3*v/2-5*x+Math.PI*x+I),S=Math.PI/2+k/x,O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+x+x*Math.cos(-S)-f/2}px ; \n      top:${h.top+I-x-x*Math.sin(-S)-f/2}px;\n      `}))):i<3*v/2-7*x+3*Math.PI*x/2+2*I?(k=i-(3*v/2-5*x+3*Math.PI*x/2+I),O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left-f/2}px ; \n      top:${h.top+I-x-k-f/2}px;\n      `}))):i<3*v/2-7*x+2*Math.PI*x+2*I?(k=i-(3*v/2-7*x+3*Math.PI*x/2+2*I),O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+x-x*Math.cos(k/x)-f/2}px ; \n      top:${h.top+x-x*Math.sin(k/x)-f/2}px;\n      `}))):(k=i-(3*v/2-7*x+2*Math.PI*x+2*I),O.appendChild(s("div",{class:"point",id:`point${i}`,style:`width:${f}px; height:${f}px;\n      left:${h.left+x+k-f/2}px ; \n      top:${h.top-f/2}px;\n      `})))}(),H(),R(),_(c[0].innerText));const Y=document.getElementById("loginform"),Z=document.getElementById("signupform"),tt=document.getElementById("logoutBtn"),et=document.getElementById("forgotpasswordform"),nt=document.getElementById("resetpasswordform");Y&&Y.addEventListener("submit",(t=>{t.preventDefault();(async(t,n)=>{try{"success"===(await axios.post("/api/v1/users/login",{email:t,password:n})).data.status&&e("success","Logged in successfully"),window.setTimeout((()=>{location.assign("/")}),1500)}catch(t){if(e("error",t.response.data.msg),!document.getElementById("forgotP")){const t=document.createElement("a");t.id="forgotP",t.innerHTML="Forgot Password?",t.className="nav__el",t.href="/forgot-password",document.getElementById("formholder").appendChild(t)}}})(document.getElementById("email").value,document.getElementById("password").value)})),Z&&Z.addEventListener("submit",(t=>{t.preventDefault();(async(t,n,a,i)=>{try{"success"===(await axios.post("/api/v1/users/signup",{username:t,email:n,password:a,passwordConfirm:i})).data.status&&e("success","New account created!"),window.setTimeout((()=>{location.assign("/")}),1500)}catch(t){e("error",t.response.data.msg)}})(document.getElementById("username").value,document.getElementById("email").value,document.getElementById("password").value,document.getElementById("passwordConfirm").value)})),tt&&tt.addEventListener("click",(t=>{(async()=>{try{"success"===(await axios.get("/api/v1/users/logout")).data.status&&(e("success","Logged out successfully!"),window.setTimeout((()=>{location.assign("/")}),1500))}catch(t){e("error","Error logging out! Try again.")}})()})),et&&et.addEventListener("submit",(t=>{t.preventDefault();(async t=>{try{"success"===(await axios.post("/api/v1/users/forgotPassword",{email:t})).data.status&&e("success","Code has been sent"),window.setTimeout((()=>{location.assign(`/password-reset?email=${t}`)}),1500)}catch(t){e("error",t.response.data.msg)}})(document.getElementById("email").value)})),nt&&nt.addEventListener("submit",(t=>{t.preventDefault();(async(t,n,a)=>{try{"success"===(await axios.patch("/api/v1/users/resetPassword",{token:t,password:n,passwordConfirm:a})).data.status&&e("success","Password updated successfully"),window.setTimeout((()=>{location.assign("/")}),3e3)}catch(t){e("error",t.response.data.msg)}})(document.getElementById("token").value,document.getElementById("password").value,document.getElementById("passwordConfirm").value)}));const at=document.getElementById("searchdictionary"),it=()=>(async t=>{const a=n(t);try{const t=await axios.get(`/api/v1/dictionary?pattern=^${a}`),e=document.getElementById("dictionarytable");e.removeChild(e.firstChild);const n=document.createElement("tbody");e.appendChild(n),console.log(t.data.data);let i,o=0;for(let e of t.data.data.dicEntries)i=s("tr",{id:`row${o}`,class:"nav__el"},s("td",{id:`target${o}`,class:"leftcolumn",translate:"no"},document.createTextNode(e.target)),s("td",{class:"rightcolumn",translate:"no"},document.createTextNode(e.solutions.toString().split(",").join(" // "))),s("td",{class:"addfield"},document.createTextNode("+"))),n.appendChild(i),i.addEventListener("mouseover",(t=>{r()})),i.addEventListener("mouseleave",(t=>{d()})),i.addEventListener("click",(t=>{l(t)})),o+=1}catch(t){e("error","Somethings not right")}})(at.value);at&&(it(),at.addEventListener("keydown",(async t=>{clearTimeout(p),p=setTimeout(it,500)})));
//# sourceMappingURL=bundle.js.map
