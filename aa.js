function removeNum(arr, n) {
    const idx = arr.findIndex((i) => i==n)
    arr.splice(idx, 1)
}

function removeTodo(todos, id)  {
    const idx = todos.findIndex((todo) => todo.id==id)
    if (idx >= 0) {
        todos.splice(idx, 1)
    }  
}


