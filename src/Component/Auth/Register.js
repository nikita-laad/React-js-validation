import {useRef, useState, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from '../../Api/Axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%]).{8,24}$/;
const REGISTER_URL = '/signIn'
const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] =useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    }, []);

    useEffect(()=>{
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    },[user]);

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    },[pwd, matchPwd]);

    useEffect(()=>{
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if(!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await Axios.post(REGISTER_URL, JSON.stringify({user, pwd}),{
                headers: {'Content-Type':'application/json'},
                withCredentials: true
            });
            setSuccess(true);
            
        } catch (error) {
            if(!error?.response){
                setErrMsg('No server Response');
            }else if(error.response?.status === 409){
                setErrMsg('user taken')
            }else{
                setErrMsg('REgister FAiled')
            }
            errRef.current.focus();
            
        }
    }

  return (
    <div className='py-5 bg-primary'>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-lg-6 col-md-6 col-12'>
                   <div className='bg-white p-3'>
                    {success ? ( 
                        <section>
                            <h1>success</h1>
                            <p>
                                <a href='#'>Sign In</a>
                            </p>
                        </section>
                        ) : (
                            <section>
                            <div ref={errRef} className={errMsg ? "alert alert-danger p-2 ":"d-none p-2"}  role="alert" aria-live='assertive'>
                                {errMsg}
                            </div>
                            <h1>Register</h1>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor="username" className="form-label">Username
                                        <span className={validName ? "text-success" : "d-none"}>
                                            <FontAwesomeIcon icon={faCheck} className='ms-1'/>
                                        </span>
                                        <span className={validName || !user ? "d-none" : "text-danger"}>
                                            <FontAwesomeIcon icon={faTimes} className='ms-1'/>
                                        </span>
                                    </label>
                                    <input 
                                        className="form-control"
                                        type='text' 
                                        id='username' 
                                        ref={userRef} 
                                        autoComplete='off'
                                        onChange={(e)=>setUser(e.target.value)} 
                                        required 
                                        aria-invalid={validName ? "false" : "true"} 
                                        aria-describedby='uidnote' 
                                        onFocus={()=>setUserFocus(true)}
                                        onBlur={()=>setUserFocus(false)}
                                    />
                                    <p id='uidnote' className={userFocus && user && !validName ? "d-block text-danger mt-2 mb-0" : "d-none mt-2 mb-0"}>
                                        <FontAwesomeIcon icon={faInfoCircle} className='me-2' />
                                        4 to 24 characters. <br/>
                                        Must begin with a letter.<br/>
                                        Letters, numbers, underscors, hyphens allowed.
                                    </p>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='password' className="form-label">
                                        Password
                                        <span className={validPwd ? "text-success" : 'd-none'}>
                                            <FontAwesomeIcon icon={faCheck} className='ms-1'/>
                                        </span>
                                        <span className={validPwd || !pwd ? "d-none": "text-danger"}>
                                            <FontAwesomeIcon icon={faTimes} className='ms-1'/>
                                        </span>
                                    </label>
                                    <input 
                                        className="form-control"
                                        type='password' 
                                        id='password' 
                                        onChange={(e)=>setPwd(e.target.value)}
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby='pwdnote'
                                        onFocus={()=>setPwdFocus(true)}
                                        onBlur={()=>setPwdFocus(false)}
                                    />
                                    <p id='pwdnote' className={pwdFocus && !validPwd ? "d-block text-danger mt-2 mb-0" : "d-none mt-2 mb-0"}>
                                        <FontAwesomeIcon icon={faInfoCircle} className='me-2'/>
                                        8 to 24 characters. <br/>
                                        Must include uppercase and lowercase letter, a number and a special character. <br/>
                                        Allowed special character: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
                                    </p>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='confirm_pwd' className="form-label">
                                        Confirm Password
                                        <span className={validMatch && matchPwd ? "text-success" : "d-none"}>
                                            <FontAwesomeIcon icon={faCheck}  className='ms-1'/>
                                        </span>
                                        <span className={validMatch || !matchPwd ? "d-none" : "text-danger"}>
                                            <FontAwesomeIcon icon={faTimes}  className='ms-1'/>
                                        </span>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e)=>setMatchPwd(e.target.value)}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby='confirmnote'
                                        onFocus={()=>setMatchFocus(true)}
                                        onBlur={()=>setMatchFocus(false)}
                                    />
                                    <p id='confirmnote' className={matchFocus && !validMatch ? "d-block text-danger mt-2 mb-0" : "d-none mt-2 mb-0"}>
                                        <FontAwesomeIcon icon={faInfoCircle}  className='ms-2'/>
                                        Must matcg the first password input field
                                    </p>
                                </div>
                                <button className='btn btn-primary mb-2' disabled={!validName || !validPwd || !validMatch ? true :  false}>Sign Up</button>
                            </form>
                            <p className='mb-0'>
                                Already registered?<br/>
                                <span className='line'>
                                    <a href='#'>Sign In</a>
                                </span>
                            </p>
                        </section>
                        )}
                   </div>
                </div>
            </div>
           
        </div>
    </div>
    
  )
}

export default Register
