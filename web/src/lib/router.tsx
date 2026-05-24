'use client';

import NextLink from 'next/link';
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import { useMemo, type AnchorHTMLAttributes, type ReactNode } from 'react';

type NavigateOptions = {
  replace?: boolean;
};

type SetSearchParamsOptions = {
  replace?: boolean;
};

type SearchParamsInput = URLSearchParams | Record<string, string | number | boolean | null | undefined> | string;

export function useNavigate() {
  const router = useRouter();

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

export function useLocation() {
  const pathname = usePathname() ?? '/';
  const params = useNextSearchParams();
  const search = params.toString();

  return useMemo(
    () => ({
      pathname,
      search: search ? `?${search}` : '',
      hash: '',
      state: null,
      key: '',
    }),
    [pathname, search],
  );
}

export function useSearchParams(): [
  URLSearchParams,
  (next: SearchParamsInput, options?: SetSearchParamsOptions) => void,
] {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const params = useNextSearchParams();
  const snapshot = useMemo(() => new URLSearchParams(params.toString()), [params]);

  function setSearchParams(next: SearchParamsInput, options?: SetSearchParamsOptions) {
    let query: string;

    if (typeof next === 'string') {
      query = next.replace(/^\?/, '');
    } else if (next instanceof URLSearchParams) {
      query = next.toString();
    } else {
      const built = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          built.set(key, String(value));
        }
      });
      query = built.toString();
    }

    const href = query ? `${pathname}?${query}` : pathname;
    if (options?.replace) router.replace(href);
    else router.push(href);
  }

  return [snapshot, setSearchParams];
}

export function useParams<T extends Record<string, string | string[] | undefined>>() {
  return useNextParams() as T;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  children?: ReactNode;
};

export function Link({ to, children, ...props }: LinkProps) {
  return (
    <NextLink href={to} {...props}>
      {children}
    </NextLink>
  );
}
