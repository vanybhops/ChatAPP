import React, { useState } from "react";
import Popup from "./Popup";
export default function Login(props:any){
    const [popupState, setPopupState] = useState(false)
    const handleClick=async (event:React.MouseEvent)=>{
        event.preventDefault()
        await fetch(`login`,{
            "headers":{
                "accept": "application/json",
            },
            "method":"GET"
        }).then(async resp =>{
            const jsonData = await resp.json()
            localStorage.setItem("session", jsonData?.session)

            setPopupState(true)

            setTimeout(() => {
                props.setHandleLogin(true)
                location.reload()
            }, 2000);

            }
        ).catch((e)=>{
            alert(e+" error u dumb fuck")
        })
        
    }
    const handleUsernameBox= (event:any)=>{
        props.setUsername(event.target.value)
        localStorage.setItem("username", event.target.value)
    }
    return(
        <>
        {popupState?<Popup title="Login success!" description={"logged in as : "+props.username}/>:<></>}
        <form id="loginForm" className="grid p-10 bg-gray-600 rounded-xl gap-5">
            <div className="animateBorder grid gap-5">
                <label className=" text-gray-300" htmlFor="Username">Username <small className="text-gray-400">( max lenght is 16)</small></label>
                <input placeholder="username" maxLength={16} className="
                    bg-transparent
                  text-white " 
                type="text" id="username" 
                onChange={(e)=>handleUsernameBox(e)}/>
            </div>
            <button className=" bg-slate-500 hover:scale-110 transition-all ease-in-out duration-300 hover:bg-slate-900 focus:bg-slate-900 py-2 rounded-lg" onClick={e=>handleClick(e)}>Login</button>
        </form>
        </>
    )
}