import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {authActions} from "../store/auth";
import { useSelector, useDispatch } from "react-redux";
const Login = () => {
    const [Data, setData] = useState({ username: "", password: "" });
    const history = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn === true) {
    history("/");
  }
    const dispatch = useDispatch();
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (Data.username === "" || Data.email === "" || Data.password === "") {
        alert("All fields are required");
      } else {
       
        const response = await axios.post("http://localhost:1000/api/v1/log-in", Data);

        setData({ username: "", password: "" });
        localStorage.setItem("id",response.data.id);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        localStorage.setItem("token",response.data.token);
        dispatch(authActions.login());
        history("/");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

    return (
        <div className="h-[98vh] flex items-center justify-center">
        <div className="p-4 w-2/6 rounded bg-gray-900">
          <div className="text-2xl font-semibold ">Login</div>
          <input
           type="username"
           placeholder="username"
           className="bg-gray-700 p-3 py-2 my-3 w-full rounded"
           name="username" 
           value={Data.username}
           onChange={change}
           />
           <input
           type="password"
           placeholder="password"
           className="bg-gray-700 p-3 py-2 my-3 w-full rounded"
           name="password" 
           value={Data.password}
           onChange={change}
           /> 
           <div className="w-full flex items-center justify-between">
           <button className="bg-blue-400 text-xl font-semibold text-black px-3 py-2 rounded" onClick={submit}>
            Login
            </button>
           <Link to="/signup" className="text-gray-400 hover:text-gray-200">Not having an account? SignUp here</Link>
           </div>
        </div>
    </div>
    );
};

export default Login;