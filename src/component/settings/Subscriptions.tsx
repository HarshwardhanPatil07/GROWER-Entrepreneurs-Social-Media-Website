import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LuCheck } from "react-icons/lu";
import { LogonoText } from "~/svgs";
import { api } from "~/utils/api";

const Subscription = () => {
  const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
  const { data: session } = useSession();
  const [showBenefits, setShowBenefits] = useState(false);

  const { push } = useRouter();

  const handleUpgrade = async () => {
    const { checkoutUrl } = await createCheckoutSession();
    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  }

  return (<div>
    <header className="pb-4 border-b border-border-light dark:border-border">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
        Subscription
      </h1>
    </header>

    <section className="py-4">
      {session?.user.stripeSubscriptionStatus === "active" ? (
        <div className="py-4">
          <h1 className="text-2xl mb-4 font-semibold text-gray-700 dark:text-text-secondary">
            You are already subscribed to Grower Pro
          </h1>

          <button className="btn-filled">Manage Plans</button>
        </div>
      ) : (
        <>
          <div className="anouncement flex items-center gap-4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
            <div className="flex-1">
              <header className="mb-2 flex gap-2 items-center">
                <span className="">
                  <LogonoText className="h-6 w-6 stroke-gray-700 dark:stroke-text-secondary" />
                </span>
                <p className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  Grower
                  <span className="px-2 rounded-md bg-blue-500 text-base font-semibold text-white">PRO</span>
                </p>
              </header>

              <p className="text-sm text-gray-700 dark:text-text-secondary sm:text-base">
                Level up your experience with Grower Pro with powerful AI
                and premium features.
              </p>
              <span className="text-sm text-blue-300">
                  Plan will activate within 24 hrs of payment confirmation.
                </span>
            </div>

            <div className="flex gap-2">
              <button
                role="button"
                onClick={() => void handleUpgrade()}
                aria-label="upgrade plan"
                className="btn-tertiary w-fit"
              >
                Upgrade now
              </button>
              <button
                role="button"
                onClick={() => setShowBenefits(true)}
                aria-label="learn more on Grower pro"
                className="btn-outline w-fit text-sm text-white"
              >
                Learn more
              </button>
            </div>
          </div>

          {/* Benefits Modal */}
          {showBenefits && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative w-full max-w-2xl rounded-lg bg-white p-8 dark:bg-primary-light">
                <button 
                  onClick={() => setShowBenefits(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <IoCloseOutline size={24} />
                </button>
                
                <div className="mb-6 flex items-center gap-3">
                  <LogonoText className="h-8 w-8 stroke-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Grower <span className="text-blue-500">PRO</span> Benefits
                  </h2>
                </div>
                
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Premium Features
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>AI Trend Prediction</strong> - Get future trend analysis and market potential insights
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Premium Profile Badge</strong> - Stand out with a PRO badge on your profile
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Priority Support</strong> - Get faster responses to your queries
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Advanced Analytics</strong> - Detailed insights about your content performance
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Exclusive Benefits
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Featured Placement</strong> - Higher visibility in search and recommendation feeds
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Network Access</strong> - Connect with premium investors and mentors
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Private Communities</strong> - Access to exclusive pro-only discussions and groups
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">
                          <LuCheck size={16} />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Early Access</strong> - Be the first to try new Grower features
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center gap-4">
                  <button 
                    onClick={() => void handleUpgrade()}
                    className="btn-tertiary px-8 py-2"
                  >
                    Upgrade to PRO
                  </button>
                  <button 
                    onClick={() => setShowBenefits(false)}
                    className="btn-outline px-8 py-2"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  </div>)
}

export default Subscription;