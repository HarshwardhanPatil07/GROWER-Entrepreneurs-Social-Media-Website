// filepath: d:\VIT\Grower\src\pages\investments\index.tsx
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { Header } from "~/component";
import MetaTags from "~/component/MetaTags";
import { api } from "~/utils/api";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { DollarSign, Check } from "lucide-react";

const InvestmentsPage: NextPage = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/";
    },
  });
  
  const [activeTab, setActiveTab] = useState<"sent" | "received">(
    session?.user.role === "investor" ? "sent" : "received"
  );
  
  const [statusFilter, setStatusFilter] = useState<"pending" | "accepted" | "declined" | "completed" | undefined>(
    "pending"
  );
  
  // For investors: get proposals they've sent
  const { 
    data: investorProposals,
    isLoading: investorLoading
  } = api.investments.getInvestorProposals.useQuery(
    { status: statusFilter },
    { 
      enabled: session?.user.role === "investor" && activeTab === "sent",
      refetchOnWindowFocus: false 
    }
  );
  
  // For startups: get proposals they've received
  const { 
    data: founderProposals,
    isLoading: founderLoading,
    refetch: refetchFounderProposals
  } = api.investments.getFounderProposals.useQuery(
    { status: statusFilter },
    { 
      enabled: session?.user.role === "startup" && activeTab === "received",
      refetchOnWindowFocus: false 
    }
  );
  
  const { mutate: respondToProposal } = api.investments.respondToProposal.useMutation({
    onSuccess: () => {
      void refetchFounderProposals();
    }
  });
  
  // Check if user is a verified investor or a startup
  const isVerifiedInvestor = session?.user.role === "investor" && session?.user.verified === true;
  const isStartup = session?.user.role === "startup";
  
  const handleRespond = (investmentId: string, status: "accepted" | "declined") => {
    respondToProposal({
      investmentId,
      status,
    }, {
      onSuccess: () => {
        toast.success(`Investment proposal ${status === "accepted" ? "accepted" : "declined"} successfully`);
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to respond to investment proposal");
      }
    });
  };
  
  // Loading state while checking authentication
  if (status === "loading") {
    return (
      <>
        <MetaTags title="Investments" />
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 h-8 w-72 mb-8"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 h-64 w-full max-w-4xl"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Investment Proposals" />
      <Header />
      
      <main className="bg-light-bg dark:bg-primary min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
              <DollarSign className="h-8 w-8 text-secondary mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-text-secondary">
                Investment Proposals
              </h1>
            </div>
            
            {/* Role-based tabs */}
            {(isVerifiedInvestor || isStartup) && (
              <div className="mb-8">
                <div className="border-b border-border-light dark:border-border">
                  <nav className="flex space-x-8" aria-label="Tabs">
                    {isVerifiedInvestor && (
                      <button
                        onClick={() => setActiveTab("sent")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "sent"
                            ? "border-secondary text-secondary"
                            : "border-transparent text-gray-500 hover:border-gray-300 dark:text-text-primary"
                        }`}
                      >
                        Proposals Sent
                      </button>
                    )}
                    
                    {isStartup && (
                      <button
                        onClick={() => setActiveTab("received")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "received"
                            ? "border-secondary text-secondary" 
                            : "border-transparent text-gray-500 hover:border-gray-300 dark:text-text-primary"
                        }`}
                      >
                        Proposals Received
                      </button>
                    )}
                  </nav>
                </div>
              </div>
            )}
            
            {/* Status filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    statusFilter === "pending"
                      ? "bg-secondary text-white"
                      : "bg-white dark:bg-primary-light text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-border"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("accepted")}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    statusFilter === "accepted"
                      ? "bg-secondary text-white"
                      : "bg-white dark:bg-primary-light text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-border"
                  }`}
                >
                  Accepted
                </button>
                <button
                  onClick={() => setStatusFilter("declined")}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    statusFilter === "declined"
                      ? "bg-secondary text-white"
                      : "bg-white dark:bg-primary-light text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-border"
                  }`}
                >
                  Declined
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    statusFilter === "completed"
                      ? "bg-secondary text-white"
                      : "bg-white dark:bg-primary-light text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-border"
                  }`}
                >
                  Completed
                </button>
                
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter(undefined)}
                    className="px-4 py-2 text-sm rounded-md bg-white dark:bg-primary-light text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-border font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
            
            {/* Content based on active tab */}
            <div>
              {/* For investors: sent proposals */}
              {activeTab === "sent" && (
                <div>
                  {investorLoading ? (
                    <div className="p-6 text-center">
                      <div className="animate-pulse text-gray-500 dark:text-text-primary">Loading proposals...</div>
                    </div>
                  ) : investorProposals?.proposals && investorProposals.proposals.length > 0 ? (
                    <div className="space-y-4">
                      {investorProposals.proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-white dark:bg-primary-light border border-border-light dark:border-border rounded-lg overflow-hidden shadow-sm">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-16">
                                <Image
                                  src={proposal.idea.user.image ?? "/static/default_user.avif"}
                                  alt={proposal.idea.user.name}
                                  width={60}
                                  height={60}
                                  className="rounded-full"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Link href={`/u/@${proposal.idea.user.username}/${proposal.idea.slug}`} className="text-xl font-semibold text-gray-800 dark:text-text-secondary hover:underline">
                                    {proposal.idea.title}
                                  </Link>
                                  
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    proposal.status === "pending" 
                                      ? "bg-yellow-100 text-yellow-800"
                                      : proposal.status === "accepted" 
                                        ? "bg-green-100 text-green-800" 
                                        : proposal.status === "declined"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="mb-3 text-sm text-gray-600 dark:text-text-primary">
                                  <span className="font-medium">Founder:</span> {proposal.idea.user.name} (@{proposal.idea.user.username})
                                </div>
                                
                                <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-text-primary mb-3">
                                  <div>
                                    <span className="font-medium">Amount:</span> <span className="text-green-600 dark:text-green-400">${parseFloat(proposal.amount as unknown as string).toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Equity:</span> <span className="text-blue-600 dark:text-blue-400">{parseFloat(proposal.equityPercentage as unknown as string)}%</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Submitted:</span> {new Date(proposal.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                {proposal.message && (
                                  <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-md text-sm dark:bg-primary/80 dark:border-border">
                                    <span className="block font-medium text-gray-700 dark:text-text-secondary mb-1">Your message:</span>
                                    <p className="text-gray-600 dark:text-text-primary">{proposal.message}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white dark:bg-primary-light border border-border-light dark:border-border rounded-lg">
                      <p className="text-gray-500 dark:text-text-primary mb-4">You haven't sent any investment proposals yet.</p>
                      <Link href="/" className="btn-filled">
                        Browse Startup Ideas
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* For startups: received proposals */}
              {activeTab === "received" && (
                <div>
                  {founderLoading ? (
                    <div className="p-6 text-center">
                      <div className="animate-pulse text-gray-500 dark:text-text-primary">Loading proposals...</div>
                    </div>
                  ) : founderProposals?.proposals && founderProposals.proposals.length > 0 ? (
                    <div className="space-y-4">
                      {founderProposals.proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-white dark:bg-primary-light border border-border-light dark:border-border rounded-lg overflow-hidden shadow-sm">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-16">
                                <Image
                                  src={proposal.investor.image ?? "/static/default_user.avif"}
                                  alt={proposal.investor.name}
                                  width={60}
                                  height={60}
                                  className="rounded-full"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Link href={`/u/@${session?.user.username}/${proposal.idea.slug}`} className="text-xl font-semibold text-gray-800 dark:text-text-secondary hover:underline">
                                    {proposal.idea.title}
                                  </Link>
                                  
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    proposal.status === "pending" 
                                      ? "bg-yellow-100 text-yellow-800"
                                      : proposal.status === "accepted" 
                                        ? "bg-green-100 text-green-800" 
                                        : proposal.status === "declined"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="mb-3 text-sm text-gray-600 dark:text-text-primary">
                                  <span className="font-medium">Investor:</span> {proposal.investor.name} (@{proposal.investor.username})
                                </div>
                                
                                <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-text-primary mb-3">
                                  <div>
                                    <span className="font-medium">Amount:</span> <span className="text-green-600 dark:text-green-400">${parseFloat(proposal.amount as unknown as string).toLocaleString()}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Equity:</span> <span className="text-blue-600 dark:text-blue-400">{parseFloat(proposal.equityPercentage as unknown as string)}%</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Received:</span> {new Date(proposal.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                {proposal.message && (
                                  <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-md text-sm dark:bg-primary/80 dark:border-border">
                                    <span className="block font-medium text-gray-700 dark:text-text-secondary mb-1">Message from investor:</span>
                                    <p className="text-gray-600 dark:text-text-primary">{proposal.message}</p>
                                  </div>
                                )}
                                
                                {proposal.status === "pending" && (
                                  <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                      onClick={() => handleRespond(proposal.id, "accepted")}
                                      className="inline-flex items-center px-4 py-2 bg-secondary hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Accept Proposal
                                    </button>
                                    <button
                                      onClick={() => handleRespond(proposal.id, "declined")}
                                      className="px-4 py-2 bg-white dark:bg-primary-light border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
                                    >
                                      Decline Proposal
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-white dark:bg-primary-light border border-border-light dark:border-border rounded-lg">
                      <p className="text-gray-500 dark:text-text-primary">You haven't received any investment proposals yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default InvestmentsPage;