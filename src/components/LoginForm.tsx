
function LoginForm() {

    function submit(ev: FormData) {
		console.log(ev.get("username"));
	}

    return (
        <div>
		<form action={submit}>
			<label htmlFor="username">Username:</label>
			<input type="text" id="username" name="username" required />

			<label htmlFor="password">Password:</label>
			<input type="password" id="password" name="password" required />

			<button type="submit">Login</button>
		</form>
        </div>
	);
}

export default LoginForm