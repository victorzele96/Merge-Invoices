import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import db from "../firebase"

export default function Signup() {
  const businessIdRef = useRef()
  const businessNameRef = useRef()
  const emailRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const phoneRef = useRef()

  const cpaEmailRef = useRef()
  const cpaFirstNameRef = useRef()
  const cpaLastNameRef = useRef()
  const cpaPhoneRef = useRef()

  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value) //businessIdRef.current.value, add to registration more fields.
      onSuccessRegistration()
      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  const onSuccessRegistration = () => {
    
    let userRef = db.collection('users');
    let user = {  first_name:       firstNameRef.current.value, 
                  last_name:        lastNameRef.current.value, 
                  businessID:       businessIdRef.current.value, 
                  business_name:    businessNameRef.current.value, 
                  email:            emailRef.current.value, 
                  password:         passwordRef.current.value, 
                  phone:            phoneRef.current.value,
                  cpa_first_name: cpaFirstNameRef.current.value, 
                  cpa_last_name:  cpaLastNameRef.current.value, 
                  cpa_email:      cpaEmailRef.current.value, 
                  cpa_phone:      cpaPhoneRef.current.value }

    console.log(user);
    userRef.add(user)
        .then(function() {
            console.log("User was successfully registered!");
        })
}


  return (
    <>
      <Card bg="dark" variant="dark" style={{opacity:  '80%'}}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
              <Form.Group id="businessId">
                <Form.Control placeholder="Business ID" type="text" ref={businessIdRef} required />
              </Form.Group>

              <Form.Group id="businessName">
                <Form.Control placeholder="Business Name" type="text" ref={businessNameRef} required />
              </Form.Group>

              <Form.Group id="firstName">
                <Form.Control placeholder="First Name" type="text" ref={firstNameRef} required />
              </Form.Group>

              <Form.Group id="lastName">
                <Form.Control placeholder="Last Name" type="text" ref={lastNameRef} required />
              </Form.Group>

              <Form.Group id="email">
                <Form.Control placeholder="Email" type="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password">
                <Form.Control placeholder="password" type="password" ref={passwordRef} required />
              </Form.Group>

              <Form.Group id="password-confirm">
                <Form.Control placeholder="Password Confirmation" type="password" ref={passwordConfirmRef} required />
              </Form.Group>

              <Form.Group id="phone">
                <Form.Control placeholder="Phone Number" type="tel" ref={phoneRef} required />
              </Form.Group>

              <Form.Group id="cpaEmail">
                <Form.Control placeholder="CPA Email" type="email" ref={cpaEmailRef} required />
              </Form.Group>

              <Form.Group id="cpaFirstName">
                <Form.Control placeholder="CPA First Name" type="text" ref={cpaFirstNameRef} required />
              </Form.Group>

              <Form.Group id="cpaLastName">
                <Form.Control placeholder="CPA Last Name" type="text" ref={cpaLastNameRef} required />
              </Form.Group>

              <Form.Group id="cpaPhone">
                <Form.Control placeholder="CPA Phone Number" type="tel" ref={cpaPhoneRef} required />
              </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
        <div className="w-100 text-center mt-2" style={{color:  'White'}}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Card>
    </>
  )
}
