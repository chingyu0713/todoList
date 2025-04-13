import axios from "axios"
import Swal from "sweetalert2"

const TOKEN_NAME = "user_token"

const Main = () => ({
  showSection: "loginSection",
  email: "",
  nickname: "",
  password: "",
  isLogin: false,
  todos: [],
  task: "",

  init() {
    const token = localStorage.getItem(TOKEN_NAME)
    if (token) {
      this.isLogin = true
      this.showTaskInput()
      this.getTodos()
    }
  },
  clearText() {
    this.email = ""
    this.nickname = ""
    this.password = ""
  },
  showLogin() {
    this.showSection = "loginSection"
  },
  showSignUp() {
    this.showSection = "signUpSection"
  },
  showTaskInput() {
    this.showSection = "taskSection"
  },

  async deleteTodo(id) {
    const token = localStorage.getItem(TOKEN_NAME)
    if (token){
        const url = `https://todoo.5xcamp.us/todos/${id}`
        const config = { headers: { Authorization: token } }
        this.$el.parentNode.parentNode.remove()
        try {
            await axios.delete(url, config)
        } catch {
            Swal.fire({
                title: "錯誤",
                text: "無法刪除資料，請稍後再試",
                icon: "error",
                confirmButtonText: "確認",
            })
        }
    }
  },
  async addTodo() {
    const token = localStorage.getItem(TOKEN_NAME)
    if (token && this.task != "") {
      const url = "https://todoo.5xcamp.us/todos"
      const todoData = {
        todo: {
          content: this.task,
        },
      }
      const config = { headers: { Authorization: token } }
      try {
        const { data } = await axios.post(url, todoData, config)
        this.task = ""
        this.todos.unshift(data)
      } catch (err) {
        Swal.fire({
          title: "新增錯誤",
          text: "請稍後再試",
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
  async getTodos() {
    const url = "https://todoo.5xcamp.us/todos"
    const token = localStorage.getItem(TOKEN_NAME)
    if (token) {
      const config = { headers: { Authorization: token } }
      try {
        const { data } = await axios.get(url, config)
        const { todos } = data
        this.todos = todos
      } catch (err) {
        console.log(err)
      }
    }
  },

  async logout() {
    const url = "https://todoo.5xcamp.us/users/sign_out"
    const token = localStorage.getItem(TOKEN_NAME)
    if (token) {
      axios.defaults.headers.common["Authorization"] = null
    try {
      const config = { headers: { Authorization: token } }
      const resp = await axios.delete(url, config)
    } catch {
      //處理錯誤可不處理
    }
    this.isLogin = false
    localStorage.removeItem(TOKEN_NAME)
    this.todos = []
    this.showLogin()
    }
  },
  async login() {
    if (this.email != "" && this.password != "") {
      const userData = {
        user: {
          email: this.email,
          password: this.password,
        },
      }

      try {
        const resp = await axios.post("https://todoo.5xcamp.us/users/sign_in", userData)
        const token = resp.headers.authorization

        localStorage.setItem(TOKEN_NAME, token)
        this.clearText()
        this.isLogin = true
        this.showTaskInput()
      } catch (err) {
        Swal.fire({
          title: "登入發生錯誤",
          html: "請檢查帳號或密碼是否正確",
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
  async signUp() {
    if (this.email != "" && this.nickname != "" && this.password != "") {
      const userData = {
        user: {
          email: this.email,
          nickname: this.nickname,
          password: this.password,
        },
      }

      try {
        await axios.post("https://todoo.5xcamp.us/users", userData)
        this.clearText()
        this.showLogin()
      } catch (err) {
        const errText = err.response.data.error.join("<br />")
        Swal.fire({
          title: "系統發生錯誤",
          html: errText,
          icon: "error",
          confirmButtonText: "確認",
        })
      }
    }
  },
})

export default Main
