import { me } from "appbit"
import document from "document"
import { vibration } from "haptics"

/*
-------------------- Life cycle handling.
*/

me.onunload = () => {
    if (manual_exit) {
        return
    }
    vibration.start('ping')
}


/*
------------------ UI handling.
*/

let manual_exit = false
let last_back = new Date().getTime()
let list = document.getElementById("vibration-list")
let items = list.getElementsByClassName("tile-list-item")

items.forEach((element, index) => {
    let touch = element.getElementById('touch-me')
    let text = element.getElementById('text').text
    touch.onclick = (event) => {
        if (text == 'Quit App') {
            manual_exit = true
            me.exit()
            return
        }
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
