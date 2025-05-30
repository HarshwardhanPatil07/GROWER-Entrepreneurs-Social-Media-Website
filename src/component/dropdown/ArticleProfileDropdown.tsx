import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { articleimageDropdownList } from "~/utils/constants";
import { VerificationBadge } from "~/component/miniComponent";

const ArticleimageDropdown = React.forwardRef<HTMLDivElement>(({}, ref) => {
  const { data: user } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-20 mt-2 w-64 rounded-md border border-border-light bg-gray-50 py-2 text-left shadow-lg dark:border-border dark:bg-primary"
    >
      <Link href={`/u/@${user?.user.username} `}>
        <div className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-primary-light">
          <Image
            src={user?.user.image ?? "/static/default.avif"}
            alt={user?.user.name ?? "user"}
            width={100}
            height={100}
            className="h-10 w-10 rounded-full object-cover"
            draggable={false}
          />
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-sm font-semibold dark:text-text-secondary">
                {user?.user.name}
              </h1>
              {user?.user.verified && <VerificationBadge size="md" />}
            </div>
            <h2 className="text-sm text-gray-600 dark:text-text-primary">
              @{user?.user.username}
            </h2>
          </div>
        </div>
      </Link>
      {articleimageDropdownList.map((item, index) =>
        item?.type ? (
          <div
            key={index}
            className="my-2 h-[1px] w-full bg-border-light dark:bg-border"
          />
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => {
              if (item.name === "Log out") void logout();
              if (item.link && user?.user.id)
                void router.push(item.link(user?.user.id));
            }}
            key={index}
          >
            <div className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-primary-light">
              {item.icon}
              <span
                className={`${
                  item.danger
                    ? "text-red"
                    : "text-gray-700 dark:text-text-secondary"
                } text-sm font-normal`}
              >
                {item.name}
              </span>
            </div>
          </div>
        ),
      )}
    </div>
  );
});

ArticleimageDropdown.displayName = "ArticleimageDropdown";

export default ArticleimageDropdown;
