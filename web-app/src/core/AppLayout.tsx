import { Outlet } from "react-router";
import Navbar from "./NavBar";

export default function AppLayout() {
    return(
        <>
            <Navbar/>
            <div>
                <Outlet/>
            </div>
        </>
    )
}