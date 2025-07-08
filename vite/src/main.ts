import './style.scss'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
	  hello
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
