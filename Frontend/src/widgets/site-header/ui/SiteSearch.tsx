"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search } from "lucide-react";
import { getProducts, type Product } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";

interface Rect {
  top: number;
  left: number;
  width: number;
}

const inputClassName =
  "h-11 w-full rounded-xl bg-neutral-100 pl-4 pr-10 text-sm text-ink outline-none transition-colors focus:bg-white placeholder:text-neutral-400";

export function SiteSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);

  const ghostWrapperRef = useRef<HTMLDivElement>(null);
  const floatingBoxRef = useRef<HTMLDivElement>(null);
  const floatingInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    let active = true;
    const timeout = setTimeout(() => {
      setIsLoading(true);
      getProducts({ search: trimmed, limit: 6 })
        .then((data) => {
          if (active) setResults(data);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const node = ghostWrapperRef.current;
    if (node) {
      const box = node.getBoundingClientRect();
      setRect({ top: box.top, left: box.left, width: box.width });
    }
    floatingInputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!floatingBoxRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const showPanel = isOpen && query.trim().length > 0;

  const resultsPanel = showPanel ? (
    <div className="absolute left-0 right-0 top-full z-[110] mt-2 max-h-[360px] overflow-y-auto rounded-xl bg-white p-2 shadow-[0px_10px_30px_0px_#00000026]">
      {isLoading ? (
        <p className="px-3 py-4 text-center text-sm text-muted">Axtarılır...</p>
      ) : results.length > 0 ? (
        <ul className="flex flex-col">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/product/${product.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-neutral-100"
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                  {product.img_url ? (
                    <img
                      src={product.img_url}
                      loading="lazy"
                      decoding="async"
                      alt={product.title}
                      className="size-full object-contain"
                    />
                  ) : (
                    <span aria-hidden className="text-sm font-extrabold text-neutral-300">
                      {product.title.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-medium text-ink">
                    {product.title}
                  </span>
                  <span className="text-[13px] text-muted">{formatPrice(product.price)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-3 py-4 text-center text-sm text-muted">Nəticə tapılmadı</p>
      )}
    </div>
  ) : null;

  return (
    <div ref={ghostWrapperRef} className="relative flex min-w-0 flex-1">
      <form
        className={`relative flex min-w-0 flex-1 ${isOpen ? "invisible" : ""}`}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="site-search" className="sr-only">
          Axtarış
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Axtarış"
          autoComplete="off"
          className={inputClassName}
        />
        <Search
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
        />
      </form>

      {isOpen && rect && typeof document !== "undefined"
        ? createPortal(
            <>
              <div
                aria-hidden
                className="fixed inset-0 z-[100] bg-black/40"
                onClick={() => setIsOpen(false)}
              />
              <div
                ref={floatingBoxRef}
                style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width }}
                className="z-[110]"
              >
                <div className="relative flex min-w-0 flex-1">
                  <label htmlFor="site-search-active" className="sr-only">
                    Axtarış
                  </label>
                  <input
                    ref={floatingInputRef}
                    id="site-search-active"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Axtarış"
                    autoComplete="off"
                    className={inputClassName}
                  />
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                  />
                </div>

                {resultsPanel}
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
