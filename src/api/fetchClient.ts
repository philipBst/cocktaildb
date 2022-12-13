import { isEmptyArray } from "../utils/array-utils";

const defaultHeaders = {
  "Content-Type": "application/json",
};

interface IFetchClient {
  baseUrl: string;
  headers: HeadersInit;
}

export class FetchClient implements IFetchClient {
  baseUrl: IFetchClient["baseUrl"];
  headers: IFetchClient["headers"];

  constructor(
    baseUrl: IFetchClient["baseUrl"] = "",
    headers: IFetchClient["headers"] = {}
  ) {
    this.baseUrl = baseUrl;
    this.headers = { ...defaultHeaders, ...headers };
  }

  static async get(
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ) {
    return await fetch(input, init);
  }

  static async post<T>(
    input: Parameters<typeof fetch>[0],
    body: T,
    init: Omit<RequestInit, "method" | "body"> = {},
    { serialize } = { serialize: JSON.stringify }
  ) {
    return await fetch(input, {
      method: "POST",
      body: serialize(body),
      ...init,
    });
  }

  static async put<T>(
    input: Parameters<typeof fetch>[0],
    body: T,
    init: Omit<RequestInit, "method" | "body"> = {},
    { serialize } = { serialize: JSON.stringify }
  ) {
    return await fetch(input, {
      method: "PUT",
      body: serialize(body),
      ...init,
    });
  }

  static async patch(
    input: Parameters<typeof fetch>[0],
    init: Omit<RequestInit, "method"> = {}
  ) {
    return await fetch(input, {
      method: "PATCH",
      ...init,
    });
  }

  static async delete(
    input: Parameters<typeof fetch>[0],
    init: Omit<RequestInit, "method"> = {}
  ) {
    return await fetch(input, {
      method: "DELETE",
      ...init,
    });
  }

  async get(
    endpoint: string,
    queries: Record<string, string | number> = {},
    init: RequestInit = {}
  ) {
    return await fetch(
      this.baseUrl.concat(endpoint, this.createQueryString(queries)),
      {
        headers: {
          ...this.headers,
          ...(init?.headers || {}),
        },
        ...init,
      }
    );
  }

  async post<T>(
    endpoint: string,
    body: T,
    init: Omit<RequestInit, "method"> = {},
    queries: Record<string, string | number> = {},
    { serialize } = { serialize: JSON.stringify }
  ) {
    return await fetch(
      this.baseUrl.concat(endpoint, this.createQueryString(queries)),
      {
        method: "POST",
        body: serialize(body),
        headers: {
          ...this.headers,
          ...(init?.headers || {}),
        },
        ...init,
      }
    );
  }

  async put<T>(
    endpoint: string,
    body: T,
    init: Omit<RequestInit, "method"> = {},
    queries: Record<string, string | number> = {},
    { serialize } = { serialize: JSON.stringify }
  ) {
    return await fetch(
      this.baseUrl.concat(endpoint, this.createQueryString(queries)),
      {
        method: "PUT",
        body: serialize(body),
        headers: {
          ...this.headers,
          ...(init?.headers || {}),
        },
        ...init,
      }
    );
  }

  async patch<T>(
    endpoint: string,
    body: T,
    init: Omit<RequestInit, "method"> = {},
    queries: Record<string, string | number> = {},
    { serialize } = { serialize: JSON.stringify }
  ) {
    return await fetch(
      this.baseUrl.concat(endpoint, this.createQueryString(queries)),
      {
        method: "PATCH",
        body: serialize(body),
        headers: {
          ...this.headers,
          ...(init?.headers || {}),
        },
        ...init,
      }
    );
  }

  async delete(
    endpoint: string,
    init: Omit<RequestInit, "method"> = {},
    queries: Record<string, string | number> = {}
  ) {
    return await fetch(
      this.baseUrl.concat(endpoint, this.createQueryString(queries)),
      {
        method: "DELETE",
        headers: {
          ...this.headers,
          ...(init?.headers || {}),
        },
        ...init,
      }
    );
  }

  createQueryString(queries: Record<string, string | number>) {
    const entries = Object.entries(queries);
    if (isEmptyArray(entries)) return "";
    const queryString = entries
      .map((queryTuple) => queryTuple.join("="))
      .join("&");
    return "?".concat(queryString);
  }
}
