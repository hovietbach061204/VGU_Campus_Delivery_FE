export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch('http://localhost:8080/identity/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    return await res.json();
  } catch (err) {
    console.error('Login API failed:', err);
    throw err;
  }
}
