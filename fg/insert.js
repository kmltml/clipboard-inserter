(() => {
    const processMessage = msg => {
	switch(msg.action) {
	case "insert":
	    const elem = document.createElement('p')
	    elem.textContent = msg.text
	    document.querySelector("body").appendChild(elem)
	    break
	case "uninject":
	    browser.runtime.onMessage.removeListener(processMessage)
	    break
	}    
    }

    browser.runtime.onMessage.addListener(processMessage)
})()
