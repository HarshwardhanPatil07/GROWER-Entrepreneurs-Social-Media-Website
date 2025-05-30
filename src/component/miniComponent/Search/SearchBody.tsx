/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from "@faker-js/faker";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TagsSearchCard, UserSearchCard } from "~/component/card";
import { SearchLoading } from "~/component/loading";

import { Search } from "lucide-react";
import { type SearchResults } from "~/types";
import { api } from "~/utils/api";
import SearchArticle from "./SearchArticle";

interface ArticleSeach {
  id: string;
  title: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    stripeSubscriptionStatus: string | null;
  };
  cover_image: string | null;
  slug: string;
  read_time?: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TagSearch {
  id: string;
  name: string;
  slug: string;
  isFollowing: boolean;
}

interface UserSearch {
  id: string;
  name: string;
  username: string;
  image: string | null;
  isFollowing: boolean;
  isAuthor: boolean;
  stripeSubscriptionStatus: string | null;
}
const searchNavigation = [
  "TOP",
  "LATEST",
  "ARTICLES",
  "USERS",
  "TAGS",
] as const;

const SearchBody = React.forwardRef<
  HTMLDivElement,
  {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ setOpened }, ref) => {
  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<
    "TOP" | "LATEST" | "ARTICLES" | "USERS" | "TAGS"
  >("TOP");
  const { refetch } = api.posts.search.useQuery(
    {
      query,
      type,
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const [data, setData] = useState<SearchResults>({
    articles: null,
    tags: null,
    users: null,
  });


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topResults, setTopResults] = useState<any>([]);

  const [refetching, setRefetching] = useState(false);

  async function search(criteria: string): Promise<SearchResults> {
    let response: SearchResults = {
      articles: null,
      tags: null,
      users: null,
    };
    if (criteria.trim().length > 0) {
      response = (await refetch()).data as unknown as SearchResults;

      if (response) {
        if (type === "TOP") {
          const data = response;
          const randomizeResponse = faker.helpers.shuffle(
            [
              ...(data.articles?.map((e) => ({ ...e, type: "ARTICLES" })) ??
                []),
              ...(data.tags?.map((e) => ({ ...e, type: "TAGS" })) ?? []),
              ...(data.users?.map((e) => ({ ...e, type: "USERS" })) ?? []),
            ].flat()
          );
          setTopResults(randomizeResponse);
        }
        setData(response);
        return response;
      } else {
        return {
          articles: null,
          tags: null,
          users: null,
        };
      }
    }

    return {
      articles: null,
      tags: null,
      users: null,
    };
  }

  const debounced = useDebouncedCallback(async (value: string) => {
    setData(await search(value));
    setRefetching(false);
    return;
  }, 500);

  const refetchData = async (
    currentType: "TOP" | "LATEST" | "ARTICLES" | "USERS" | "TAGS"
  ) => {
    if (query.trim().length > 0) {
      const res = await refetch();
      if (currentType === "TOP") {
        const data = res.data as SearchResults;
        const randomizeResponse = faker.helpers.shuffle(
          [
            ...(data.articles?.map((e) => ({ ...e, type: "ARTICLES" })) ?? []),
            ...(data.tags?.map((e) => ({ ...e, type: "TAGS" })) ?? []),
            ...(data.users?.map((e) => ({ ...e, type: "USERS" })) ?? []),
          ].flat()
        );
        setTopResults(randomizeResponse);
        return;
      }
      setData(res.data as SearchResults);
    } else {
      setData({
        articles: null,
        tags: null,
        users: null,
      });
    }
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-start justify-center py-24"
    >
      <div
        onClick={() => setOpened(false)}
        className="fixed inset-0 z-40 bg-gray-700 bg-opacity-50 backdrop-blur"
      />

      <div className="z-50 w-11/12 max-w-[950px] overflow-hidden rounded-xl border border-border-light bg-white shadow-lg dark:border-border dark:bg-primary">
        <header className="p-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 stroke-gray-700 dark:stroke-text-primary" />
            </span>

            <input
              type="text"
              placeholder="Search Grower"
              className="input-primary w-full"
              autoFocus
              onChange={(e) => {
                setQuery(e.target.value);
                setRefetching(true);
                void debounced(e.target.value);
              }}
            />
          </div>
        </header>

        <div className="">
          {query.trim() !== "" && (
            <div className="w-full overflow-auto">
              <ul className="scroll-area flex w-full items-center gap-2 border-b border-border-light px-4 dark:border-border">
                {searchNavigation.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setType(item);
                        setRefetching(true);
                        setTimeout(() => {
                          void refetchData(item);
                        }, 100);
                        setRefetching(false);
                      }}
                      className={`${type === item ? "btn-tab-active" : "btn-tab"
                        }`}
                    >
                      {`${item.slice(0, 1)}${item
                        .slice(1, item.length)
                        .toLowerCase()} `}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section>
            {query.trim() === "" ? (
              <div className="flex min-h-[10rem] items-center justify-center p-4">
                <h1 className="flex items-center gap-2 text-center text-base text-gray-700 dark:text-text-secondary">
                  <Search className="hidden h-4 w-4 stroke-gray-700 dark:stroke-text-primary md:block" />
                  Search for tags, people, articles, and more
                </h1>
              </div>
            ) : (
              <div className="scroll-area max-h-[65vh] min-h-[350px] overflow-auto">
                {refetching ? (
                  <SearchLoading />
                ) : type === "USERS" ? data.users && data.users.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.users.map((user: UserSearch) => (
                      <div
                        key={user.id}
                        className="border-b border-border-light dark:border-border last:border-none"
                      >
                        <UserSearchCard
                          key={user.id}
                          user={{ ...user, verified: false }}
                          setOpened={setOpened}
                        />
                      </div>
                    ))}
                  </ul>
                ) : <NoSearchResults /> : type === "TAGS" ? data.tags && data.tags.length > 0 ? (
                  <ul className="scroll-area max-h-[20rem] overflow-auto">
                    {data.tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="border-b border-border-light dark:border-border last:border-none"
                      >
                        <TagsSearchCard
                          key={tag.id}
                          tag={tag}
                          setOpened={setOpened}
                        />
                      </div>
                    ))}
                  </ul>
                ) : <NoSearchResults /> : (type === "ARTICLES" || type === "LATEST") ?
                  data.articles &&
                    data.articles.length > 0 ? (
                    <ul className="scroll-area max-h-[20rem] overflow-auto">
                      {data.articles.map((article: ArticleSeach) => (
                        <div
                          onClick={() => setOpened(false)}
                          key={article.id}
                          className="border-b border-border-light dark:border-border last:border-none"
                        >
                          <SearchArticle data={article} />
                        </div>
                      ))}
                    </ul>
                  ) : <NoSearchResults /> : type === "TOP" ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    topResults.length > 0 ? topResults.map((search: { type: "ARTICLES" | "TAGS" | "USERS"; id: string; name?: string; username?: string; image?: string; stripeSubscriptionStatus?: string | null; isFollowing?: boolean; isAuthor?: boolean; title?: string; cover_image?: string; slug?: string; read_time?: number; likesCount?: number; commentsCount?: number; createdAt?: Date; updatedAt?: Date; }) => {
                      const { type, ...rest } = search;
                      return type === "ARTICLES" ? (
                        <div
                          onClick={() => setOpened(false)}
                          key={rest.id}
                          className="border-b border-border-light dark:border-border last:border-none"
                        >
                          <SearchArticle data={rest as ArticleSeach} />
                        </div>
                      ) : type === "TAGS" ? (
                        <div
                          key={rest.id}
                          className="border-b border-border-light dark:border-border last:border-none"
                        >
                          <TagsSearchCard
                            key={rest.id}
                            tag={rest as TagSearch}
                            setOpened={setOpened}
                          />
                        </div>
                      ) : type === "USERS" ? (
                        <div
                          key={rest.id}
                          className="border-b border-border-light dark:border-border last:border-none"
                        >
                          <UserSearchCard
                            key={rest.id}
                            user={{
                              id: rest.id,
                              name: rest.name ?? "",
                              username: rest.username ?? "",
                              stripeSubscriptionStatus: rest.stripeSubscriptionStatus ?? null,
                              image: rest.image ?? "",
                              isFollowing: rest.isFollowing ?? false,
                              isAuthor: rest.isAuthor ?? false,
                              verified: false
                            }}
                            setOpened={setOpened}
                          />
                        </div>
                      ) : null;
                    }) : <NoSearchResults />
                  ) : (
                    <NoSearchResults />
                  )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
});

SearchBody.displayName = "SearchBody";

export default SearchBody;

const NoSearchResults = () => <div className="flex h-64 items-center justify-center">
  <p className="text-center text-base font-semibold text-gray-700 dark:text-text-secondary md:text-xl">
    Whoops! No results found. Try a new keyword or phrase.
  </p>
</div>
