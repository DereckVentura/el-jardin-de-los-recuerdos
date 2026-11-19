import { emociones, type Emocion } from '../models/recuerdo'

const paletas: Record<Emocion, [string, string, string]> = {
  alegria: ['#eeb741','#f7d777','#895929'],
  nostalgia: ['#ad92c1','#d4c0dd','#706281'],
  amor: ['#c86777','#e8a1aa','#96465d'],
  calma: ['#7fa4c8','#c0d8e7','#526e8e'],
  tristeza: ['#8689bf','#bdc1dc','#62658e'],
  gratitud: ['#e59a64','#f1bf8c','#9e6641'],
}
function corona(n: number, forma: string, relleno: string, linea: string, inicio = 0) {
  return Array.from({ length:n }, (_, i) => `<g transform="rotate(${inicio+i*360/n})"><path d="${forma}" fill="${relleno}" stroke="${linea}" stroke-width=".7"/><path d="M0 -6 Q-1 -11 0 -16" fill="none" stroke="${linea}" opacity=".48" stroke-width=".8"/></g>`).join('')
}
function cabeza(e: Emocion) {
  const [a,b,c] = paletas[e]
  const centro = `<circle r="5" fill="${c}"/><g fill="#f4d899"><circle cx="-2" cy="-1" r=".9"/><circle cx="2" cy="-2" r=".8"/><circle cx="1" cy="2" r=".7"/></g>`
  switch(e) {
    case 'alegria': return corona(15,'M0 1 Q-9 -12 0 -26 Q7 -14 0 1Z',a,c)+corona(12,'M0 0 Q-6 -10 0 -20 Q7 -10 0 0Z',b,c,13)+'<circle r="8" fill="#835c36"/>'+centro
    case 'amor': return corona(5,'M0 1 C-18 -3 -19 -25 -8 -24 Q0 -28 5 -21 Q14 -10 0 1Z',a,c)+corona(4,'M0 1 C-12 -3 -15 -17 -4 -17 Q11 -17 0 1Z',b,c,28)+centro
    case 'gratitud': return corona(8,'M0 2 C-9 -3 -14 -22 -5 -22 Q-1 -20 0 -23 Q3 -20 6 -22 C14 -20 9 -5 0 2Z',a,c)+centro
    case 'calma': return corona(5,'M0 1 C-5 -2 -16 -11 -13 -19 Q-10 -26 -4 -21 Q0 -30 5 -23 Q12 -25 13 -18 C11 -8 4 -3 0 1Z',b,c)+centro
    case 'tristeza': return `<path d="M0 -17 Q-13 -17 -14 -4 Q-13 6 -17 11 Q-10 10 -8 15 Q-3 10 0 16 Q5 10 8 14 Q10 8 15 9 Q8 3 10 -5 Q11 -15 0 -17Z" fill="${a}" stroke="${c}"/><path d="M0 -15 Q-6 -4 -7 10 M2 -14 Q6 -1 6 9" fill="none" stroke="${b}" stroke-width="1.5"/>`
    case 'nostalgia': return Array.from({length:6},(_,i)=>`<g transform="translate(${(i%2?1:-1)*(7-i*.7)} ${15-i*6}) rotate(${i%2?35:-35})"><ellipse rx="5" ry="9" fill="${i%2?a:b}" stroke="${c}" stroke-width=".8"/><path d="M0 6 Q-2 2 0 -5" fill="none" stroke="${c}" stroke-width=".65"/></g>`).join('')
  }
}
export function flor(e: Emocion, decorativa=false) {
  const orientacion = e==='amor'||e==='nostalgia' ? -1 : 1
  const campanas = e==='tristeza' ? '<g transform="translate(68 64) rotate(-16) scale(.64)">'+cabeza(e)+'</g>' : ''
  return `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" ${decorativa?'aria-hidden="true"':`role="img" aria-label="Flor de ${emociones[e]}"`}><g transform="translate(${orientacion<0?100:0} 0) scale(${orientacion} 1)">
    <g fill="none" stroke="#698066" stroke-linecap="round"><path d="M44 144 C45 115 58 72 49 41" stroke-width="2.2"/><path d="M48 119 Q31 105 25 89 M52 97 Q69 86 75 70" stroke-width="1.4"/></g>
    <g stroke="#71826c" stroke-width=".65"><path fill="#95a78b" d="M46 116 Q23 115 21 84 Q41 91 46 116Z"/><path fill="#a7b89a" d="M53 99 Q55 75 80 66 Q75 88 53 99Z"/><path fill="#b0bfa4" d="M52 79 Q37 74 32 56 Q49 62 52 79Z"/></g>
    <path d="M24 90 L43 112 M76 71 L56 94 M35 61 L49 75" fill="none" stroke="#788b70" stroke-width="1"/>
    ${e==='tristeza'?'<path d="M51 80 Q60 42 69 56" fill="none" stroke="#698066" stroke-width="1.4"/>':''}
    <g transform="translate(49 40) rotate(-8)">${cabeza(e)}</g>${campanas}</g></svg>`
}
export function icono(tipo: 'hoja'|'buscar'|'mas'|'flecha'|'cerrar') {
  const trazo = {hoja:'M4 18C3 8 10 3 20 3c0 10-6 16-14 14m-3 4L15 9',buscar:'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',mas:'M12 5v14M5 12h14',flecha:'M6 17 18 5M7 5h11v11',cerrar:'M6 6l12 12M18 6 6 18'}[tipo]
  return `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${trazo}"/></svg>`
}
