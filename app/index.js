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
let patterns = [
    "alert",
    "bump",
    "confirmation",
    "confirmation-max",
    "nudge",
    "nudge-max",
    "ping",
    "ring",
    ]
patterns.push('Quit App')

let manual_exit = false
let last_back = new Date().getTime()
let list_ui = document.getElementById('vibration-list')
let notification_animation = document.getElementById('notification-animation')
notification_animation.style.opacity = 0


list_ui.delegate = {
    getTileInfo: function(index) {
        return {
            type: "my-pool",
            value: patterns[index],
            index: index
            }
    },
    configureTile: function(tile, info) {
        if (info.type != "my-pool") { return }

        let text = tile.getElementById("text")
        text.text = info.value

        let doExit = () => {
            manual_exit = true
            me.exit()
        }

        let doVibrate = () => {
            console.log('Trigger: ' + info.value)
            let result = vibration.start(info.value)
            if (!result) {
                // New vibration could not be triggers.
                notification_animation.style.opacity = 1
                console.log('Motor busy')
                notification_animation.animate('enable')
            }
        }

        let onClick
        if (info.value == 'Quit App') {
            onClick = doExit
            let background = tile.getElementById('background')
            background.style.fill = 'orange'
            text.style.fill = 'black'
        } else {
            onClick = doVibrate
        }

        let touch = tile.getElementById('touch-me')
        touch.onclick = (event) => onClick()
    }
}

// It must be set AFTER `delegate`.
list_ui.length = patterns.length

document.onkeypress = function(event) {
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
