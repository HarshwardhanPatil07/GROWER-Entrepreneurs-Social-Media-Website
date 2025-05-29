import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, getSession } from "next-auth/react";

const AuthDebug = () => {
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const state = searchParams.get("state");
    const code = searchParams.get("code");
    
    setDebugInfo({
      error,
      errorDescription, 
      state,
      code,
      currentUrl: window.location.href,
      timestamp: new Date().toISOString(),
    });    // Also check session
    getSession().then((session) => {
      setDebugInfo((prev: any) => ({ ...prev, session }));
    });
  }, [searchParams]);

  const handleTestLogin = () => {
    signIn("google", { 
      callbackUrl: "/",
      redirect: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current URL Parameters</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <ul className="space-y-2">
            <li>Next Auth URL: {process.env.NEXTAUTH_URL || "Not set"}</li>
            <li>Vercel URL: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not set"}</li>
            <li>Google Client ID: {process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set"}</li>
            <li>Google Client Secret: {process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set"}</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <button 
            onClick={handleTestLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Google Login
          </button>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-semibold text-yellow-800">Common Issues:</h3>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            <li>• Check Google OAuth callback URLs match exactly</li>
            <li>• Verify domain restrictions in Google API key</li>
            <li>• Ensure NEXTAUTH_URL matches your domain</li>
            <li>• Check if Google APIs are enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
