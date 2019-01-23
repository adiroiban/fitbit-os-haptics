import { me } from "appbit"
import document from "document"
import { vibration } from "haptics"

/*
-------------------- Life cycle handling.
*/

me.onunload = () => {
  vibration.start('ping')
}


/*
------------------ UI handling.
*/

let last_back = new Date().getTime()
let list = document.getElementById("vibration-list")
let items = list.getElementsByClassName("tile-list-item")

items.forEach((element, index) => {
    let touch = element.getElementById('touch-me')
    let text = element.getElementById('text').text
    touch.onclick = (event) => {
        vibration.start(text);
    }
})

document.onkeypress = function(event) {
    console.log("Key pressed: " + event.key)
    let now = new Date().getTime()
    if (event.key == 'back') {
        vibration.stop()
        if (now - last_back < 1500) {
            me.exit()
        } else {
            last_back = new Date().getTime()
            event.preventDefault()
        }
    }

}