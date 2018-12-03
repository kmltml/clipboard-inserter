console.log("I'm alive")

let previousContent = ""
let listeningTabs = []
let timer = null
let options = defaultOptions

browser.storage.local.get(defaultOptions)
    .then(o => options = o)

browser.storage.onChanged.addListener((changes, area) => {
    if(area === "local") {
	const optionKeys = Object.keys(options)
	for(key of Object.keys(changes)) {
	    if(optionKeys.indexOf(key) >= 0) {
		options[key] = changes[key].newValue
	    }
	}
	updateTimer()
    }
})

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({ active: true, currentWindow: true })
	.then(([t]) => toggleTab(t.id))
})

window.onload = () => {
    document.querySelector("#paste-target").addEventListener("paste", e => {
	if(e.clipboardData.getData("text/plain") === "") {
	    e.preventDefault() // prevent anything that is not representable as plain text from being pasted
	}
    })
}

function toggleTab(id) {
    const index = listeningTabs.indexOf(id)
    if(index >= 0) {
	uninject(id)
	listeningTabs.splice(index, 1)
	updateTimer()
	browser.browserAction.setBadgeText({ text: "", tabId: id })
    } else {
	browser.tabs.executeScript({file: "/fg/insert.js"})
	listeningTabs.push(id)
	updateTimer()
	browser.browserAction.setBadgeBackgroundColor({ color: "green", tabId: id })
	browser.browserAction.setBadgeText({ text: "ON", tabId: id })
    }
}

function notifyForeground(id, text) {
    browser.tabs.sendMessage(id, {
	action: "insert", text, options
    })
}

function uninject(id) {
    browser.tabs.sendMessage(id, { action: "uninject" })
}

function checkClipboard() {
    const pasteTarget = document.querySelector("#paste-target")
    pasteTarget.innerText = ""
    pasteTarget.focus()
    document.execCommand("paste")
    const content = pasteTarget.innerText
    if(content != previousContent && content != "") {
	listeningTabs.forEach(id => notifyForeground(id, content))
	previousContent = content
    }
}

function updateTimer() {
    function stop() {
	clearInterval(timer.id)
	timer = null
    }
    function start() {
	const id = setInterval(checkClipboard, options.monitorInterval)
	timer = { id, interval: options.monitorInterval }
    }
    if(listeningTabs.length > 0) {
	if(timer === null) {
	    start()
	} else if(timer.interval !== options.monitorInterval) {
	    stop()
	    start()
	}
    } else {
	stop()
    }
}
