import { useClickOutside } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { NotAuthenticatedProfileDropdown, ProfileDropdown } from "../dropdown";
import { LeftArea } from "../miniComponent";
import SearchArea from "../miniComponent/Search/Search";
import RightArea from "./RightAreaHeader";

const Header: React.FC<{ search?: boolean }> = ({ search = true }) => {
  const { data: user, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOpened(false), null, [
    control,
    dropdown,
  ]);

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b border-border-light bg-white dark:border-border dark:bg-primary">
      <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-2 md:py-4">
        <div className="flex flex-1 items-center justify-between gap-8 md:gap-4">
          <LeftArea />
          {search && <SearchArea />}
        </div>

        <div className="flex items-center gap-3">
          <RightArea />

          {/* Get Started button - only visible when not signed in */}
          {status !== "authenticated" && (
            <Link href="/onboard">
              <button className="hidden rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 sm:block">
                Get Started
              </button>
            </Link>
          )}

          <div className="relative rounded-full">
            <div ref={setControl}>
              <Image
                src={user?.user.image ?? "/static/default_user.avif"}
                alt={user?.user.name ?? "user"}
                width={180}
                height={180}
                className="h-7 w-7 cursor-pointer select-none overflow-hidden rounded-full md:h-8 md:w-8 lg:h-9 lg:w-9"
                onClick={() => setOpened((prev) => !prev)}
                draggable={false}
              />
            </div>

            {opened &&
              (!!user ? (
                <ProfileDropdown
                  setOpened={setOpened}
                  user={user}
                  ref={setDropdown}
                />
              ) : (
                <NotAuthenticatedProfileDropdown ref={setDropdown} />
              ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
