import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MetaTags from "~/component/MetaTags";
import { Google, Logo } from "~/svgs";
import { ArrowUpRight, BarChart3, ChevronRight, Lightbulb, Rocket, TrendingUp, Users } from "lucide-react";

const Onboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      void router.push("/");
    }
  }, [session, status, router]);

  const handleGoogleSignIn = () => {
    // For signup: validate role is selected and include it in state
    // For login: just proceed normally
    if (isSignUp) {
      if (!selectedRole) return; // Extra validation
      
      void signIn("google", {
        callbackUrl: "/",
        state: JSON.stringify({ role: selectedRole })
      });
    } else {
      void signIn("google", {
        callbackUrl: "/"
      });
    }
  };

  // Determine if the sign-up button should be disabled
  const isSignUpButtonDisabled = isSignUp && !selectedRole;

  const features = [
    {
      icon: <Rocket className="h-5 w-5 text-purple-600" />,
      title: "Accelerate Growth",
      description: "Connect with resources to scale your startup faster"
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Expert Mentorship",
      description: "Gain insights from industry veterans and advisors"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-green-600" />,
      title: "Track Progress",
      description: "Visualize your startup's journey with powerful analytics"
    }
  ];

  return (
    <>
      <MetaTags
        title={isSignUp ? "Join Grower - Your Startup Growth Platform" : "Sign in to Grower"}
        description="Accelerate your startup's growth with Grower. Connect with mentors, attract investors, and scale your business."
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-black">
        {/* Hero Header */}
        <header className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(45%_25%_at_50%_50%,rgba(56,189,248,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(45%_25%_at_50%_50%,rgba(56,189,248,0.1),rgba(0,0,0,0))]"></div>
          
          <div className="container mx-auto flex items-center justify-between p-4 relative z-10">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-9 fill-secondary" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:block">
                Home
              </Link>
              <Link href="/explore" className="hidden text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:block">
                Explore
              </Link>
              <Link href="#" className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700">
                About us <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Form Section */}
              <div className="flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mx-auto w-full max-w-md">
                  {/* Toggle between Sign Up and Log In */}
                  <div className="mb-8 flex overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-1 text-base font-medium dark:border-gray-800 dark:bg-gray-800">
                    <button 
                      onClick={() => setIsSignUp(true)}
                      className={`flex-1 rounded-md px-5 py-2 transition-all ${
                        isSignUp 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      Sign Up
                    </button>
                    <button 
                      onClick={() => setIsSignUp(false)}
                      className={`flex-1 rounded-md px-5 py-2 transition-all ${
                        !isSignUp 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      Log In
                    </button>
                  </div>
                  
                  <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {isSignUp ? "Join our community" : "Welcome back"}
                  </h1>
                  
                  <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                    {isSignUp 
                      ? "Create an account to start your growth journey" 
                      : "Sign in to continue where you left off"}
                  </p>
                  
                  {isSignUp && (
                    <div className="mb-8">
                      <h2 className="mb-4 text-center text-lg font-medium text-gray-900 dark:text-white">I am a...</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <RoleOption 
                          role="startup" 
                          icon={<Rocket size={24} />}
                          label="Startup" 
                          description="Building a company"
                          isSelected={selectedRole === "startup"} 
                          onClick={() => setSelectedRole("startup")}
                        />
                        <RoleOption 
                          role="mentor" 
                          icon={<Lightbulb size={24} />}
                          label="Mentor" 
                          description="Providing guidance"
                          isSelected={selectedRole === "mentor"} 
                          onClick={() => setSelectedRole("mentor")}
                        />
                        <RoleOption 
                          role="investor" 
                          icon={<TrendingUp size={24} />}
                          label="Investor" 
                          description="Funding startups"
                          isSelected={selectedRole === "investor"} 
                          onClick={() => setSelectedRole("investor")}
                        />
                      </div>
                      
                      {!selectedRole && (
                        <p className="mt-2 text-center text-sm text-orange-500 dark:text-orange-400">
                          Please select a role to continue
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={isSignUpButtonDisabled}
                      className={`flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 ${
                        isSignUpButtonDisabled 
                          ? "cursor-not-allowed opacity-60" 
                          : ""
                      }`}
                    >
                      <Google className="h-5 w-5 fill-gray-700 dark:fill-white" />
                      <span>{isSignUp ? "Continue with Google" : "Sign in with Google"}</span>
                    </button>
                    
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {isSignUp 
                        ? "Already have an account? " 
                        : "Don't have an account? "}
                      <button 
                        onClick={() => setIsSignUp(!isSignUp)} 
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        {isSignUp ? "Sign in" : "Sign up"}
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col justify-center">
                <div className="max-w-lg">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                    Grow your startup with the right connections
                  </h2>
                  <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                    Grower is a platform designed to accelerate startup growth through meaningful connections, expert mentorship, and access to resources.
                  </p>
                  
                  <div className="space-y-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
                    <div className="flex items-start gap-4">
                      <Image
                        src="https://utfs.io/f/53f08a4c-c6a2-42f0-9fa3-ae206c80fdb9-fvu4vo.jpg"
                        width={50}
                        height={50}
                        alt="Success story profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="mb-2 text-lg italic leading-relaxed text-gray-700 dark:text-gray-300">
                          "Grower helped us connect with the right mentors at the perfect time in our journey. Six months later, we secured our Series A funding!"
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Caffeinated Coders</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">YC Batch '24</p>
                          </div>
                          <Link href="#success-stories" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            More stories <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedRole === "startup" && (
                    <div className="mt-12 rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
                      <h3 className="mb-4 text-xl font-bold text-green-900 dark:text-green-300">Startup Blog</h3>
                      <p className="text-gray-600 dark:text-gray-400">Read the latest articles and insights for startups.</p>
                      <Link href="/blog/startup" className="mt-4 inline-block text-green-600 hover:text-green-500 dark:text-green-400">
                        Go to Startup Blog
                      </Link>
                    </div>
                  )}

                  {selectedRole === "mentor" && (
                    <div className="mt-12 rounded-xl bg-yellow-50 p-6 dark:bg-yellow-900/20">
                      <h3 className="mb-4 text-xl font-bold text-yellow-900 dark:text-yellow-300">Mentor Blog</h3>
                      <p className="text-gray-600 dark:text-gray-400">Read the latest articles and insights for mentors.</p>
                      <Link href="/blog/mentor" className="mt-4 inline-block text-yellow-600 hover:text-yellow-500 dark:text-yellow-400">
                        Go to Mentor Blog
                      </Link>
                    </div>
                  )}

                  {selectedRole === "investor" && (
                    <div className="mt-12 rounded-xl bg-red-50 p-6 dark:bg-red-900/20">
                      <h3 className="mb-4 text-xl font-bold text-red-900 dark:text-red-300">Investor Blog</h3>
                      <p className="text-gray-600 dark:text-gray-400">Read the latest articles and insights for investors.</p>
                      <Link href="/blog/investor" className="mt-4 inline-block text-red-600 hover:text-red-500 dark:text-red-400">
                        Go to Investor Blog
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Role selection component
interface RoleOptionProps {
  role: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const RoleOption = ({ role, icon, label, description, isSelected, onClick }: RoleOptionProps) => {
  return (
    <div 
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-700
        ${isSelected 
          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-900/30 dark:ring-blue-500/20' 
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
        }
      `}
    >
      <div className={`mb-3 rounded-full bg-gray-100 p-2 transition-colors ${
        isSelected ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {icon}
      </div>
      <div className={`font-medium mb-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
        {label}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </div>
    </div>
  );
};

export default Onboard;
