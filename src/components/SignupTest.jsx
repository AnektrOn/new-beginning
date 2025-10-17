import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const SignupTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleTestSignup = async () => {
    setLoading(true);
    setResult('');
    try {
      console.log('Testing signup with:', { email, password });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        setResult(`Signup successful! User is immediately signed in. User ID: ${data.user.id}`);
        toast.success('Test signup successful - user signed in!');
      } else if (data.user && !data.session) {
        setResult(`Signup successful! User created but needs email verification. User ID: ${data.user.id}`);
        toast.success('Test signup successful - check email!');
      } else {
        setResult('Signup response was unexpected');
        toast.error('Unexpected signup response');
      }
    } catch (error) {
      setResult(`Error during test signup: ${error.message}`);
      toast.error(`Test signup failed: ${error.message}`);
      console.error('Test signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Direct Supabase Signup Test</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="test@example.com"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="test-password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="test-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="password"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleTestSignup}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Test Direct Signup'}
        </button>
      </div>
      {result && (
        <div className="mt-4 p-3 bg-white border rounded">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default SignupTest;