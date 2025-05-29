import { Mail, Settings, Table2, User, Wand2, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

const UserDetailsOptions = () => {
  const { tab } = useRouter().query;
  const { data: session } = useSession();
  const isUserStartup = session?.user?.role === "startup";
  const isUserMentor = session?.user?.role === "mentor";
  const isUserInvestor = session?.user?.role === "investor";

  return (
    <div className="rounded-md border py-2 border-border-light bg-white dark:border-border dark:bg-primary">
      <ul className="flex flex-row items-end mb-2 overflow-auto text-sm font-bold scroll-area uppercase text-gray-00 whitespace-nowrap dark:bg-primary dark:text-text-secondary lg:items-start lg:flex-col">
        <li className="w-full">
          <Link href="/settings">
            <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === undefined ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
              <span>
                <User className={`w-5 h-5 ${tab?.length === 1 && tab[0] === undefined ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
              </span>
              <span>
                PROFILE
              </span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/email-notification">
            <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === "email-notification" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
              <span>
                <Mail className={`w-5 h-5 ${tab?.length === 1 && tab[0] === "email-notification" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
              </span>
              <span>
                EMAIL NOTIFICATIONS
              </span>
            </div>
          </Link>
        </li>
        
        {/* Only show Manage Blogs option for users with the startup role */}
        {isUserStartup && (
          <li className="w-full">
            <Link href="/settings/manage-blogs">
              <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === "manage-blogs" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
                <span>
                  <Table2 className={`w-5 h-5 ${tab?.length === 1 && tab[0] === "manage-blogs" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
                </span>
                <span>
                  MANAGE IDEAS
                </span>
              </div>
            </Link>
          </li>
        )}
        
        {/* Add Verification option for startup, mentor, and investor users */}
        {(isUserStartup || isUserMentor || isUserInvestor) && (
          <li className="w-full">
            <Link href="/settings/verification">
              <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === "verification" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
                <span>
                  <BadgeCheck className={`w-5 h-5 ${tab?.length === 1 && tab[0] === "verification" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
                </span>
                <span>
                  GET VERIFIED
                </span>
              </div>
            </Link>
          </li>
        )}
        
        <li className="w-full">
          <Link href="/settings/account">
            <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === "account" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
              <span>
                <Settings className={`w-5 h-5 ${tab?.length === 1 && tab[0] === "account" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
              </span>
              <span>
                ACCOUNT
              </span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/pro">
            <div className={`cursor-pointer px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border flex flex-row items-center gap-2 ${tab?.length === 1 && tab[0] === "pro" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}>
              <span>
                <Wand2 className={`w-5 h-5 ${tab?.length === 1 && tab[0] === "pro" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`} />
              </span>
              <span>
                PRO SUBSCRIPTIONS
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDetailsOptions;
