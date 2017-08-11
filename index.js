var self = require('sdk/self');
var clipboard = require('sdk/clipboard')
var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var { ToggleButton } = require('sdk/ui/button/toggle')
var timers = require('sdk/timers')
var { prefs } = require('sdk/simple-prefs')

var button = ToggleButton({
  id: "clipboard-inserter-btn",
  label: "Toggle Clipboard Cnserter",
  icon: {
    16: "./icon16.png",
    32: "./icon32.png",
    64: "./icon64.png"
  },
  onChange: function(state) {
    this.state('window', null)
    let { checked } = this.state('tab')
    checked = !checked
    this.state('tab', { checked })
    if(checked) {
      enableMonitor()
    } else {
      disableMonitor()
    }
  }
})

function enableMonitor() {
  console.log("Enabling clipboard monitor")
  tabs.activeTab.clinClipboardMonitor = new ClipboardMonitor()
}

function disableMonitor() {
  console.log("Disabling clipboard monitor")
  var monitor = tabs.activeTab.clinClipboardMonitor
  if(monitor) {
    timers.clearInterval(monitor.intervalID)
    delete tabs.activeTab.clinClipboardMonitor
  } else {
    console.error("Trying to disable clipboard monitor on tab without active ClipboardMonitor!")
  }
}

function ClipboardMonitor() {

  var lastContent = ''

  this.worker = tabs.activeTab.attach({ contentScriptFile: self.data.url('inserter.js') })

  this.intervalID = timers.setInterval(() => {
    if(clipboard.currentFlavors.indexOf('text') != -1) {
      var currentContent = clipboard.get('text/unicode')
      if(lastContent !== currentContent) {
        this.worker.port.emit('insert', currentContent, prefs)
        lastContent = currentContent
      }
    }
  }, 100)

}
