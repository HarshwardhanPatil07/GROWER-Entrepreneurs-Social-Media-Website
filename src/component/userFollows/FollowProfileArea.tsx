import { BadgeCheck, Calendar, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Tooltip } from "@mantine/core";


const FollowimageArea: FC<{
  user: {
    name: string;
    username: string;
    followersCount: number;
    followingCount: number;
    image: string;
    createdAt: Date;
    verified?: boolean;
  }
}> = ({ user }) => {
  const { data: session } = useSession();

  return <div className="w-full rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary md:w-1/4">
    <Link href={`/u/@${user.username}`}>
      <Image
        src={user.image}
        width={800}
        height={800}
        className="mb-4 h-28 w-28 overflow-hidden rounded-full object-cover"
        alt="User image"
      />
    </Link>

    <Link href={`/u/@${user.username}`}>
      <div className="mb-2 flex items-center gap-2">
        <p className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          {user.name}
        </p>
        {user.verified && (
          <Tooltip
            label="Verified Account"
            position="bottom"
            style={{
              fontSize: "0.8rem",
              fontWeight: "400",
              letterSpacing: "0.5px",
            }}
          >
            <BadgeCheck className="h-5 w-5 fill-blue-500 stroke-white" />
          </Tooltip>
        )}
      </div>
    </Link>

    <p className="mb-8 text-base font-medium text-gray-500 dark:text-text-primary">@{user.username}</p>

    {user.username === session?.user.username && (
      <Link href="/settings" className="btn-outline inline-flex mb-4 items-center gap-2">
        <Pencil className="h-5 w-5 fill-none stroke-secondary" />
        <span>Edit Profile</span>
      </Link>
    )}

    <div className="flex items-center gap-2">
      <span>
        <Calendar className="h-4 w-4 fill-none stroke-gray-500 dark:stroke-text-primary" />
      </span>

      <span className="text-md text-gray-500 dark:text-text-primary">
        Member since{" "}
        <span className="font-medium">
          {new Date(user.createdAt).toDateString()}
        </span>
      </span>
    </div>
  </div>
}
export default FollowimageArea;