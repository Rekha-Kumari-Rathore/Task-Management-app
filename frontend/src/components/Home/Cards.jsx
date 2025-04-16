import axios from "axios";
import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";

const Cards = ({ home, setInputDiv, data,fetch }) => {
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

   const handleCompleteTask = async (id,status) => {
    try {
       await axios.put(
            `http://localhost:1000/api/v2/update-complete-task/${id}`,
            { completed: !status },
            {headers}
        );
        fetch()
    } catch (error) {
        console.log(error);
    }
   }; 
   const handleImportant = async (id, currentImportant) => {
    try {
        const updatedImportant = !currentImportant; // toggle the value

        await axios.put(
            `http://localhost:1000/api/v2/update-imp-task/${id}`,
            { important: updatedImportant },
            { headers }
        );
        fetch()
        // Optionally update your UI or state here
    } catch (error) {
        console.log(error);
    }
};
 
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {data &&
                data.map((items, i) => (
                    <div className="flex flex-col justify-between bg-orange-400 rounded-sm p-4">
                        <div>
                            <h3 className="text-xl font-semibold">{items.title}</h3>
                            <p className="text-gray300 my-2">{items.desc}</p>

                        </div>
                        <div className="mt-4 w-full flex items-center">
                            <button className={`${items.completed === false ? "bg-red-500" : "bg-green-700"} p-2 rounded w-3/6`}
                            onClick ={()=>handleCompleteTask(items._id,items.completed)}
                            >

                              {items.completed === true ? "Completed" : "In Completed"}
                              
                            </button>
                            <div className="text-white p-2 w-3/6 text-2xl font-semibold flex justify-around">
                                <button onClick={()=>handleImportant(items._id,items.important)}>
                                    {items.important ?  <FaHeart className="text-red-500"/>:<CiHeart /> }
                                </button>
                                <button>
                                    <FaEdit />
                                </button>
                                <button>
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {home==="true" && (
                    <button className="flex flex-col justify-center items-center bg-orange-400 rounded-sm p-4 text-gray-300 hover:scale-105 hover:cursor-pointer transition-all duration-300" onClick={()=>setInputDiv("fixed")}>
            <MdAddCircle className="text-5xl"/>
            <h2 className="text-2xl mt-4">Add Tasks</h2>      
         </button>
        )}
         
        </div>
    );
};
 
export default Cards;