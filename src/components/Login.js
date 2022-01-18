import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiAccountOutline, mdiLockOutline, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js';
import UserContext from '../Context/User';
import '../login.css'

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState(false)
    const [showIcon, setShowIcon] = useState(true)
    const [disable, setDisable] = useState(true);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (email !== "" && password !== "") {
            setDisable(false);
        }
        else {
            setDisable(true);
        }
    }, [email, password])

    const [values, setValues] = useState({
        showPassword: false,
    });
    const handleShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
        setShowIcon(!showIcon)
    }
    const HandleLogin = async () => {
        setLoader(true);
        const data = {
            email: email,
            password: password
        }
        axios.post("https://iastestingapi.herokuapp.com/api/login", { ...data })
            .then(async (res) => {
                if (res.data.user.userType === 'admin') {
                    localStorage.setItem('admin', JSON.stringify(res.data))
                    setUser(res.data)
                    setValidation(false)
                    console.log(res.data)
                }
                else {
                    setValidation(true)
                }
                setLoader(false)

            })
            .catch(async (err) => {
                console.log(err)
                try {
                    if (err.response.status === 403 || err.response.status === 404) {
                        setValidation(true)
                    }
                }
                catch (err) {
                    console.log(err)
                }
                setLoader(false)
            })
    }
    return (
        <>
            <div class='grid-container'>
                <div class='col2'>
                    <div class='register-form'>
                        <p className='heading'>IAS</p>
                        <p className='subHeading'>Log In</p>
                        <div className='inputWrap'>
                            <Icon path={mdiAccountOutline} size={1} />
                            <input className='input' type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder='Email' />
                        </div>
                        <div className='inputWrap'>
                            <Icon path={mdiLockOutline} size={1} />
                            <input className='input' type={values.showPassword ? 'text' : 'password'} name='password' onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
                            {
                                showIcon ?
                                    <Icon path={mdiEyeOffOutline}
                                        size={1}
                                        style={{ color: 'gray' }}
                                        onClick={handleShowPassword}
                                    />
                                    : <Icon
                                        path={mdiEyeOutline}
                                        size={1}
                                        style={{ color: 'gray' }}
                                        onClick={handleShowPassword}
                                    />
                            }

                        </div>
                        <div className={`${validation ? 'passMatchError' : 'noError'}`}>
                            <p className='errorText'>Incorrect email or password</p>
                        </div>
                        <div className='submitButton' onClick={HandleLogin}>Log In</div>
                    </div>
                </div>
            </div>
            {
                loader ?
                    <div className='loaderContainer'>
                        <ProgressSpinner />
                    </div>
                    :
                    ''
            }
        </>
    );
}
