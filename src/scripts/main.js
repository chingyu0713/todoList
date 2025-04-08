import axios from "axios"
import Swal from 'sweetalert2' 
const TOKEN_NAME = "userToken"

const Main = () => ({
  showSection: "loginSection",
  email: "",
  nickname: "",
  password: "",
  isLogin: false,
  init() {
    const token = localStorage.getItem(TOKEN_NAME)
    if(token) {
      this.isLogin = true
      this.showTaskInput()
    }
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
  clearText() {
    this.email = ""
    this.nickname = ""
    this.password = ""
  },
    async logout() {
        const url = "https://todoo.5xcamp.us/users/sign_out";
        const token = localStorage.getItem(TOKEN_NAME)
        if(token) {
            axios.defaults.headers.common['Authorization'] = token;
            const resp = await axios.delete(url)
            console.log(resp);
            
        }
    },

  async signIn() {
    if (this.email != ""&& this.password != "") {
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
        // console.log("登入成功");
        this.isLogin = true;
        this.showTaskInput()
        
      } catch (err) {
        console.log(err);
        
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
          title: "註冊錯誤",
          html: errText,
          icon: "error",
          confirmButtonText: "確認",
          })
      }
    }
  },

})

export default Main
