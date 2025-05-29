// filepath: d:\VIT\Grower\src\pages\invest\[slug].tsx
import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Header } from "~/component";
import MetaTags from "~/component/MetaTags";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { articles, users } from "~/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";

interface InvestmentPageProps {
  article: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    cover_image: string | null;
    content: string;
    user: {
      id: string;
      name: string;
      username: string;
      image: string | null;
    };
  } | null;
}

const InvestmentPage: NextPage<InvestmentPageProps> = ({ article }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [equity, setEquity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the user is a verified investor
  const isVerifiedInvestor = session?.user.role === "investor" && session?.user.verified === true;

  // If article doesn't exist or user is not a verified investor, redirect to home
  if (!article || !isVerifiedInvestor) {
    if (!article) {
      toast.error("Idea not found");
    } else if (!isVerifiedInvestor) {
      toast.error("Only verified investors can invest in ideas");
    }
    
    // Use useEffect to avoid React hydration issues
    if (typeof window !== "undefined") {
      void router.push("/");
    }
    
    return null;
  }

  // Use our new investments API mutation
  const { mutateAsync: createInvestment } = api.investments.createInvestment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investmentAmount || !equity) {
      toast.error("Please provide both investment amount and equity percentage");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call our investments API to save the proposal
      await createInvestment({
        ideaId: article.id,
        founderId: article.user.id,
        amount: investmentAmount,
        equityPercentage: equity,
        message: message ?? undefined,
      });
      
      toast.success("Investment proposal submitted successfully!");
      
      // Redirect back to the idea page
      void router.push(`/u/@${article.user.username}/${article.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit investment proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaTags title={`Invest in ${article.title}`} />
      <Header />
      
      <main className="bg-white dark:bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link 
                href={`/u/@${article.user.username}/${article.slug}`}
                className="text-secondary hover:underline mb-2 inline-block"
              >
                ← Back to idea
              </Link>
              <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-text-secondary">
                Invest in {article.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <Image
                  src={article.user.image ?? "/static/default_user.avif"}
                  alt={article.user.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800 dark:text-text-secondary">
                    {article.user.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-text-primary">
                    @{article.user.username}
                  </p>
                </div>
              </div>
              
              {article.cover_image && (
                <div className="mb-6">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    width={800}
                    height={450}
                    className="rounded-lg w-full"
                  />
                </div>
              )}
              
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/10 dark:border-green-900/30">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-text-secondary">
                  About this investment opportunity
                </h2>
                <p className="text-gray-600 dark:text-text-primary">
                  {article.subtitle ?? "Submit your investment proposal for this startup idea. The startup founder will review your offer and get back to you if interested."}
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-primary-light border border-border-light dark:border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-text-secondary">
                Your Investment Proposal
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="investmentAmount" 
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-text-secondary"
                  >
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="text"
                      id="investmentAmount"
                      className="input-outline pl-8"
                      placeholder="10,000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="equity" 
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-text-secondary"
                  >
                    Equity Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="equity"
                      className="input-outline pr-8"
                      placeholder="5"
                      value={equity}
                      onChange={(e) => setEquity(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label 
                    htmlFor="message" 
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-text-secondary"
                  >
                    Message to Founder (Optional)
                  </label>
                  <textarea
                    id="message"
                    className="input-outline min-h-[120px]"
                    placeholder="Explain why you're interested in this idea and how you can help beyond just funding."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-end">
                  <Link 
                    href={`/u/@${article.user.username}/${article.slug}`}
                    className="btn-outline mr-4"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`btn-filled bg-green-600 hover:bg-green-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Investment Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // Check if user is logged in and is a verified investor
  if (!session || session.user.role !== "investor" || !session.user.verified) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    // Fetch the article/idea and its author information
    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      columns: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        cover_image: true,
        content: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        },
      },
    });

    if (!article) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
    };
  } catch (error) {
    console.error("Error fetching idea:", error);
    
    return {
      props: {
        article: null,
      },
    };
  }
};

export default InvestmentPage;