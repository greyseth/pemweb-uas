// Utility untuk memudahkan pembuatan request ke API

export default async function request(method, endpoint, body) {
  const requestOptions = {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (window.localStorage.getItem("auth_token"))
    requestOptions.headers.authorization = `Bearer ${window.localStorage.getItem(
      "auth_token"
    )}`;

  if (method !== "GET") requestOptions.body = JSON.stringify(body);

  try {
    const request = await fetch(
      process.env.REACT_APP_APIHOST + endpoint,
      requestOptions
    );

    if (request.ok) {
      const contentType = request.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1)
        return await request.json();
    } else {
      const contentType = request.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1)
        return {
          error: { status: request.status, details: await request.json() },
        };

      return { error: { status: request.status } };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}
