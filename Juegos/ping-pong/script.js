let cnv = document.getElementById('c'), ctx = cnv.getContext('2d')
cnv.width = window.innerWidth; cnv.height = window.innerHeight
let b = { x: 100, y: 100, r: 20, vx: 5, vy: 3, color: 'white' }
function rnd() { return '#' + Math.floor(Math.random() * 16777215).toString(16) }
function draw() { ctx.clearRect(0, 0, cnv.width, cnv.height); ctx.fillStyle = b.color; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill() }
function update() {
    b.x += b.vx; b.y += b.vy
    if (b.x < 0 + b.r || b.x > cnv.width - b.r) { b.vx *= -1; b.color = rnd() }
    if (b.y < 0 + b.r || b.y > cnv.height - b.r) { b.vy *= -1; b.color = rnd() }
}
function loop() { update(); draw(); requestAnimationFrame(loop) }
loop();