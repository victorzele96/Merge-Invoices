import React, { useState } from "react"
import { Navbar, Nav, Button } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

export default function MenuNavbar() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const style = {
      color: "white"
    }

    async function handleLogout() {
      setError("")

      try {
        await logout()
        history.push("/login")
      } catch {
        setError("Failed to log out")
      }
    }

    return(
        <>
        <Navbar bg="dark" variant="dark" style={{ position: "fixed" , top: 0, "width": "100%"}}>
            <Navbar.Brand className="" href="/">Home</Navbar.Brand>
            <Navbar.Toggle />
            <Nav className="mr-auto">
                
                <Nav.Link style={style} href={currentUser ? "/" : "/login"}>{currentUser ? "Dashboard" : "Login"}</Nav.Link>
                <Nav.Link style={style} href={currentUser ? "/document" : "/signup"}>{currentUser ? "Documents" : "Signup"}</Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={style}>
                Signed in as: <strong style={{ color: "lightblue" }}>{currentUser ? currentUser.email : "Guest"}</strong>
                {/* {error && <Alert variant="danger">{error}</Alert>} */}
                <Button className="ml-4" variant="dark" onClick={handleLogout} >
                    {currentUser ? "Log Out" : ""}
                </Button>
            </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
        </>
    )
}