import { Newspaper } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { forwardRef } from "react";
import { profileDropdownList } from "~/utils/constants";
import { VerificationBadge } from "~/component/miniComponent";

const ProfileDropdown = forwardRef<
  HTMLDivElement,
  {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
  }
>(({ setOpened, setSearchOpen = () => { }, user }, ref) => {
  const router = useRouter();
  const isUserStartup = user?.user?.role === "startup";

  // Proper logout function using signOut from next-auth
  const handleLogout = () => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-md border border-border-light bg-white shadow-lg dark:border-border dark:bg-primary sm:w-72"
    >
      <Link
        href={`/u/@${user?.user?.username}`}
        onClick={() => setOpened(false)}
      >
        <div className="flex cursor-pointer items-center gap-2 border-b border-border-light px-4 py-3 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light">
          <Image
            src={user?.user.image}
            alt={user?.user.name ?? "user"}
            width={100}
            height={100}
            className="h-10 w-10 rounded-full object-cover"
            draggable={false}
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h1 className="max-height-one text-base font-semibold dark:text-text-secondary">
                {user?.user.name}
              </h1>
              {user?.user.verified && <VerificationBadge size="md" />}
            </div>
            <div className="text-sm text-gray-500 dark:text-text-primary">
              @{user?.user.username}
              {user?.user.stripeSubscriptionStatus === "active" && (
                <span className="ml-2 px-2 py-0.5 tracking-wider rounded-md bg-blue-500 text-xs font-semibold text-white">PRO</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {isUserStartup ? (
        user?.user.handle ? (
          <div className="border-b border-border-light dark:border-border">
            <h1 className="mb-1 px-4 text-xs font-semibold text-gray-500 dark:text-text-primary">
              Personal Ideas
            </h1>
            <Link href={`/${user.user.id}/dashboard`}>
              <div className="px-4 py-2 hover:bg-gray-200 hover:dark:bg-border">
                <h1 className="max-height-one text-sm text-gray-700 dark:text-text-secondary">
                  {`${user.user.handle.handle}.hashnode-t3.dev`}
                </h1>
              </div>
            </Link>
          </div>
        ) : (
          <Link href={`/onboard/blog/setup?redirect=/`}>
            <div className="flex w-full cursor-pointer gap-2 px-4 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
              <Newspaper className="h-7 w-7 stroke-secondary" />
              <div>
                <h1 className="mb-1 text-sm font-semibold text-secondary">
                  Start a personal idea post
                </h1>
                <h1 className="text-xs font-medium text-gray-500 dark:text-text-secondary">
                  Create a Grower channel for personal use.
                </h1>
              </div>
            </div>
          </Link>
        )
      ) : null}

      {profileDropdownList.map((item, index) => (
        <>
          {item?.type ? (
            <div
              key={index}
              className="my-2 h-[1px] w-full bg-border-light dark:bg-border"
            />
          ) : (
            <div
              className={`${
                item.hiddenItem ? "block lg:hidden" : ""
              } cursor-pointer`}
              onClick={() => {
                if (item.danger) {
                  handleLogout();
                } else if (item.link && user?.user.id) {
                  const link = item.link(user?.user.id);
                  void router.push(link);
                  setOpened(false);
                } else if (item.onClick) {
                  item.onClick(setOpened, setSearchOpen);
                }
              }}
              key={index}
            >
              {/* Hide "Manage your blogs" option if user is not a startup */}
              {(item.name !== "Manage your ideas" || isUserStartup) && (
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-light-bg dark:hover:bg-primary-light">
                  <div>{item.icon}</div>
                  <div
                    className={`text-sm ${
                      item.danger
                        ? "text-red"
                        : "text-gray-700 dark:text-text-secondary"
                    }`}
                  >
                    {item.name}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ))}
    </div>
  );
});

ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
