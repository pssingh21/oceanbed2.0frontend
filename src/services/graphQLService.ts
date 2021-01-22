import { GraphQLClient } from "graphql-request";

const endpoint =
  "https://djqymf3udf.execute-api.eu-central-1.amazonaws.com/prod/oceanbed/graphql";

const client = new GraphQLClient(endpoint);

export async function requestGraphQL(
  setRequestHeaders: boolean,
  query: string
): Promise<JSON> {
  return new Promise<JSON>(async (resolve, reject) => {
    try {
      const data = await client.request(
        query,
        undefined,
        getRequestHeaders(setRequestHeaders)
      );
      resolve(data);
    } catch (error) {
      console.error(JSON.stringify(error, undefined, 2));
      reject(error);
    }
  });
}

const getRequestHeaders = (
  setRequestHeaders: boolean
): { authorization: string } => {
  if (
    !setRequestHeaders ||
    !("token" in localStorage) ||
    !localStorage.getItem("token")
  ) {
    return { authorization: "" };
  }
  return { authorization: localStorage.getItem("token") as string };
};
