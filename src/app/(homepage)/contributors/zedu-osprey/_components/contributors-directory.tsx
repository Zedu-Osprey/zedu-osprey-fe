"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SearchX,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Contributor } from "~/data/zedu-osprey-contributors";

const PAGE_SIZE = 12;
const OSPREY_AVATAR = "/images/contributors/osprey-avatar.webp";

type NameRange = "all" | "a-m" | "n-z";
type SortOption = "name-asc" | "name-desc" | "username-asc";

type ContributorsDirectoryProps = {
  contributors: Contributor[];
};

function ContributorCard({ name, username }: Contributor) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={120}
      closeDelay={100}
    >
      <HoverCard.Trigger asChild>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`View ${name}'s contributor profile`}
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          className="group flex h-full w-full flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <span className="relative flex size-24 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-50 via-white to-amber-50 ring-4 ring-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Image
              src={OSPREY_AVATAR}
              alt=""
              width={96}
              height={96}
              className="h-[92%] w-[92%] object-contain object-bottom"
            />
          </span>

          <span className="flex min-w-0 w-full flex-col gap-1">
            <span className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
              {name}
            </span>
            <span className="truncate text-sm text-neutral-500">
              @{username}
            </span>
          </span>
        </button>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          sideOffset={10}
          collisionPadding={16}
          className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-50 via-white to-amber-50 ring-1 ring-neutral-200">
              <Image
                src={OSPREY_AVATAR}
                alt=""
                width={64}
                height={64}
                className="h-[92%] w-[92%] object-contain object-bottom"
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">
                {name}
              </h3>
              <p className="truncate text-sm text-neutral-500">@{username}</p>
            </div>
          </div>

          <div className="my-4 h-px bg-neutral-100" />

          <div className="rounded-xl bg-primary-50/70 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <Sparkles
                className="size-4 text-primary-500"
                aria-hidden="true"
              />
              Contributions
            </div>
            <p className="text-sm leading-6 text-neutral-600">
              Great things are in the works. Contribution highlights are coming
              soon.
            </p>
          </div>

          <HoverCard.Arrow className="fill-white" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export function ContributorsDirectory({
  contributors,
}: ContributorsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [nameRange, setNameRange] = useState<NameRange>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  const filteredContributors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return contributors
      .filter((contributor) => {
        const matchesQuery =
          !normalizedQuery ||
          contributor.name.toLocaleLowerCase().includes(normalizedQuery) ||
          contributor.username.toLocaleLowerCase().includes(normalizedQuery);
        const firstLetter = contributor.name.trim().charAt(0).toUpperCase();
        const matchesRange =
          nameRange === "all" ||
          (nameRange === "a-m"
            ? firstLetter >= "A" && firstLetter <= "M"
            : firstLetter >= "N" && firstLetter <= "Z");

        return matchesQuery && matchesRange;
      })
      .sort((first, second) => {
        if (sortBy === "name-desc") {
          return second.name.localeCompare(first.name, undefined, {
            sensitivity: "base",
          });
        }

        if (sortBy === "username-asc") {
          return first.username.localeCompare(second.username, undefined, {
            sensitivity: "base",
          });
        }

        return first.name.localeCompare(second.name, undefined, {
          sensitivity: "base",
        });
      });
  }, [contributors, nameRange, query, sortBy]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredContributors.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleContributors = filteredContributors.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const resetFilters = () => {
    setQuery("");
    setNameRange("all");
    setSortBy("name-asc");
    setPage(1);
  };

  return (
    <section
      aria-labelledby="contributors-directory-title"
      className="w-full px-4 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-7 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                id="contributors-directory-title"
                className="text-lg font-semibold text-neutral-900"
              >
                Contributor directory
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Search the team or hover over a profile to see more.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(15rem,1fr)_10rem_11rem]">
              <label className="relative sm:col-span-2 lg:col-span-1">
                <span className="sr-only">Search contributors</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name or username"
                  className="h-11 pl-9"
                />
              </label>

              <Select
                value={nameRange}
                onValueChange={(value: NameRange) => {
                  setNameRange(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11" aria-label="Filter by name">
                  <Filter className="mr-2 size-4 text-neutral-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All names</SelectItem>
                  <SelectItem value="a-m">Names A–M</SelectItem>
                  <SelectItem value="n-z">Names N–Z</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => {
                  setSortBy(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11" aria-label="Sort contributors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A–Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z–A</SelectItem>
                  <SelectItem value="username-asc">Username: A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-neutral-500">
          <p aria-live="polite">
            {filteredContributors.length === 0
              ? "No contributors found"
              : `Showing ${startIndex + 1}–${Math.min(
                  startIndex + PAGE_SIZE,
                  filteredContributors.length
                )} of ${filteredContributors.length}`}
          </p>
          {(query || nameRange !== "all" || sortBy !== "name-asc") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-medium text-primary-500 hover:text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          )}
        </div>

        {visibleContributors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleContributors.map((contributor) => (
              <ContributorCard key={contributor.username} {...contributor} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 text-center">
            <span className="mb-4 rounded-full bg-white p-3 shadow-sm">
              <SearchX className="size-6 text-neutral-400" aria-hidden="true" />
            </span>
            <h3 className="font-semibold text-neutral-900">
              No matching contributors
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              Try a different name, username, or alphabetical range.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-5"
            >
              Clear filters
            </Button>
          </div>
        )}

        {filteredContributors.length > PAGE_SIZE && (
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Go to previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </Button>
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <Button
                      type="button"
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="icon"
                      aria-label={`Go to page ${pageNumber}`}
                      aria-current={
                        currentPage === pageNumber ? "page" : undefined
                      }
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Go to next page"
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
}
