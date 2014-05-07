# CoffeeScript

addListener = (element, type, callback) ->
  if element.addEventListener
    element.addEventListener type, callback
  else element.attachEvent "on" + type, callback  if element.attachEvent
  return
for i in document.getElementsByTagName("a")
    #console.log "test1", i
    addListener i, "click", ->
       #console.dir i
       ga "send", "event", "link", "click", i.href
       return


