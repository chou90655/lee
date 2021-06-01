
import { getTheme } from '../../util/cach'
let themeClass = getTheme() || '54b1ff'
themeClass && (document.body.className += `theme-color${themeClass}`)