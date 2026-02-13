const $=id=>document.getElementById(id)
const screenStart=$("screenStart"),screenQuiz=$("screenQuiz"),screenResult=$("screenResult")
const qTitle=$("qTitle"),optionsEl=$("options")
const btnStart=$("btnStart"),btnPrev=$("btnPrev"),btnNext=$("btnNext"),btnResetTop=$("btnResetTop"),btnRestart=$("btnRestart"),btnShareLink=$("btnShareLink"),btnSaveCard=$("btnSaveCard")
const progressBar=$("progressBar"),qIndexEl=$("qIndex"),qTotalEl=$("qTotal"),qTotal2El=$("qTotal2")
const resultLineEl=$("resultLine"),resultMoneyEl=$("resultMoney")
const myNameInput=$("myName"),friendNameInput=$("friendName")

const fmtWon=n=>"₩"+Math.round(n).toLocaleString("ko-KR")
const QUESTIONS=[
{id:"Q01",type:"multi",text:"해당 되는 거 모두 체크",options:[
{key:"A",text:"들찍해준 적 있다",score:30000},
{key:"B",text:"내 운동 끝나고도 남아준 적 있다",score:30000},
{key:"C",text:"짐(초크, 휴대폰 등) 챙겨준 적 있다",score:30000},
{key:"D",text:"시범 보여준 적 있다",score:30000},
{key:"E",text:"실패 원인 분석해준 적 있다",score:30000},
{key:"F",text:"음료 대신 사다준 적 있다",score:30000},
{key:"G",text:"등반 사진 찍어준 적 있다",score:30000},
{key:"H",text:"같이 원정 간 적 있다",score:30000},
{key:"I",text:"같이 클라이밍 간 적 있다",score:15000}
]},
{id:"Q02",type:"single",text:"둘이 암장가면",options:[
{key:"A",text:"내가 챙겨주는 편",score:30000},
{key:"B",text:"내가 챙김받는 편",score:0},
{key:"C",text:"서로 유기하는 편",score:0},
{key:"D",text:"애가 갑자기 시라져서 유기 당함",score:50000}
]},
{id:"Q03",type:"single",text:"찐막이라더니 진짜 ㄹㅇ 진심 찐막 한 번만 더 라고 한다면",options:[
{key:"A",text:"기다려준다",score:15000},
{key:"B",text:"기다리면서 들찍까지 해준다",score:30000},
{key:"C",text:"ㅇㅇ~ 하셈~ 난 먼저 간다",score:-15000}
]},
{id:"Q04",type:"single",text:"내 운동 끝났는데 상대는 한창이라면?",options:[
{key:"A",text:"응원+구경한다",score:30000},
{key:"B",text:"언제까지 할 건지 물어보고 결정",score:15000},
{key:"C",text:"집 간다~",score:-15000}
]},
{id:"Q05",type:"single",text:"난 풀었는데 상대가 못 풀었다면?",options:[
{key:"A",text:"풀 때까지 응원한다",score:30000},
{key:"B",text:"앉아서 다른 사람이랑 같이 구경한다",score:15000},
{key:"C",text:"다른 벽 간다 ㅃㅇ~",score:-15000}
]},
{id:"Q06",type:"single",text:"힘 다 털렸는데 문제 물어보면?",options:[
{key:"A",text:"카탈로그 보라고 한다",score:-15000},
{key:"B",text:"어떤 느낌인지만 말로 설명한다",score:15000},
{key:"C",text:"힘들어도 보여준다",score:30000}
]},
{id:"Q07",type:"single",text:"254168번째 들찍 해달라고 하면?",options:[
{key:"A",text:"기꺼이~",score:30000},
{key:"B",text:"솔직히 조금 귀찮지만... 찍어준다",score:15000},
{key:"C",text:"들찍? 내가? 왜?",score:-30000}
]},
{id:"Q08",type:"single",text:"빡클 중인데 와서 말걸면?",options:[
{key:"A",text:"이 김에 좀 쉬자",score:30000},
{key:"B",text:"나 잠깐만 이것만 좀 하고",score:15000},
{key:"C",text:"줘팬다",score:-30000}
]},
{id:"Q09",type:"single",text:"내가 선호하지 않는 암장 같이 꼬옥 가고 싶다고 하면?",options:[
{key:"A",text:"가자~",score:100000},
{key:"B",text:"다른 암장으로 유인한다",score:10000},
{key:"C",text:"싫.다.",score:-15000}
]},
{id:"Q10",type:"single",text:"상대는 나한테",options:[
{key:"A",text:"행클부적",score:150000},
{key:"B",text:"완등부적",score:150000},
{key:"C",text:"그냥 인간",score:0}
]}
]

let idx=0
const answers=new Map()

function show(which){
screenStart.classList.toggle("hidden",which!=="start")
screenQuiz.classList.toggle("hidden",which!=="quiz")
screenResult.classList.toggle("hidden",which!=="result")
}

function isAnswered(q){
const v=answers.get(q.id)
if(q.type==="multi") return v instanceof Set && v.size>0
return typeof v==="string" && v.length>0
}

function getMultiSet(qid){
const v=answers.get(qid)
return v instanceof Set?v:new Set()
}

function render(){
const q=QUESTIONS[idx]
qIndexEl.textContent=String(idx+1)
qTitle.textContent=`Q${idx+1}. ${q.text}`
optionsEl.innerHTML=""
const pct=((idx+1)/QUESTIONS.length)*100
progressBar.style.width=`${pct}%`
if(q.type==="multi"){
const selected=getMultiSet(q.id)
q.options.forEach(op=>{
const b=document.createElement("button")
b.type="button"
b.className="option"
b.textContent=`${op.key}. ${op.text}`
if(selected.has(op.key)) b.classList.add("selected")
b.addEventListener("click",()=>{
const set=getMultiSet(q.id)
set.has(op.key)?set.delete(op.key):set.add(op.key)
answers.set(q.id,set)
render()
})
optionsEl.appendChild(b)
})
}else{
const picked=answers.get(q.id)||null
q.options.forEach(op=>{
const b=document.createElement("button")
b.type="button"
b.className="option"
b.textContent=`${op.key}. ${op.text}`
if(picked===op.key) b.classList.add("selected")
b.addEventListener("click",()=>{answers.set(q.id,op.key);render()})
optionsEl.appendChild(b)
})
}
btnPrev.disabled=idx===0
btnNext.disabled=!isAnswered(q)
}

function calcScore(){
let total=0
for(const q of QUESTIONS){
const v=answers.get(q.id)
if(q.type==="multi"){
const set=v instanceof Set?v:new Set()
for(const key of set){
const op=q.options.find(o=>o.key===key)
if(op) total+=op.score
}
}else{
const op=q.options.find(o=>o.key===v)
if(op) total+=op.score
}
}
return total
}

function resetAll(){
answers.clear();idx=0;progressBar.style.width="0%";qIndexEl.textContent="1";show("start")
}

function showResult(){
const money=calcScore()
const my=(myNameInput.value||"").trim()||"나"
const fr=(friendNameInput.value||"").trim()||"너"

if(money<0){
resultLineEl.textContent=`오히려 ${my}(이)가 ${fr}한테 줘야함…`
resultMoneyEl.textContent=fmtWon(Math.abs(money))
}else{
resultLineEl.textContent=`${fr}가 ${my}에게 줘야할 친구비는...`
resultMoneyEl.textContent=fmtWon(money)
}

const url=new URL(location.href)
url.searchParams.set("a",encodeURIComponent(my))
url.searchParams.set("b",encodeURIComponent(fr))
url.searchParams.set("m",String(money))
history.replaceState(null,"",url.toString())
show("result")
}

async function shareResult(){
const money=calcScore()
const my=(myNameInput.value||"").trim()||"나"
const fr=(friendNameInput.value||"").trim()||"너"
const url=new URL(location.href)
url.searchParams.set("a",encodeURIComponent(my))
url.searchParams.set("b",encodeURIComponent(fr))
url.searchParams.set("m",String(money))

let text
if(money>0){
text=`${fr}(이)가 ${my}에게 줘야할 친구비는...`
}else(money<0){
text=`${my}(이)가 ${fr}에게 줘야할 친구비는...`
}

try{
if(navigator.share){
await navigator.share({title:"클친(클라이밍친구)비 정산서",text,url:url.toString()})
return
}
}catch(e){}

try{
await navigator.clipboard.writeText(url.toString())
alert("링크 복사 완료 😎")
}catch(e){
prompt("복사 안 되면 이거 복붙 ㄱㄱ",url.toString())
}
}


async function saveCard(){
const card=$("resultCard")
if(!card) return alert("resultCard 없음")
if(!window.html2canvas) return alert("html2canvas 로딩 안 됨")
const hides=card.querySelectorAll(".no-export")
try{
hides.forEach(el=>el.classList.add("is-hidden-for-export"))
await new Promise(r=>setTimeout(r,120))
const canvas=await window.html2canvas(card,{backgroundColor:null,scale:2,useCORS:true,allowTaint:true,logging:false})
const a=document.createElement("a")
a.download="friend-fee-card.png"
a.href=canvas.toDataURL("image/png")
document.body.appendChild(a)
a.click()
a.remove()
}catch(e){console.error(e);alert("저장 실패. 콘솔 확인 ㄱㄱ")}
finally{hides.forEach(el=>el.classList.remove("is-hidden-for-export"))}
}

function startGuard(){
const my=(myNameInput.value||"").trim()
const fr=(friendNameInput.value||"").trim()
if(!my||!fr){alert("이름 2개 다 입력해야 시작 가능 😏");return false}
return true
}

btnStart.addEventListener("click",()=>{if(!startGuard())return;show("quiz");idx=0;render()})
btnResetTop.addEventListener("click",resetAll)
btnRestart.addEventListener("click",resetAll)
btnPrev.addEventListener("click",()=>{if(idx>0){idx--;render()}})
btnNext.addEventListener("click",()=>{const q=QUESTIONS[idx];if(!isAnswered(q))return;if(idx<QUESTIONS.length-1){idx++;render()}else showResult()})
btnShareLink.addEventListener("click",shareResult)
btnSaveCard.addEventListener("click",saveCard)

;["myName","friendName"].forEach(id=>{
const el=$(id);if(!el) return
el.addEventListener("keydown",e=>{if(e.key==="Enter") btnStart.click()})
})

function restoreFromQuery(){
const url=new URL(location.href)
const m=url.searchParams.get("m")
const a=url.searchParams.get("a")
const b=url.searchParams.get("b")
if(!m) return false

const money=Number(m)||0
const my=decodeURIComponent(a||"나")
const fr=decodeURIComponent(b||"너")

myNameInput.value=my
friendNameInput.value=fr

if(money<0){
resultLineEl.textContent=`오히려 ${my}가 ${fr}한테 줘야함…`
resultMoneyEl.textContent=fmtWon(Math.abs(money))
}else{
resultLineEl.textContent=`${fr}가 ${my}에게 줘야할 친구비는...`
resultMoneyEl.textContent=fmtWon(money)
}

show("result")
return true
}



qTotalEl.textContent=String(QUESTIONS.length)
qTotal2El.textContent=String(QUESTIONS.length)
if(!restoreFromQuery()) show("start")




