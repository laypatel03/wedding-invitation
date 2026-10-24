'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginPage() {
    const [state, action, pending] = useActionState(login, null);

    return (
        <main className="login">
            <form className="login-card" action={action}>
                <div className="eyebrow">Bhavi &amp; Priyanka</div>
                <h1>RSVPs</h1>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password"
                    required autoFocus />
                {state?.error && <p className="login-error" role="alert">{state.error}</p>}
                <button className="btn" type="submit" disabled={pending}>
                    {pending ? 'Checking…' : 'Sign in'}
                </button>
            </form>
        </main>
    );
}
