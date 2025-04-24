export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/auth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

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

export async function registerUser(
  username: string,
  firstname: string,
  lastname: string,
  password: string,
  dateOfBirth: string
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/identity/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          firstname,
          lastname,
          password,
          dateOfBirth,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    return await res.json();
  } catch (err) {
    console.error('Register API failed:', err);
    throw err;
  }
}
