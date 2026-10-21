import{u as x,r as s,j as e,H as g}from"./app-BKq9MT_q.js";import{P as w}from"./lottie-react.esm-R1ldk6S0.js";function j(){const{data:n,setData:l,post:c,processing:d,errors:t}=x({email:"",password:""}),[m,a]=s.useState(!1),[o,p]=s.useState(localStorage.getItem("darkMode")==="true"),[i,u]=s.useState(!1);s.useEffect(()=>{o?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode"),localStorage.setItem("darkMode",o)},[o]);const b=()=>{p(!o)},f=()=>{u(!i)},h=r=>{r.preventDefault(),a(!0),c(route("login.check"),{onFinish:()=>a(!1),onError:()=>a(!1)})};return e.jsxs("div",{className:"container-fluid position-relative bg-white d-flex p-0 w-100",style:{minHeight:"100vh"},children:[e.jsx(g,{title:"Login"}),e.jsx("button",{onClick:b,className:"btn btn-lg-square position-fixed top-0 end-0 m-3",style:{zIndex:9999,background:"transparent",border:"none",color:"var(--text-muted)"},children:o?e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"1.65rem"},children:"light_mode"}):e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"1.65rem"},children:"dark_mode"})}),m&&e.jsx("div",{id:"loading-screen",className:"loader-full-screen",children:e.jsx(w,{autoplay:!0,loop:!0,src:o?"/lottie/Scene-2.json":"/lottie/Scene-1.json",style:{height:"100px",width:"100px"}})}),e.jsx("div",{className:"container-fluid position-relative",children:e.jsx("div",{className:"row h-100 align-items-center justify-content-center",style:{minHeight:"100vh"},children:e.jsx("div",{className:"col-12 col-sm-8 col-md-5 col-lg-4 col-xl-3",children:e.jsxs("div",{className:"p-4",children:[e.jsx("div",{className:"d-flex flex-column align-items-center justify-content-center mb-4",children:e.jsx("a",{href:"/",className:"text-center mb-3",children:e.jsx("img",{id:"loginLogo",src:o?"/img/owens-darkmode.png":"/img/owens.png",alt:"Owen's Logo",style:{height:"70px"}})})}),e.jsxs("form",{onSubmit:h,children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"email",className:"form-label text-muted",children:"Correo electrónico"}),e.jsx("input",{type:"email",className:`form-control border-0 border-bottom rounded-0 px-0 shadow-none form-control-sm ${t.email?"is-invalid":""}`,id:"email",value:n.email,onChange:r=>l("email",r.target.value),style:{background:"transparent"}}),t.email&&e.jsx("div",{className:"invalid-feedback",children:t.email})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"password",className:"form-label text-muted",children:"Contraseña"}),e.jsxs("div",{className:"input-group border-bottom",children:[e.jsx("input",{type:i?"text":"password",className:`form-control border-0 rounded-0 px-0 shadow-none form-control-sm ${t.password?"is-invalid":""}`,id:"password",value:n.password,onChange:r=>l("password",r.target.value),style:{background:"transparent"}}),e.jsx("button",{type:"button",onClick:f,className:"btn btn-sm text-muted border-0 bg-transparent shadow-none pe-0",children:e.jsx("i",{className:`bi ${i?"bi-eye-slash":"bi-eye"}`,style:{fontSize:"1.1rem"}})})]}),t.password&&e.jsx("div",{className:"text-danger small mt-1",children:t.password})]}),e.jsxs("button",{type:"submit",className:"btn btn-primary py-2 w-100 rounded-0 text-uppercase btn-sm d-flex align-items-center justify-content-center gap-2",style:{letterSpacing:"1.5px",fontWeight:"500"},disabled:d,children:[e.jsx("span",{className:"btn-text",children:"Ingresar"}),d&&e.jsx("div",{className:"spinner-border spinner-border-sm text-white",role:"status",style:{width:"1rem",height:"1rem",borderWidth:"0.15em"}})]})]})]})})})}),e.jsx("style",{children:`
                .form-control:focus {
                    border-color: #df0f13 !important;
                    box-shadow: none !important;
                }
                .form-control::placeholder {
                    color: #adb5bd;
                    opacity: 0.5;
                }
                .btn-primary {
                    background-color: #df0f13;
                    border-color: #df0f13;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #b90c10;
                    border-color: #b90c10;
                    letter-spacing: 3px;
                }

                /* Dark Mode Button Hover - Brighter/Vibrant */
                body.dark-mode .btn-primary:hover {
                    background-color: #FF5A5F !important;
                    border-color: #FF5A5F !important;
                }
                
                /* Dark Mode Input Border Fix */
                body.dark-mode .form-control {
                    color: #fff !important;
                    border-bottom-color: #2c3038 !important;
                }
                body.dark-mode .input-group {
                    border-bottom-color: #2c3038 !important;
                }
                /* Focus state needs to target the parent input-group now */
                .form-control:focus {
                    box-shadow: none !important;
                }
                
                .input-group:focus-within {
                    border-color: #df0f13 !important;
                }
                body.dark-mode .input-group:focus-within {
                    border-color: #FF5A5F !important;
                }

                /* Remove Autofill Yellow Background */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #fff inset !important;
                    -webkit-text-fill-color: #000 !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                body.dark-mode input:-webkit-autofill,
                body.dark-mode input:-webkit-autofill:hover, 
                body.dark-mode input:-webkit-autofill:focus, 
                body.dark-mode input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #191C24 inset !important; /* Match dark card bg */
                    -webkit-text-fill-color: #fff !important;
                }
            `})]})}export{j as default};
