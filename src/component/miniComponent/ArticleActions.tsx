import { Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";

import { Bookmark, BookmarkMinus, Heart, MessageCircle, MoreVertical, Share2, UserPlus, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { C } from "~/utils/context";
import ShareOptions from "./ShareOptions";
import FutureTrendModal from "../popup/FutureTrendModal";

interface Props {
  article: {
    id: string,
    title: string,
    subtitle: string | null,
    slug: string,
    cover_image: string,
    disabledComments: boolean,
    readCount: number,
    likesCount: number,
    commentsCount: number,
    createdAt: string,
    content: string,
    read_time: number
    user: {
      username: string,
      image: string,
      name: string,
      id: string,
    },
  }; 
  setCommentsModal: React.Dispatch<React.SetStateAction<boolean>>;
  commentsCount: number;
}

const ArticleActions: FC<Props> = ({
  article,
  commentsCount,
  setCommentsModal,
}) => {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [control, setControl] = useState<HTMLDivElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  const [predictionModalOpen, setPredictionModalOpen] = useState(false);

  useClickOutside<HTMLDivElement>(() => setShareOpen(false), null, [
    control,
    dropdown,
  ]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsControl, setOptionsControl] = useState<HTMLDivElement | null>(null);
  const [optionsDropdown, setOptionsDropdown] = useState<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>(() => setOptionsOpen(false), null, [
    optionsControl,
    optionsDropdown,
  ]);

  const { bookmarks, updateBookmark } = useContext(C)!;
  const { data: user } = useSession();
  const { mutate: LikeArticle } = api.likes.likeArticle.useMutation();
  const [like, setLike] = useState({
    hasLiked: false,
    likesCount: article.likesCount,
  });

  // Check if the current user is a verified mentor
  const isMentorVerified = user?.user?.role === "mentor" && user?.user?.verified === true;
  
  // Check if the current user is a verified investor
  const isInvestorVerified = user?.user?.role === "investor" && user?.user?.verified === true;
  
  // Check if user has Pro subscription - ensure it's exactly "active" and nothing else
  const isProSubscriber = user?.user?.stripeSubscriptionStatus === "active";

  // Flag to determine if Future Trend button should be shown
  const showFutureTrendButton = !!user?.user && (isProSubscriber === true || isInvestorVerified === true);

  const { data } = api.likes.likeState.useQuery(
    {
      articleId: article.id,
    },
    {
      enabled: !!article.id,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      setLike(prev => ({
        ...prev,
        hasLiked: data.liked,
      }));
    }
  }, [data]);

  const likeFunction = () => {
    if (!user?.user.id) {
      toast.error("You need to login to like an article");
      return;
    }

    try {
      setLike({
        hasLiked: !like.hasLiked,
        likesCount: like.hasLiked ? like.likesCount - 1 : like.likesCount + 1,
      });
      LikeArticle({
        articleId: article.id,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      }
    }
  };

  // Function to handle connection with author
  const handleConnect = () => {
    if (!user?.user.id) {
      toast.error("You need to be logged in to connect");
      return;
    }
    
    // Navigate to the author's profile page
    void router.push(`/u/@${article.user.username}`);
  };

  // Function to handle investment 
  const handleInvest = () => {
    if (!user?.user.id) {
      toast.error("You need to be logged in to invest");
      return;
    }
    
    if (!isInvestorVerified) {
      toast.error("Only verified investors can invest in ideas");
      return;
    }
    
    // Navigate to the investment page for this idea
    void router.push(`/invest/${article.slug}`);
  };

  // Function to handle AI Future Trend prediction
  const handleFutureTrendPrediction = () => {
    if (!user?.user.id) {
      toast.error("You need to be logged in to view AI predictions");
      return;
    }

    if (!isProSubscriber && !isInvestorVerified) {
      toast.error("This feature requires a PRO subscription");
      return;
    }

    setPredictionModalOpen(true);
  };

  return (
    <>
      <div className="sticky bottom-4 left-0 flex w-full items-center justify-center gap-2 px-4 py-4">
        <div className="mx-auto flex items-center justify-between gap-2 rounded-full border border-border-light bg-light-bg px-4 py-1 shadow-sm dark:border-border dark:bg-primary-light sm:w-max">
          <Tooltip label="Like" withArrow>
            <button
              aria-label="icon"
              role="button"
              onClick={() => void likeFunction()}
              className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
            >
              <div className="flex items-center justify-center gap-2">
                <Heart
                  className={`h-5 w-5 fill-none ${like.hasLiked
                    ? "fill-red stroke-red"
                    : "stroke-border dark:stroke-text-primary"
                    }  md:h-6 md:w-6`}
                />
              </div>

              <span>{like.likesCount}</span>
            </button>
          </Tooltip>

          <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

          <Tooltip
            label={`${article.disabledComments
              ? "Comments Disabled"
              : `Comments (${commentsCount})`
              }`}
            classNames={{
              tooltip: `${article.disabledComments
                ? "bg-[#dc2626!important] text-[#fafafa!important] dark:text-[#fff!important]"
                : ""
                }`,
            }}
            withArrow
          >
            <button
              aria-label="icon"
              role="button"
              onClick={() => !article.disabledComments && setCommentsModal(true)}
              disabled={article.disabledComments}
              className={`${article.disabledComments ? "cursor-not-allowed opacity-70" : ""
                } flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
              </div>

              <span>{commentsCount}</span>
            </button>
          </Tooltip>

          {/* Future Trend AI Prediction Button - Only shown if user has active subscription or is verified investor */}
          {showFutureTrendButton && isProSubscriber && (
            <>
              <div className="h-6 w-[2px] bg-border-light dark:bg-border" />
              
              <Tooltip label="AI Future Trend Prediction" withArrow>
                <button
                  aria-label="AI Future Trend Prediction"
                  role="button"
                  onClick={handleFutureTrendPrediction}
                  className="flex items-center gap-2 rounded-full p-2 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <div className="relative flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 fill-none stroke-purple-600 dark:stroke-purple-400 md:h-6 md:w-6" />
                    <Sparkles className="absolute -right-1 -top-1 h-3 w-3 fill-none stroke-purple-600 dark:stroke-purple-400" />
                  </div>
                  <span className="mr-1 hidden sm:inline">Future Trend</span>
                  <span className="inline-block rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">PRO</span>
                </button>
              </Tooltip>
            </>
          )}

          {/* Add Invest button for verified investors */}
          {isInvestorVerified && (
            <>
              <div className="h-6 w-[2px] bg-border-light dark:bg-border" />
              
              <Tooltip label="Invest in this idea" withArrow>
                <button
                  aria-label="Invest in this idea"
                  role="button"
                  onClick={handleInvest}
                  className="flex items-center gap-2 rounded-full p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="h-5 w-5 fill-none stroke-green-600 dark:text-gray-300 md:h-6 md:w-6" />
                  </div>
                  <span className="dark:text-gray-300">Invest</span>
                </button>
              </Tooltip>
            </>
          )}

          {/* Add Connect button for verified mentors */}
          {isMentorVerified && (
            <>
              <div className="h-6 w-[2px] bg-border-light dark:bg-border" />
              
              <Tooltip label="Connect with author" withArrow>
                <button
                  aria-label="Connect with author"
                  role="button"
                  onClick={handleConnect}
                  className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
                >
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
                  </div>
                  <span>Connect</span>
                </button>
              </Tooltip>
            </>
          )}

          <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

          <Tooltip label="Bookmark" withArrow>
            <button
              aria-label="icon"
              onClick={() => updateBookmark(article.id)}
              role="button"
              className={`dark:hover:bg-border ${bookmarks.find((bookmark) => bookmark.id === article.id)
                ? "bg-secondary bg-opacity-20"
                : ""
                } btn-icon-large flex w-max items-center justify-center`}
            >
              {bookmarks.find((bookmark) => bookmark.id === article.id) ? (
                <BookmarkMinus className="h-6 w-6 stroke-gray-700 dark:stroke-text-primary" />
              ) : (
                <Bookmark className="h-6 w-6 stroke-gray-700 dark:stroke-text-primary" />
              )}
            </button>
          </Tooltip>

          <div className="h-6 w-[2px] bg-border-light dark:bg-border" />

          <div className="relative">
            {shareOpen && (
              <ShareOptions
                acticleDetails={{
                  title: article.title,
                  by: article.user.username,
                }}
                ref={setDropdown}
                setShareOpen={setShareOpen}
              />
            )}

            <Tooltip label="Share" withArrow>
              <div
                ref={setControl}
              >
                <button
                  aria-label="icon"
                  role="button"
                  onClick={() => void setShareOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Share2 className="h-5 w-5 fill-none stroke-border dark:stroke-text-primary md:h-6 md:w-6" />
                  </div>
                </button>
              </div>
            </Tooltip>
          </div>

          <div className="h-6 w-[2px] bg-border-light dark:bg-border"></div>

          <div className="relative">
            {optionsOpen && (
              <MoreOptions
                ref={setOptionsDropdown}
                setOptionsOpen={setOptionsOpen}
                slug={article.slug}
                user={user?.user.username === article.user.username}
              />
            )}

            <Tooltip label="More Options" withArrow position="bottom">
              <div
                ref={setOptionsControl}
              >
                <button
                  aria-label="icon"
                  role="button"
                  onClick={() => void setOptionsOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-2 text-gray-700 hover:bg-text-secondary dark:text-text-secondary dark:hover:bg-border"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MoreVertical className="h-5 w-5 fill-border dark:fill-text-primary md:h-6 md:w-6" />
                  </div>
                </button>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Future Trend Modal */}
      {predictionModalOpen && (
        <FutureTrendModal
          articleId={article.id}
          isOpen={predictionModalOpen}
          onClose={() => setPredictionModalOpen(false)}
        />
      )}
    </>
  );
};

export default ArticleActions;

const MoreOptions = React.forwardRef<
  HTMLDivElement,
  {
    setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: boolean;
    slug: string
  }
>(({ setOptionsOpen, slug, user }, ref) => {
  const router = useRouter();
  const { mutateAsync: deleteArticle } = api.posts.deleteTemporarily.useMutation();
  const { mutateAsync: disableComment } = api.posts.disableComments.useMutation();
  const userActions = [
    "Edit",
    "Delete",
    "Disable Comments",
    "Pin to your idea",
    "Report",
  ]

  const guestActions = [
    "Report",
    "Follow",
  ];

  const actionControler = async (name: string) => {
    switch (name) {
      case "Delete":
        try {
          const res = await deleteArticle({
            slug,
          });

          if (res.success) {
            toast.success("Article deleted successfully");
          } else {
            toast.error("Failed to delete article");
          }
        } catch (err) {
          if (err instanceof TRPCClientError) {
            toast.error(err.message);
          } else {
            toast.error("Failed to delete article");
          }
        }
        break;
      case "Edit":
        void router.push(`/article/edit/${slug}`);
        break;

      case "Disable Comments":
        try {
          const res = await disableComment({
            slug,
          })

          if (res.success) {
            toast.success("Comments disabled successfully");
          } else {
            toast.error("Failed to disable comments");
          }
        } catch (err) {
          if (err instanceof TRPCClientError) {
            toast.error(err.message);
          } else {
            toast.error("Failed to disable comments");
          }
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={ref}
      className="absolute -right-full bottom-full mt-2 min-w-[190px] rounded-md border border-border-light bg-white shadow-md dark:border-border dark:bg-primary md:-left-2"
    >
      <ul className="py-2">
        {user ? userActions.map((option, index) => (
          <li
            onClick={() => {
              void actionControler(option)
              setOptionsOpen(false)
            }}
            className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 pr-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-border"
            key={index}
          >
            {option}
          </li>
        )) : guestActions.map((option, index) => (
          <li
            onClick={() => {
              void actionControler(option)
              setOptionsOpen(false)
            }
            }
            className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 pr-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-border"
            key={index}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
});

MoreOptions.displayName = "MoreOptions";