document.addEventListener("DOMContentLoaded", () => {
    const elemName = document.querySelector("#elem-name"),
	  containerSelector = document.querySelector("#container-selector"),
	  monitorInterval = document.querySelector("#monitor-interval")

    const storage = browser.storage.local
    
    storage.get(defaultOptions).then(o => {
	elemName.value = o.elemName
	containerSelector.value = o.containerSelector
	monitorInterval.value = o.monitorInterval
    })
    elemName.onchange = () => storage.set({ elemName: elemName.value })
    containerSelector.onchange = () => storage.set({ containerSelector: containerSelector.value })
    monitorInterval.onchange = () => {
	const newVal = monitorInterval.value
	if(newVal >= 100) {
	    storage.set({ monitorInterval: monitorInterval.value })
	}
    }
})
