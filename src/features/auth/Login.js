import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

const Login = () => {
	const userRef = useRef();
	const errRef = useRef();
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const navigate = useNavigate();

	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useDispatch();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [user, password]);

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			const userData = await login({ user, password }).unwrap();
			dispatch(setCredentials({ ...userData, user }));
			setUser('');
			setPassword('');
			navigate('/welcome');
		} catch (err) {
			if (!err?.originalStatus) {
				// isLoading: true until timeout occurs
				setErrMsg('сервер не отвечает');
			} else if (err.originalStatus === 400) {
				setErrMsg(err.data.message);
			} else if (err.originalStatus === 401) {
				setErrMsg(err.data.message);
			} else {
				setErrMsg('Login Failed');
			}
			errRef.current.focus();
		}
	};

	const handleUserInput = e => setUser(e.target.value);

	const handlePwdInput = e => setPassword(e.target.value);

	return isLoading ? (
		<h1>Loading...</h1>
	) : (
		<section className="login">
			<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
				{errMsg}
			</p>

			<h1>Employee Login</h1>

			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					id="username"
					ref={userRef}
					value={user}
					onChange={handleUserInput}
					autoComplete="off"
					required
				/>

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					onChange={handlePwdInput}
					value={password}
					required
				/>
				<button>Sign In</button>
			</form>
		</section>
	);
};
export default Login;
