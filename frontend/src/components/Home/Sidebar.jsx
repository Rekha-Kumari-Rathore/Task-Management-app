import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebookOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";

const Sidebar = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const data = [
        {
            title: "All tasks",
            icon: <CgNotes />,
            link: "/",
        },
        {
            title: "Important tasks",
            icon: <MdLabelImportant />,
            link: "/importantTasks",
        },
        {
            title: "Completed tasks",
            icon: <FaCheckDouble />,
            link: "/completedTasks",
        },
        {
            title: "Incompleted tasks",
            icon: <TbNotebookOff />,
            link: "/incompletedTasks",
        },
    ];

    const [Data, setData] = useState();
    const logout = () => {
     dispatch(authActions.logout());   
     localStorage.clear("id");
     localStorage.clear("token");
     history("/signup");
    };
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    useEffect(() => {
     
    const user = JSON.parse(localStorage.getItem("user"));

    setData(user);
    }, []);

    
    return (
     <>
          {Data && (
           <div>
                <h2 className="text-xl font-semibold capitalize">{Data.username}</h2>
                <h4 className="mb-1 text-gray-400">{Data.email}</h4>
            
                <hr />
            </div>
           )}
            <div>
                {data.map((items, i)=> (
                    <Link to={items.link} 
                    key={i}
                     className="my-2 flex items-center hover:bg-gray-600 p-2 rounded transition-all duration-300">
                        {items.icon } {items.title} 
                    </Link>
                ))}
            </div>
            <div>
                <button className="bg-gray-600 w-full p-2 rounded" onClick={logout}>Log Out </button> 
            </div>
            </>
    );
};

export default Sidebar;